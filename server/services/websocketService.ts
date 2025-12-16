/**
 * WebSocket Service
 * 
 * Manages real-time WebSocket connections and broadcasts notifications
 * to connected clients based on events (tier upgrades, milestones, compliance alerts)
 */

// WebSocket type - using any to avoid ws dependency
type WebSocket = any;
import { getDb } from '../db';

export interface WebSocketNotification {
  id?: string;
  type: 'tier_upgrade' | 'milestone' | 'compliance_alert' | 'recommendation' | 'intervention_update';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp?: Date;
  read?: boolean;
}

interface ActiveConnection {
  userId: number;
  connectionId: string;
  ws: WebSocket;
  connectedAt: Date;
}

class WebSocketManager {
  private connections: Map<string, ActiveConnection> = new Map();
  private userConnections: Map<number, Set<string>> = new Map();
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startHeartbeat();
  }

  /**
   * Register a new WebSocket connection
   */
  registerConnection(userId: number, connectionId: string, ws: WebSocket): void {
    const connection: ActiveConnection = {
      userId,
      connectionId,
      ws,
      connectedAt: new Date(),
    };

    this.connections.set(connectionId, connection);

    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId)!.add(connectionId);

    // Log connection
    this.logConnection(userId, connectionId, 'connected');
  }

  /**
   * Unregister a WebSocket connection
   */
  unregisterConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      this.connections.delete(connectionId);
      this.userConnections.get(connection.userId)?.delete(connectionId);
      this.logConnection(connection.userId, connectionId, 'disconnected');
    }
  }

  /**
   * Send notification to a specific user
   */
  async notifyUser(userId: number, notification: WebSocketNotification): Promise<void> {
    const connectionIds = this.userConnections.get(userId);
    if (!connectionIds) return;

    const payload = JSON.stringify({
      ...notification,
      timestamp: notification.timestamp || new Date(),
    });

    connectionIds.forEach((connectionId) => {
      const connection = this.connections.get(connectionId);
      if (connection && connection.ws.readyState === 1) {
        // 1 = OPEN
        connection.ws.send(payload);
      }
    });

    // Queue notification in database
    await this.queueNotification(userId, notification);
  }

  /**
   * Broadcast notification to multiple users
   */
  async broadcastToUsers(userIds: number[], notification: WebSocketNotification): Promise<void> {
    for (const userId of userIds) {
      await this.notifyUser(userId, notification);
    }
  }

  /**
   * Broadcast notification to all connected users
   */
  async broadcastToAll(notification: WebSocketNotification): Promise<void> {
    const payload = JSON.stringify({
      ...notification,
      timestamp: notification.timestamp || new Date(),
    });

    this.connections.forEach((connection) => {
      if (connection.ws.readyState === 1) {
        connection.ws.send(payload);
      }
    });
  }

  /**
   * Send heartbeat to keep connections alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const heartbeat = JSON.stringify({ type: 'heartbeat', timestamp: new Date() });

      this.connections.forEach((connection) => {
        if (connection.ws.readyState === 1) {
          connection.ws.ping();
        }
      });
    }, 30000); // Every 30 seconds
  }

  /**
   * Queue notification in database for persistence
   */
  private async queueNotification(userId: number, notification: WebSocketNotification): Promise<void> {
    try {
      const dbPromise = getDb();
      const db = await dbPromise;
      if (!db) return;
      
      // Using raw SQL query through the pool
      const pool = (db as any).$client;
      await pool.execute(
        `INSERT INTO notification_queue (userId, type, title, message, data, status) 
         VALUES (?, ?, ?, ?, ?, 'sent')`,
        [
          userId,
          notification.type,
          notification.title,
          notification.message,
          notification.data ? JSON.stringify(notification.data) : null,
        ]
      );
    } catch (error) {
      console.error('Error queueing notification:', error);
    }
  }

  /**
   * Log connection event
   */
  private async logConnection(userId: number, connectionId: string, event: 'connected' | 'disconnected'): Promise<void> {
    try {
      const dbPromise = getDb();
      const db = await dbPromise;
      if (!db) return;
      
      const pool = (db as any).$client;
      if (event === 'connected') {
        await pool.execute(
          `INSERT INTO websocket_connections (userId, connectionId, isActive) VALUES (?, ?, TRUE)`,
          [userId, connectionId]
        );
      } else {
        await pool.execute(`UPDATE websocket_connections SET isActive = FALSE WHERE connectionId = ?`, [
          connectionId,
        ]);
      }
    } catch (error) {
      console.error('Error logging connection:', error);
    }
  }

  /**
   * Get active connection count
   */
  getActiveConnectionCount(): number {
    return this.connections.size;
  }

  /**
   * Get user connection count
   */
  getUserConnectionCount(userId: number): number {
    return this.userConnections.get(userId)?.size || 0;
  }

  /**
   * Cleanup on shutdown
   */
  shutdown(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.connections.forEach((connection) => {
      connection.ws.close();
    });
    this.connections.clear();
    this.userConnections.clear();
  }
}

