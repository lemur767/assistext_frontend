// src/components/Dashboard/Dashboard.tsx
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analyticsService';
import { formatters } from '../../utils/formatters';
import { QUERY_KEYS } from '../../utils/constants';
import type { 
  DashboardData, 
  DashboardStats, 
  Activity, 
  Insight, 
  Client,
  BaseComponentProps 
} from '../../types';

// Chart.js imports for TypeScript
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps extends BaseComponentProps {
  profileId: string;
}

type TimeRange = '24h' | '7d' | '30d' | '90d';

export const Dashboard: React.FC<DashboardProps> = ({ 
  profileId, 
  className = '' 
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: QUERY_KEYS.dashboard(profileId),
    queryFn: () => analyticsService.getDashboardData(profileId, timeRange),
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className={`dashboard space-y-8 ${className}`}>
      {/* Dashboard Header */}
      <DashboardHeader 
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        data={dashboardData}
      />

      {/* Stats Grid */}
      <StatsGrid stats={dashboardData?.stats} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MessageVolumeChart 
          data={dashboardData?.messageVolume}
          timeRange={timeRange}
        />
        <AIPerformanceChart 
          data={dashboardData?.aiPerformance}
          timeRange={timeRange}
        />
      </div>

      {/* Activity and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={dashboardData?.recentActivity || []} />
        <QuickInsights insights={dashboardData?.insights || []} />
      </div>

      {/* Client Analytics */}
      <ClientAnalytics 
        clients={dashboardData?.topClients || []}
        timeRange={timeRange}
      />
    </div>
  );
};

// Dashboard Header Component
interface DashboardHeaderProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  data?: DashboardData;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  timeRange, 
  onTimeRangeChange, 
  data 
}) => {
  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ];

  const formatDateRange = (range: TimeRange): string => {
    const now = new Date();
    const start = new Date();
    
    switch (range) {
      case '24h':
        start.setHours(start.getHours() - 24);
        break;
      case '7d':
        start.setDate(start.getDate() - 7);
        break;
      case '30d':
        start.setDate(start.getDate() - 30);
        break;
      case '90d':
        start.setDate(start.getDate() - 90);
        break;
    }
    
    return `${formatters.date(start)} - ${formatters.date(now)}`;
  };

  return (
    <div className="dashboard-header">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-theme">Dashboard Overview</h1>
          <p className="text-neutral-500 mt-1">
            {formatDateRange(timeRange)}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="form-input w-auto"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          
          <button className="btn btn-primary">
            <DownloadIcon className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats Grid Component
interface StatsGridProps {
  stats?: DashboardStats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Messages',
      value: formatters.number(stats?.totalMessages || 0),
      change: stats?.messageChange || 0,
      icon: '📱',
      color: 'primary' as const,
      subtitle: 'Messages received',
    },
    {
      title: 'AI Responses',
      value: formatters.number(stats?.aiResponses || 0),
      change: stats?.aiResponseChange || 0,
      icon: '🤖',
      color: 'success' as const,
      subtitle: `${formatters.percentage(stats?.aiResponseRate || 0)} auto-response rate`,
    },
    {
      title: 'Active Clients',
      value: formatters.number(stats?.activeClients || 0),
      change: stats?.clientChange || 0,
      icon: '👥',
      color: 'warning' as const,
      subtitle: 'Unique conversations',
    },
    {
      title: 'Response Time',
      value: `${stats?.avgResponseTime || 0}s`,
      change: stats?.responseTimeChange || 0,
      icon: '⚡',
      color: 'accent' as const,
      subtitle: 'Average AI response',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

// Individual Stat Card
interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'accent';
  subtitle: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  subtitle 
}) => {
  const isPositive = (change || 0) >= 0;
  const changeIcon = isPositive ? '↗' : '↘';
  const changeColorClass = isPositive ? 'text-success' : 'text-error';

  const iconColorClasses = {
    primary: 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark',
    success: 'bg-success/10 text-success dark:bg-success/20',
    warning: 'bg-warning/10 text-warning dark:bg-warning/20',
    accent: 'bg-accent/10 text-accent dark:bg-accent-dark/20 dark:text-accent-dark',
  };

  return (
    <div className="stats-card group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${iconColorClasses[color]}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${changeColorClass}`}>
            <span>{changeIcon}</span>
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-theme">{value}</div>
        <div className="text-sm font-medium text-theme">{title}</div>
        <div className="text-xs text-neutral-500">{subtitle}</div>
      </div>
    </div>
  );
};

