/**
 * WebSocket Notification Bell Component
 * 
 * Real-time notification bell with WebSocket integration
 */

import React, { useState, useEffect, useCallback } from 'react';
import { trpc } from '../lib/trpc';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';

interface WebSocketNotification {
  id?: string;
  type: 'tier_upgrade' | 'milestone' | 'compliance_alert' | 'recommendation' | 'intervention_update';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp?: Date;
  read?: boolean;
}

export const WebSocketNotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<WebSocketNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastNotification, setLastNotification] = useState<WebSocketNotification | null>(null);

  // Fetch unread count
  const { data: unreadData } = (trpc as any).websocket.getUnreadCount.useQuery();

  // Mark as read mutation
  const markAsReadMutation = (trpc as any).websocket.markAsRead.useMutation();

  // WebSocket connection setup
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const notification: WebSocketNotification = JSON.parse(event.data);

        // Skip heartbeat messages
        if ((notification as any).type === 'heartbeat') {
          return;
        }

        // Add notification to list
        setNotifications((prev) => [notification, ...prev].slice(0, 50));
        setLastNotification(notification);

        // Show toast
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);

        // Increment unread count
        setUnreadCount((prev) => prev + 1);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);

      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Update unread count from query
  useEffect(() => {
    if (unreadData?.unreadCount !== undefined) {
      setUnreadCount(unreadData.unreadCount);
    }
  }, [unreadData]);

  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    await markAsReadMutation.mutateAsync({ notificationId: parseInt(notificationId) });
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, [markAsReadMutation]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tier_upgrade':
        return '🎉';
      case 'milestone':
        return '🏆';
      case 'compliance_alert':
        return '⚠️';
      case 'recommendation':
        return '💡';
      case 'intervention_update':
        return '📝';
      default:
        return '📢';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 rounded-full"
        title={isConnected ? 'Connected' : 'Disconnected'}
      >
        <Bell className={`h-5 w-5 ${isConnected ? 'text-gray-600' : 'text-gray-400'}`} />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Connection Indicator */}
        <span
          className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </Button>

      {/* Toast Notification */}
      {showToast && lastNotification && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{getNotificationIcon(lastNotification.type)}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{lastNotification.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{lastNotification.message}</p>
              {lastNotification.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-6 text-xs"
                  onClick={() => handleMarkAsRead(lastNotification.id!)}
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Connection Status Indicator */}
      {!isConnected && (
        <div className="absolute top-full right-0 mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
          Reconnecting...
        </div>
      )}
    </div>
  );
};
