// src/pages/ClientManagement.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { clientsAPI } from '../api/clients';
import { Search, Filter, MoreVertical, Phone, Mail, Tag, Flag, Archive } from 'lucide-react';

interface Client {
  id: string;
  phone_number: string;
  name?: string;
  email?: string;
  tags: string[];
  is_blocked: boolean;
  is_flagged: boolean;
  last_contact: string;
  total_messages: number;
}

const ClientManagement: React.FC = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedProfile) {
      loadClients();
    }
  }, [selectedProfile, searchQuery, filterStatus]);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const filters = {
        search: searchQuery,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      };
      const data = await clientsAPI.getClients(selectedProfile, 1, 50, filters);
      setClients(data.clients || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBlock = async (clientId: string, isBlocked: boolean) => {
    try {
      await clientsAPI.toggleBlockClient(clientId, !isBlocked);
      setClients(prev => 
        prev.map(client => 
          client.id === clientId 
            ? { ...client, is_blocked: !isBlocked }
            : client
        )
      );
    } catch (error) {
      console.error('Error toggling block status:', error);
    }
  };

  const handleToggleFlag = async (clientId: string, isFlagged: boolean) => {
    try {
      await clientsAPI.toggleFlagClient(clientId, !isFlagged);
      setClients(prev => 
        prev.map(client => 
          client.id === clientId 
            ? { ...client, is_flagged: !isFlagged }
            : client
        )
      );
    } catch (error) {
      console.error('Error toggling flag status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-500">Manage your SMS contacts and conversations</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Clients</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Clients ({clients.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Messages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {client.name || client.phone_number}
                          </div>
                          <div className="text-sm text-gray-500">
                            {client.phone_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.total_messages}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(client.last_contact).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {client.is_blocked && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Blocked
                          </span>
                        )}
                        {client.is_flagged && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Flagged
                          </span>
                        )}
                        {!client.is_blocked && !client.is_flagged && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleFlag(client.id, client.is_flagged)}
                          className={`p-1 rounded ${
                            client.is_flagged 
                              ? 'text-yellow-600 hover:bg-yellow-50' 
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleBlock(client.id, client.is_blocked)}
                          className={`p-1 rounded ${
                            client.is_blocked 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:bg-gray-50 rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;