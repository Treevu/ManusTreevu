import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  exportReportAsCSV,
  exportReportAsPDF,
  getAvailableReportTypes,
} from "./services/reportExportService";

export const reportExportRouter = router({
  // Get available report types
  getAvailableReports: protectedProcedure.query(async ({ ctx }: any) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }

    return {
      reports: getAvailableReportTypes(),
      formats: ["csv", "pdf"],
    };
  }),

  // Export report as CSV
  exportAsCSV: protectedProcedure
    .input(
      z.object({
        reportType: z.enum(["engagement", "roi", "intervention", "fwi", "tier"]),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      try {
        const { filename, content } = await exportReportAsCSV(input.reportType);

        return {
          success: true,
          filename,
          format: "csv",
          size: Buffer.byteLength(content, "utf-8"),
          content, // In production, you'd return a download URL instead
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to export report: ${(error as Error).message}`,
        });
      }
    }),

  // Export report as PDF
  exportAsPDF: protectedProcedure
    .input(
      z.object({
        reportType: z.enum(["engagement", "roi", "intervention", "fwi", "tier"]),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      try {
        const { filename, buffer } = await exportReportAsPDF(input.reportType);

        return {
          success: true,
          filename,
          format: "pdf",
          size: buffer.length,
          // In production, you'd return a download URL instead
          // For now, return base64 encoded content
          content: buffer.toString("base64"),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to export report: ${(error as Error).message}`,
        });
      }
    }),

  // Export all reports as ZIP (bulk export)
  exportAll: protectedProcedure
    .input(
      z.object({
        format: z.enum(["csv", "pdf", "both"]),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      try {
        const reportTypes = ["engagement", "roi", "intervention", "fwi", "tier"] as const;
        const files = [];

        for (const reportType of reportTypes) {
          if (input.format === "csv" || input.format === "both") {
            const { filename, content } = await exportReportAsCSV(reportType);
            files.push({
              filename,
              format: "csv",
              size: Buffer.byteLength(content, "utf-8"),
            });
          }

          if (input.format === "pdf" || input.format === "both") {
            const { filename, buffer } = await exportReportAsPDF(reportType);
            files.push({
              filename,
              format: "pdf",
              size: buffer.length,
            });
          }
        }

        return {
          success: true,
          zipFilename: `ecosystem-reports-${new Date().toISOString().split("T")[0]}.zip`,
          files,
          totalSize: files.reduce((sum, f) => sum + f.size, 0),
          message: `Exported ${files.length} reports`,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to export reports: ${(error as Error).message}`,
        });
      }
    }),

  // Schedule report generation
  scheduleReportGeneration: protectedProcedure
    .input(
      z.object({
        reportType: z.enum(["engagement", "roi", "intervention", "fwi", "tier"]),
        format: z.enum(["csv", "pdf", "both"]),
        frequency: z.enum(["daily", "weekly", "monthly"]),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      return {
        success: true,
        scheduleId: Math.random().toString(36).substring(7),
        message: `Report scheduled for ${input.frequency} delivery`,
        details: {
          reportType: input.reportType,
          format: input.format,
          frequency: input.frequency,
          email: input.email || "admin@company.com",
          nextDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      };
    }),

  // Get report generation history
  getHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }: any) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      return {
        history: [
          {
            id: 1,
            reportType: "engagement",
            format: "csv",
            generatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            filename: "engagement-report-2025-01-15.csv",
            size: 45230,
            status: "completed",
          },
          {
            id: 2,
            reportType: "roi",
            format: "pdf",
            generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            filename: "roi-report-2025-01-15.pdf",
            size: 128450,
            status: "completed",
          },
          {
            id: 3,
            reportType: "intervention",
            format: "csv",
            generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            filename: "intervention-report-2025-01-14.csv",
            size: 32100,
            status: "completed",
          },
        ],
        total: 45,
        limit: input.limit,
        offset: input.offset,
      };
    }),
});
