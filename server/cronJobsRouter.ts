import { router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  updateEngagementMetricsDaily,
  assignInterventionsWeekly,
  notifyManagersCriticalInterventions,
  updateRewardTiersDaily,
  generateDailyReports,
  calculateMonthlyROI,
  getCronJobStatus,
} from "./services/cronJobsService";

export const cronJobsRouter = router({
  // Run engagement metrics update
  runEngagementUpdate: protectedProcedure.mutation(async ({ ctx }: any) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }

    const result = await updateEngagementMetricsDaily();
    return {
      success: true,
      ...result,
      message: `Updated metrics for ${result.updated} departments`,
    };
  }),

  // Run intervention assignment
  runInterventionAssignment: protectedProcedure.mutation(async ({ ctx }: any) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }

    const result = await assignInterventionsWeekly();
    return {
      success: true,
      ...result,
      message: `Assigned ${result.assigned} interventions`,
    };
  }),

  // Run manager notifications
  runManagerNotifications: protectedProcedure.mutation(async ({ ctx }: any) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }

    const result = await notifyManagersCriticalInterventions();
    return {
      success: true,
      ...result,
      message: `Notified managers about ${result.criticalCount} critical cases`,
    };
  }),

  // Run reward tier update
  runRewardTierUpdate: protectedProcedure.mutation(async ({ ctx }: any) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }

    const result = await updateRewardTiersDaily();
    return {
      success: true,
      ...result,
      message: `Updated tiers: ${result.upgraded} upgrades, ${result.downgraded} downgrades`,
    };
  }),

  // Run report generation
  runReportGeneration: protectedProcedure.mutation(async ({ ctx }: any) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }

    const result = await generateDailyReports();
    return {
      success: true,
      ...result,
      message: `Generated ${result.generated} reports`,
    };
  }),

  // Run ROI calculation
  runROICalculation: protectedProcedure.mutation(async ({ ctx }: any) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }

    const result = await calculateMonthlyROI();
    return {
      success: true,
      ...result,
      message: `Calculated ROI for ${result.calculated} interventions: $${result.totalROI}`,
    };
  }),

  // Get cron job status
  getStatus: protectedProcedure.query(async ({ ctx }: any) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }

    return getCronJobStatus();
  }),

  // Run all jobs
  runAll: protectedProcedure.mutation(async ({ ctx }: any) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }

    const results = {
      engagementMetrics: await updateEngagementMetricsDaily(),
      interventions: await assignInterventionsWeekly(),
      managerNotifications: await notifyManagersCriticalInterventions(),
      rewardTiers: await updateRewardTiersDaily(),
      reports: await generateDailyReports(),
      roi: await calculateMonthlyROI(),
    };

    return {
      success: true,
      results,
      message: "All cron jobs executed successfully",
    };
  }),
});
