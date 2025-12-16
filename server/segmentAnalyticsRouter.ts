/**
 * Segment Analytics Router
 * 
 * tRPC endpoints for segment analytics and reporting
 */

import { router, adminProcedure } from './_core/trpc';
import { z } from 'zod';
import {
  recordSegmentAnalytics,
  getSegmentAnalytics,
  calculateChurnAnalysis,
  calculateROIAnalysis,
  getSegmentTrends,
  compareSegments,
  getInterventionPerformance,
  getSegmentHealthScore,
  type SegmentAnalytics,
} from './services/segmentAnalyticsService';

export const segmentAnalyticsRouter = router({
  /**
   * Record daily segment analytics
   */
  recordAnalytics: adminProcedure
    .input(
      z.object({
        segment: z.string(),
        date: z.date(),
        employeeCount: z.number(),
        avgWellnessScore: z.number(),
        avgFwiScore: z.number(),
        avgEngagementScore: z.number(),
        churnRate: z.number(),
        roiEstimated: z.number(),
        roiActual: z.number(),
        interventionCount: z.number(),
        completedInterventionCount: z.number(),
        avgInterventionDuration: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const analytics: SegmentAnalytics = {
        segment: input.segment,
        date: input.date,
        employeeCount: input.employeeCount,
        avgWellnessScore: input.avgWellnessScore,
        avgFwiScore: input.avgFwiScore,
        avgEngagementScore: input.avgEngagementScore,
        churnRate: input.churnRate,
        roiEstimated: input.roiEstimated,
        roiActual: input.roiActual,
        interventionCount: input.interventionCount,
        completedInterventionCount: input.completedInterventionCount,
        avgInterventionDuration: input.avgInterventionDuration,
      };

      await recordSegmentAnalytics(analytics);
      return { success: true, message: 'Analytics recorded' };
    }),

  /**
   * Get segment analytics for date range
   */
  getAnalytics: adminProcedure
    .input(
      z.object({
        segment: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ input }) => {
      const analytics = await getSegmentAnalytics(input.segment, input.startDate, input.endDate);
      return { analytics, count: analytics.length };
    }),

  /**
   * Get churn analysis for segment
   */
  getChurnAnalysis: adminProcedure
    .input(
      z.object({
        segment: z.string(),
        days: z.number().default(30),
      })
    )
    .query(async ({ input }) => {
      const analysis = await calculateChurnAnalysis(input.segment, input.days);
      return analysis;
    }),

  /**
   * Get ROI analysis for segment
   */
  getROIAnalysis: adminProcedure
    .input(
      z.object({
        segment: z.string(),
        days: z.number().default(180),
      })
    )
    .query(async ({ input }) => {
      const analysis = await calculateROIAnalysis(input.segment, input.days);
      return analysis;
    }),

  /**
   * Get segment trends over time
   */
  getTrends: adminProcedure
    .input(
      z.object({
        segment: z.string(),
        days: z.number().default(90),
      })
    )
    .query(async ({ input }) => {
      const trends = await getSegmentTrends(input.segment, input.days);
      return trends;
    }),

  /**
   * Compare all segments performance
   */
  compareSegments: adminProcedure
    .input(z.object({ date: z.date().optional() }))
    .query(async ({ input }) => {
      const date = input.date || new Date();
      const comparison = await compareSegments(date);
      return {
        date,
        segments: comparison,
        topPerformer: comparison[0],
        bottomPerformer: comparison[comparison.length - 1],
      };
    }),

  /**
   * Get intervention performance by type
   */
  getInterventionPerformance: adminProcedure
    .input(
      z.object({
        segment: z.string(),
        days: z.number().default(90),
      })
    )
    .query(async ({ input }) => {
      const performance = await getInterventionPerformance(input.segment, input.days);
      return {
        segment: input.segment,
        interventions: performance,
        totalInterventions: performance.reduce((sum, i) => sum + i.count, 0),
        avgCompletionRate:
          Math.round(
            (performance.reduce((sum, i) => sum + i.completionRate, 0) / performance.length) * 10
          ) / 10,
      };
    }),

  /**
   * Get segment health score
   */
  getHealthScore: adminProcedure
    .input(z.object({ segment: z.string() }))
    .query(async ({ input }) => {
      const healthScore = await getSegmentHealthScore(input.segment);
      return healthScore;
    }),

  /**
   * Get all segments health scores
   */
  getAllHealthScores: adminProcedure.query(async () => {
    const segments = [
      'financial_champions',
      'rising_stars',
      'steady_performers',
      'at_risk',
      'crisis_intervention',
    ];

    const healthScores = await Promise.all(
      segments.map(async (segment) => ({
        segment,
        ...await getSegmentHealthScore(segment),
      }))
    );

    return {
      segments: healthScores,
      overallHealth:
        Math.round(
          (healthScores.reduce((sum, s) => sum + s.overallScore, 0) / healthScores.length) * 10
        ) / 10,
    };
  }),

  /**
   * Get dashboard summary
   */
  getDashboardSummary: adminProcedure.query(async () => {
    const segments = [
      'financial_champions',
      'rising_stars',
      'steady_performers',
      'at_risk',
      'crisis_intervention',
    ];

    const summaries = await Promise.all(
      segments.map(async (segment) => {
        const churn = await calculateChurnAnalysis(segment, 30);
        const roi = await calculateROIAnalysis(segment, 180);
        const health = await getSegmentHealthScore(segment);

        return {
          segment,
          employeeCount: churn.totalEmployees,
          churnRate: churn.churnRate,
          roiAccuracy: roi.accuracy,
          healthStatus: health.status,
          healthScore: health.overallScore,
        };
      })
    );

    return {
      timestamp: new Date(),
      segments: summaries,
      totalEmployees: summaries.reduce((sum, s) => sum + s.employeeCount, 0),
      avgChurnRate:
        Math.round((summaries.reduce((sum, s) => sum + s.churnRate, 0) / summaries.length) * 10) /
        10,
      avgROIAccuracy:
        Math.round(
          (summaries.reduce((sum, s) => sum + s.roiAccuracy, 0) / summaries.length) * 10
        ) / 10,
    };
  }),
});
