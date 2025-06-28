import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Phone, 
  Info, 
  MoreVertical, 
  ArrowLeft,
  Brain,
  Clock,
  CheckCheck,
  Check,
  AlertTriangle,
  User,
  Settings,
  Zap,
  MessageSquareMore,
  Copy,
  Flag,
  Ban,
  Star,
  Archive
} from 'lucide-react';

const ConversationInterface = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [isAiMode, setIsAiMode] = useState(true);
  const [showClientInfo, setShowClientInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const conversations = [
    {
      id: 1,
      clientName: "John D.",
      clientNumber: "+1 (555) 234-5678",
      profileName: "Sarah Wilson",
      lastMessage: "Are you available tonight?",
      timestamp: "2 mins ago",
      isUnread: true,
      isOnline: true,
      isRegular: true,
      notes: "Regular client, prefers evening appointments"
    },
    {
      id: 2,
      clientName: "Mike R.",
      clientNumber: "+1 (555) 345-6789",
      profileName: "Sarah Wilson",
      lastMessage: "Thanks for the quick response!",
      timestamp: "15 mins ago",
      isUnread: false,
      isOnline: false,
      isRegular: false,
      notes: "New client, verified"
    },
    {
      id: 3,
      clientName: "Alex K.",
      clientNumber: "+1 (555) 456-7890",
      profileName: "Emma Davis",
      lastMessage: "What's your availability for tomorrow?",
      timestamp: "1 hour ago",
      isUnread: true,
      isOnline: true,
      isRegular: true,
      notes: "VIP client, travels frequently"
    }
  ];

  const [messages, setMessages] = useState({
    1: [
      {
        id: 1,
        content: "Hey Sarah, how's your evening going?",
        isIncoming: true,
        timestamp: "6:30 PM",
        status: "delivered",
        isAiGenerated: false
      },
      {
        id: 2,
        content: "Hi! It's going well, thanks for asking 😊",
        isIncoming: false,
        timestamp: "6:32 PM",
        status: "delivered",
        isAiGenerated: true
      },
      {
        id: 3,
        content: "Are you available tonight?",
        isIncoming: true,
        timestamp: "6:35 PM",
        status: "delivered",
        isAiGenerated: false
      }
    ],
    2: [
      {
        id: 1,
        content: "Thank you for the information!",
        isIncoming: true,
        timestamp: "5:15 PM",
        status: "delivered",
        isAiGenerated: false
      },
      {
        id: 2,
        content: "You're welcome! Let me know if you need anything else.",
        isIncoming: false,
        timestamp: "5:16 PM",
        status: "delivered",
        isAiGenerated: true
      },
      {
        id: 3,
        content: "Thanks for the quick response!",
        isIncoming: true,
        timestamp: "5:17 PM",
        status: "delivered",
        isAiGenerated: false
      }
    ]
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      content: message,
      isIncoming: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sending",
      isAiGenerated: false
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage]
    }));

    setMessage('');
    
    // Simulate message sending and delivery
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id].map(msg => 
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        )
      }));
    }, 1000);
  };

  const handleAiResponse = () => {
    if (!selectedConversation) return;

    setIsTyping(true);
    
    setTimeout(() => {
      const aiResponse = {
        id: Date.now(),
        content: "I appreciate you reaching out! Let me check my schedule and get back to you shortly.",
        isIncoming: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "delivered",
        isAiGenerated: true
      };

      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: [...(prev[selectedConversation.id] || []), aiResponse]
      }));
      
      setIsTyping(false);
    }, 2000);
  };

  const ConversationListItem = ({ conversation }) => (
    <div
      className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        selectedConversation?.id === conversation.id ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
      }`}
      onClick={() => setSelectedConversation(conversation)}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {conversation.clientName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          {conversation.isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900 truncate">{conversation.clientName}</h4>
              {conversation.isRegular && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
            <span className="text-xs text-gray-500">{conversation.timestamp}</span>
          </div>
          
          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
          
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-400">{conversation.profileName}</span>
            {conversation.isUnread && (
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const MessageBubble = ({ message }) => (
    <div className={`flex ${message.isIncoming ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        message.isIncoming 
          ? 'bg-gray-100 text-gray-900' 
          : 'bg-blue-600 text-white'
      } ${message.isAiGenerated && !message.isIncoming ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}`}>
        <p className="text-sm">{message.content}</p>
        <div className="flex items-center justify-between mt-1">
          <span className={`text-xs ${message.isIncoming ? 'text-gray-500' : 'text-blue-100'}`}>
            {message.timestamp}
          </span>
          <div className="flex items-center space-x-1 ml-2">
            {message.isAiGenerated && !message.isIncoming && (
              <Zap className="h-3 w-3 text-yellow-300" />
            )}
            {!message.isIncoming && (
              message.status === "sending" ? (
                <Clock className="h-3 w-3 text-blue-200" />
              ) : message.status === "delivered" ? (
                <CheckCheck className="h-3 w-3 text-blue-200" />
              ) : (
                <Check className="h-3 w-3 text-blue-200" />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conversation => (
            <ConversationListItem 
              key={conversation.id} 
              conversation={conversation} 
            />
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button className="lg:hidden text-gray-400 hover:text-gray-600">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  
                  <div className="relative">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {selectedConversation.clientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {selectedConversation.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                      <span>{selectedConversation.clientName}</span>
                      {selectedConversation.isRegular && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedConversation.clientNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-full">
                    <Brain className={`h-4 w-4 ${isAiMode ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className="text-sm text-gray-600">AI Mode</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isAiMode} 
                        onChange={(e) => setIsAiMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-6 h-3 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <button 
                    onClick={() => setShowClientInfo(!showClientInfo)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <Info className="h-5 w-5" />
                  </button>
                  
                  <div className="relative">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(messages[selectedConversation.id] || []).map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              {isAiMode && (
                <div className="mb-3 flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-purple-700">AI Mode Active</span>
                  </div>
                  <button
                    onClick={handleAiResponse}
                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Generate AI Response
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <MessageSquareMore className="h-5 w-5" />
                  </button>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquareMore className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Client Info Sidebar */}
      {showClientInfo && selectedConversation && (
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Client Info</h3>
            <button 
              onClick={() => setShowClientInfo(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-medium">
                  {selectedConversation.clientName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h4 className="text-lg font-medium text-gray-900">{selectedConversation.clientName}</h4>
              <p className="text-gray-500">{selectedConversation.clientNumber}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Status</span>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${selectedConversation.isOnline ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium">{selectedConversation.isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Client Type</span>
                <div className="flex items-center space-x-1">
                  {selectedConversation.isRegular && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  <span className="text-sm font-medium">{selectedConversation.isRegular ? 'Regular' : 'New'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Notes</h5>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedConversation.notes}</p>
            </div>
            
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Flag className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">Flag Conversation</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Archive className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">Archive</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600">
                <Ban className="h-4 w-4" />
                <span className="text-sm">Block Client</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationInterface;