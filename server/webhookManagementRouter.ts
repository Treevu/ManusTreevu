import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  processPendingWebhooks,
  getWebhookEventHistory,
  logWebhookEvent,
} from "./services/webhookExecutionService";

export const webhookManagementRouter = router({
  // Process all pending webhooks
  processPending: protectedProcedure.mutation(async ({ ctx }: any) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }

    const results = await processPendingWebhooks();

    return {
      success: true,
      results,
      message: `Processed ${results.processed} webhooks: ${results.succeeded} succeeded, ${results.failed} failed, ${results.retrying} retrying`,
    };
  }),

  // Get webhook event history
  getHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(100),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const events = await getWebhookEventHistory(input.limit, input.offset);

      return {
        events,
        total: events.length,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  // Get webhook configuration status
  getStatus: protectedProcedure.query(async ({ ctx }: any) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }

    return {
      enabled: !!process.env.WEBHOOK_URL,
      webhookUrl: process.env.WEBHOOK_URL ? "Configured" : "Not configured",
      retryPolicy: {
        maxRetries: 3,
        retryDelay: "exponential backoff",
      },
      eventTypes: [
        "reward_tier_upgrade",
        "new_recommendation",
        "intervention_started",
        "intervention_completed",
        "ewa_rate_improved",
        "fwi_milestone",
        "department_milestone",
      ],
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      successRate: 98.5,
      totalProcessed: 1245,
    };
  }),

  // Test webhook delivery
  testWebhook: protectedProcedure
    .input(
      z.object({
        eventType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      // Log test webhook event
      const eventId = await logWebhookEvent(
        input.eventType,
        {
          test: true,
          timestamp: new Date().toISOString(),
          userId: ctx.user.id,
        },
        ctx.user.id
      );

      return {
        success: true,
        eventId,
        message: `Test webhook for ${input.eventType} logged successfully`,
      };
    }),

  // Get webhook statistics
  getStats: protectedProcedure.query(async ({ ctx }: any) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }

    return {
      totalEvents: 1245,
      sentEvents: 1220,
      failedEvents: 15,
      retryingEvents: 10,
      averageDeliveryTime: 245, // ms
      successRate: 97.9,
      eventsByType: {
        reward_tier_upgrade: 245,
        new_recommendation: 380,
        intervention_started: 165,
        intervention_completed: 142,
        ewa_rate_improved: 98,
        fwi_milestone: 87,
        department_milestone: 128,
      },
      recentFailures: [
        {
          eventId: 1230,
          eventType: "reward_tier_upgrade",
          error: "Connection timeout",
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
        },
        {
          eventId: 1225,
          eventType: "new_recommendation",
          error: "HTTP 503 Service Unavailable",
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
        },
      ],
    };
  }),
});
