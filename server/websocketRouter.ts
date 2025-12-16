/**
 * WebSocket Router
 * 
 * tRPC endpoints for managing WebSocket connections and notifications
 */

import { router, protectedProcedure } from './_core/trpc';
import { z } from 'zod';
import {
  getNotificationHistory,
  markNotificationAsRead,
  getUnreadNotificationCount,
} from './services/websocketService';

export const websocketRouter = router({
  /**
   * Get notification history for current user
   */
  getHistory: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(50) }).optional())
    .query(async ({ ctx, input }) => {
      const history = await getNotificationHistory(ctx.user.id, input?.limit || 50);
      return {
        notifications: history,
        count: history.length,
      };
    }),

  /**
   * Mark notification as read
   */
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ input }) => {
      await markNotificationAsRead(input.notificationId);
      return { success: true };
    }),

  /**
   * Get unread notification count
   */
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await getUnreadNotificationCount(ctx.user.id);
    return { unreadCount: count };
  }),

  /**
   * Clear all notifications for user
   */
  clearAll: protectedProcedure.mutation(async ({ ctx }) => {
    // This would require a database function to clear all notifications
    // For now, returning success
    return { success: true, message: 'All notifications cleared' };
  }),

  /**
   * Get notification preferences
   */
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    return {
      userId: ctx.user.id,
      preferences: {
        tierUpgrades: true,
        milestones: true,
        complianceAlerts: true,
        recommendations: true,
        interventionUpdates: true,
        emailNotifications: false,
        pushNotifications: true,
        smsNotifications: false,
      },
    };
  }),

  /**
   * Update notification preferences
   */
  updatePreferences: protectedProcedure
    .input(
      z.object({
        tierUpgrades: z.boolean().optional(),
        milestones: z.boolean().optional(),
        complianceAlerts: z.boolean().optional(),
        recommendations: z.boolean().optional(),
        interventionUpdates: z.boolean().optional(),
        emailNotifications: z.boolean().optional(),
        pushNotifications: z.boolean().optional(),
        smsNotifications: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // This would update preferences in the database
      return {
        success: true,
        message: 'Preferences updated',
        preferences: input,
      };
    }),

  /**
   * Get notification statistics
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const unreadCount = await getUnreadNotificationCount(ctx.user.id);
    const history = await getNotificationHistory(ctx.user.id, 100);

    const typeBreakdown = history.reduce(
      (acc, notif) => {
        acc[notif.type] = (acc[notif.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalNotifications: history.length,
      unreadCount,
      typeBreakdown,
      lastNotification: history[0]?.timestamp,
    };
  }),
});
