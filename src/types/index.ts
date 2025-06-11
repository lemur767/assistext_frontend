// Export all types
export * from '../types/auth';
export * from '../types/profile';
export * from '../types/message';
export * from '../types/client';
export * from '../types/billing';

// src/types/index.ts
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive: boolean;
  isAdmin: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  phoneNumber: string;
  description?: string;
  timezone: string;
  isActive: boolean;
  aiEnabled: boolean;
  businessHours?: BusinessHours;
  dailyAutoResponseLimit: number;
  twilioSid?: string;
  createdAt: string;
  updatedAt: string;
  // Computed fields
  messageCount?: number;
  clientCount?: number;
  aiResponseRate?: number;
}

export interface BusinessHours {
  [key: string]: {
    start: string;
    end: string;
    enabled?: boolean;
  };
}

export interface Message {
  id: string;
  content: string;
  isIncoming: boolean;
  senderNumber: string;
  profileId: string;
  aiGenerated: boolean;
  timestamp: string;
  isRead: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
  twilioSid?: string;
  sendError?: string;
}

export interface Client {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  notes?: string;
  isRegular: boolean;
  isBlocked: boolean;
  lastActivity: string;
  messageCount: number;
  aiResponseRate: number;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  clientName: string;
  clientPhone: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface AISettings {
  id: string;
  profileId: string;
  aiEnabled: boolean;
  responseDelay: number;
  maxResponseLength: number;
  temperature: number;
  model: string;
  personality: string;
  tone: string;
  customInstructions?: string;
  styleNotes?: string;
  useEmojis: boolean;
  casualLanguage: boolean;
}

export interface TextExample {
  id: string;
  profileId: string;
  incoming: string;
  outgoing: string;
  timestamp: string;
}

export interface DashboardStats {
  totalMessages: number;
  messageChange: number;
  aiResponses: number;
  aiResponseChange: number;
  aiResponseRate: number;
  activeClients: number;
  clientChange: number;
  avgResponseTime: number;
  responseTimeChange: number;
}

export interface DashboardData {
  stats: DashboardStats;
  messageVolume: {
    labels: string[];
    incoming: number[];
    aiResponses: number[];
  };
  aiPerformance: {
    labels: string[];
    responseRate: number[];
    accuracyScore: number[];
  };
  recentActivity: Activity[];
  insights: Insight[];
  topClients: Client[];
}

export interface Activity {
  id: string;
  type: 'ai_response' | 'flagged_message' | 'new_client' | 'profile_update';
  title: string;
  description: string;
  timestamp: string;
  profileId?: string;
  clientId?: string;
}

export interface Insight {
  id: string;
  type: 'performance' | 'optimization' | 'warning' | 'success';
  title: string;
  description: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form types
export interface CreateProfileForm {
  name: string;
  phoneNumber: string;
  description?: string;
  timezone: string;
  aiEnabled: boolean;
}

export interface UpdateProfileForm extends Partial<CreateProfileForm> {
  id: string;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export interface ErrorProps extends BaseComponentProps {
  message: string;
  retry?: () => void;
}

// Hook types
export interface UseWebSocketReturn {
  socket: any;
  isConnected: boolean;
  messages: Message[];
  sendMessage: (message: any) => void;
}

export interface UseQueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
}