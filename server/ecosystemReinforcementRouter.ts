/**
 * Ecosystem Reinforcement Router
 * Exposes the 6 ecosystem reinforcements via tRPC endpoints
 */

import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import * as ecosystemService from "./services/ecosystemReinforcementService";
import * as db from "./db";
import { users } from "../drizzle/schema";

export const ecosystemReinforcementRouter = router({
  // ============================================
  // REFUERZO 1: GAMIFICATION → REAL REWARDS
  // ============================================
  rewards: router({
    getTiers: publicProcedure.query(async () => {
      return ecosystemService.getAllRewardTiers();
    }),

    getUserTier: protectedProcedure.query(async ({ ctx }) => {
      return ecosystemService.getUserRewardTier(ctx.user.id);
    }),

    getDiscount: protectedProcedure.query(async ({ ctx }) => {
      const discount = await ecosystemService.calculateUserDiscount(ctx.user.id);
      return { discountPercentage: discount };
    }),
  }),

  // ============================================
  // REFUERZO 3: EWA → DYNAMIC RATES
  // ============================================
  ewaRates: router({
    getAllRates: publicProcedure.query(async () => {
      return ecosystemService.getAllEwaDynamicRates();
    }),

    getUserRate: protectedProcedure.query(async ({ ctx }) => {
      return ecosystemService.getEwaRateForUser(ctx.user.id);
    }),

    calculateFee: protectedProcedure
      .input(z.object({ amount: z.number() }))
      .query(async ({ ctx, input }) => {
        const dbInstance = await db.getDb();
        if (!dbInstance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const userResult = await dbInstance
          .select()
          .from(users)
          .where(eq(users.id, ctx.user.id))
          .limit(1);

        if (!userResult?.[0]) throw new TRPCError({ code: "NOT_FOUND" });

        const rateReduction = await ecosystemService.calculateEwaRateReduction(
          ctx.user.id
        );
        const fee = await ecosystemService.calculateEwaFee(
          input.amount,
          userResult[0].fwiScore || 50,
          rateReduction
        );

        return {
          fee,
          feePercentage: ((fee / input.amount) * 100).toFixed(2),
        };
      }),
  }),

  // ============================================
  // REFUERZO 2: ALERTS → SUGGESTED ACTIONS
  // ============================================
  alerts: router({
    getSuggestedActions: publicProcedure
      .input(z.object({ alertType: z.string() }))
      .query(async ({ input }) => {
        return ecosystemService.getSuggestedActionsForAlert(input.alertType);
      }),
  }),

  // ============================================
  // REFUERZO 5: MARKETPLACE → AI RECOMMENDATIONS
  // ============================================
  recommendations: router({
    getPersonalized: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return ecosystemService.getPersonalizedRecommendations(
          ctx.user.id,
          input.limit || 5
        );
      }),

    markViewed: protectedProcedure
      .input(z.object({ recommendationId: z.number() }))
      .mutation(async ({ input }) => {
        await ecosystemService.markRecommendationAsViewed(
          input.recommendationId
        );
        return { success: true };
      }),

    markConverted: protectedProcedure
      .input(z.object({ recommendationId: z.number() }))
      .mutation(async ({ input }) => {
        await ecosystemService.markRecommendationAsConverted(
          input.recommendationId
        );
        return { success: true };
      }),
  }),

  // ============================================
  // REFUERZO 6: RISK CLUSTERING → EARLY INTERVENTION
  // ============================================
  interventions: router({
    getActive: protectedProcedure.query(async ({ ctx }) => {
      return ecosystemService.getActiveInterventionPlans(ctx.user.id);
    }),
  }),

  // ============================================
  // INITIALIZATION
  // ============================================
  initialize: publicProcedure.mutation(async () => {
    try {
      await ecosystemService.initializeDefaultTiersAndRates();
      return { success: true, message: "Ecosystem reinforcements initialized" };
    } catch (error) {
      console.error("[EcosystemReinforcement] Initialization failed:", error);
      return { success: false, error: String(error) };
    }
  }),
});
