import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  generateMobileTokens,
  validateMobileToken,
  refreshMobileToken,
  registerPushToken,
  unregisterPushToken,
  sendPushNotification,
  getActiveSessions,
  logoutFromDevice,
  logoutFromAllDevices,
  getMobileAppVersionInfo,
} from "./services/mobileAuthService";

export const mobileRouter = router({
  // Mobile authentication
  auth: router({
    // Login with device info
    login: publicProcedure
      .input(
        z.object({
          userId: z.number(),
          deviceId: z.string(),
          deviceName: z.string(),
          platform: z.enum(["ios", "android"]),
        })
      )
      .mutation(async ({ input }: any) => {
        try {
          const tokens = await generateMobileTokens(
            input.userId,
            input.deviceId,
            input.deviceName,
            input.platform
          );

          return {
            success: true,
            ...tokens,
            user: {
              id: input.userId,
              deviceId: input.deviceId,
            },
          };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to authenticate mobile device",
          });
        }
      }),

    // Refresh access token
    refreshToken: publicProcedure
      .input(z.object({ refreshToken: z.string() }))
      .mutation(async ({ input }: any) => {
        const newTokens = await refreshMobileToken(input.refreshToken);

        if (!newTokens) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid or expired refresh token",
          });
        }

        return {
          success: true,
          ...newTokens,
        };
      }),

    // Validate token
    validateToken: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }: any) => {
        const decoded = await validateMobileToken(input.token);

        return {
          valid: !!decoded,
          userId: decoded?.userId,
          deviceId: decoded?.deviceId,
        };
      }),

    // Get active sessions
    getSessions: protectedProcedure.query(async ({ ctx }: any) => {
      const sessions = await getActiveSessions(ctx.user.id);

      return {
        sessions,
        total: sessions.length,
      };
    }),

    // Logout from device
    logoutDevice: protectedProcedure
      .input(z.object({ deviceId: z.string() }))
      .mutation(async ({ input, ctx }: any) => {
        const success = await logoutFromDevice(ctx.user.id, input.deviceId);

        return {
          success,
          message: success ? "Logged out from device" : "Failed to logout",
        };
      }),

    // Logout from all devices
    logoutAll: protectedProcedure.mutation(async ({ ctx }: any) => {
      const success = await logoutFromAllDevices(ctx.user.id);

      return {
        success,
        message: success ? "Logged out from all devices" : "Failed to logout",
      };
    }),
  }),

  // Push notifications
  notifications: router({
    // Register push token
    registerToken: protectedProcedure
      .input(
        z.object({
          token: z.string(),
          platform: z.enum(["ios", "android"]),
          deviceId: z.string(),
        })
      )
      .mutation(async ({ input, ctx }: any) => {
        const success = await registerPushToken(
          ctx.user.id,
          input.token,
          input.platform,
          input.deviceId
        );

        return {
          success,
          message: success ? "Push token registered" : "Failed to register token",
        };
      }),

    // Unregister push token
    unregisterToken: protectedProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input, ctx }: any) => {
        const success = await unregisterPushToken(ctx.user.id, input.token);

        return {
          success,
          message: success ? "Push token unregistered" : "Failed to unregister token",
        };
      }),

    // Send test notification
    sendTest: protectedProcedure.mutation(async ({ ctx }: any) => {
      const result = await sendPushNotification(
        ctx.user.id,
        "Test Notification",
        "This is a test notification from Treevü",
        { type: "test" }
      );

      return {
        success: result.sent > 0,
        sent: result.sent,
        failed: result.failed,
      };
    }),
  }),

  // Mobile dashboard data
  dashboard: router({
    // Get user rewards info
    getRewards: protectedProcedure.query(async ({ ctx }: any) => {
      return {
        userId: ctx.user.id,
        treePoints: 1500,
        currentTier: "Silver",
        nextTier: "Gold",
        pointsNeeded: 500,
        discount: 5,
        ewaReduction: 0.5,
        progress: 75, // percentage to next tier
      };
    }),

    // Get personalized recommendations
    getRecommendations: protectedProcedure
      .input(z.object({ limit: z.number().default(5) }))
      .query(async ({ input, ctx }: any) => {
        return {
          recommendations: [
            {
              id: 1,
              type: "Spending Reduction Offer",
              title: "Switch to Budget Provider",
              description: "Save $150/month on utilities",
              estimatedSavings: 150,
              urgency: "high",
              relevanceScore: 0.92,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            {
              id: 2,
              type: "Financial Service",
              title: "Refinance Your Loan",
              description: "Lower your interest rate by 2%",
              estimatedSavings: 200,
              urgency: "medium",
              relevanceScore: 0.85,
              expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            },
          ],
          total: 2,
        };
      }),

    // Get intervention status
    getInterventions: protectedProcedure.query(async ({ ctx }: any) => {
      return {
        active: [
          {
            id: 1,
            type: "education",
            title: "Financial Literacy Program",
            description: "Learn budgeting and saving strategies",
            progress: 65,
            startedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            expectedCompletion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            estimatedROI: 45000,
          },
        ],
        completed: [
          {
            id: 2,
            type: "goals",
            title: "Emergency Fund Goal",
            description: "Build 6-month emergency fund",
            completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            actualROI: 12000,
          },
        ],
      };
    }),

    // Get FWI score and trends
    getFWIScore: protectedProcedure.query(async ({ ctx }: any) => {
      return {
        userId: ctx.user.id,
        currentScore: 68,
        previousScore: 60,
        improvement: 8,
        trend: "improving",
        riskLevel: "medium",
        benchmark: {
          average: 65,
          yourPosition: "above average",
        },
        history: [
          { month: "January", score: 60 },
          { month: "February", score: 62 },
          { month: "March", score: 65 },
          { month: "April", score: 68 },
        ],
      };
    }),

    // Get EWA rate info
    getEWARate: protectedProcedure.query(async ({ ctx }: any) => {
      return {
        userId: ctx.user.id,
        currentRate: 1.5,
        baseRate: 2.5,
        tierDiscount: 1.0,
        riskAdjustment: 0,
        lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        timesUsedThisMonth: 3,
        estimatedSavings: 45, // from tier discount
      };
    }),
  }),

  // App version and updates
  version: router({
    // Check for app updates
    checkUpdate: publicProcedure.query(async () => {
      return getMobileAppVersionInfo();
    }),

    // Report app crash
    reportCrash: publicProcedure
      .input(
        z.object({
          errorMessage: z.string(),
          stackTrace: z.string(),
          platform: z.enum(["ios", "android"]),
          appVersion: z.string(),
        })
      )
      .mutation(async ({ input }: any) => {
        console.log(`[Mobile Crash Report] ${input.platform} v${input.appVersion}: ${input.errorMessage}`);

        return {
          success: true,
          message: "Crash report received",
          crashId: `crash_${Date.now()}`,
        };
      }),

    // Send app feedback
    sendFeedback: protectedProcedure
      .input(
        z.object({
          rating: z.number().min(1).max(5),
          message: z.string(),
          category: z.enum(["bug", "feature_request", "general_feedback"]),
        })
      )
      .mutation(async ({ input, ctx }: any) => {
        console.log(`[Mobile Feedback] User ${ctx.user.id}: ${input.category} - Rating: ${input.rating}`);

        return {
          success: true,
          message: "Feedback received",
          feedbackId: `feedback_${Date.now()}`,
        };
      }),
  }),
});
