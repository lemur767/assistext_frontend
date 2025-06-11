import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { messageService } from '../../services/messageService';
import { formatters } from '../../utils/formatters';
import { QUERY_KEYS } from '../../utils/constants';
import type { 
  Profile, 
  Conversation, 
  Message, 
  Client,
  BaseComponentProps 
} from '../../types';

interface MessagingInterfaceProps extends BaseComponentProps {
  profileId: string;
}

export const MessagingInterface: React.FC<MessagingInterfaceProps> = ({ 
  profileId, 
  className = '' 
}) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileConversationsOpen, setIsMobileConversationsOpen] = useState(false);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const queryClient = useQueryClient();

  // WebSocket connection for real-time messages
  const { messages, sendMessage, isConnected } = useWebSocket(profileId);

  // Fetch conversations
  const { data: conversations = [] } = useQuery({
    queryKey: QUERY_KEYS.conversations(profileId),
    queryFn: () => messageService.getConversations(profileId),
    refetchInterval: 30000,
  });

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Keyboard shortcuts
  useKeyboardShortcut(
    { key: 'k', ctrlKey: true },
    () => setIsMobileConversationsOpen(true),
    []
  );

  useKeyboardShortcut(
    { key: 'Escape' },
    () => {
      if (isMobileConversationsOpen) {
        setIsMobileConversationsOpen(false);
      }
    },
    [isMobileConversationsOpen]
  );

  return (
    <div className={`messaging-interface flex h-full ${className}`}>
      {/* Conversations Panel */}
      <ConversationsPanel
        conversations={filteredConversations}
        selectedId={selectedConversationId}
        onSelect={(id) => {
          setSelectedConversationId(id);
          if (isMobile) {
            setIsMobileConversationsOpen(false);
          }
        }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isOpen={isMobileConversationsOpen}
        onClose={() => setIsMobileConversationsOpen(false)}
        isMobile={isMobile}
      />

      {/* Chat Panel */}
      <ChatPanel
        conversationId={selectedConversationId}
        profileId={profileId}
        isConnected={isConnected}
        onOpenConversations={() => setIsMobileConversationsOpen(true)}
        isMobile={isMobile}
      />
    </div>
  );
};