// Message Volume Chart
interface MessageVolumeChartProps {
  data?: {
    labels: string[];
    incoming: number[];
    aiResponses: number[];
  };
  timeRange: TimeRange;
}

const MessageVolumeChart: React.FC<MessageVolumeChartProps> = ({ data, timeRange }) => {
  const chartData = useMemo(() => ({
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Incoming Messages',
        data: data?.incoming || [],
        borderColor: 'rgb(11, 87, 117)', // Primary color
        backgroundColor: 'rgba(11, 87, 117, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'AI Responses',
        data: data?.aiResponses || [],
        borderColor: 'rgb(190, 92, 240)', // Secondary color
        backgroundColor: 'rgba(190, 92, 240, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }), [data]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Inter',
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: 'Inter',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter',
          },
        },
      },
    },
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-theme">Message Volume</h3>
        <p className="text-sm text-neutral-500">Incoming messages vs AI responses</p>
      </div>
      <div className="card-body">
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

// AI Performance Chart
interface AIPerformanceChartProps {
  data?: {
    labels: string[];
    responseRate: number[];
    accuracyScore: number[];
  };
  timeRange: TimeRange;
}

const AIPerformanceChart: React.FC<AIPerformanceChartProps> = ({ data, timeRange }) => {
  const chartData = useMemo(() => ({
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Response Rate (%)',
        data: data?.responseRate || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Accuracy Score (%)',
        data: data?.accuracyScore || [],
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
      },
    ],
  }), [data]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Inter',
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: 'Inter',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter',
          },
        },
      },
    },
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-theme">AI Performance</h3>
        <p className="text-sm text-neutral-500">Response rate and accuracy metrics</p>
      </div>
      <div className="card-body">
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

