import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Message, UseWebSocketReturn } from '../types';

export const useWebSocket = (profileId: string): UseWebSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (!profileId) return;

    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
    const newSocket = io(wsUrl, {
      query: { profileId },
      transports: ['websocket'],
      timeout: 10000,
      forceNew: true,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
      
      // Handle reconnection for certain disconnect reasons
      if (reason === 'io server disconnect') {
        // Server disconnected, need to reconnect manually
        setTimeout(() => {
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            newSocket.connect();
          }
        }, 1000 * reconnectAttempts.current);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('new_message', (message: Message) => {
      console.log('New message received:', message);
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('message_status_update', (update: { messageId: string; status: string }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === update.messageId 
          ? { ...msg, status: update.status as Message['status'] }
          : msg
      ));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [profileId]);

  const sendMessage = useCallback((message: any) => {
    if (socket && isConnected) {
      socket.emit('send_message', message);
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    messages,
    sendMessage,
  };
};