// Singleton instance
export const wsManager = new WebSocketManager();

/**
 * Notification helper functions
 */

export async function notifyTierUpgrade(userId: number, tierName: string, benefits: string[]): Promise<void> {
  await wsManager.notifyUser(userId, {
    type: 'tier_upgrade',
    title: `Congratulations! You reached ${tierName} Tier`,
    message: `You've earned new benefits: ${benefits.join(', ')}`,
    data: { tierName, benefits },
  });
}

export async function notifyMilestoneCompleted(
  userId: number,
  interventionTitle: string,
  milestoneTitle: string
): Promise<void> {
  await wsManager.notifyUser(userId, {
    type: 'milestone',
    title: `Milestone Completed: ${milestoneTitle}`,
    message: `Great progress on "${interventionTitle}"!`,
    data: { interventionTitle, milestoneTitle },
  });
}

export async function notifyComplianceAlert(userId: number, alertType: string, details: string): Promise<void> {
  await wsManager.notifyUser(userId, {
    type: 'compliance_alert',
    title: `Compliance Alert: ${alertType}`,
    message: details,
    data: { alertType, details },
  });
}

export async function notifyNewRecommendation(
  userId: number,
  recommendationTitle: string,
  savings: number
): Promise<void> {
  await wsManager.notifyUser(userId, {
    type: 'recommendation',
    title: `New Recommendation: ${recommendationTitle}`,
    message: `Potential savings: $${savings.toLocaleString()}`,
    data: { recommendationTitle, savings },
  });
}

export async function notifyInterventionUpdate(
  userId: number,
  interventionTitle: string,
  status: string
): Promise<void> {
  await wsManager.notifyUser(userId, {
    type: 'intervention_update',
    title: `Intervention Update: ${interventionTitle}`,
    message: `Status: ${status}`,
    data: { interventionTitle, status },
  });
}

/**
 * Get notification history for user
 */
export async function getNotificationHistory(userId: number, limit: number = 50): Promise<WebSocketNotification[]> {
  try {
    const dbPromise = getDb();
    const db = await dbPromise;
    if (!db) return [];
    
    const pool = (db as any).$client;
    const [result] = await pool.execute(
      `SELECT id, type, title, message, data, createdAt as timestamp, readAt as read 
       FROM notification_queue 
       WHERE userId = ? 
       ORDER BY createdAt DESC 
       LIMIT ?`,
      [userId, limit]
    );

    return (result as any[]).map((row) => ({
      id: row.id.toString(),
      type: row.type,
      title: row.title,
      message: row.message,
      data: row.data ? JSON.parse(row.data) : undefined,
      timestamp: row.timestamp,
      read: !!row.read,
    }));
  } catch (error) {
    console.error('Error fetching notification history:', error);
    return [];
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: number): Promise<void> {
  try {
    const dbPromise = getDb();
    const db = await dbPromise;
    if (!db) return;
    
    const pool = (db as any).$client;
    await pool.execute(`UPDATE notification_queue SET readAt = NOW() WHERE id = ?`, [notificationId]);
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}

/**
 * Get unread notification count for user
 */
export async function getUnreadNotificationCount(userId: number): Promise<number> {
  try {
    const dbPromise = getDb();
    const db = await dbPromise;
    if (!db) return 0;
    
    const pool = (db as any).$client;
    const [result] = await pool.execute(
      `SELECT COUNT(*) as count FROM notification_queue WHERE userId = ? AND readAt IS NULL`,
      [userId]
    );
    return (result as any[])[0]?.count || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
}
