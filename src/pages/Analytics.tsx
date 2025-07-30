// src/pages/Analytics.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/UI/Select';
import { Badge } from '../components/UI/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/UI/Tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Bot,
  Clock,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { useAnalytics, useDashboardSummary, usePerformanceMonitoring } from '../hooks/useAnalytics';
import {  } from '../services/analyticsService';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { toast } from 'sonner';

// Remove any profile-related props - now works with user context automatically
export const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1d' | '7d' | '30d' | '90d' | '1y'>('7d');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use the new user-based hooks - NO MORE PROFILE ID!
  const { 
    useDashboardAnalytics, 
    useMessageAnalytics, 
    useClientAnalytics,
    useExportAnalytics,
    refreshAnalytics 
  } = useAnalytics();
  
  // Get dashboard summary with real-time data
  const dashboardSummary = useDashboardSummary(selectedPeriod);
  
  // Get detailed analytics
  const messageAnalytics = useMessageAnalytics(selectedPeriod, 'daily');
  const clientAnalytics = useClientAnalytics(selectedPeriod, true);
  
  // Performance monitoring
  const performanceMonitoring = usePerformanceMonitoring();
  
  // Export functionality
  const exportMutation = useExportAnalytics();

  // Handle period change
  const handlePeriodChange = (period: '1d' | '7d' | '30d' | '90d' | '1y') => {
    setSelectedPeriod(period);
  };

  // Handle export
  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    exportMutation.mutate({
      type: format,
      sections: ['dashboard', 'messages', 'clients'],
      period: selectedPeriod
    });
  };

  // Get main dashboard data
  const dashboardData = dashboardSummary.dashboard.data;
  const realtimeData = dashboardSummary.realtime.data;
  const isLoading = dashboardSummary.isLoading;
  const error = dashboardSummary.error;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 space-x-2">
        <LoadingSpinner size="lg" />
        <span className="text-lg">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">Error Loading Analytics</h3>
          <p className="text-gray-600 mt-1">
            {error instanceof Error ? error.message : 'Failed to load analytics data'}
          </p>
          <Button 
            onClick={() => refreshAnalytics()} 
            className="mt-4"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const coreMetrics = dashboardData?.core_metrics;
  const timeSeriesData = dashboardData?.time_series;
  const growthMetrics = dashboardData?.growth;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your performance and AI automation insights
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* System Health Indicator */}
          <div className="flex items-center space-x-2">
            {performanceMonitoring.isHealthy ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm text-gray-600">
              System {performanceMonitoring.systemStatus}
            </span>
          </div>
          
          {/* Export Dropdown */}
          <Select onValueChange={handleExport}>
            <SelectTrigger className="w-32">
              <Download className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">Export CSV</SelectItem>
              <SelectItem value="json">Export JSON</SelectItem>
              <SelectItem value="pdf">Export PDF</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Period Selector */}
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Refresh Button */}
          <Button 
            onClick={() => refreshAnalytics()} 
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Real-time Activity Bar */}
      {realtimeData && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Live Activity</span>
                </div>
                <div className="text-sm text-gray-600">
                  {realtimeData.current_activity.messages_today} messages today
                </div>
                <div className="text-sm text-gray-600">
                  {realtimeData.current_activity.active_conversations} active conversations
                </div>
                <div className="text-sm text-gray-600">
                  {realtimeData.today_summary.ai_adoption_rate}% AI adoption today
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {realtimeData.last_updated ? 
                  new Date(realtimeData.last_updated).toLocaleTimeString() : 'Just now'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Core Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Messages"
              value={coreMetrics?.total_messages || 0}
              change={growthMetrics?.message_growth || 0}
              icon={MessageSquare}
              subtitle={`${coreMetrics?.sent_messages || 0} sent, ${coreMetrics?.received_messages || 0} received`}
            />
            
            <MetricCard
              title="AI Adoption Rate"
              value={`${coreMetrics?.ai_adoption_rate || 0}%`}
              change={growthMetrics?.ai_usage_growth || 0}
              icon={Bot}
              subtitle={`${coreMetrics?.ai_messages || 0} AI responses`}
            />
            
            <MetricCard
              title="Active Clients"
              value={coreMetrics?.active_clients || 0}
              change={growthMetrics?.client_growth || 0}
              icon={Users}
              subtitle={`${coreMetrics?.new_clients || 0} new this period`}
            />
            
            <MetricCard
              title="Avg Response Time"
              value={`${coreMetrics?.avg_response_time_minutes || 0}m`}
              change={0} // Could calculate from previous period
              icon={Clock}
              subtitle={`${coreMetrics?.response_rate || 0}% response rate`}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Message Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Message Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sent" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name="Sent" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="received" 
                      stackId="1"
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      name="Received" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ai_generated" 
                      stackId="2"
                      stroke="#ffc658" 
                      fill="#ffc658" 
                      name="AI Generated" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* AI Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span>AI Adoption Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData?.ai_performance?.usage_trend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: any) => [`${value}%`, 'AI Rate']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ai_rate" 
                      stroke="#ff7300" 
                      strokeWidth={2}
                      name="AI Adoption Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Business Intelligence Summary */}
          {dashboardData?.business_intelligence && (
            <Card>
              <CardHeader>
                <CardTitle>Business Impact Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {dashboardData.business_intelligence.estimated_time_saved_hours}h
                    </div>
                    <div className="text-sm text-gray-600">Time Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {dashboardData.business_intelligence.automation_rate}%
                    </div>
                    <div className="text-sm text-gray-600">Automation Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {dashboardData.business_intelligence.avg_sentiment_score}
                    </div>
                    <div className="text-sm text-gray-600">Avg Sentiment</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <MessageAnalyticsSection 
            data={messageAnalytics.data} 
            isLoading={messageAnalytics.isLoading}
          />
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <ClientAnalyticsSection 
            data={clientAnalytics.data} 
            isLoading={clientAnalytics.isLoading}
          />
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <PerformanceAnalyticsSection 
            monitoring={performanceMonitoring}
            dashboardData={dashboardData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, subtitle }) => {
  const isPositive = change > 0;
  const isNegative = change < 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <Icon className="h-4 w-4 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {analyticsHelpers.formatNumber(Number(value))}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
        )}
        {change !== 0 && (
          <div className="flex items-center mt-2">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : isNegative ? (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            ) : null}
            <span className={`text-xs ${
              isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
            }`}>
              {isPositive ? '+' : ''}{change}% vs last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Message Analytics Section Component
const MessageAnalyticsSection: React.FC<{ data: any; isLoading: boolean }> = ({ data, isLoading }) => {
  if (isLoading) return <LoadingSpinner />;
  if (!data) return <div>No message analytics available</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Message Volume Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.volume?.data || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sent" fill="#8884d8" name="Sent" />
              <Bar dataKey="received" fill="#82ca9d" name="Received" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// Client Analytics Section Component
const ClientAnalyticsSection: React.FC<{ data: any; isLoading: boolean }> = ({ data, isLoading }) => {
  if (isLoading) return <LoadingSpinner />;
  if (!data) return <div>No client analytics available</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.growth?.new_clients_trend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Engagement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>High Engagement</span>
                <Badge variant="secondary">
                  {data.engagement?.high_engagement?.count || 0} clients
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Medium Engagement</span>
                <Badge variant="secondary">
                  {data.engagement?.medium_engagement?.count || 0} clients
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Low Engagement</span>
                <Badge variant="secondary">
                  {data.engagement?.low_engagement?.count || 0} clients
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Performance Analytics Section Component
const PerformanceAnalyticsSection: React.FC<{ 
  monitoring: any; 
  dashboardData: any;
}> = ({ monitoring, dashboardData }) => {
  return (
    <div className="space-y-6">
      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>System Health</span>
            <Badge 
              variant={monitoring.isHealthy ? "secondary" : "destructive"}
              className="ml-2"
            >
              {monitoring.systemStatus}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {monitoring.alerts.length > 0 ? (
            <div className="space-y-2">
              {monitoring.alerts.map((alert: any, index: number) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">{alert.message}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>All systems operational</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Performance Metrics */}
      {dashboardData?.ai_performance && (
        <Card>
          <CardHeader>
            <CardTitle>AI Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {dashboardData.ai_performance.confidence_stats.avg_confidence}
                </div>
                <div className="text-sm text-gray-600">Avg Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {dashboardData.ai_performance.avg_processing_time_ms}ms
                </div>
                <div className="text-sm text-gray-600">Avg Processing Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {dashboardData.business_intelligence?.automation_rate || 0}%
                </div>
                <div className="text-sm text-gray-600">Automation Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;