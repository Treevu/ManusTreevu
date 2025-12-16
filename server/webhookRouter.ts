import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  triggerRewardTierUpgrade,
  triggerNewRecommendation,
  triggerInterventionStarted,
  triggerInterventionCompleted,
  triggerEWARateImproved,
  triggerFWIMilestone,
  triggerDepartmentMilestone,
} from "./services/ecosystemWebhookService";

export const webhookRouter = router({
  // Trigger reward tier upgrade notification
  triggerTierUpgrade: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        oldTierName: z.string(),
        newTierName: z.string(),
        newDiscount: z.number(),
        ewaReduction: z.number(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      // Only admins can trigger webhooks
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await triggerRewardTierUpgrade(
        input.userId,
        input.oldTierName,
        input.newTierName,
        input.newDiscount,
        input.ewaReduction
      );

      return { success: true };
    }),

  // Trigger new recommendation notification
  triggerNewRecommendation: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        recommendationType: z.string(),
        estimatedSavings: z.number(),
        urgency: z.enum(["low", "medium", "high"]),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await triggerNewRecommendation(
        input.userId,
        input.recommendationType,
        input.estimatedSavings,
        input.urgency
      );

      return { success: true };
    }),

  // Trigger intervention started notification
  triggerInterventionStarted: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        interventionType: z.string(),
        expectedOutcome: z.string(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await triggerInterventionStarted(
        input.userId,
        input.interventionType,
        input.expectedOutcome
      );

      return { success: true };
    }),

  // Trigger intervention completed notification
  triggerInterventionCompleted: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        interventionType: z.string(),
        actualOutcome: z.string(),
        roiActual: z.number(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await triggerInterventionCompleted(
        input.userId,
        input.interventionType,
        input.actualOutcome,
        input.roiActual
      );

      return { success: true };
    }),

  // Trigger EWA rate improved notification
  triggerEWARateImproved: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        oldRate: z.number(),
        newRate: z.number(),
        fwiScore: z.number(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await triggerEWARateImproved(
        input.userId,
        input.oldRate,
        input.newRate,
        input.fwiScore
      );

      return { success: true };
    }),

  // Trigger FWI milestone notification
  triggerFWIMilestone: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        fwiScore: z.number(),
        milestone: z.number(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await triggerFWIMilestone(input.userId, input.fwiScore, input.milestone);

      return { success: true };
    }),

  // Trigger department milestone notification
  triggerDepartmentMilestone: protectedProcedure
    .input(
      z.object({
        departmentId: z.number(),
        engagementScore: z.number(),
        totalROI: z.number(),
        employeeIds: z.array(z.number()),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await triggerDepartmentMilestone(
        input.departmentId,
        input.engagementScore,
        input.totalROI,
        input.employeeIds
      );

      return { success: true };
    }),
});