// Recent Activity Feed
interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: Activity['type']) => {
    const configs = {
      ai_response: { icon: '🤖', colorClass: 'text-success bg-success/10' },
      flagged_message: { icon: '🚨', colorClass: 'text-error bg-error/10' },
      new_client: { icon: '👤', colorClass: 'text-primary bg-primary/10 dark:text-primary-dark dark:bg-primary-dark/10' },
      profile_update: { icon: '⚙️', colorClass: 'text-warning bg-warning/10' },
    };
    return configs[type] || configs.new_client;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-theme">Recent Activity</h3>
        <p className="text-sm text-neutral-500">Latest platform events</p>
      </div>
      <div className="card-body">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-3xl mb-3">📋</div>
            <p className="text-neutral-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity) => {
              const { icon, colorClass } = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${colorClass}`}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-theme text-sm">
                      {activity.title}
                    </div>
                    <div className="text-sm text-neutral-500 mt-0.5">
                      {activity.description}
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      {formatters.relativeTime(activity.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Quick Insights Component
interface QuickInsightsProps {
  insights: Insight[];
}

const QuickInsights: React.FC<QuickInsightsProps> = ({ insights }) => {
  const insightIcons = {
    performance: '📈',
    optimization: '🎯',
    warning: '⚠️',
    success: '✅',
  };

  const insightColorClasses = {
    performance: 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark',
    optimization: 'bg-accent/10 text-accent dark:bg-accent-dark/20 dark:text-accent-dark',
    warning: 'bg-warning/10 text-warning',
    success: 'bg-success/10 text-success',
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-theme">AI Insights</h3>
        <p className="text-sm text-neutral-500">Automated recommendations</p>
      </div>
      <div className="card-body">
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-3xl mb-3">💡</div>
            <p className="text-neutral-500">No insights available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="insight-item p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${insightColorClasses[insight.type]}`}>
                    {insightIcons[insight.type] || '💡'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-theme text-sm mb-1">
                      {insight.title}
                    </div>
                    <div className="text-sm text-neutral-500 mb-3">
                      {insight.description}
                    </div>
                    {insight.action && (
                      <button className="btn btn-primary btn-sm">
                        {insight.action}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Client Analytics Component
interface ClientAnalyticsProps {
  clients: Client[];
  timeRange: TimeRange;
}

const ClientAnalytics: React.FC<ClientAnalyticsProps> = ({ clients, timeRange }) => {
  const [sortBy, setSortBy] = useState<'messageCount' | 'responseRate' | 'lastActivity'>('messageCount');

  const sortedClients = useMemo(() => {
    return [...clients].sort((a, b) => {
      switch (sortBy) {
        case 'messageCount':
          return b.messageCount - a.messageCount;
        case 'responseRate':
          return b.aiResponseRate - a.aiResponseRate;
        case 'lastActivity':
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        default:
          return 0;
      }
    });
  }, [clients, sortBy]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-theme">Top Clients</h3>
            <p className="text-sm text-neutral-500">Most active client interactions</p>
          </div>
          <select 
            className="form-input w-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="messageCount">Most Messages</option>
            <option value="responseRate">AI Response Rate</option>
            <option value="lastActivity">Recent Activity</option>
          </select>
        </div>
      </div>
      <div className="card-body p-0">
        {sortedClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-3xl mb-3">👥</div>
            <p className="text-neutral-500">No client data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-sm text-neutral-600 dark:text-neutral-400">Client</th>
                  <th className="text-left py-3 px-6 font-semibold text-sm text-neutral-600 dark:text-neutral-400">Messages</th>
                  <th className="text-left py-3 px-6 font-semibold text-sm text-neutral-600 dark:text-neutral-400">AI Rate</th>
                  <th className="text-left py-3 px-6 font-semibold text-sm text-neutral-600 dark:text-neutral-400">Last Active</th>
                  <th className="text-left py-3 px-6 font-semibold text-sm text-neutral-600 dark:text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {sortedClients.slice(0, 10).map((client, index) => (
                  <ClientRow key={client.id} client={client} rank={index + 1} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Individual Client Row
interface ClientRowProps {
  client: Client;
  rank: number;
}

const ClientRow: React.FC<ClientRowProps> = ({ client, rank }) => {
  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusBadge = (status: Client['status']) => {
    const statusConfigs = {
      active: { class: 'badge-success', text: 'Active' },
      inactive: { class: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400', text: 'Inactive' },
      blocked: { class: 'badge-error', text: 'Blocked' },
    };
    
    const config = statusConfigs[status];
    
    return (
      <span className={`badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  return (
    <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
      <td className="py-3 px-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
            #{rank}
          </div>
          <div className="profile-avatar w-10 h-10 text-xs">
            {getInitials(client.name || 'Unknown')}
          </div>
          <div>
            <div className="font-medium text-sm text-theme">{client.name || 'Unknown'}</div>
            <div className="text-xs text-neutral-500">{formatters.phone(client.phoneNumber)}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-6">
        <div className="font-semibold text-theme">{formatters.number(client.messageCount)}</div>
      </td>
      <td className="py-3 px-6">
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-success transition-all duration-300"
              style={{ width: `${client.aiResponseRate}%` }}
            />
          </div>
          <span className="text-sm font-medium text-theme">
            {formatters.percentage(client.aiResponseRate, 0)}
          </span>
        </div>
      </td>
      <td className="py-3 px-6 text-sm text-neutral-500">
        {formatters.relativeTime(client.lastActivity)}
      </td>
      <td className="py-3 px-6">
        {getStatusBadge(client.status)}
      </td>
    </tr>
  );
};

// Loading Skeleton
const DashboardSkeleton: React.FC = () => (
  <div className="dashboard space-y-8">
    <div className="space-y-4">
      <div className="skeleton h-8 w-64" />
      <div className="skeleton h-4 w-96" />
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card p-6">
          <div className="skeleton h-12 w-12 rounded-xl mb-4" />
          <div className="skeleton h-8 w-16 mb-2" />
          <div className="skeleton h-4 w-24 mb-2" />
          <div className="skeleton h-3 w-32" />
        </div>
      ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="card">
          <div className="card-header">
            <div className="skeleton h-6 w-32" />
          </div>
          <div className="card-body">
            <div className="skeleton h-80 w-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Icons
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default Dashboard;