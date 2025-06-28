import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Users, 
  Brain, 
  Settings, 
  TrendingUp, 
  Phone, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  PlusCircle,
  MoreVertical,
  Search,
  Filter,
  Bell,
  User,
  LogOut,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      name: "Sarah Wilson",
      phone: "+1 (555) 123-4567",
      isActive: true,
      aiEnabled: true,
      unreadMessages: 3,
      totalMessages: 47,
      responseRate: 98,
      lastActivity: "2 mins ago"
    },
    {
      id: 2,
      name: "Emma Davis",
      phone: "+1 (555) 987-6543",
      isActive: false,
      aiEnabled: false,
      unreadMessages: 0,
      totalMessages: 23,
      responseRate: 95,
      lastActivity: "1 hour ago"
    }
  ]);

  const [conversations, setConversations] = useState([
    {
      id: 1,
      clientName: "John D.",
      clientNumber: "+1 (555) 234-5678",
      lastMessage: "Are you available tonight?",
      timestamp: "2 mins ago",
      isUnread: true,
      profileId: 1,
      isAiResponded: false
    },
    {
      id: 2,
      clientName: "Mike R.",
      clientNumber: "+1 (555) 345-6789",
      lastMessage: "Thanks for the quick response!",
      timestamp: "15 mins ago",
      isUnread: false,
      profileId: 1,
      isAiResponded: true
    }
  ]);

  const stats = {
    totalMessages: 156,
    aiResponses: 89,
    responseRate: 97,
    avgResponseTime: "2.3 mins"
  };

  const StatCard = ({ icon: Icon, title, value, trend, color = "blue" }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ProfileCard = ({ profile }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{profile.name}</h3>
            <p className="text-sm text-gray-500">{profile.phone}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${profile.isActive ? 'bg-green-400' : 'bg-gray-300'}`}></div>
          <MoreVertical className="h-4 w-4 text-gray-400 cursor-pointer" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">{profile.unreadMessages}</p>
          <p className="text-xs text-gray-500">Unread</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">{profile.totalMessages}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className={`h-4 w-4 ${profile.aiEnabled ? 'text-green-500' : 'text-gray-400'}`} />
          <span className="text-sm text-gray-600">AI Responses</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={profile.aiEnabled} 
            className="sr-only peer"
            onChange={() => {
              setProfiles(profiles.map(p => 
                p.id === profile.id ? {...p, aiEnabled: !p.aiEnabled} : p
              ));
            }}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Response Rate</span>
        <span className="font-medium text-green-600">{profile.responseRate}%</span>
      </div>
      <div className="flex items-center justify-between text-sm mt-1">
        <span className="text-gray-500">Last Activity</span>
        <span className="text-gray-700">{profile.lastActivity}</span>
      </div>
    </div>
  );

  const ConversationItem = ({ conversation }) => (
    <div className={`p-4 border-l-4 ${conversation.isUnread ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-white'} hover:bg-gray-50 transition-colors cursor-pointer`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {conversation.clientName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{conversation.clientName}</h4>
            <p className="text-sm text-gray-500">{conversation.clientNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{conversation.timestamp}</p>
          {conversation.isAiResponded && (
            <div className="flex items-center space-x-1 mt-1">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-yellow-600">AI</span>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-700 truncate">{conversation.lastMessage}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">AssisText</h1>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('conversations')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'conversations' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Conversations
                </button>
                <button
                  onClick={() => setActiveTab('profiles')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'profiles' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profiles
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
                <LogOut className="h-4 w-4 text-gray-400 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={MessageSquare}
                title="Total Messages"
                value={stats.totalMessages}
                trend={12}
                color="blue"
              />
              <StatCard
                icon={Brain}
                title="AI Responses"
                value={stats.aiResponses}
                trend={8}
                color="purple"
              />
              <StatCard
                icon={TrendingUp}
                title="Response Rate"
                value={`${stats.responseRate}%`}
                trend={3}
                color="green"
              />
              <StatCard
                icon={Clock}
                title="Avg Response Time"
                value={stats.avgResponseTime}
                trend={-15}
                color="orange"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <PlusCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-700">Add New Profile</span>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                  <Settings className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-700">AI Settings</span>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-700">View Analytics</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversations</h2>
                <div className="space-y-2">
                  {conversations.slice(0, 3).map(conversation => (
                    <ConversationItem key={conversation.id} conversation={conversation} />
                  ))}
                </div>
                <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All Conversations
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Status</h2>
                <div className="space-y-4">
                  {profiles.map(profile => (
                    <div key={profile.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{profile.name}</h4>
                        <p className="text-sm text-gray-500">
                          {profile.unreadMessages} unread • {profile.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {profile.aiEnabled && <Brain className="h-4 w-4 text-green-500" />}
                        <div className={`h-3 w-3 rounded-full ${profile.isActive ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conversations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Conversations</h2>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {conversations.map(conversation => (
                <ConversationItem key={conversation.id} conversation={conversation} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profiles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Profiles</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <PlusCircle className="h-4 w-4" />
                <span>Add Profile</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map(profile => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;