// src/api/client.ts - Building on our existing auth
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend.assitext.ca';
import dotenv from 'dotenv';

export const apiClients = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get tokens from our existing auth context
  const tokens = localStorage.getItem('auth_tokens');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  
  if (tokens) {
    const { access_token } = JSON.parse(tokens);
    headers.Authorization = `Bearer ${access_token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    if (response.status === 401) {
      // Use existing auth refresh logic
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
};