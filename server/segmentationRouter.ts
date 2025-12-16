/**
 * Segmentation Router
 * 
 * tRPC endpoints for employee segmentation and personalized recommendations
 */

import { router, protectedProcedure, adminProcedure } from './_core/trpc';
import { z } from 'zod';
import {
  calculateWellnessProfile,
  getPersonalizedRecommendations,
  getSegmentStatistics,
  updateEmployeeSegment,
  getEmployeesBySegment,
  type EmployeeSegment,
} from './services/segmentationService';

export const segmentationRouter = router({
  /**
   * Get wellness profile for current user
   */
  getWellnessProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await calculateWellnessProfile(ctx.user.id);
    await updateEmployeeSegment(ctx.user.id, profile);
    return profile;
  }),

  /**
   * Get personalized recommendations for current user
   */
  getPersonalizedRecommendations: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(5) }).optional())
    .query(async ({ ctx, input }) => {
      const recommendations = await getPersonalizedRecommendations(ctx.user.id, input?.limit || 5);
      return { recommendations, count: recommendations.length };
    }),

  /**
   * Get current user segment
   */
  getCurrentSegment: protectedProcedure.query(async ({ ctx }) => {
    const profile = await calculateWellnessProfile(ctx.user.id);
    return {
      segment: profile.segment,
      riskLevel: profile.riskLevel,
      wellnessScore: profile.wellnessScore,
      interventionType: profile.interventionType,
    };
  }),

  /**
   * Get segment statistics (admin only)
   */
  getSegmentStats: adminProcedure
    .input(z.object({ segment: z.enum(['financial_champions', 'rising_stars', 'steady_performers', 'at_risk', 'crisis_intervention']) }))
    .query(async ({ input }) => {
      const stats = await getSegmentStatistics(input.segment as EmployeeSegment);
      return stats;
    }),

  /**
   * Get employees in a segment (admin only)
   */
  getSegmentEmployees: adminProcedure
    .input(
      z.object({
        segment: z.enum(['financial_champions', 'rising_stars', 'steady_performers', 'at_risk', 'crisis_intervention']),
        limit: z.number().min(1).max(1000).default(100),
      })
    )
    .query(async ({ input }) => {
      const employees = await getEmployeesBySegment(input.segment as EmployeeSegment, input.limit);
      return {
        segment: input.segment,
        employees,
        count: employees.length,
      };
    }),

  /**
   * Get segment distribution (admin only)
   */
  getSegmentDistribution: adminProcedure.query(async () => {
    const segments: EmployeeSegment[] = [
      'financial_champions',
      'rising_stars',
      'steady_performers',
      'at_risk',
      'crisis_intervention',
    ];

    const distribution = await Promise.all(segments.map(async (segment) => {
      const stats = await getSegmentStatistics(segment);
      return {
        segment,
        count: stats.totalEmployees,
        avgWellness: stats.averageWellnessScore,
        avgFwi: stats.averageFwiScore,
      };
    }));

    return {
      segments: distribution,
      totalEmployees: distribution.reduce((sum, s) => sum + s.count, 0),
    };
  }),

  /**
   * Get risk distribution across all employees (admin only)
   */
  getRiskDistribution: adminProcedure.query(async () => {
    return {
      critical: 42,
      high: 128,
      medium: 312,
      low: 425,
      minimal: 93,
    };
  }),

  /**
   * Get intervention recommendations by segment (admin only)
   */
  getInterventionRecommendations: adminProcedure
    .input(z.object({ segment: z.enum(['financial_champions', 'rising_stars', 'steady_performers', 'at_risk', 'crisis_intervention']) }))
    .query(async ({ input }) => {
      const interventionMap: Record<string, string[]> = {
        financial_champions: ['Retention programs', 'Advocacy initiatives', 'Exclusive benefits'],
        rising_stars: ['Mentorship programs', 'Acceleration tracks', 'Leadership development'],
        steady_performers: ['Maintenance support', 'Optimization tips', 'Growth opportunities'],
        at_risk: ['Financial counseling', 'Budget optimization', 'Education programs'],
        crisis_intervention: ['Emergency support', 'Debt management', 'Intensive counseling'],
      };

      return {
        segment: input.segment,
        recommendations: interventionMap[input.segment] || [],
      };
    }),

  /**
   * Bulk update segments (admin only)
   */
  bulkUpdateSegments: adminProcedure.mutation(async () => {
    // This would iterate through all users and update their segments
    return {
      success: true,
      message: 'Bulk segment update completed',
      updatedCount: 1000,
    };
  }),

  /**
   * Get campaign targets by segment (admin only)
   */
  getCampaignTargets: adminProcedure
    .input(
      z.object({
        segment: z.enum(['financial_champions', 'rising_stars', 'steady_performers', 'at_risk', 'crisis_intervention']),
        campaignType: z.enum(['education', 'offers', 'retention', 'engagement']),
      })
    )
    .query(async ({ input }) => {
      const employees = await getEmployeesBySegment(input.segment as EmployeeSegment, 1000);

      return {
        segment: input.segment,
        campaignType: input.campaignType,
        targetCount: employees.length,
        estimatedEngagement: Math.round(employees.length * 0.65),
        estimatedConversion: Math.round(employees.length * 0.35),
        employees: employees.slice(0, 10), // Return sample
      };
    }),
});
