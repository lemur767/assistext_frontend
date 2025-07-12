import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Send, 
  Phone, 
  Archive,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Bot,
  Paperclip,
  Smile
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Contact {
  phone_number: string;
  name?: string;
  avatar_url?: string;
  last_seen?: Date;
  is_blocked?: boolean;
}

interface Message {
  id: string;
  conversation_id: string;
  from_number: string;
  to_number: string;
  content: string;
  message_type: 'incoming' | 'outgoing' | 'auto_reply';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  ai_generated: boolean;
  timestamp: Date;
  metadata?: {
    response_time_ms?: number;
    model_used?: string;
  };
}

interface Conversation {
  id: string;
  contact: Contact;
  last_message: Message;
  unread_count: number;
  is_archived: boolean;
  is_starred: boolean;
  created_at: Date;
  updated_at: Date;
}

const Conversations: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations with real-time updates
  useEffect(() => {
    const interval = setInterval(loadConversations, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/conversations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
        
        // If a conversation is selected, refresh its messages
        if (selectedConversation) {
          loadMessages(selectedConversation.id);
        }
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        
        // Mark conversation as read
        markAsRead(conversationId);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (conversationId: string) => {
    try {
      await fetch(`/api/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) {
      return;
    }

    setIsSending(true);
    
    try {
      const response = await fetch('/api/conversations/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          to_number: selectedConversation.contact.phone_number,
          message: newMessage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const sentMessage = await response.json();
      
      // Add message to local state immediately
      setMessages(prev => [...prev, sentMessage.message]);
      setNewMessage('');
      
      // Update conversation list
      loadConversations();
      
      toast.success('Message sent!');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const toggleArchive = async (conversationId: string, isArchived: boolean) => {
    try {
      await fetch(`/api/conversations/${conversationId}/archive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ archived: !isArchived })
      });
      
      loadConversations();
      toast.success(isArchived ? 'Conversation unarchived' : 'Conversation archived');
    } catch (error) {
      toast.error('Failed to update conversation');
    }
  };

  const toggleStar = async (conversationId: string, isStarred: boolean) => {
    try {
      await fetch(`/api/conversations/${conversationId}/star`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ starred: !isStarred })
      });
      
      loadConversations();
    } catch (error) {
      toast.error('Failed to update conversation');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) {
      return 'Just now';
    } else if (hours < 24) {
      return `${Math.floor(hours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredConversations = conversations.filter(conv => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesPhone = conv.contact.phone_number.includes(query);
      const matchesName = conv.contact.name?.toLowerCase().includes(query);
      const matchesMessage = conv.last_message.content.toLowerCase().includes(query);
      
      if (!matchesPhone && !matchesName && !matchesMessage) {
        return false;
      }
    }
    
    // Apply type filter
    switch (filterType) {
      case 'unread':
        return conv.unread_count > 0;
      case 'starred':
        return conv.is_starred;
      case 'archived':
        return conv.is_archived;
      default:
        return !conv.is_archived; // Show non-archived by default
    }
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white dark:bg-slate-900">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Conversations
          </h1>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="form-input pl-9 text-sm"
            />
          </div>
          
          {/* Filters */}
          <div className="flex space-x-2">
            {(['all', 'unread', 'starred', 'archived'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterType === filter
                    ? 'bg-brand-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => {
                setSelectedConversation(conversation);
                loadMessages(conversation.id);
              }}
              className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-brand-primary/10 border-brand-primary/20' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                  {conversation.contact.avatar_url ? (
                    <img 
                      src={conversation.contact.avatar_url} 
                      alt={conversation.contact.name || 'Contact'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Contact Info */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {conversation.contact.name || formatPhoneNumber(conversation.contact.phone_number)}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {conversation.is_starred && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      <span className="text-xs text-slate-500">
                        {formatTimestamp(conversation.last_message.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Last Message */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {conversation.last_message.ai_generated && (
                        <Bot className="w-3 h-3 text-brand-primary flex-shrink-0" />
                      )}
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {conversation.last_message.content}
                      </p>
                    </div>
                    
                    {conversation.unread_count > 0 && (
                      <span className="bg-brand-primary text-white text-xs rounded-full px-2 py-1 ml-2">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredConversations.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-slate-400 mb-2">
                <User className="w-12 h-12 mx-auto mb-3" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                    {selectedConversation.contact.avatar_url ? (
                      <img 
                        src={selectedConversation.contact.avatar_url} 
                        alt={selectedConversation.contact.name || 'Contact'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedConversation.contact.name || 'Unknown Contact'}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatPhoneNumber(selectedConversation.contact.phone_number)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleStar(selectedConversation.id, selectedConversation.is_starred)}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedConversation.is_starred
                        ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${selectedConversation.is_starred ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => toggleArchive(selectedConversation.id, selectedConversation.is_archived)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Archive className="w-5 h-5" />
                  </button>
                  
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.message_type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.message_type === 'outgoing'
                        ? 'bg-brand-primary text-white'
                        : message.ai_generated
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                    }`}>
                      <div className="flex items-start space-x-2">
                        {message.ai_generated && message.message_type !== 'outgoing' && (
                          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`text-xs ${
                              message.message_type === 'outgoing' 
                                ? 'text-white/70' 
                                : 'text-slate-500 dark:text-slate-400'
                            }`}>
                              {formatTimestamp(message.timestamp)}
                            </span>
                            
                            {message.message_type === 'outgoing' && (
                              <div className="flex items-center space-x-1">
                                {message.status === 'sent' && <Clock className="w-3 h-3 text-white/70" />}
                                {message.status === 'delivered' && <CheckCircle className="w-3 h-3 text-white/70" />}
                                {message.status === 'failed' && <AlertCircle className="w-3 h-3 text-red-300" />}
                              </div>
                            )}
                          </div>
                          
                          {message.ai_generated && message.metadata?.response_time_ms && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              AI response ({message.metadata.response_time_ms}ms)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    ref={messageInputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="form-input resize-none"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                Select a conversation
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;