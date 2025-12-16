/**
 * Firebase Cloud Messaging Service
 * 
 * Handles push notifications for mobile devices via FCM
 */

import { getDb } from '../db';

export interface PushNotificationToken {
  userId: number;
  token: string;
  deviceType: 'ios' | 'android' | 'web';
  deviceName?: string;
}

export interface PushNotification {
  title: string;
  body: string;
  data?: Record<string, string>;
  badge?: number;
  sound?: string;
  priority?: 'high' | 'normal';
}

/**
 * Register a push notification token for a user
 */
export async function registerPushToken(
  userId: number,
  token: string,
  deviceType: 'ios' | 'android' | 'web',
  deviceName?: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  await pool.execute(
    `INSERT INTO push_notification_tokens (userId, token, deviceType, deviceName)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     isActive = TRUE,
     deviceName = VALUES(deviceName),
     lastUsed = CURRENT_TIMESTAMP`,
    [userId, token, deviceType, deviceName || null]
  );
}

/**
 * Unregister a push notification token
 */
export async function unregisterPushToken(userId: number, token: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  await pool.execute(
    `UPDATE push_notification_tokens SET isActive = FALSE WHERE userId = ? AND token = ?`,
    [userId, token]
  );
}

/**
 * Get all active tokens for a user
 */
export async function getUserTokens(userId: number): Promise<PushNotificationToken[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT userId, token, deviceType, deviceName FROM push_notification_tokens 
     WHERE userId = ? AND isActive = TRUE`,
    [userId]
  );

  return (result as any[]).map((row) => ({
    userId: row.userId,
    token: row.token,
    deviceType: row.deviceType,
    deviceName: row.deviceName,
  }));
}

/**
 * Send push notification to a user
 */
export async function sendPushNotification(
  userId: number,
  notification: PushNotification
): Promise<{ success: number; failed: number }> {
  const tokens = await getUserTokens(userId);

  let success = 0;
  let failed = 0;

  for (const token of tokens) {
    try {
      // In production, this would call Firebase Admin SDK
      // For now, we simulate the call
      await simulateFCMSend(token.token, notification);
      success++;

      // Update last used timestamp
      const db = await getDb();
      if (db) {
        const pool = (db as any).$client;
        await pool.execute(
          `UPDATE push_notification_tokens SET lastUsed = CURRENT_TIMESTAMP WHERE token = ?`,
          [token.token]
        );
      }
    } catch (error) {
      console.error(`Failed to send FCM to token ${token.token}:`, error);
      failed++;

      // Mark token as inactive if it fails
      await unregisterPushToken(userId, token.token);
    }
  }

  return { success, failed };
}

/**
 * Send push notification to multiple users
 */
export async function sendBulkPushNotification(
  userIds: number[],
  notification: PushNotification
): Promise<{ totalSent: number; totalFailed: number }> {
  let totalSent = 0;
  let totalFailed = 0;

  for (const userId of userIds) {
    const result = await sendPushNotification(userId, notification);
    totalSent += result.success;
    totalFailed += result.failed;
  }

  return { totalSent, totalFailed };
}

/**
 * Send notification to segment
 */
export async function sendSegmentPushNotification(
  segment: string,
  notification: PushNotification
): Promise<{ totalSent: number; totalFailed: number }> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT DISTINCT es.userId FROM employee_segments es
     WHERE es.segment = ?`,
    [segment]
  );

  const userIds = (result as any[]).map((row) => row.userId);
  return sendBulkPushNotification(userIds, notification);
}

/**
 * Send notification to users with specific risk level
 */
export async function sendRiskLevelPushNotification(
  riskLevel: string,
  notification: PushNotification
): Promise<{ totalSent: number; totalFailed: number }> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT DISTINCT es.userId FROM employee_segments es
     WHERE es.riskLevel = ?`,
    [riskLevel]
  );

  const userIds = (result as any[]).map((row) => row.userId);
  return sendBulkPushNotification(userIds, notification);
}

/**
 * Get push notification statistics
 */
export async function getPushNotificationStats(): Promise<{
  totalTokens: number;
  activeTokens: number;
  inactiveTokens: number;
  byDeviceType: Record<string, number>;
}> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT 
      COUNT(*) as totalTokens,
      SUM(CASE WHEN isActive = TRUE THEN 1 ELSE 0 END) as activeTokens,
      SUM(CASE WHEN isActive = FALSE THEN 1 ELSE 0 END) as inactiveTokens,
      deviceType,
      COUNT(*) as deviceCount
     FROM push_notification_tokens
     GROUP BY deviceType`
  );

  const rows = result as any[];
  const byDeviceType: Record<string, number> = {};

  rows.forEach((row) => {
    if (row.deviceType) {
      byDeviceType[row.deviceType] = row.deviceCount;
    }
  });

  return {
    totalTokens: rows[0]?.totalTokens || 0,
    activeTokens: rows[0]?.activeTokens || 0,
    inactiveTokens: rows[0]?.inactiveTokens || 0,
    byDeviceType,
  };
}

/**
 * Clean up inactive tokens older than 30 days
 */
export async function cleanupInactiveTokens(): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `DELETE FROM push_notification_tokens 
     WHERE isActive = FALSE AND lastUsed < DATE_SUB(NOW(), INTERVAL 30 DAY)`
  );

  return (result as any).affectedRows || 0;
}

/**
 * Simulate FCM send (in production, use Firebase Admin SDK)
 */
async function simulateFCMSend(token: string, notification: PushNotification): Promise<void> {
  // In production, this would be:
  // const message = {
  //   notification: {
  //     title: notification.title,
  //     body: notification.body,
  //   },
  //   data: notification.data,
  //   token: token,
  // };
  // await admin.messaging().send(message);

  // For now, simulate with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[FCM] Sent to token: ${token.substring(0, 20)}...`);
      resolve();
    }, 10);
  });
}

/**
 * Create rich notification with actions (iOS/Android)
 */
export function createRichNotification(
  title: string,
  body: string,
  actions: Array<{ id: string; title: string }> = [],
  data: Record<string, string> = {}
): PushNotification {
  return {
    title,
    body,
    data: {
      ...data,
      actions: JSON.stringify(actions),
    },
    priority: 'high',
    sound: 'default',
  };
}

/**
 * Create silent notification for background sync
 */
export function createSilentNotification(data: Record<string, string>): PushNotification {
  return {
    title: '',
    body: '',
    data,
    priority: 'normal',
  };
}

/**
 * Create notification with badge count
 */
export function createBadgedNotification(
  title: string,
  body: string,
  badge: number,
  data: Record<string, string> = {}
): PushNotification {
  return {
    title,
    body,
    badge,
    data,
    priority: 'high',
  };
}
