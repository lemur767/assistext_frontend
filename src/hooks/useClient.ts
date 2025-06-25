// src/hooks/useClients.ts
/**
 * Custom React hook for client management
 * Provides comprehensive client data management with caching, error handling, and real-time updates
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ClientService } from '../services/clientService';
import type { 
  Client, 
  ClientFilters, 
  ClientStats, 
  PaginatedResponse,
  ClientBulkOperation,
  BulkOperationResult 
} from '../types/client';

// Hook options interface
interface UseClientsOptions {
  profileId?: string;
  initialFilters?: ClientFilters;
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableRealTime?: boolean;
}

// Hook return type
interface UseClientsReturn {
  // Data
  clients: Client[];
  filteredClients: Client[];
  clientStats: ClientStats | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalClients: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  
  // State
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isRefreshing: boolean;
  
  // Filters and search
  filters: ClientFilters;
  searchQuery: string;
  
  // Actions
  setFilters: (filters: ClientFilters) => void;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  refreshClients: () => Promise<void>;
  
  // Client operations
  createClient: (data: any) => Promise<Client>;
  updateClient: (id: string, data: any) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
  toggleBlockClient: (id: string, shouldBlock: boolean, reason?: string) => Promise<Client>;
  toggleFlagClient: (id: string, shouldFlag: boolean, reason?: string) => Promise<Client>;
  markAsRegular: (id: string, isRegular: boolean) => Promise<Client>;
  markAsVIP: (id: string, isVIP: boolean) => Promise<Client>;
  addTags: (id: string, tags: string[]) => Promise<Client>;
  removeTags: (id: string, tags: string[]) => Promise<Client>;
  
  // Bulk operations
  bulkOperation: (operation: ClientBulkOperation) => Promise<BulkOperationResult>;
  selectedClients: string[];
  setSelectedClients: (clientIds: string[]) => void;
  toggleClientSelection: (clientId: string) => void;
  selectAllClients: () => void;
  clearSelection: () => void;
  
  // Search and export
  searchClients: (query: string) => Promise<void>;
  exportClients: (format?: 'csv' | 'xlsx') => Promise<void>;
}

export const useClients = (options: UseClientsOptions = {}): UseClientsReturn => {
  const {
    profileId,
    initialFilters = {},
    autoRefresh = false,
    refreshInterval = 30000,
    enableRealTime = false,
  } = options;

  const queryClient = useQueryClient();

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ClientFilters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Query key generator
  const getQueryKey = useCallback(
    (page: number, currentFilters: ClientFilters) => [
      'clients',
      profileId,
      page,
      currentFilters,
      searchQuery,
    ],
    [profileId, searchQuery]
  );

  // Main clients query
  const {
    data: clientsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: getQueryKey(currentPage, filters),
    queryFn: async () => {
      const searchFilters = {
        ...filters,
        ...(searchQuery && { search: searchQuery }),
      };

      if (profileId) {
        return await ClientService.getClients(profileId, currentPage, 20, searchFilters);
      } else {
        return await ClientService.getAllClients(currentPage, 20, searchFilters);
      }
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Client statistics query
  const { data: clientStats } = useQuery({
    queryKey: ['client-stats', profileId],
    queryFn: () => ClientService.getClientStats(profileId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!profileId || !profileId, // Always enabled
  });

  // Derived data
  const clients = clientsResponse?.data || [];
  const pagination = clientsResponse?.pagination;
  const totalPages = pagination?.pages || 0;
  const totalClients = pagination?.total || 0;
  const hasNextPage = pagination?.has_next || false;
  const hasPrevPage = pagination?.has_prev || false;

  // Filtered clients for local filtering
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          client.phone_number.toLowerCase().includes(query) ||
          client.name?.toLowerCase().includes(query) ||
          client.email?.toLowerCase().includes(query) ||
          client.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [clients, searchQuery]);

  // Mutations
  const createClientMutation = useMutation({
    mutationFn: ClientService.createClient,
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create client: ${error.message}`);
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      ClientService.updateClient(id, data),
    onSuccess: (updatedClient) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update client: ${error.message}`);
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: ClientService.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete client: ${error.message}`);
    },
  });

  const toggleBlockMutation = useMutation({
    mutationFn: ({ id, shouldBlock, reason }: { id: string; shouldBlock: boolean; reason?: string }) =>
      ClientService.toggleBlockClient(id, shouldBlock, { reason }),
    onSuccess: (client, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(`Client ${variables.shouldBlock ? 'blocked' : 'unblocked'} successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update block status: ${error.message}`);
    },
  });

  const toggleFlagMutation = useMutation({
    mutationFn: ({ id, shouldFlag, reason }: { id: string; shouldFlag: boolean; reason?: string }) =>
      ClientService.toggleFlagClient(id, shouldFlag, reason),
    onSuccess: (client, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(`Client ${variables.shouldFlag ? 'flagged' : 'unflagged'} successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update flag status: ${error.message}`);
    },
  });

  const markRegularMutation = useMutation({
    mutationFn: ({ phoneNumber, isRegular }: { phoneNumber: string; isRegular: boolean }) =>
      ClientService.markClientAsRegular(phoneNumber, isRegular),
    onSuccess: (client, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(`Client marked as ${variables.isRegular ? 'regular' : 'not regular'}`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update regular status: ${error.message}`);
    },
  });

  const markVIPMutation = useMutation({
    mutationFn: ({ id, isVIP }: { id: string; isVIP: boolean }) =>
      ClientService.markClientAsVIP(id, isVIP),
    onSuccess: (client, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(`Client marked as ${variables.isVIP ? 'VIP' : 'not VIP'}`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update VIP status: ${error.message}`);
    },
  });

  const addTagsMutation = useMutation({
    mutationFn: ({ id, tags }: { id: string; tags: string[] }) =>
      ClientService.addClientTags(id, tags),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Tags added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add tags: ${error.message}`);
    },
  });

  const removeTagsMutation = useMutation({
    mutationFn: ({ id, tags }: { id: string; tags: string[] }) =>
      ClientService.removeClientTags(id, tags),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Tags removed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove tags: ${error.message}`);
    },
  });

  const bulkOperationMutation = useMutation({
    mutationFn: ClientService.bulkOperation,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(`Bulk operation completed: ${result.successful} successful, ${result.failed} failed`);
    },
    onError: (error: Error) => {
      toast.error(`Bulk operation failed: ${error.message}`);
    },
  });

  // Actions
  const refreshClients = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedClients([]); // Clear selection when changing pages
  }, []);

  const createClient = useCallback(async (data: any): Promise<Client> => {
    return createClientMutation.mutateAsync(data);
  }, [createClientMutation]);

  const updateClient = useCallback(async (id: string, data: any): Promise<Client> => {
    return updateClientMutation.mutateAsync({ id, data });
  }, [updateClientMutation]);

  const deleteClient = useCallback(async (id: string): Promise<void> => {
    return deleteClientMutation.mutateAsync(id);
  }, [deleteClientMutation]);

  const toggleBlockClient = useCallback(async (
    id: string,
    shouldBlock: boolean,
    reason?: string
  ): Promise<Client> => {
    return toggleBlockMutation.mutateAsync({ id, shouldBlock, reason });
  }, [toggleBlockMutation]);

  const toggleFlagClient = useCallback(async (
    id: string,
    shouldFlag: boolean,
    reason?: string
  ): Promise<Client> => {
    return toggleFlagMutation.mutateAsync({ id, shouldFlag, reason });
  }, [toggleFlagMutation]);

  const markAsRegular = useCallback(async (phoneNumber: string, isRegular: boolean): Promise<Client> => {
    return markRegularMutation.mutateAsync({ phoneNumber, isRegular });
  }, [markRegularMutation]);

  const markAsVIP = useCallback(async (id: string, isVIP: boolean): Promise<Client> => {
    return markVIPMutation.mutateAsync({ id, isVIP });
  }, [markVIPMutation]);

  const addTags = useCallback(async (id: string, tags: string[]): Promise<Client> => {
    return addTagsMutation.mutateAsync({ id, tags });
  }, [addTagsMutation]);

  const removeTags = useCallback(async (id: string, tags: string[]): Promise<Client> => {
    return removeTagsMutation.mutateAsync({ id, tags });
  }, [removeTagsMutation]);

  const bulkOperation = useCallback(async (operation: ClientBulkOperation): Promise<BulkOperationResult> => {
    return bulkOperationMutation.mutateAsync(operation);
  }, [bulkOperationMutation]);

  // Selection management
  const toggleClientSelection = useCallback((clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  }, []);

  const selectAllClients = useCallback(() => {
    setSelectedClients(clients.map(client => client.id));
  }, [clients]);

  const clearSelection = useCallback(() => {
    setSelectedClients([]);
  }, []);

  // Search functionality
  const searchClients = useCallback(async (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Export functionality
  const exportClients = useCallback(async (format: 'csv' | 'xlsx' = 'csv') => {
    try {
      const blob = await ClientService.exportClients(profileId, filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clients_export_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Export completed successfully');
    } catch (error) {
      toast.error(`Export failed: ${error.message}`);
    }
  }, [profileId, filters]);

  // Real-time updates (WebSocket integration)
  useEffect(() => {
    if (!enableRealTime) return;

    // WebSocket connection and event handling would go here
    // This is a placeholder for WebSocket integration
    console.log('Real-time updates enabled for clients');

    return () => {
      // Cleanup WebSocket connection
    };
  }, [enableRealTime]);

  // Clear selection when filters change
  useEffect(() => {
    setSelectedClients([]);
  }, [filters, searchQuery]);

  return {
    // Data
    clients,
    filteredClients,
    clientStats: clientStats || null,
    
    // Pagination
    currentPage,
    totalPages,
    totalClients,
    hasNextPage,
    hasPrevPage,
    
    // State
    isLoading,
    isError,
    error: error as Error | null,
    isRefreshing,
    
    // Filters and search
    filters,
    searchQuery,
    
    // Actions
    setFilters,
    setSearchQuery,
    setPage,
    refreshClients,
    
    // Client operations
    createClient,
    updateClient,
    deleteClient,
    toggleBlockClient,
    toggleFlagClient,
    markAsRegular,
    markAsVIP,
    addTags,
    removeTags,
    
    // Bulk operations
    bulkOperation,
    selectedClients,
    setSelectedClients,
    toggleClientSelection,
    selectAllClients,
    clearSelection,
    
    // Search and export
    searchClients,
    exportClients,
  };
};

export default useClients;