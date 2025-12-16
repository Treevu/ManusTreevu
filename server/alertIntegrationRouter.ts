import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  integrateAlertWithEcosystem,
  processDepartmentAlerts,
  logAlertAction,
} from "./services/alertIntegrationService";

export const alertIntegrationRouter = router({
  // Integrate a single alert with ecosystem
  processAlert: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        alertType: z.enum([
          "low_fwi",
          "high_spending",
          "frequent_ewa",
          "fwi_improvement",
          "tier_upgrade",
        ]),
        alertData: z.record(z.string(), z.any()),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      // Only admins can process alerts
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      await integrateAlertWithEcosystem(
        input.userId,
        input.alertType,
        input.alertData
      );

      await logAlertAction(
        input.userId,
        input.alertType,
        "ecosystem_integration",
        "success"
      );

      return { success: true, message: "Alert processed successfully" };
    }),

  // Process multiple alerts for a department
  processDepartmentAlerts: protectedProcedure
    .input(
      z.object({
        departmentId: z.number(),
        alerts: z.array(
          z.object({
            userId: z.number(),
            alertType: z.enum([
              "low_fwi",
              "high_spending",
              "frequent_ewa",
              "fwi_improvement",
              "tier_upgrade",
            ]),
            alertData: z.record(z.string(), z.any()),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      // Only admins can process alerts
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const results = await processDepartmentAlerts(
        input.departmentId,
        input.alerts
      );

      return {
        success: true,
        processed: results.filter((r: any) => r.status === "processed").length,
        failed: results.filter((r: any) => r.status === "failed").length,
        results,
      };
    }),

  // Get alert integration status
  getIntegrationStatus: protectedProcedure.query(async ({ ctx }: any) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Return mock status data
    return {
      enabled: true,
      lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      alertsProcessed: 1245,
      actionsTriggered: 3890,
      successRate: 98.7,
      averageProcessingTime: 245, // ms
      integrations: {
        rewards: { enabled: true, lastUpdate: new Date(Date.now() - 10 * 60 * 1000) },
        ewaRates: { enabled: true, lastUpdate: new Date(Date.now() - 15 * 60 * 1000) },
        recommendations: { enabled: true, lastUpdate: new Date(Date.now() - 20 * 60 * 1000) },
        interventions: { enabled: true, lastUpdate: new Date(Date.now() - 25 * 60 * 1000) },
      },
    };
  }),

  // Enable/disable alert integration
  toggleIntegration: protectedProcedure
    .input(
      z.object({
        enabled: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      // In a real app, you'd save this setting to the database
      return {
        success: true,
        message: `Alert integration ${input.enabled ? "enabled" : "disabled"}`,
      };
    }),

  // Get integration logs
  getIntegrationLogs: protectedProcedure
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

      // Return mock log data
      return {
        logs: [
          {
            id: 1,
            timestamp: new Date(Date.now() - 1 * 60 * 1000),
            userId: 123,
            alertType: "low_fwi",
            action: "triggered_intervention",
            status: "success",
          },
          {
            id: 2,
            timestamp: new Date(Date.now() - 2 * 60 * 1000),
            userId: 456,
            alertType: "high_spending",
            action: "sent_recommendation",
            status: "success",
          },
          {
            id: 3,
            timestamp: new Date(Date.now() - 3 * 60 * 1000),
            userId: 789,
            alertType: "fwi_improvement",
            action: "reduced_ewa_rate",
            status: "success",
          },
        ],
        total: 1245,
        limit: input.limit,
        offset: input.offset,
      };
    }),
});
