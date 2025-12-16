import { getDb } from "../db";

export interface MobileAuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

export interface MobileSession {
  sessionId: string;
  userId: number;
  deviceId: string;
  deviceName: string;
  platform: "ios" | "android";
  lastActivity: Date;
  createdAt: Date;
  expiresAt: Date;
}

export interface PushNotificationToken {
  userId: number;
  token: string;
  platform: "ios" | "android";
  deviceId: string;
  isActive: boolean;
  createdAt: Date;
}

/**
 * Generate mobile authentication tokens
 */
export async function generateMobileTokens(
  userId: number,
  deviceId: string,
  deviceName: string,
  platform: "ios" | "android"
): Promise<MobileAuthToken> {
  try {
    // In production, use JWT library to generate tokens
    const accessToken = Buffer.from(
      JSON.stringify({
        userId,
        deviceId,
        iat: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      })
    ).toString("base64");

    const refreshToken = Buffer.from(
      JSON.stringify({
        userId,
        deviceId,
        iat: Date.now(),
        exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      })
    ).toString("base64");

    // Log session
    await logMobileSession(userId, deviceId, deviceName, platform);

    return {
      accessToken,
      refreshToken,
      expiresIn: 24 * 60 * 60, // 24 hours in seconds
      tokenType: "Bearer",
    };
  } catch (error) {
    console.error("Error generating mobile tokens:", error);
    throw error;
  }
}

/**
 * Validate mobile access token
 */
export async function validateMobileToken(token: string): Promise<{ userId: number; deviceId: string } | null> {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

    if (decoded.exp < Date.now()) {
      return null; // Token expired
    }

    return {
      userId: decoded.userId,
      deviceId: decoded.deviceId,
    };
  } catch (error) {
    console.error("Error validating mobile token:", error);
    return null;
  }
}

/**
 * Refresh mobile access token
 */
export async function refreshMobileToken(
  refreshToken: string
): Promise<MobileAuthToken | null> {
  try {
    const decoded = JSON.parse(Buffer.from(refreshToken, "base64").toString("utf-8"));

    if (decoded.exp < Date.now()) {
      return null; // Refresh token expired
    }

    return generateMobileTokens(
      decoded.userId,
      decoded.deviceId,
      "Mobile Device",
      "ios"
    );
  } catch (error) {
    console.error("Error refreshing mobile token:", error);
    return null;
  }
}

/**
 * Log mobile session
 */
export async function logMobileSession(
  userId: number,
  deviceId: string,
  deviceName: string,
  platform: "ios" | "android"
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    // In a real app, you'd insert into a mobile_sessions table
    console.log(`[Mobile Auth] Session logged for user ${userId} on ${platform} device: ${deviceName}`);
  } catch (error) {
    console.error("Error logging mobile session:", error);
  }
}

/**
 * Register push notification token
 */
export async function registerPushToken(
  userId: number,
  token: string,
  platform: "ios" | "android",
  deviceId: string
): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    // In a real app, you'd insert into push_notification_tokens table
    console.log(`[Push Notifications] Registered token for user ${userId} on ${platform}`);
    return true;
  } catch (error) {
    console.error("Error registering push token:", error);
    return false;
  }
}

/**
 * Unregister push notification token
 */
export async function unregisterPushToken(userId: number, token: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    // In a real app, you'd delete from push_notification_tokens table
    console.log(`[Push Notifications] Unregistered token for user ${userId}`);
    return true;
  } catch (error) {
    console.error("Error unregistering push token:", error);
    return false;
  }
}

/**
 * Send push notification to user
 */
export async function sendPushNotification(
  userId: number,
  title: string,
  message: string,
  data?: Record<string, string>
): Promise<{ sent: number; failed: number }> {
  try {
    const db = await getDb();
    if (!db) return { sent: 0, failed: 0 };

    // In a real app, you'd query push_notification_tokens and send via FCM/APNs
    console.log(`[Push Notifications] Sending to user ${userId}: "${title}" - "${message}"`);

    return {
      sent: 1,
      failed: 0,
    };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { sent: 0, failed: 1 };
  }
}

/**
 * Get active mobile sessions for user
 */
export async function getActiveSessions(userId: number): Promise<MobileSession[]> {
  try {
    // Mock data - in production, query mobile_sessions table
    return [
      {
        sessionId: "sess_abc123",
        userId,
        deviceId: "device_001",
        deviceName: "iPhone 14 Pro",
        platform: "ios",
        lastActivity: new Date(Date.now() - 5 * 60 * 1000),
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
      },
      {
        sessionId: "sess_def456",
        userId,
        deviceId: "device_002",
        deviceName: "Samsung Galaxy S23",
        platform: "android",
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 17 * 60 * 60 * 1000),
      },
    ];
  } catch (error) {
    console.error("Error getting active sessions:", error);
    return [];
  }
}

/**
 * Logout from specific device
 */
export async function logoutFromDevice(userId: number, deviceId: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    // In a real app, you'd delete from mobile_sessions table
    console.log(`[Mobile Auth] User ${userId} logged out from device ${deviceId}`);
    return true;
  } catch (error) {
    console.error("Error logging out from device:", error);
    return false;
  }
}

/**
 * Logout from all devices
 */
export async function logoutFromAllDevices(userId: number): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    // In a real app, you'd delete all sessions for user
    console.log(`[Mobile Auth] User ${userId} logged out from all devices`);
    return true;
  } catch (error) {
    console.error("Error logging out from all devices:", error);
    return false;
  }
}

/**
 * Get mobile app version info
 */
export function getMobileAppVersionInfo(): {
  currentVersion: string;
  minimumVersion: string;
  latestVersion: string;
  updateRequired: boolean;
  updateAvailable: boolean;
} {
  return {
    currentVersion: "1.0.0",
    minimumVersion: "1.0.0",
    latestVersion: "1.1.0",
    updateRequired: false,
    updateAvailable: true,
  };
}
