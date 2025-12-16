/**
 * HR Integration & Psychological Pricing Router
 * 
 * tRPC endpoints for HR integrations and psychological pricing strategies
 */

import { router, adminProcedure, protectedProcedure } from './_core/trpc';
import { z } from 'zod';
import {
  configureHRIntegration,
  getHRIntegrationStatus,
  syncWorkdayEmployees,
  syncBambooHREmployees,
  createCharmPricingRule,
  createDecoyPricingRule,
  createBundlingPricingRule,
  getPricingRuleForUser,
  createABTest,
  recordABTestImpression,
  recordABTestConversion,
  getABTestResults,
  getAllPricingRules,
  getAllABTests,
} from './services/hrPricingService';

export const hrPricingRouter = router({
  // ============ HR INTEGRATION ENDPOINTS ============

  /**
   * Configure Workday integration
   */
  configureWorkday: adminProcedure
    .input(
      z.object({
        apiKey: z.string(),
        apiSecret: z.string(),
        webhookUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await configureHRIntegration('workday', input.apiKey, input.apiSecret, input.webhookUrl);
      return { success: true, message: 'Workday integration configured' };
    }),

  /**
   * Configure BambooHR integration
   */
  configureBambooHR: adminProcedure
    .input(
      z.object({
        apiKey: z.string(),
        apiSecret: z.string(),
        webhookUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await configureHRIntegration('bamboohr', input.apiKey, input.apiSecret, input.webhookUrl);
      return { success: true, message: 'BambooHR integration configured' };
    }),

  /**
   * Get HR integration status
   */
  getIntegrationStatus: adminProcedure
    .input(z.object({ integrationType: z.enum(['workday', 'bamboohr']) }))
    .query(async ({ input }) => {
      const status = await getHRIntegrationStatus(input.integrationType);
      return status || { error: 'Integration not configured' };
    }),

  /**
   * Sync Workday employees
   */
  syncWorkday: adminProcedure.mutation(async () => {
    const result = await syncWorkdayEmployees();
    return { success: true, ...result };
  }),

  /**
   * Sync BambooHR employees
   */
  syncBambooHR: adminProcedure.mutation(async () => {
    const result = await syncBambooHREmployees();
    return { success: true, ...result };
  }),

  // ============ PSYCHOLOGICAL PRICING ENDPOINTS ============

  /**
   * Create charm pricing rule
   */
  createCharmPricing: adminProcedure
    .input(
      z.object({
        segment: z.string(),
        basePrice: z.number(),
        charmPrice: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const rule = await createCharmPricingRule(input.segment, input.basePrice, input.charmPrice);
      return { success: true, rule };
    }),

  /**
   * Create decoy pricing rule
   */
  createDecoyPricing: adminProcedure
    .input(
      z.object({
        segment: z.string(),
        standardPrice: z.number(),
        premiumPrice: z.number(),
        decoyPrice: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const rule = await createDecoyPricingRule(
        input.segment,
        input.standardPrice,
        input.premiumPrice,
        input.decoyPrice
      );
      return { success: true, rule };
    }),

  /**
   * Create bundling pricing rule
   */
  createBundlingPricing: adminProcedure
    .input(
      z.object({
        segment: z.string(),
        individualPrice: z.number(),
        bundlePrice: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const rule = await createBundlingPricingRule(
        input.segment,
        input.individualPrice,
        input.bundlePrice
      );
      return { success: true, rule };
    }),

  /**
   * Get pricing rule for user
   */
  getPricingRule: protectedProcedure
    .input(
      z.object({
        segment: z.string(),
        fwiScore: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const rule = await getPricingRuleForUser(ctx.user.id, input.segment, input.fwiScore);
      return rule || { message: 'No pricing rule applicable' };
    }),

  /**
   * Get all pricing rules
   */
  getAllRules: adminProcedure.query(async () => {
    const rules = await getAllPricingRules();
    return {
      rules,
      count: rules.length,
      byType: {
        charm: rules.filter((r) => r.ruleType === 'charm').length,
        decoy: rules.filter((r) => r.ruleType === 'decoy').length,
        bundling: rules.filter((r) => r.ruleType === 'bundling').length,
        tiered: rules.filter((r) => r.ruleType === 'tiered').length,
      },
    };
  }),

  // ============ A/B TESTING ENDPOINTS ============

  /**
   * Create A/B test
   */
  createTest: adminProcedure
    .input(
      z.object({
        testName: z.string(),
        controlPrice: z.number(),
        variantPrice: z.number(),
        durationDays: z.number().default(14),
      })
    )
    .mutation(async ({ input }) => {
      const test = await createABTest(
        input.testName,
        input.controlPrice,
        input.variantPrice,
        input.durationDays
      );
      return { success: true, test };
    }),

  /**
   * Record test impression
   */
  recordImpression: protectedProcedure
    .input(
      z.object({
        testName: z.string(),
        variant: z.enum(['control', 'variant']),
      })
    )
    .mutation(async ({ input }) => {
      await recordABTestImpression(input.testName, input.variant);
      return { success: true };
    }),

  /**
   * Record test conversion
   */
  recordConversion: protectedProcedure
    .input(
      z.object({
        testName: z.string(),
        variant: z.enum(['control', 'variant']),
      })
    )
    .mutation(async ({ input }) => {
      await recordABTestConversion(input.testName, input.variant);
      return { success: true };
    }),

  /**
   * Get A/B test results
   */
  getTestResults: adminProcedure
    .input(z.object({ testName: z.string() }))
    .query(async ({ input }) => {
      const results = await getABTestResults(input.testName);
      if (!results) return { error: 'Test not found' };

      const controlRate = results.controlImpressions > 0 
        ? (results.controlConversions / results.controlImpressions * 100)
        : 0;
      const variantRate = results.variantImpressions > 0
        ? (results.variantConversions / results.variantImpressions * 100)
        : 0;

      const improvement = variantRate > 0 && controlRate > 0
        ? (((variantRate - controlRate) / controlRate) * 100).toFixed(2)
        : '0';

      return {
        ...results,
        controlConversionRate: controlRate.toFixed(2),
        variantConversionRate: variantRate.toFixed(2),
        improvement,
      };
    }),

  /**
   * Get all A/B tests
   */
  getAllTests: adminProcedure.query(async () => {
    const tests = await getAllABTests();
    return {
      tests,
      count: tests.length,
      active: tests.filter((t) => !t.winner).length,
      completed: tests.filter((t) => t.winner).length,
    };
  }),

  /**
   * Get pricing dashboard summary
   */
  getDashboardSummary: adminProcedure.query(async () => {
    const rules = await getAllPricingRules();
    const tests = await getAllABTests();

    return {
      pricingRules: {
        total: rules.length,
        byType: {
          charm: rules.filter((r) => r.ruleType === 'charm').length,
          decoy: rules.filter((r) => r.ruleType === 'decoy').length,
          bundling: rules.filter((r) => r.ruleType === 'bundling').length,
        },
        avgDiscount: Math.round(
          (rules.reduce((sum, r) => sum + r.discountPercentage, 0) / rules.length) * 100
        ) / 100,
      },
      abTests: {
        total: tests.length,
        active: tests.filter((t) => !t.winner).length,
        completed: tests.filter((t) => t.winner).length,
        totalImpressions: tests.reduce((sum, t) => sum + t.controlImpressions + t.variantImpressions, 0),
        totalConversions: tests.reduce((sum, t) => sum + t.controlConversions + t.variantConversions, 0),
      },
    };
  }),
});