// Conversations Panel Component
interface ConversationsPanelProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const ConversationsPanel: React.FC<ConversationsPanelProps> = ({
  conversations,
  selectedId,
  onSelect,
  searchTerm,
  onSearchChange,
  isOpen,
  onClose,
  isMobile,
}) => {
  const panelClasses = `
    w-80 bg-card border-r border-neutral-200 dark:border-neutral-700 
    flex flex-col h-full transition-transform duration-300
    ${isMobile ? 
      `fixed inset-y-0 left-0 z-modal shadow-xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}` : 
      'relative'
    }
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      <div className={panelClasses}>
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg text-theme">Conversations</h3>
            {isMobile && (
              <button 
                onClick={onClose}
                className="btn btn-ghost p-1"
                aria-label="Close conversations"
              >
                <XIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <SearchInput 
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search conversations..."
            className="w-full"
          />
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <EmptyConversations />
          ) : (
            <div className="space-y-1 p-2">
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === selectedId}
                  onClick={() => onSelect(conversation.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Individual Conversation Item
interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div 
      className={`
        conversation-item flex items-center gap-3 p-3 rounded-lg cursor-pointer
        transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800
        ${isActive ? 
          'bg-primary/10 border-l-4 border-primary text-primary dark:bg-primary-dark/10 dark:border-primary-dark dark:text-primary-dark' : 
          'text-theme'
        }
      `}
      onClick={onClick}
    >
      <div className="profile-avatar w-12 h-12 text-sm">
        {getInitials(conversation.clientName)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">
          {conversation.clientName}
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
          {conversation.lastMessage}
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <div className="text-xs text-neutral-400">
          {formatters.relativeTime(conversation.lastMessageTime)}
        </div>
        {conversation.unreadCount > 0 && (
          <div className="badge bg-primary text-white min-w-5 h-5 text-xs flex items-center justify-center">
            {conversation.unreadCount}
          </div>
        )}
      </div>
    </div>
  );
};

// Chat Panel Component
interface ChatPanelProps {
  conversationId: string | null;
  profileId: string;
  isConnected: boolean;
  onOpenConversations: () => void;
  isMobile: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  conversationId,
  profileId,
  isConnected,
  onOpenConversations,
  isMobile,
}) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  // Fetch conversation details
  const { data: conversation } = useQuery({
    queryKey: QUERY_KEYS.conversation(conversationId || ''),
    queryFn: () => messageService.getConversation(conversationId!),
    enabled: !!conversationId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: messageService.sendMessage,
    onSuccess: () => {
      setMessageText('');
      scrollToBottom();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations(profileId) });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [messageText]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!messageText.trim() || !conversationId) return;

    sendMessageMutation.mutate({
      conversationId,
      profileId,
      content: messageText,
      isAiGenerated: false,
    });
  }, [messageText, conversationId, profileId, sendMessageMutation]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  if (!conversationId) {
    return (
      <div className="flex-1 bg-card flex items-center justify-center">
        <EmptyChatState onOpenConversations={onOpenConversations} isMobile={isMobile} />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex-1 bg-card flex items-center justify-center">
        <LoadingChatState />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-card flex flex-col">
      {/* Chat Header */}
      <ChatHeader 
        conversation={conversation} 
        isConnected={isConnected}
        onOpenConversations={onOpenConversations}
        isMobile={isMobile}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="space-y-4">
          {conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <MessageInput
        value={messageText}
        onChange={setMessageText}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
        disabled={sendMessageMutation.isPending}
        textareaRef={textareaRef}
      />
    </div>
  );
};

// Chat Header Component
interface ChatHeaderProps {
  conversation: Conversation;
  isConnected: boolean;
  onOpenConversations: () => void;
  isMobile: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  isConnected,
  onOpenConversations,
  isMobile,
}) => {
  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="chat-header p-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMobile && (
            <button 
              onClick={onOpenConversations}
              className="btn btn-ghost p-2 -ml-2"
              aria-label="Open conversations"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          )}
          
          <div className="profile-avatar w-10 h-10 text-sm">
            {getInitials(conversation.clientName)}
          </div>
          
          <div>
            <div className="font-semibold text-theme">
              {conversation.clientName}
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <div className={`status-indicator ${isConnected ? 'online' : 'offline'}`} />
              <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <ActionButton 
            icon={<PhoneIcon className="w-4 h-4" />}
            onClick={() => window.open(`tel:${conversation.clientPhone}`)}
            title="Call client"
          />
          <ActionButton 
            icon={<ArchiveIcon className="w-4 h-4" />}
            onClick={() => console.log('Archive conversation')}
            title="Archive conversation"
          />
          <ActionButton 
            icon={<BlockIcon className="w-4 h-4" />}
            onClick={() => console.log('Block client')}
            title="Block client"
            variant="error"
          />
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const messageClasses = `
    flex gap-3 mb-4
    ${message.isIncoming ? '' : 'flex-row-reverse'}
  `;

  const bubbleClasses = `
    message-bubble max-w-xs sm:max-w-sm lg:max-w-md
    ${message.isIncoming ? 'incoming' : 'outgoing'}
    ${message.aiGenerated ? 'ai-generated' : ''}
  `;

  return (
    <div className={messageClasses}>
      <div className="profile-avatar w-8 h-8 text-xs flex-shrink-0">
        {message.isIncoming ? 
          message.senderNumber.slice(-2) : 
          'AT'
        }
      </div>
      
      <div className="flex flex-col gap-1">
        <div className={bubbleClasses}>
          {message.content}
        </div>
        
        <div className={`
          flex items-center gap-2 text-xs text-neutral-400 px-1
          ${message.isIncoming ? '' : 'flex-row-reverse'}
        `}>
          {message.aiGenerated && (
            <span className="badge badge-primary text-xs">AI</span>
          )}
          <span>{formatters.time(message.timestamp)}</span>
          {!message.isIncoming && (
            <MessageStatus status={message.status} />
          )}
        </div>
      </div>
    </div>
  );
};

// Message Status Component
interface MessageStatusProps {
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
}

const MessageStatus: React.FC<MessageStatusProps> = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending': return <div className="w-4 h-4 rounded-full border-2 border-neutral-300 border-t-primary animate-spin" />;
      case 'sent': return <CheckIcon className="w-4 h-4 text-neutral-400" />;
      case 'delivered': return <CheckDoubleIcon className="w-4 h-4 text-success" />;
      case 'failed': return <ExclamationIcon className="w-4 h-4 text-error" />;
      default: return null;
    }
  };

  return (
    <span className="flex items-center">
      {getStatusIcon()}
    </span>
  );
};

// Message Input Component
interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  disabled,
  textareaRef,
}) => {
  return (
    <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-card">
      <div className="flex items-end gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus-within:border-primary dark:focus-within:border-primary-dark transition-colors">
        <textarea
          ref={textareaRef}
          className="flex-1 bg-transparent border-none outline-none resize-none text-theme placeholder:text-neutral-400 max-h-32"
          placeholder="Type your message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          rows={1}
          disabled={disabled}
        />
        
        <button
          className={`
            btn p-2 rounded-lg transition-all duration-200
            ${value.trim() && !disabled ? 
              'bg-primary hover:bg-primary/90 text-white dark:bg-primary-dark dark:hover:bg-primary-dark/90' : 
              'bg-neutral-200 text-neutral-400 cursor-not-allowed dark:bg-neutral-700'
            }
          `}
          onClick={onSend}
          disabled={disabled || !value.trim()}
        >
          {disabled ? (
            <div className="loading-spinner w-5 h-5" />
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

// Search Input Component
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
      <input
        type="text"
        className="form-input pl-10 pr-4 py-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

// Action Button Component
interface ActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
  variant?: 'default' | 'error';
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  onClick, 
  title, 
  variant = 'default' 
}) => {
  const variantClasses = {
    default: 'btn-ghost',
    error: 'text-error hover:bg-error/10 dark:hover:bg-error/20',
  };

  return (
    <button
      className={`btn p-2 ${variantClasses[variant]}`}
      onClick={onClick}
      title={title}
    >
      {icon}
    </button>
  );
};

// Empty States
const EmptyConversations: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-4xl mb-4">💬</div>
    <h3 className="font-semibold text-theme mb-2">No conversations yet</h3>
    <p className="text-sm text-neutral-500">
      Messages will appear here when clients contact you.
    </p>
  </div>
);

interface EmptyChatStateProps {
  onOpenConversations: () => void;
  isMobile: boolean;
}

const EmptyChatState: React.FC<EmptyChatStateProps> = ({ 
  onOpenConversations, 
  isMobile 
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-4xl mb-4">💭</div>
    <h3 className="font-semibold text-theme mb-2">Select a conversation</h3>
    <p className="text-sm text-neutral-500 mb-4">
      Choose a conversation from the sidebar to start messaging.
    </p>
    {isMobile && (
      <button 
        className="btn btn-primary"
        onClick={onOpenConversations}
      >
        Open Conversations
      </button>
    )}
  </div>
);

const LoadingChatState: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="loading-spinner mb-4" />
    <p className="text-neutral-500">Loading conversation...</p>
  </div>
);

// Icons
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const ArchiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
  </svg>
);

const BlockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CheckDoubleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

export default MessagingInterface;