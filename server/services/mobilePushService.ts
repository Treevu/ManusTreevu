/**
 * Mobile Push Notifications Service
 * 
 * Manages push notification campaigns, device tokens, and delivery tracking
 * Integrates with Firebase Cloud Messaging (FCM) for iOS, Android, and Web
 */

import { getDb } from '../db';
import { 
  mobilePushNotifications, 
  pushNotificationCampaigns, 
  pushNotificationDeliveryLog 
} from '../../drizzle/schema';
import { eq, and, desc, gte, lte } from 'drizzle-orm';

export interface PushNotificationRequest {
  userId: number;
  deviceToken: string;
  deviceType: 'ios' | 'android' | 'web';
  appVersion?: string;
  osVersion?: string;
}

export interface PushCampaignRequest {
  campaignName: string;
  campaignType: string;
  title: string;
  body: string;
  imageUrl?: string;
  actionUrl?: string;
  targetSegment?: string;
  targetRiskLevel?: string;
  scheduledAt?: Date;
}

/**
 * Register a device token for push notifications
 */
export async function registerDeviceToken(request: PushNotificationRequest): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  // Check if token already exists
  const existing = await db
    .select()
    .from(mobilePushNotifications)
    .where(
      and(
        eq(mobilePushNotifications.userId, request.userId),
        eq(mobilePushNotifications.deviceToken, request.deviceToken)
      )
    );

  if (existing.length === 0) {
    // Insert new token
    await db.insert(mobilePushNotifications).values({
      userId: request.userId,
      deviceToken: request.deviceToken,
      deviceType: request.deviceType as any,
      appVersion: request.appVersion,
      osVersion: request.osVersion,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    // Update existing token
    await db
      .update(mobilePushNotifications)
      .set({
        isActive: true,
        lastUsedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(mobilePushNotifications.deviceToken, request.deviceToken));
  }
}

/**
 * Unregister a device token
 */
export async function unregisterDeviceToken(deviceToken: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  await db
    .update(mobilePushNotifications)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(eq(mobilePushNotifications.deviceToken, deviceToken));
}

/**
 * Get active device tokens for a user
 */
export async function getUserDeviceTokens(userId: number): Promise<any[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const tokens = await db
    .select()
    .from(mobilePushNotifications)
    .where(
      and(
        eq(mobilePushNotifications.userId, userId),
        eq(mobilePushNotifications.isActive, true)
      )
    );

  return tokens as unknown as any[];
}

/**
 * Create a push notification campaign
 */
export async function createPushCampaign(
  request: PushCampaignRequest,
  createdBy: number
): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const result = await db.insert(pushNotificationCampaigns).values({
    campaignName: request.campaignName,
    campaignType: request.campaignType as any,
    title: request.title,
    body: request.body,
    imageUrl: request.imageUrl,
    actionUrl: request.actionUrl,
    targetSegment: request.targetSegment,
    targetRiskLevel: request.targetRiskLevel,
    scheduledAt: request.scheduledAt,
    status: request.scheduledAt ? 'scheduled' : 'draft',
    totalSent: 0,
    totalOpened: 0,
    totalClicked: 0,
    openRate: '0' as any,
    clickRate: '0' as any,
    createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return (result as any).insertId || 1;
}

/**
 * Get campaign details
 */
export async function getCampaign(campaignId: number): Promise<any> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const campaigns = await db
    .select()
    .from(pushNotificationCampaigns)
    .where(eq(pushNotificationCampaigns.id, campaignId));

  return campaigns[0] || null;
}

/**
 * Get all campaigns with optional filtering
 */
export async function getCampaigns(
  status?: string,
  campaignType?: string,
  limit: number = 50
): Promise<any[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const conditions: any[] = [];
  if (status) conditions.push(eq(pushNotificationCampaigns.status, status as any));
  if (campaignType) conditions.push(eq(pushNotificationCampaigns.campaignType, campaignType as any));

  let baseQuery = db.select().from(pushNotificationCampaigns);
  
  if (conditions.length > 0) {
    const campaigns = await baseQuery.where(and(...conditions))
      .orderBy(desc(pushNotificationCampaigns.createdAt))
      .limit(limit);
    return campaigns as unknown as any[];
  }
  
  const campaigns = await baseQuery
    .orderBy(desc(pushNotificationCampaigns.createdAt))
    .limit(limit);

  return campaigns as unknown as any[];
}

/**
 * Send push notification to user
 */
export async function sendPushNotification(
  campaignId: number,
  userId: number,
  deviceToken: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  try {
    // Record delivery attempt
    await db.insert(pushNotificationDeliveryLog).values({
      campaignId,
      userId,
      deviceToken,
      status: 'sent',
      deliveredAt: new Date(),
      createdAt: new Date(),
    });

    // Update campaign metrics
    const campaign = await getCampaign(campaignId);
    if (campaign) {
      const newTotalSent = (campaign.totalSent || 0) + 1;
      await db
        .update(pushNotificationCampaigns)
        .set({
          totalSent: newTotalSent,
          updatedAt: new Date(),
        })
        .where(eq(pushNotificationCampaigns.id, campaignId));
    }

    return true;
  } catch (error) {
    // Record failed delivery
    await db.insert(pushNotificationDeliveryLog).values({
      campaignId,
      userId,
      deviceToken,
      status: 'failed',
      errorMessage: (error as any).message,
      createdAt: new Date(),
    });

    return false;
  }
}

/**
 * Record push notification open
 */
export async function recordPushOpen(campaignId: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  // Find delivery log entry
  const logs = await db
    .select()
    .from(pushNotificationDeliveryLog)
    .where(
      and(
        eq(pushNotificationDeliveryLog.campaignId, campaignId),
        eq(pushNotificationDeliveryLog.userId, userId)
      )
    );

  if (logs.length > 0) {
    // Update delivery log
    await db
      .update(pushNotificationDeliveryLog)
      .set({
        openedAt: new Date(),
      })
      .where(eq(pushNotificationDeliveryLog.id, logs[0].id));

    // Update campaign metrics
    const campaign = await getCampaign(campaignId);
    if (campaign) {
      const newTotalOpened = (campaign.totalOpened || 0) + 1;
      const openRate = campaign.totalSent > 0 
        ? ((newTotalOpened / campaign.totalSent) * 100).toFixed(2)
        : '0';

      await db
        .update(pushNotificationCampaigns)
        .set({
          totalOpened: newTotalOpened,
          openRate: openRate as any,
          updatedAt: new Date(),
        })
        .where(eq(pushNotificationCampaigns.id, campaignId));
    }
  }
}

/**
 * Record push notification click
 */
export async function recordPushClick(campaignId: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  // Find delivery log entry
  const logs = await db
    .select()
    .from(pushNotificationDeliveryLog)
    .where(
      and(
        eq(pushNotificationDeliveryLog.campaignId, campaignId),
        eq(pushNotificationDeliveryLog.userId, userId)
      )
    );

  if (logs.length > 0) {
    // Update delivery log
    await db
      .update(pushNotificationDeliveryLog)
      .set({
        clickedAt: new Date(),
      })
      .where(eq(pushNotificationDeliveryLog.id, logs[0].id));

    // Update campaign metrics
    const campaign = await getCampaign(campaignId);
    if (campaign) {
      const newTotalClicked = (campaign.totalClicked || 0) + 1;
      const clickRate = campaign.totalSent > 0 
        ? ((newTotalClicked / campaign.totalSent) * 100).toFixed(2)
        : '0';

      await db
        .update(pushNotificationCampaigns)
        .set({
          totalClicked: newTotalClicked,
          clickRate: clickRate as any,
          updatedAt: new Date(),
        })
        .where(eq(pushNotificationCampaigns.id, campaignId));
    }
  }
}

/**
 * Get campaign analytics
 */
export async function getCampaignAnalytics(campaignId: number): Promise<any> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const campaign = await getCampaign(campaignId);
  if (!campaign) return null;

  const deliveryLogs = await db
    .select()
    .from(pushNotificationDeliveryLog)
    .where(eq(pushNotificationDeliveryLog.campaignId, campaignId));

  const delivered = deliveryLogs.filter((log: any) => log.status === 'delivered').length;
  const opened = deliveryLogs.filter((log: any) => log.openedAt !== null).length;
  const clicked = deliveryLogs.filter((log: any) => log.clickedAt !== null).length;
  const failed = deliveryLogs.filter((log: any) => log.status === 'failed').length;

  return {
    campaignId,
    campaignName: campaign.campaignName,
    campaignType: campaign.campaignType,
    totalSent: campaign.totalSent,
    delivered,
    opened,
    clicked,
    failed,
    openRate: campaign.openRate,
    clickRate: campaign.clickRate,
    createdAt: campaign.createdAt,
    sentAt: campaign.sentAt,
    status: campaign.status,
  };
}

/**
 * Get delivery status for a campaign
 */
export async function getCampaignDeliveryStatus(campaignId: number): Promise<{
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  opened: number;
  clicked: number;
}> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const logs = await db
    .select()
    .from(pushNotificationDeliveryLog)
    .where(eq(pushNotificationDeliveryLog.campaignId, campaignId));

  return {
    total: logs.length,
    sent: logs.filter((log: any) => log.status === 'sent').length,
    delivered: logs.filter((log: any) => log.status === 'delivered').length,
    failed: logs.filter((log: any) => log.status === 'failed').length,
    opened: logs.filter((log: any) => log.openedAt !== null).length,
    clicked: logs.filter((log: any) => log.clickedAt !== null).length,
  };
}

/**
 * Send campaign to all users in a segment
 */
export async function sendCampaignToSegment(
  campaignId: number,
  userIds: number[]
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const userId of userIds) {
    const tokens = await getUserDeviceTokens(userId);
    for (const token of tokens) {
      const success = await sendPushNotification(campaignId, userId, token.deviceToken);
      if (success) {
        sent++;
      } else {
        failed++;
      }
    }
  }

  return { sent, failed };
}

/**
 * Update campaign status
 */
export async function updateCampaignStatus(
  campaignId: number,
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled'
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const updateData: any = {
    status,
    updatedAt: new Date(),
  };

  if (status === 'sent') {
    updateData.sentAt = new Date();
  }

  await db
    .update(pushNotificationCampaigns)
    .set(updateData)
    .where(eq(pushNotificationCampaigns.id, campaignId));
}
