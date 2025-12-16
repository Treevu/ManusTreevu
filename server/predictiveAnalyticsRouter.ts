import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  predictInterventionSuccess,
  predictChurnRisk,
  forecastDepartmentROI,
  predictEngagementTrajectory,
  getAnalyticsSummary,
} from "./services/predictiveAnalyticsService";

export const predictiveAnalyticsRouter = router({
  // Intervention success prediction
  interventionSuccess: router({
    predict: publicProcedure
      .input(
        z.object({
          interventionType: z.enum(["education", "goals", "offers", "counseling", "manager_alert"]),
          fwiScore: z.number().min(0).max(100),
          tier: z.enum(["Bronze", "Silver", "Gold", "Platinum"]),
          treePoints: z.number().min(0),
          previousInterventions: z.number().min(0),
          completionRate: z.number().min(0).max(1),
        })
      )
      .query(async ({ input }: any) => {
        const prediction = predictInterventionSuccess(input.interventionType, {
          fwiScore: input.fwiScore,
          tier: input.tier,
          treePoints: input.treePoints,
          previousInterventions: input.previousInterventions,
          completionRate: input.completionRate,
        });

        return {
          success: true,
          prediction,
        };
      }),

    // Get success rates by intervention type
    getSuccessRatesByType: publicProcedure.query(async () => {
      const successRates = {
        education: 0.72,
        goals: 0.68,
        offers: 0.85,
        counseling: 0.75,
        manager_alert: 0.62,
      };

      return {
        success: true,
        successRates,
        average: Object.values(successRates).reduce((a, b) => a + b) / Object.values(successRates).length,
      };
    }),
  }),

  // Churn risk prediction
  churnRisk: router({
    predict: publicProcedure
      .input(
        z.object({
          fwiScore: z.number().min(0).max(100),
          engagementScore: z.number().min(0).max(100),
          monthsWithCompany: z.number().min(0),
          activeInterventions: z.number().min(0),
          lastEngagementDate: z.date(),
          tier: z.enum(["Bronze", "Silver", "Gold", "Platinum"]),
          treePoints: z.number().min(0),
        })
      )
      .query(async ({ input }: any) => {
        const prediction = predictChurnRisk({
          fwiScore: input.fwiScore,
          engagementScore: input.engagementScore,
          monthsWithCompany: input.monthsWithCompany,
          activeInterventions: input.activeInterventions,
          lastEngagementDate: input.lastEngagementDate,
          tier: input.tier,
          treePoints: input.treePoints,
        });

        return {
          success: true,
          prediction,
        };
      }),

    // Get high-risk employees
    getHighRiskEmployees: protectedProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ input }: any) => {
        // Mock data - in production, query database
        const highRiskEmployees = [
          {
            employeeId: 101,
            name: "John Doe",
            churnRiskScore: 0.85,
            riskLevel: "critical",
            recommendedActions: ["Immediate manager check-in", "Personalized counseling"],
          },
          {
            employeeId: 102,
            name: "Jane Smith",
            churnRiskScore: 0.72,
            riskLevel: "high",
            recommendedActions: ["Increase engagement offers", "Peer mentoring program"],
          },
        ];

        return {
          success: true,
          employees: highRiskEmployees.slice(0, input.limit),
          total: highRiskEmployees.length,
        };
      }),
  }),

  // ROI forecasting
  roiForecast: router({
    predictByDepartment: publicProcedure
      .input(
        z.object({
          departmentId: z.string(),
          departmentName: z.string(),
          currentROI: z.number(),
          employeeCount: z.number(),
          interventionCount: z.number(),
          averageInterventionROI: z.number(),
          growthTrend: z.number(),
          interventionTypes: z.record(z.string(), z.number()),
          forecastPeriod: z.enum(["1month", "3months", "6months", "12months"]).default("6months"),
        })
      )
      .mutation(async ({ input }: any) => {
        const forecast = forecastDepartmentROI(
          {
            departmentId: input.departmentId,
            departmentName: input.departmentName,
            currentROI: input.currentROI,
            employeeCount: input.employeeCount,
            interventionCount: input.interventionCount,
            averageInterventionROI: input.averageInterventionROI,
            growthTrend: input.growthTrend,
            interventionTypes: input.interventionTypes,
          } as any,
          input.forecastPeriod as any
        );

        return {
          success: true,
          forecast,
        };
      }),

    // Get forecasts for all departments
    getAllDepartmentForecasts: protectedProcedure
      .input(z.object({ forecastPeriod: z.enum(["1month", "3months", "6months", "12months"]).default("6months") }))
      .query(async ({ input }: any) => {
        // Mock data - in production, query database
        const forecasts = [
          {
            departmentId: "sales",
            departmentName: "Sales",
            currentROI: 245000,
            forecastedROI: 281750,
            growthRate: 15.0,
            forecastPeriod: input.forecastPeriod,
          },
          {
            departmentId: "engineering",
            departmentName: "Engineering",
            currentROI: 198000,
            forecastedROI: 227700,
            growthRate: 15.0,
            forecastPeriod: input.forecastPeriod,
          },
          {
            departmentId: "hr",
            departmentName: "HR",
            currentROI: 125000,
            forecastedROI: 143750,
            growthRate: 15.0,
            forecastPeriod: input.forecastPeriod,
          },
        ];

        const totalCurrentROI = forecasts.reduce((sum, f) => sum + f.currentROI, 0);
        const totalForecastedROI = forecasts.reduce((sum, f) => sum + f.forecastedROI, 0);

        return {
          success: true,
          forecasts,
          summary: {
            totalCurrentROI,
            totalForecastedROI,
            overallGrowthRate: ((totalForecastedROI - totalCurrentROI) / totalCurrentROI) * 100,
          },
        };
      }),
  }),

  // Engagement prediction
  engagement: router({
    predictTrajectory: publicProcedure
      .input(
        z.object({
          currentEngagementScore: z.number().min(0).max(100),
          engagementTrend: z.number(),
          activeInterventions: z.number().min(0),
          completedInterventions: z.number().min(0),
          fwiScore: z.number().min(0).max(100),
          treePoints: z.number().min(0),
        })
      )
      .query(async ({ input }: any) => {
        const prediction = predictEngagementTrajectory({
          currentEngagementScore: input.currentEngagementScore,
          engagementTrend: input.engagementTrend,
          activeInterventions: input.activeInterventions,
          completedInterventions: input.completedInterventions,
          fwiScore: input.fwiScore,
          treePoints: input.treePoints,
        });

        return {
          success: true,
          prediction,
        };
      }),

    // Get engagement trends
    getTrends: protectedProcedure.query(async () => {
      // Mock data - in production, query database
      return {
        success: true,
        trends: {
          averageEngagement: 65,
          improvingCount: 450,
          stableCount: 350,
          decliningCount: 125,
          improvingPercentage: 45,
          stablePercentage: 35,
          decliningPercentage: 12.5,
        },
      };
    }),
  }),

  // Overall analytics summary
  summary: router({
    getOverallSummary: protectedProcedure.query(async () => {
      const summary = getAnalyticsSummary({
        totalEmployees: 1000,
        activeInterventions: 250,
        averageROI: 189000,
        departmentCount: 8,
      });

      return {
        success: true,
        ...summary,
        insights: [
          "Intervention success rate is above industry average (72% vs 65%)",
          "Churn risk is moderate (35%) - focus on high-risk employees",
          "ROI forecast shows 15% growth over 6 months",
          "Engagement trends are improving across all departments",
        ],
      };
    }),

    // Get predictive insights
    getInsights: protectedProcedure.query(async () => {
      return {
        success: true,
        insights: [
          {
            category: "Intervention Success",
            insight: "Offer-based interventions have 85% success rate - highest among all types",
            action: "Increase allocation to offer-based programs",
            impact: "Potential +$50K ROI",
          },
          {
            category: "Churn Risk",
            insight: "42 employees identified as high-risk for churn",
            action: "Implement immediate retention programs",
            impact: "Could retain $1.2M in productivity",
          },
          {
            category: "ROI Forecast",
            insight: "Sales department projected to grow ROI by 15% in 6 months",
            action: "Scale successful interventions in Sales",
            impact: "Expected +$36.8K ROI",
          },
          {
            category: "Engagement",
            insight: "45% of employees showing improving engagement trend",
            action: "Identify and replicate success factors",
            impact: "Sustained engagement growth",
          },
        ],
      };
    }),
  }),
});
