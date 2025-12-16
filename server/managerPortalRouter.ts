import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  getTeamMembers,
  getTeamPerformance,
  getTeamInterventions,
  sendSupportMessage,
  getEmployeeDetail,
  getManagerDashboardSummary,
} from "./services/managerPortalService";

export const managerPortalRouter = router({
  // Manager dashboard
  dashboard: router({
    // Get dashboard summary
    getSummary: protectedProcedure.query(async ({ ctx }: any) => {
      // In production, verify user is a manager
      const summary = await getManagerDashboardSummary(ctx.user.id);

      return {
        success: true,
        ...summary,
      };
    }),

    // Get team members
    getTeamMembers: protectedProcedure.query(async ({ ctx }: any) => {
      const teamMembers = await getTeamMembers(ctx.user.id);

      return {
        success: true,
        teamMembers,
        total: teamMembers.length,
      };
    }),

    // Get team performance
    getTeamPerformance: protectedProcedure.query(async ({ ctx }: any) => {
      const performance = await getTeamPerformance(ctx.user.id);

      return {
        success: true,
        ...performance,
      };
    }),
  }),

  // Intervention oversight
  interventions: router({
    // Get all team interventions
    getAll: protectedProcedure.query(async ({ ctx }: any) => {
      const interventions = await getTeamInterventions(ctx.user.id);

      return {
        success: true,
        interventions,
        total: interventions.length,
        active: interventions.filter((i) => i.status === "active").length,
        completed: interventions.filter((i) => i.status === "completed").length,
      };
    }),

    // Get interventions by status
    getByStatus: protectedProcedure
      .input(z.object({ status: z.enum(["active", "completed", "abandoned"]) }))
      .query(async ({ input, ctx }: any) => {
        const interventions = await getTeamInterventions(ctx.user.id);
        const filtered = interventions.filter((i) => i.status === input.status);

        return {
          success: true,
          interventions: filtered,
          total: filtered.length,
        };
      }),

    // Get interventions by type
    getByType: protectedProcedure
      .input(z.object({ type: z.string() }))
      .query(async ({ input, ctx }: any) => {
        const interventions = await getTeamInterventions(ctx.user.id);
        const filtered = interventions.filter((i) => i.type === input.type);

        return {
          success: true,
          interventions: filtered,
          total: filtered.length,
        };
      }),

    // Get high-priority interventions
    getHighPriority: protectedProcedure.query(async ({ ctx }: any) => {
      const interventions = await getTeamInterventions(ctx.user.id);
      const highPriority = interventions.filter(
        (i) => i.status === "active" && i.progress < 30
      );

      return {
        success: true,
        interventions: highPriority,
        total: highPriority.length,
      };
    }),
  }),

  // Employee support tools
  support: router({
    // Send message to employee
    sendMessage: protectedProcedure
      .input(
        z.object({
          employeeId: z.number(),
          subject: z.string(),
          message: z.string(),
        })
      )
      .mutation(async ({ input, ctx }: any) => {
        const result = await sendSupportMessage(
          ctx.user.id,
          input.employeeId,
          input.subject,
          input.message
        );

        if (!result.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send message",
          });
        }

        return {
          success: true,
          messageId: result.messageId,
          message: "Message sent successfully",
        };
      }),

    // Schedule one-on-one meeting
    scheduleMeeting: protectedProcedure
      .input(
        z.object({
          employeeId: z.number(),
          date: z.date(),
          duration: z.number(), // minutes
          topic: z.string(),
        })
      )
      .mutation(async ({ input, ctx }: any) => {
        // In production, integrate with calendar system
        console.log(`[Manager] Scheduled meeting with employee ${input.employeeId}`);

        return {
          success: true,
          meetingId: `meeting_${Date.now()}`,
          message: "Meeting scheduled successfully",
        };
      }),

    // Send resource to employee
    sendResource: protectedProcedure
      .input(
        z.object({
          employeeId: z.number(),
          resourceType: z.enum(["article", "video", "course", "tool"]),
          resourceTitle: z.string(),
          resourceUrl: z.string().url(),
        })
      )
      .mutation(async ({ input, ctx }: any) => {
        console.log(`[Manager] Sent ${input.resourceType} to employee ${input.employeeId}`);

        return {
          success: true,
          resourceId: `resource_${Date.now()}`,
          message: "Resource sent successfully",
        };
      }),
  }),

  // Employee detail view
  employees: router({
    // Get employee detail
    getDetail: protectedProcedure
      .input(z.object({ employeeId: z.number() }))
      .query(async ({ input, ctx }: any) => {
        const detail = await getEmployeeDetail(input.employeeId);

        if (!detail) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Employee not found",
          });
        }

        return {
          success: true,
          employee: detail,
        };
      }),

    // Get employee FWI trend
    getFWITrend: protectedProcedure
      .input(z.object({ employeeId: z.number() }))
      .query(async ({ input, ctx }: any) => {
        const detail = await getEmployeeDetail(input.employeeId);

        if (!detail) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Employee not found",
          });
        }

        return {
          success: true,
          employeeId: input.employeeId,
          trend: detail.fwiTrend,
          currentScore: detail.fwiScore,
          improvement: detail.fwiTrend[detail.fwiTrend.length - 1].score - detail.fwiTrend[0].score,
        };
      }),

    // Get employee recommendations
    getRecommendations: protectedProcedure
      .input(z.object({ employeeId: z.number() }))
      .query(async ({ input, ctx }: any) => {
        const detail = await getEmployeeDetail(input.employeeId);

        if (!detail) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Employee not found",
          });
        }

        return {
          success: true,
          employeeId: input.employeeId,
          recommendations: detail.recommendations,
          totalPotentialSavings: detail.recommendations.reduce(
            (sum, r) => sum + r.estimatedSavings,
            0
          ),
        };
      }),

    // Get employee interventions
    getInterventions: protectedProcedure
      .input(z.object({ employeeId: z.number() }))
      .query(async ({ input, ctx }: any) => {
        const detail = await getEmployeeDetail(input.employeeId);

        if (!detail) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Employee not found",
          });
        }

        return {
          success: true,
          employeeId: input.employeeId,
          interventions: detail.interventions,
          total: detail.interventions.length,
        };
      }),
  }),

  // Analytics and reporting
  analytics: router({
    // Get team analytics
    getTeamAnalytics: protectedProcedure.query(async ({ ctx }: any) => {
      const teamMembers = await getTeamMembers(ctx.user.id);
      const interventions = await getTeamInterventions(ctx.user.id);
      const performance = await getTeamPerformance(ctx.user.id);

      return {
        success: true,
        teamSize: teamMembers.length,
        riskDistribution: {
          critical: teamMembers.filter((m) => m.riskLevel === "critical").length,
          high: teamMembers.filter((m) => m.riskLevel === "high").length,
          medium: teamMembers.filter((m) => m.riskLevel === "medium").length,
          low: teamMembers.filter((m) => m.riskLevel === "low").length,
        },
        interventionMetrics: {
          total: interventions.length,
          active: interventions.filter((i) => i.status === "active").length,
          completed: interventions.filter((i) => i.status === "completed").length,
          abandoned: interventions.filter((i) => i.status === "abandoned").length,
        },
        performanceMetrics: {
          averageFWI: performance.averageFWI,
          averageEngagement: performance.averageEngagement,
          totalROI: performance.totalROI,
          interventionsCompleted: performance.interventionsCompleted,
        },
      };
    }),

    // Get intervention ROI analysis
    getROIAnalysis: protectedProcedure.query(async ({ ctx }: any) => {
      const interventions = await getTeamInterventions(ctx.user.id);

      const byType = interventions.reduce(
        (acc, i) => {
          if (!acc[i.type]) {
            acc[i.type] = { count: 0, totalROI: 0, avgROI: 0 };
          }
          acc[i.type].count++;
          acc[i.type].totalROI += i.estimatedROI;
          acc[i.type].avgROI = acc[i.type].totalROI / acc[i.type].count;
          return acc;
        },
        {} as Record<string, { count: number; totalROI: number; avgROI: number }>
      );

      return {
        success: true,
        byType,
        totalEstimatedROI: interventions.reduce((sum, i) => sum + i.estimatedROI, 0),
        averageROIPerIntervention:
          interventions.length > 0
            ? interventions.reduce((sum, i) => sum + i.estimatedROI, 0) / interventions.length
            : 0,
      };
    }),
  }),
});
