import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  analyticsService, 
  type AnalyticsPeriod, 
  type ExportOptions,
  type DashboardAnalytics,
  type MessageAnalytics,
  type ClientAnalytics,
  type PerformanceAnalytics,
  type RealtimeAnalytics
} from '../services/analyticsService';

// Query keys for React Query
export const ANALYTICS_QUERY_KEYS = {
  all: ['analytics'] as const,
  dashboard: (period: string, includeSignalwire: boolean) => 
    ['analytics', 'dashboard', period, includeSignalwire] as const,
  messages: (period: string, breakdown: string) => 
    ['analytics', 'messages', period, breakdown] as const,
  clients: (period: string, includeSegments: boolean) => 
    ['analytics', 'clients', period, includeSegments] as const,
  performance: (period: string) => 
    ['analytics', 'performance', period] as const,
  realtime: () => ['analytics', 'realtime'] as const,
  health: () => ['analytics', 'health'] as const,
  messageStats: () => ['analytics', 'message-stats'] as const,
  clientStats: () => ['analytics', 'client-stats'] as const,
};

export const useAnalytics = () => {
  const queryClient = useQueryClient();

  // Dashboard analytics hook - NO MORE PROFILE ID!
  const useDashboardAnalytics = (
    period: AnalyticsPeriod['period'] = '7d',
    includeSignalwire = false,
    options?: {
      enabled?: boolean;
      refetchInterval?: number;
      staleTime?: number;
    }
  ) => {
    return useQuery({
      queryKey: ANALYTICS_QUERY_KEYS.dashboard(period, includeSignalwire),
      queryFn: () => analyticsService.getDashboardAnalytics(period, includeSignalwire),
      staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
      refetchInterval: options?.refetchInterval ?? 10 * 60 * 1000, // 10 minutes
      enabled: options?.enabled ?? true,
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
  };

  // Message analytics hook
  const useMessageAnalytics = (
    period: AnalyticsPeriod['period'] = '30d',
    breakdown: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily',
    options?: {
      enabled?: boolean;
      staleTime?: number;
    }
  ) => {
    return useQuery({
      queryKey: ANALYTICS_QUERY_KEYS.messages(period, breakdown),
      queryFn: () => analyticsService.getMessageAnalytics(period, breakdown),
      staleTime: options?.staleTime ?? 5 * 60 * 1000,
      enabled: options?.enabled ?? true,
      retry: 2,
    });
  };

  // Client analytics hook
  const useClientAnalytics = (
    period: AnalyticsPeriod['period'] = '30d',
    includeSegments = false,
    options?: {
      enabled?: boolean;
      staleTime?: number;
    }
  ) => {
    return useQuery({
      queryKey: ANALYTICS_QUERY_KEYS.clients(period, includeSegments),
      queryFn: () => analyticsService.getClientAnalytics(period, includeSegments),
      staleTime: options?.staleTime ?? 5 * 60 * 1000,
      enabled: options?.enabled ?? true,
      retry: 2,
    });
  };

  // Performance analytics hook
  const usePerformanceAnalytics = (
    period: AnalyticsPeriod['period'] = '30d',
    options?: {
      enabled?: boolean;
      staleTime?: number;
    }
  ) => {
    return useQuery({
      queryKey: ANALYTICS_QUERY_KEYS.performance(period),
      queryFn: () => analyticsService.getPerformanceAnalytics(period),
      staleTime: options?.staleTime ?? 5 * 60 * 1000,
      enabled: options?.enabled ?? true,
      retry: 2,
    });
  };

  // Real-time analytics hook - NEW!
  const useRealtimeAnalytics = (
    options?: {
      enabled?: boolean;
      refetchInterval?: number;
    }
  ) => {
    return useQuery({
      queryKey: ANALYTICS_QUERY_KEYS.realtime(),
      queryFn: () => analyticsService.getRealtimeAnalytics(),
      staleTime: 30 * 1000, // 30 seconds
      refetchInterval: options?.refetchInterval ?? 60 * 1000, // 1 minute
      enabled: options?.enabled ?? true,
      retry: 1,
    });
  };

  // System health hook
  const useSystemHealth = (
    options?: {
      enabled?: boolean;
      refetchInterval?: number;
    }
  ) => {
    return useQuery({
      queryKey: ANALYTICS_QUERY_KEYS.health(),
      queryFn: () => analyticsService.getSystemHealth(),
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: options?.refetchInterval ?? 5 * 60 * 1000, // 5 minutes
      enabled: options?.enabled ?? true,
      retry: 1,
    });
  };

  // Message stats hook (integrates with existing endpoint)
  const useMessageStats = (
    options?: {
      enabled?: boolean;
      staleTime?: number;
    }
  ) => {
    return useQuery({
      queryKey: ANALYTICS_QUERY_KEYS.messageStats(),
      queryFn: () => analyticsService.getMessageStats(),
      staleTime: options?.staleTime ?? 5 * 60 * 1000,
      enabled: options?.enabled ?? true,
      retry: 2,
    });
  };

  // Client stats hook (integrates with existing endpoint)
  const useClientStats = (
    options?: {
      enabled?: boolean;
      staleTime?: number;
    }
  ) => {
    return useQuery({
      queryKey: ANALYTICS_QUERY_KEYS.clientStats(),
      queryFn: () => analyticsService.getClientStats(),
      staleTime: options?.staleTime ?? 5 * 60 * 1000,
      enabled: options?.enabled ?? true,
      retry: 2,
    });
  };

  // Export analytics mutation
  const useExportAnalytics = () => {
    return useMutation({
      mutationFn: (options: ExportOptions) => analyticsService.exportAnalytics(options),
      onSuccess: (data, variables) => {
        if (variables.type === 'csv') {
          // Handle CSV blob download
          const blob = data as Blob;
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `analytics-${variables.period}-${Date.now()}.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          toast.success('Analytics exported successfully!');
        } else {
          toast.success('Analytics data exported!');
        }
      },
      onError: (error) => {
        console.error('Export failed:', error);
        toast.error('Failed to export analytics. Please try again.');
      },
    });
  };

  // Download report mutation
  const useDownloadReport = () => {
    return useMutation({
      mutationFn: ({ period, format }: { 
        period: AnalyticsPeriod['period']; 
        format: 'pdf' | 'excel' 
      }) => analyticsService.downloadReport(period, format),
      onSuccess: (blob, variables) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const extension = variables.format === 'pdf' ? 'pdf' : 'xlsx';
        link.download = `analytics-report-${variables.period}-${Date.now()}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('Report downloaded successfully!');
      },
      onError: (error) => {
        console.error('Download failed:', error);
        toast.error('Failed to download report. Please try again.');
      },
    });
  };

  // Search analytics mutation
  const useSearchAnalytics = () => {
    return useMutation({
      mutationFn: ({ query, period }: { 
        query: string; 
        period: AnalyticsPeriod['period'] 
      }) => analyticsService.searchAnalytics(query, period),
      onError: (error) => {
        console.error('Search failed:', error);
        toast.error('Failed to search analytics. Please try again.');
      },
    });
  };

  // Custom query mutation
  const useCustomAnalyticsQuery = () => {
    return useMutation({
      mutationFn: (queryParams: Record<string, any>) => 
        analyticsService.customQuery(queryParams),
      onError: (error) => {
        console.error('Custom query failed:', error);
        toast.error('Failed to execute custom query. Please try again.');
      },
    });
  };

  // Refresh all analytics data
  const refreshAnalytics = () => {
    queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.all });
    toast.success('Analytics data refreshed!');
  };

  // Refresh specific analytics section
  const refreshSection = (section: 'dashboard' | 'messages' | 'clients' | 'performance' | 'realtime') => {
    switch (section) {
      case 'dashboard':
        queryClient.invalidateQueries({ queryKey: ['analytics', 'dashboard'] });
        break;
      case 'messages':
        queryClient.invalidateQueries({ queryKey: ['analytics', 'messages'] });
        break;
      case 'clients':
        queryClient.invalidateQueries({ queryKey: ['analytics', 'clients'] });
        break;
      case 'performance':
        queryClient.invalidateQueries({ queryKey: ['analytics', 'performance'] });
        break;
      case 'realtime':
        queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.realtime() });
        break;
    }
    
    toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} analytics refreshed!`);
  };

  // Prefetch analytics data
  const prefetchDashboard = (period: AnalyticsPeriod['period'] = '7d') => {
    queryClient.prefetchQuery({
      queryKey: ANALYTICS_QUERY_KEYS.dashboard(period, false),
      queryFn: () => analyticsService.getDashboardAnalytics(period, false),
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    // Query hooks
    useDashboardAnalytics,
    useMessageAnalytics,
    useClientAnalytics,
    usePerformanceAnalytics,
    useRealtimeAnalytics,
    useSystemHealth,
    useMessageStats,
    useClientStats,
    
    // Mutation hooks
    useExportAnalytics,
    useDownloadReport,
    useSearchAnalytics,
    useCustomAnalyticsQuery,
    
    // Utility functions
    refreshAnalytics,
    refreshSection,
    prefetchDashboard,
  };
};

// Specialized hooks for common analytics patterns

// Combined dashboard hook with all essential data
export const useDashboardSummary = (period: AnalyticsPeriod['period'] = '7d') => {
  const { useDashboardAnalytics, useRealtimeAnalytics, useSystemHealth } = useAnalytics();
  
  const dashboardQuery = useDashboardAnalytics(period, true);
  const realtimeQuery = useRealtimeAnalytics();
  const healthQuery = useSystemHealth();
  
  return {
    dashboard: dashboardQuery,
    realtime: realtimeQuery,
    health: healthQuery,
    isLoading: dashboardQuery.isLoading || realtimeQuery.isLoading,
    isError: dashboardQuery.isError || realtimeQuery.isError,
    error: dashboardQuery.error || realtimeQuery.error,
  };
};

// Analytics overview hook for navigation/sidebar
export const useAnalyticsOverview = () => {
  const { useMessageStats, useClientStats, useRealtimeAnalytics } = useAnalytics();
  
  const messageStats = useMessageStats();
  const clientStats = useClientStats();
  const realtime = useRealtimeAnalytics({ refetchInterval: 2 * 60 * 1000 }); // 2 minutes
  
  const unreadMessages = messageStats.data?.unread_messages || 0;
  const todayMessages = realtime.data?.today_summary.total_messages || 0;
  const activeClients = clientStats.data?.stats?.active_clients || 0;
  const aiAdoptionRate = realtime.data?.today_summary.ai_adoption_rate || 0;
  
  return {
    unreadMessages,
    todayMessages,
    activeClients,
    aiAdoptionRate,
    isLoading: messageStats.isLoading || clientStats.isLoading || realtime.isLoading,
    lastUpdated: realtime.data?.last_updated,
  };
};

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  const { useSystemHealth, usePerformanceAnalytics } = useAnalytics();
  
  const health = useSystemHealth({ refetchInterval: 60 * 1000 }); // 1 minute
  const performance = usePerformanceAnalytics('7d');
  
  const isHealthy = health.data?.status === 'healthy';
  const hasWarnings = health.data?.status === 'warning';
  const hasCriticalIssues = health.data?.status === 'critical';
  
  const alerts = health.data?.checks ? 
    Object.entries(health.data.checks)
      .filter(([_, check]: [string, any]) => check.status !== 'healthy')
      .map(([name, check]: [string, any]) => ({
        name,
        status: check.status,
        message: check.error || `${name} is ${check.status}`
      })) : [];
  
  return {
    isHealthy,
    hasWarnings,
    hasCriticalIssues,
    alerts,
    systemStatus: health.data?.status || 'unknown',
    performanceData: performance.data,
    isLoading: health.isLoading || performance.isLoading,
    lastChecked: health.dataUpdatedAt,
  };
};

export default useAnalytics;