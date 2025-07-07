import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ClientService } from '../services/clientService';
import { MessageService } from '../services/messageService';
import { QUERY_KEYS } from '../utils/constants';
import type { 
  Client, 
  Message,
  Conversation,
  MessageTemplate,
  ClientStats,
  MessageStats,
  ClientFilters,
  MessageFilters,
  ConversationFilters,
  UseQueryOptions,
  UseMutationOptions 
} from '../types';

// =============================================================================
// CLIENT HOOKS
// =============================================================================

/**
 * Hook to get clients for the current user
 */
export const useClients = (
  filters: ClientFilters = {},
  options?: UseQueryOptions
) => {
  const queryKey = [...QUERY_KEYS.clients, filters];
  
  return useQuery({
    queryKey,
    queryFn: () => ClientService.getClients({
      page: 1,
      per_page: 50,
      include_stats: true,
      ...filters,
    }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to get infinite list of clients (for pagination)
 */
export const useInfiniteClients = (
  filters: ClientFilters = {},
  options?: UseQueryOptions
) => {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.clients, 'infinite', filters],
    queryFn: ({ pageParam = 1 }) => ClientService.getClients({
      page: pageParam,
      per_page: 20,
      include_stats: false,
      ...filters,
    }),
    getNextPageParam: (lastPage) => 
      lastPage.pagination.has_next ? lastPage.pagination.page + 1 : undefined,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to get a specific client
 */
export const useClient = (
  clientId: string | undefined,
  options?: UseQueryOptions & {
    include_stats?: boolean;
    include_settings?: boolean;
    include_messages?: boolean;
    message_limit?: number;
  }
) => {
  const { include_stats, include_settings, include_messages, message_limit, ...queryOptions } = options || {};
  
  return useQuery({
    queryKey: QUERY_KEYS.client(clientId || ''),
    queryFn: () => ClientService.getClient(clientId!, {
      include_stats,
      include_settings,
      include_messages,
      message_limit,
    }),
    enabled: !!clientId,
    staleTime: 1 * 60 * 1000, // 1 minute
    ...queryOptions,
  });
};

/**
 * Hook to create a new client
 */
export const useCreateClient = (
  options?: UseMutationOptions<Client, Error, {
    phone_number: string;
    name?: string;
    nickname?: string;
    email?: string;
    notes?: string;
    tags?: string[];
    relationship_status?: string;
    priority_level?: number;
  }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ClientService.createClient,
    onSuccess: (data, variables) => {
      // Add to clients cache
      queryClient.setQueryData(
        QUERY_KEYS.clients,
        (oldData: any) => {
          if (!oldData?.clients) return oldData;
          return {
            ...oldData,
            clients: [data, ...oldData.clients],
          };
        }
      );
      
      // Invalidate client stats
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clientStats });
      
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

/**
 * Hook to update a client
 */
export const useUpdateClient = (
  options?: UseMutationOptions<Client, Error, { clientId: string; updates: Partial<any> }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ clientId, updates }) => ClientService.updateClient(clientId, updates),
    onSuccess: (data, { clientId }) => {
      // Update specific client cache
      queryClient.setQueryData(QUERY_KEYS.client(clientId), data);
      
      // Update clients list cache
      queryClient.setQueryData(
        QUERY_KEYS.clients,
        (oldData: any) => {
          if (!oldData?.clients) return oldData;
          return {
            ...oldData,
            clients: oldData.clients.map((client: Client) =>
              client.id === clientId ? data : client
            ),
          };
        }
      );
      
      options?.onSuccess?.(data, { clientId, updates });
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

/**
 * Hook to delete a client
 */
export const useDeleteClient = (
  options?: UseMutationOptions<{ message: string }, Error, string>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ClientService.deleteClient,
    onSuccess: (data, clientId) => {
      // Remove from clients cache
      queryClient.setQueryData(
        QUERY_KEYS.clients,
        (oldData: any) => {
          if (!oldData?.clients) return oldData;
          return {
            ...oldData,
            clients: oldData.clients.filter((client: Client) => client.id !== clientId),
          };
        }
      );
      
      // Remove specific client cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.client(clientId) });
      
      // Invalidate client stats
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clientStats });
      
      options?.onSuccess?.(data, clientId);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

/**
 * Hook for client actions (block, unblock, flag, unflag)
 */
export const useClientAction = (
  action: 'block' | 'unblock' | 'flag' | 'unflag',
  options?: UseMutationOptions<{ message: string; client: Client }, Error, any>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: any) => {
      switch (action) {
        case 'block':
          return ClientService.blockClient(params.clientId, params.reason);
        case 'unblock':
          return ClientService.unblockClient(params.clientId);
        case 'flag':
          return ClientService.flagClient(params.clientId, params.reasons);
        case 'unflag':
          return ClientService.unflagClient(params.clientId);
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    },
    onSuccess: (data, params) => {
      const clientId = params.clientId;
      
      // Update specific client cache
      queryClient.setQueryData(QUERY_KEYS.client(clientId), data.client);
      
      // Update clients list cache
      queryClient.setQueryData(
        QUERY_KEYS.clients,
        (oldData: any) => {
          if (!oldData?.clients) return oldData;
          return {
            ...oldData,
            clients: oldData.clients.map((client: Client) =>
              client.id === clientId ? data.client : client
            ),
          };
        }
      );
      
      options?.onSuccess?.(data, params);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

/**
 * Hook for bulk client operations
 */
export const useBulkClientOperation = (
  options?: UseMutationOptions<any, Error, any>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ClientService.bulkOperation,
    onSuccess: (data, variables) => {
      // Invalidate all client-related queries to refresh data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clientStats });
      
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

/**
 * Hook to get client statistics
 */
export const useClientStats = (
  days: number = 30,
  options?: UseQueryOptions
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.clientStats, days],
    queryFn: () => ClientService.getClientStats(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// =============================================================================
// MESSAGE HOOKS
// =============================================================================

/**
 * Hook to get messages for the current user
 */
export const useMessages = (
  filters: MessageFilters = {},
  options?: UseQueryOptions
) => {
  const queryKey = [...QUERY_KEYS.messages, filters];
  
  return useQuery({
    queryKey,
    queryFn: () => MessageService.getMessages({
      page: 1,
      per_page: 50,
      include_analysis: false,
      ...filters,
    }),
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to get infinite list of messages (for pagination)
 */
export const useInfiniteMessages = (
  filters: MessageFilters = {},
  options?: UseQueryOptions
) => {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.messages, 'infinite', filters],
    queryFn: ({ pageParam = 1 }) => MessageService.getMessages({
      page: pageParam,
      per_page: 30,
      include_analysis: false,
      ...filters,
    }),
    getNextPageParam: (lastPage) => 
      lastPage.pagination.has_next ? lastPage.pagination.page + 1 : undefined,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to get a specific message
 */
export const useMessage = (
  messageId: string | undefined,
  includeAnalysis: boolean = true,
  options?: UseQueryOptions
) => {
  return useQuery({
    queryKey: QUERY_KEYS.message(messageId || ''),
    queryFn: () => MessageService.getMessage(messageId!, includeAnalysis),
    enabled: !!messageId,
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
};

/**
 * Hook to send a message
 */
export const useSendMessage = (
  options?: UseMutationOptions<Message, Error, {
    recipient_number: string;
    content: string;
    ai_generated?: boolean;
  }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: MessageService.sendMessage,
    onSuccess: (data, variables) => {
      // Add to messages cache
      queryClient.setQueryData(
        QUERY_KEYS.messages,
        (oldData: any) => {
          if (!oldData?.messages) return oldData;
          return {
            ...oldData,
            messages: [data, ...oldData.messages],
          };
        }
      );
      
      // Invalidate conversations to update latest message
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations });
      
      // Invalidate message stats
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.messageStats });
      
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

/**
 * Hook for message actions (mark read, flag, unflag)
 */
export const useMessageAction = (
  action: 'markRead' | 'flag' | 'unflag',
  options?: UseMutationOptions<{ message: string; message_data: Message }, Error, any>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: any) => {
      switch (action) {
        case 'markRead':
          return MessageService.markMessageRead(params.messageId);
        case 'flag':
          return MessageService.flagMessage(params.messageId, params.reasons);
        case 'unflag':
          return MessageService.unflagMessage(params.messageId);
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    },
    onSuccess: (data, params) => {
      const messageId = params.messageId;
      
      // Update specific message cache
      queryClient.setQueryData(QUERY_KEYS.message(messageId), data.message_data);
      
      // Update messages list cache
      queryClient.setQueryData(
        QUERY_KEYS.messages,
        (oldData: any) => {
          if (!oldData?.messages) return oldData;
          return {
            ...oldData,
            messages: oldData.messages.map((message: Message) =>
              message.id === messageId ? data.message_data : message
            ),
          };
        }
      );
      
      // If marking as read, update conversations
      if (action === 'markRead') {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations });
      }
      
      options?.onSuccess?.(data, params);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

/**
 * Hook to get message statistics
 */
export const useMessageStats = (
  days: number = 30,
  options?: UseQueryOptions
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.messageStats, days],
    queryFn: () => MessageService.getMessageStats(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// =============================================================================
// CONVERSATION HOOKS
// =============================================================================

/**
 * Hook to get conversations
 */
export const useConversations = (
  filters: ConversationFilters = {},
  options?: UseQueryOptions
) => {
  const queryKey = [...QUERY_KEYS.conversations, filters];
  
  return useQuery({
    queryKey,
    queryFn: () => MessageService.getConversations({
      page: 1,
      per_page: 50,
      ...filters,
    }),
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    ...options,
  });
};

/**
 * Hook to get messages for a specific conversation
 */
export const useConversationMessages = (
  phoneNumber: string | undefined,
  options?: UseQueryOptions & {
    page?: number;
    per_page?: number;
    include_analysis?: boolean;
  }
) => {
  const { page, per_page, include_analysis, ...queryOptions } = options || {};
  
  return useQuery({
    queryKey: QUERY_KEYS.conversation(phoneNumber || ''),
    queryFn: () => MessageService.getConversationMessages(phoneNumber!, {
      page,
      per_page,
      include_analysis,
    }),
    enabled: !!phoneNumber,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 10 * 1000, // Refetch every 10 seconds for active conversations
    ...queryOptions,
  });
};

// =============================================================================
// MESSAGE TEMPLATE HOOKS
// =============================================================================

/**
 * Hook to get message templates
 */
export const useMessageTemplates = (
  filters: { category?: string; active_only?: boolean } = {},
  options?: UseQueryOptions
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.messageTemplates, filters],
    queryFn: () => MessageService.getMessageTemplates(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

/**
 * Hook to create a message template
 */
export const useCreateMessageTemplate = (
  options?: UseMutationOptions<MessageTemplate, Error, {
    name: string;
    content: string;
    category?: string;
    description?: string;
  }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: MessageService.createMessageTemplate,
    onSuccess: (data, variables) => {
      // Add to templates cache
      queryClient.setQueryData(
        QUERY_KEYS.messageTemplates,
        (oldData: MessageTemplate[] | undefined) => {
          if (!oldData) return [data];
          return [data, ...oldData];
        }
      );
      
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

// =============================================================================
// UTILITY HOOKS
// =============================================================================

/**
 * Hook to refresh all client and message data
 */
export const useRefreshClientMessageData = () => {
  const queryClient = useQueryClient();
  
  return useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.messages }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clientStats }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.messageStats }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.messageTemplates }),
    ]);
  }, [queryClient]);
};

/**
 * Hook to search clients and messages locally
 */
export const useLocalSearch = () => {
  return {
    searchClients: useCallback((clients: Client[], searchTerm: string) => 
      ClientService.searchClients(clients, searchTerm), []),
    searchMessages: useCallback((messages: Message[], searchTerm: string) => 
      MessageService.searchMessages(messages, searchTerm), []),
    sortClients: useCallback((clients: Client[], sortBy: string, sortOrder: 'asc' | 'desc' = 'desc') => 
      ClientService.sortClients(clients, sortBy, sortOrder), []),
  };
};