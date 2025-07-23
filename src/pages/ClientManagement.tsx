// src/components/ClientManagement.tsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  Tag, 
  Flag, 
  Archive,
  Download,
  Plus,
  Shield,
  AlertTriangle,
  CheckSquare
} from 'lucide-react';
import { ClientService } from '../services/clientService';
import type { Client, ClientFilters, PaginatedResponse } from '../types/client';

interface ClientManagementProps {
  profileId?: string;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ profileId }) => {
  // State management
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [filters, setFilters] = useState<ClientFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Load clients data
  const user_id = localStorage.getItem('user_id');

  const loadClients = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      // Convert tags array to comma-separated string if present
      const searchFilters: any = {
        ...filters,
        ...(searchQuery && { search: searchQuery }),
        ...(filters.tags && Array.isArray(filters.tags) ? { tags: filters.tags.join(',') } : {}),
      };

      let response: PaginatedResponse<Client>;
      
      const rawResponse = await ClientService.getClients({
        page: currentPage,
        per_page: 20,
        ...searchFilters
      });
      response = {
        data: rawResponse.clients,
        pagination: rawResponse.pagination,
        success: true,
        filters_applied: rawResponse.filters_applied
      };

      setClients(response.data);
      setTotalPages(response.pagination.pages);
      setTotalClients(response.pagination.total);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Failed to load clients');
      console.error('Error loading clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load clients when dependencies change
  useEffect(() => {
    loadClients();
  }, [profileId, currentPage, searchQuery, filters]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<ClientFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page
  };

  // Handle client block/unblock
  const handleToggleBlock = async (clientId: string, shouldBlock: boolean) => {
    try {
      await ClientService.toggleBlockClient(clientId, shouldBlock);
      await loadClients(); // Refresh the list
    } catch (err) {
      console.error('Error toggling block status:', err);
    }
  };

  // Handle client flag/unflag
  const handleToggleFlag = async (clientId: string, shouldFlag: boolean) => {
    try {
      await ClientService.toggleFlagClient(clientId, shouldFlag);
      await loadClients(); // Refresh the list
    } catch (err) {
      console.error('Error toggling flag status:', err);
    }
  };

  // Handle regular status toggle
  const handleToggleRegular = async (phoneNumber: string, isRegular: boolean) => {
    try {
      await ClientService.markClientAsRegular(phoneNumber, isRegular);
      await loadClients(); // Refresh the list
    } catch (err) {
      console.error('Error updating regular status:', err);
    }
  };

  // Handle client selection
  const handleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map(client => client.id));
    }
  };

  // Handle bulk operations
  const handleBulkBlock = async () => {
    if (selectedClients.length === 0) return;
    
    try {
      await ClientService.bulkOperation({
        client_ids: selectedClients,
        operation: 'block',
        data: { reason: 'Bulk block operation' }
      });
      setSelectedClients([]);
      await loadClients();
    } catch (err) {
      console.error('Error in bulk block:', err);
    }
  };

  const handleBulkUnblock = async () => {
    if (selectedClients.length === 0) return;
    
    try {
      await ClientService.bulkOperation({
        client_ids: selectedClients,
        operation: 'unblock'
      });
      setSelectedClients([]);
      await loadClients();
    } catch (err) {
      console.error('Error in bulk unblock:', err);
    }
  };

  // Export clients
  const handleExport = async () => {
    try {
      await ClientService.exportClients(profileId, filters);
    } catch (err) {
      console.error('Error exporting clients:', err);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status display info
  const getStatusInfo = (client: Client) => {
    if (client.is_blocked) {
      return { text: 'Blocked', color: 'bg-red-100 text-red-800' };
    }
    if (client.is_flagged) {
      return { text: 'Flagged', color: 'bg-yellow-100 text-yellow-800' };
    }
    if (client.is_vip) {
      return { text: 'VIP', color: 'bg-purple-100 text-purple-800' };
    }
    if (client.is_regular) {
      return { text: 'Regular', color: 'bg-blue-100 text-blue-800' };
    }
    return { text: 'Active', color: 'bg-green-100 text-green-800' };
  };

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Error Loading Clients
          </h3>
          <p className="text-gray-600 text-center mb-6">
            {error || 'An unexpected error occurred'}
          </p>
          <button
            onClick={loadClients}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-500">Manage your SMS contacts and conversations</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={loadClients}
              disabled={isLoading}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
            
            <button
              onClick={handleExport}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <button className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Client</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange({ 
                status: e.target.value === 'all' ? undefined : e.target.value as any 
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="flagged">Flagged</option>
              <option value="regular">Regular</option>
              <option value="vip">VIP</option>
            </select>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={filters.date_from || ''}
                    onChange={(e) => handleFilterChange({ date_from: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={filters.date_to || ''}
                    onChange={(e) => handleFilterChange({ date_to: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.has_email || false}
                        onChange={(e) => handleFilterChange({ has_email: e.target.checked || undefined })}
                        className="mr-2"
                      />
                      <span className="text-sm">Has Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.has_name || false}
                        onChange={(e) => handleFilterChange({ has_name: e.target.checked || undefined })}
                        className="mr-2"
                      />
                      <span className="text-sm">Has Name</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedClients.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-800">
                  {selectedClients.length} client{selectedClients.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleBulkBlock}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Block
                  </button>
                  <button
                    onClick={handleBulkUnblock}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Unblock
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedClients([])}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Client Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search or filters' : 'Your clients will appear here once they contact you'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedClients.length === clients.length && clients.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Messages
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Contact
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => {
                    const statusInfo = getStatusInfo(client);
                    return (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedClients.includes(client.id)}
                            onChange={() => handleClientSelection(client.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Phone className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {client.name || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-500">{client.phone_number}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {client.email && <Mail className="w-4 h-4 text-gray-400" />}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                            {client.tags.map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-1">
                            <span>{client.total_messages}</span>
                            {client.unread_messages > 0 && (
                              <span className="bg-red-100 text-red-800 text-xs rounded-full px-2 py-0.5">
                                {client.unread_messages} new
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(client.last_contact)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleToggleFlag(client.id, !client.is_flagged)}
                              className={`p-1 rounded ${
                                client.is_flagged 
                                  ? 'text-yellow-600 hover:bg-yellow-50' 
                                  : 'text-gray-400 hover:bg-gray-50'
                              }`}
                              title={client.is_flagged ? 'Unflag client' : 'Flag client'}
                            >
                              <Flag className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleBlock(client.id, !client.is_blocked)}
                              className={`p-1 rounded ${
                                client.is_blocked 
                                  ? 'text-red-600 hover:bg-red-50' 
                                  : 'text-gray-400 hover:bg-gray-50'
                              }`}
                              title={client.is_blocked ? 'Unblock client' : 'Block client'}
                            >
                              {client.is_blocked ? <Archive className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleToggleRegular(client.phone_number, !client.is_regular)}
                              className={`p-1 rounded ${
                                client.is_regular 
                                  ? 'text-blue-600 hover:bg-blue-50' 
                                  : 'text-gray-400 hover:bg-gray-50'
                              }`}
                              title={client.is_regular ? 'Remove regular status' : 'Mark as regular'}
                            >
                              <CheckSquare className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:bg-gray-50 rounded">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages} ({totalClients} total clients)
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManagement;