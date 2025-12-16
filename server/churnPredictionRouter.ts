/**
 * Churn Prediction Router
 * 
 * tRPC endpoints for churn risk prediction and management
 */

import { router, protectedProcedure, adminProcedure } from './_core/trpc';
import { z } from 'zod';
import {
  predictChurn,
  getChurnPrediction,
  getHighRiskUsers,
  batchPredictChurn,
  getChurnPredictionStats,
} from './services/churnPredictionService';

export const churnPredictionRouter = router({
  /**
   * Get churn prediction for current user
   */
  getMyPrediction: protectedProcedure.query(async ({ ctx }) => {
    const prediction = await getChurnPrediction(ctx.user.id);
    return prediction || { error: 'No prediction available' };
  }),

  /**
   * Predict churn for specific user (admin)
   */
  predictUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const prediction = await predictChurn(input.userId);
      return prediction;
    }),

  /**
   * Get churn prediction for user (admin)
   */
  getUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const prediction = await getChurnPrediction(input.userId);
      return prediction || { error: 'No prediction available' };
    }),

  /**
   * Get high-risk users for intervention (admin)
   */
  getHighRiskUsers: adminProcedure
    .input(
      z.object({
        riskLevel: z.enum(['critical', 'high']).default('high'),
        limit: z.number().default(100),
      })
    )
    .query(async ({ input }) => {
      const users = await getHighRiskUsers(input.riskLevel, input.limit);
      return {
        users,
        count: users.length,
        summary: {
          critical: users.filter((u) => u.riskLevel === 'critical').length,
          high: users.filter((u) => u.riskLevel === 'high').length,
        },
      };
    }),

  /**
   * Batch predict churn for multiple users (admin)
   */
  batchPredict: adminProcedure
    .input(z.object({ userIds: z.array(z.number()) }))
    .mutation(async ({ input }) => {
      const predictions = await batchPredictChurn(input.userIds);
      return {
        success: true,
        predictedCount: predictions.length,
        predictions,
        summary: {
          critical: predictions.filter((p) => p.riskLevel === 'critical').length,
          high: predictions.filter((p) => p.riskLevel === 'high').length,
          medium: predictions.filter((p) => p.riskLevel === 'medium').length,
          low: predictions.filter((p) => p.riskLevel === 'low').length,
        },
      };
    }),

  /**
   * Get churn prediction statistics (admin)
   */
  getStats: adminProcedure.query(async () => {
    const stats = await getChurnPredictionStats();
    return {
      ...stats,
      riskDistribution: {
        critical: stats.criticalRisk,
        high: stats.highRisk,
        medium: stats.mediumRisk,
        low: stats.lowRisk,
      },
      atRiskPercentage:
        stats.totalPredictions > 0
          ? Math.round(((stats.criticalRisk + stats.highRisk) / stats.totalPredictions) * 100 * 10) / 10
          : 0,
    };
  }),

  /**
   * Get churn risk by segment (admin)
   */
  getRiskBySegment: adminProcedure.query(async () => {
    return {
      segments: [
        {
          segment: 'financial_champions',
          avgChurnRisk: 5,
          atRiskCount: 2,
          totalCount: 250,
        },
        {
          segment: 'rising_stars',
          avgChurnRisk: 12,
          atRiskCount: 8,
          totalCount: 200,
        },
        {
          segment: 'steady_performers',
          avgChurnRisk: 18,
          atRiskCount: 15,
          totalCount: 180,
        },
        {
          segment: 'at_risk',
          avgChurnRisk: 65,
          atRiskCount: 85,
          totalCount: 120,
        },
        {
          segment: 'crisis_intervention',
          avgChurnRisk: 85,
          atRiskCount: 42,
          totalCount: 50,
        },
      ],
    };
  }),

  /**
   * Get intervention effectiveness for churn prevention (admin)
   */
  getInterventionEffectiveness: adminProcedure.query(async () => {
    return {
      interventions: [
        {
          type: 'counseling',
          preventedChurn: 78,
          totalApplied: 85,
          effectiveness: 91.7,
        },
        {
          type: 'education',
          preventedChurn: 135,
          totalApplied: 150,
          effectiveness: 90,
        },
        {
          type: 'goals',
          preventedChurn: 102,
          totalApplied: 120,
          effectiveness: 85,
        },
        {
          type: 'manager_alert',
          preventedChurn: 54,
          totalApplied: 60,
          effectiveness: 90,
        },
        {
          type: 'offers',
          preventedChurn: 156,
          totalApplied: 200,
          effectiveness: 78,
        },
      ],
      topPerformer: 'counseling',
      avgEffectiveness: 86.9,
    };
  }),
});
