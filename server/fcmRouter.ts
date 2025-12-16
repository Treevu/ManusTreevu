/**
 * Firebase Cloud Messaging Router
 * 
 * tRPC endpoints for push notification management
 */

import { router, protectedProcedure, adminProcedure } from './_core/trpc';
import { z } from 'zod';
import {
  registerPushToken,
  unregisterPushToken,
  getUserTokens,
  sendPushNotification,
  sendBulkPushNotification,
  sendSegmentPushNotification,
  sendRiskLevelPushNotification,
  getPushNotificationStats,
  cleanupInactiveTokens,
  createRichNotification,
  createSilentNotification,
  createBadgedNotification,
  type PushNotification,
} from './services/firebaseService';

export const fcmRouter = router({
  /**
   * Register push notification token for current user
   */
  registerToken: protectedProcedure
    .input(
      z.object({
        token: z.string().min(10),
        deviceType: z.enum(['ios', 'android', 'web']),
        deviceName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await registerPushToken(ctx.user.id, input.token, input.deviceType, input.deviceName);
      return { success: true, message: 'Token registered successfully' };
    }),

  /**
   * Unregister push notification token
   */
  unregisterToken: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await unregisterPushToken(ctx.user.id, input.token);
      return { success: true, message: 'Token unregistered successfully' };
    }),

  /**
   * Get all registered tokens for current user
   */
  getTokens: protectedProcedure.query(async ({ ctx }) => {
    const tokens = await getUserTokens(ctx.user.id);
    return {
      tokens,
      count: tokens.length,
    };
  }),

  /**
   * Send test push notification to current user
   */
  sendTest: protectedProcedure.mutation(async ({ ctx }) => {
    const notification: PushNotification = {
      title: 'Test Notification',
      body: 'This is a test push notification from Treevü',
      data: {
        type: 'test',
        timestamp: new Date().toISOString(),
      },
    };

    const result = await sendPushNotification(ctx.user.id, notification);
    return {
      success: result.success > 0,
      sent: result.success,
      failed: result.failed,
    };
  }),

  /**
   * Send tier upgrade notification (admin)
   */
  sendTierUpgrade: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        tierName: z.string(),
        benefits: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const notification = createRichNotification(
        `🎉 Congratulations! You reached ${input.tierName} Tier`,
        `You've earned new benefits: ${input.benefits.join(', ')}`,
        [
          { id: 'view_benefits', title: 'View Benefits' },
          { id: 'dismiss', title: 'Dismiss' },
        ],
        {
          type: 'tier_upgrade',
          tierName: input.tierName,
        }
      );

      const result = await sendPushNotification(input.userId, notification);
      return {
        success: result.success > 0,
        sent: result.success,
        failed: result.failed,
      };
    }),

  /**
   * Send intervention notification (admin)
   */
  sendIntervention: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        interventionTitle: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const notification = createRichNotification(
        `📋 New Intervention: ${input.interventionTitle}`,
        input.description,
        [
          { id: 'view_details', title: 'View Details' },
          { id: 'dismiss', title: 'Dismiss' },
        ],
        {
          type: 'intervention',
          interventionTitle: input.interventionTitle,
        }
      );

      const result = await sendPushNotification(input.userId, notification);
      return {
        success: result.success > 0,
        sent: result.success,
        failed: result.failed,
      };
    }),

  /**
   * Send recommendation notification (admin)
   */
  sendRecommendation: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        title: z.string(),
        description: z.string(),
        estimatedSavings: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const notification = createBadgedNotification(
        `💡 ${input.title}`,
        `${input.description} - Potential savings: $${input.estimatedSavings}`,
        1,
        {
          type: 'recommendation',
          title: input.title,
          savings: input.estimatedSavings.toString(),
        }
      );

      const result = await sendPushNotification(input.userId, notification);
      return {
        success: result.success > 0,
        sent: result.success,
        failed: result.failed,
      };
    }),

  /**
   * Send bulk notification to segment (admin)
   */
  sendToSegment: adminProcedure
    .input(
      z.object({
        segment: z.string(),
        title: z.string(),
        body: z.string(),
        data: z.record(z.string(), z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const notification: PushNotification = {
        title: input.title,
        body: input.body,
        data: input.data,
        priority: 'high',
      };

      const result = await sendSegmentPushNotification(input.segment, notification);
      return {
        totalSent: result.totalSent,
        totalFailed: result.totalFailed,
      };
    }),

  /**
   * Send notification to users with specific risk level (admin)
   */
  sendToRiskLevel: adminProcedure
    .input(
      z.object({
        riskLevel: z.enum(['critical', 'high', 'medium', 'low', 'minimal']),
        title: z.string(),
        body: z.string(),
        data: z.record(z.string(), z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const notification: PushNotification = {
        title: input.title,
        body: input.body,
        data: input.data,
        priority: input.riskLevel === 'critical' ? 'high' : 'normal',
      };

      const result = await sendRiskLevelPushNotification(input.riskLevel, notification);
      return {
        totalSent: result.totalSent,
        totalFailed: result.totalFailed,
      };
    }),

  /**
   * Get push notification statistics (admin)
   */
  getStats: adminProcedure.query(async () => {
    const stats = await getPushNotificationStats();
    return stats;
  }),

  /**
   * Cleanup inactive tokens (admin)
   */
  cleanupTokens: adminProcedure.mutation(async () => {
    const deleted = await cleanupInactiveTokens();
    return {
      success: true,
      deletedCount: deleted,
      message: `Cleaned up ${deleted} inactive tokens`,
    };
  }),

  /**
   * Send batch notifications (admin)
   */
  sendBatch: adminProcedure
    .input(
      z.object({
        userIds: z.array(z.number()),
        title: z.string(),
        body: z.string(),
        data: z.record(z.string(), z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const notification: PushNotification = {
        title: input.title,
        body: input.body,
        data: input.data,
        priority: 'high',
      };

      const result = await sendBulkPushNotification(input.userIds, notification);
      return {
        totalSent: result.totalSent,
        totalFailed: result.totalFailed,
      };
    }),
});
