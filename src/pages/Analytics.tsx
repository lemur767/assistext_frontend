// src/pages/Analytics.tsx - Complete implementation
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AnalyticService } from '../services/analyticService'
import { BarChart3, TrendingUp, Users, Zap, MessageSquare, Clock } from 'lucide-react';
import type { DashboardData } from '../types';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<DashboardData | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [selectedProfile, timeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await AnalyticService.getDashboardData(selectedProfile || undefined, timeRange);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {Math.abs(change)}% from last period
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = analyticsData?.stats;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500">Detailed insights into your SMS performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Messages"
            value={stats?.totalMessages?.toLocaleString() || '0'}
            change={stats?.messageChange}
            icon={<MessageSquare className="w-6 h-6 text-blue-600" />}
            color="bg-blue-100"
          />
          <MetricCard
            title="AI Responses"
            value={stats?.aiResponses?.toLocaleString() || '0'}
            change={stats?.aiResponseChange}
            icon={<Zap className="w-6 h-6 text-purple-600" />}
            color="bg-purple-100"
          />
          <MetricCard
            title="Active Clients"
            value={stats?.activeClients?.toLocaleString() || '0'}
            change={stats?.clientChange}
            icon={<Users className="w-6 h-6 text-green-600" />}
            color="bg-green-100"
          />
          <MetricCard
            title="Avg Response Time"
            value={`${stats?.avgResponseTime || 0}s`}
            change={stats?.responseTimeChange}
            icon={<Clock className="w-6 h-6 text-orange-600" />}
            color="bg-orange-100"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Volume</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <BarChart3 className="w-16 h-16 text-gray-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Performance</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <TrendingUp className="w-16 h-16 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;