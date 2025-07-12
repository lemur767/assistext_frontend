import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Zap,
  Brain,
  Phone,
  Clock,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalMessages: number;
  activeClients: number;
  responseRate: number;
  aiEfficiency: number;
  messagesChange: number;
  clientsChange: number;
  responseRateChange: number;
  efficiencyChange: number;
}

interface RecentActivity {
  id: string;
  type: 'message' | 'client' | 'ai' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  // Mock data - replace with actual API calls
  const stats: DashboardStats = {
    totalMessages: 1247,
    activeClients: 89,
    responseRate: 94.2,
    aiEfficiency: 87.5,
    messagesChange: 12.5,
    clientsChange: 8.3,
    responseRateChange: 2.1,
    efficiencyChange: -1.2,
  };

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'message',
      title: 'New message from Sarah Johnson',
      description: 'AI responded automatically within 2 seconds',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'success'
    },
    {
      id: '2',
      type: 'client',
      title: 'New client added',
      description: 'Mike Chen added to your contact list',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'info'
    },
    {
      id: '3',
      type: 'ai',
      title: 'AI model updated',
      description: 'Performance improvements deployed',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'success'
    },
    {
      id: '4',
      type: 'system',
      title: 'SignalWire connection verified',
      description: 'All systems operational',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'success'
    }
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change: number;
    icon: React.ElementType;
    suffix?: string;
  }> = ({ title, value, change, icon: Icon, suffix = '' }) => {
    const isPositive = change > 0;
    const isNeutral = change === 0;
    
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {value}{suffix}
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex items-center mt-4 space-x-2">
          {!isNeutral && (
            <div className={`flex items-center space-x-1 ${
              isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(change)}%
              </span>
            </div>
          )}
          <span className="text-sm text-slate-500 dark:text-slate-400">
            vs last {timeRange === '24h' ? 'day' : timeRange === '7d' ? 'week' : 'month'}
          </span>
        </div>
      </div>
    );
  };

  const ActivityItem: React.FC<{ activity: RecentActivity }> = ({ activity }) => {
    const getStatusIcon = () => {
      switch (activity.status) {
        case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
        case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
        case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
        default: return <Activity className="w-4 h-4 text-blue-500" />;
      }
    };

    const getTypeIcon = () => {
      switch (activity.type) {
        case 'message': return <MessageSquare className="w-5 h-5" />;
        case 'client': return <Users className="w-5 h-5" />;
        case 'ai': return <Brain className="w-5 h-5" />;
        default: return <Settings className="w-5 h-5" />;
      }
    };

    const timeAgo = (date: Date) => {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    };

    return (
      <div className="flex items-start space-x-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400">
          {getTypeIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {activity.title}
            </p>
            {getStatusIcon()}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {activity.description}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            {timeAgo(activity.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-accent rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.first_name || user?.username}! 👋
            </h1>
            <p className="text-white/80">
              Here's what's happening with your AI assistant today.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <p className="text-white/80 text-sm">Status</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Analytics Overview
        </h2>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '24h' | '7d' | '30d')}
            className="form-input text-sm py-2"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Messages"
          value={stats.totalMessages.toLocaleString()}
          change={stats.messagesChange}
          icon={MessageSquare}
        />
        <StatCard
          title="Active Clients"
          value={stats.activeClients}
          change={stats.clientsChange}
          icon={Users}
        />
        <StatCard
          title="Response Rate"
          value={stats.responseRate}
          change={stats.responseRateChange}
          icon={TrendingUp}
          suffix="%"
        />
        <StatCard
          title="AI Efficiency"
          value={stats.aiEfficiency}
          change={stats.efficiencyChange}
          icon={Brain}
          suffix="%"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Recent Activity
                </h3>
                <Link
                  to="/app/analytics"
                  className="text-sm text-brand-primary hover:text-brand-accent transition-colors"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/app/conversations"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
              >
                <MessageSquare className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  View Conversations
                </span>
              </Link>
              <Link
                to="/app/ai-settings"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
              >
                <Brain className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Configure AI
                </span>
              </Link>
              <Link
                to="/app/analytics"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
              >
                <BarChart3 className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  View Analytics
                </span>
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">AI Engine</span>
                </div>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full">
                  Online
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">SignalWire</span>
                </div>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full">
                  Connected
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Auto-Reply</span>
                </div>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;