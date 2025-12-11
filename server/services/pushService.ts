import webpush from 'web-push';
import { getDb } from '../db';
import { pushSubscriptions } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';

// VAPID keys for Web Push
// In production, these should be environment variables
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'UUxI4O8-FbRouADVXc-hK3ltm2lOqKl-XaiuEgfLRHs';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:support@treevu.app';

// Configure web-push
webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export interface PushPayload {
  title: string;
  body?: string;
  message?: string;
  icon?: string;
  type?: string;
  actionUrl?: string;
  tag?: string;
  notificationId?: number;
  actions?: Array<{ action: string; title: string; icon?: string }>;
  requireInteraction?: boolean;
}

/**
 * Get VAPID public key for client subscription
 */
export function getVapidPublicKey(): string {
  return VAPID_PUBLIC_KEY;
}

/**
 * Save a push subscription for a user
 */
export async function savePushSubscription(
  userId: number,
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  },
  userAgent?: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Check if subscription already exists
    const existing = await db
      .select()
      .from(pushSubscriptions)
      .where(
        and(
          eq(pushSubscriptions.userId, userId),
          eq(pushSubscriptions.endpoint, subscription.endpoint)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing subscription
      await db
        .update(pushSubscriptions)
        .set({
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          userAgent,
          isActive: true,
          lastUsedAt: new Date(),
        })
        .where(eq(pushSubscriptions.id, existing[0].id));
    } else {
      // Create new subscription
      await db.insert(pushSubscriptions).values({
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent,
      });
    }

    return true;
  } catch (error) {
    console.error('[PushService] Error saving subscription:', error);
    return false;
  }
}

/**
 * Remove a push subscription
 */
export async function removePushSubscription(
  userId: number,
  endpoint: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(pushSubscriptions)
      .set({ isActive: false })
      .where(
        and(
          eq(pushSubscriptions.userId, userId),
          eq(pushSubscriptions.endpoint, endpoint)
        )
      );
    return true;
  } catch (error) {
    console.error('[PushService] Error removing subscription:', error);
    return false;
  }
}

/**
 * Send push notification to a specific user
 */
export async function sendPushToUser(
  userId: number,
  payload: PushPayload
): Promise<{ success: number; failed: number }> {
  const db = await getDb();
  if (!db) return { success: 0, failed: 0 };

  try {
    // Get all active subscriptions for the user
    const subscriptions = await db
      .select()
      .from(pushSubscriptions)
      .where(
        and(
          eq(pushSubscriptions.userId, userId),
          eq(pushSubscriptions.isActive, true)
        )
      );

    if (subscriptions.length === 0) {
      return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;

    // Send to all subscriptions
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify(payload),
          {
            TTL: 86400, // 24 hours
            urgency: 'normal',
          }
        );

        // Update last used timestamp
        await db
          .update(pushSubscriptions)
          .set({ lastUsedAt: new Date() })
          .where(eq(pushSubscriptions.id, sub.id));

        success++;
      } catch (error: any) {
        console.error('[PushService] Error sending push:', error);
        
        // If subscription is invalid, mark as inactive
        if (error.statusCode === 404 || error.statusCode === 410) {
          await db
            .update(pushSubscriptions)
            .set({ isActive: false })
            .where(eq(pushSubscriptions.id, sub.id));
        }
        
        failed++;
      }
    }

    return { success, failed };
  } catch (error) {
    console.error('[PushService] Error in sendPushToUser:', error);
    return { success: 0, failed: 0 };
  }
}

/**
 * Send push notification to multiple users
 */
export async function sendPushToUsers(
  userIds: number[],
  payload: PushPayload
): Promise<{ success: number; failed: number }> {
  let totalSuccess = 0;
  let totalFailed = 0;

  for (const userId of userIds) {
    const result = await sendPushToUser(userId, payload);
    totalSuccess += result.success;
    totalFailed += result.failed;
  }

  return { success: totalSuccess, failed: totalFailed };
}

/**
 * Get subscription count for a user
 */
export async function getUserSubscriptionCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  try {
    const subscriptions = await db
      .select()
      .from(pushSubscriptions)
      .where(
        and(
          eq(pushSubscriptions.userId, userId),
          eq(pushSubscriptions.isActive, true)
        )
      );
    return subscriptions.length;
  } catch (error) {
    console.error('[PushService] Error getting subscription count:', error);
    return 0;
  }
}
