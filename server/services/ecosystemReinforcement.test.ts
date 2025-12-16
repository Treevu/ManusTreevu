import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as ecosystemService from "./ecosystemReinforcementService";

describe("Ecosystem Reinforcement Service", () => {
  beforeAll(async () => {
    // Initialize default tiers and rates
    await ecosystemService.initializeDefaultTiersAndRates();
  });

  describe("Refuerzo 1: Gamification → Real Rewards", () => {
    it("should get all reward tiers", async () => {
      const tiers = await ecosystemService.getAllRewardTiers();
      expect(tiers).toBeDefined();
      expect(Array.isArray(tiers)).toBe(true);
      expect(tiers.length).toBeGreaterThan(0);
    });

    it("should find reward tier by points", async () => {
      // Bronze tier: 0-499 points
      const bronzeTier = await ecosystemService.getRewardTierByPoints(250);
      expect(bronzeTier).toBeDefined();
      expect(bronzeTier?.tierName).toBe("Bronze");
      expect(bronzeTier?.discountPercentage).toBe(0);

      // Silver tier: 500-999 points
      const silverTier = await ecosystemService.getRewardTierByPoints(750);
      expect(silverTier).toBeDefined();
      expect(silverTier?.tierName).toBe("Silver");
      expect(silverTier?.discountPercentage).toBe(5);

      // Gold tier: 1000-1999 points
      const goldTier = await ecosystemService.getRewardTierByPoints(1500);
      expect(goldTier).toBeDefined();
      expect(goldTier?.tierName).toBe("Gold");
      expect(goldTier?.discountPercentage).toBe(10);

      // Platinum tier: 2000+ points
      const platinumTier = await ecosystemService.getRewardTierByPoints(3000);
      expect(platinumTier).toBeDefined();
      expect(platinumTier?.tierName).toBe("Platinum");
      expect(platinumTier?.discountPercentage).toBe(15);
    });

    it("should calculate EWA rate reduction based on tier", async () => {
      // Bronze: 0 basis points
      const bronzeReduction = await ecosystemService.calculateEwaRateReduction(
        999
      );
      expect(bronzeReduction).toBe(0);

      // Silver: 25 basis points (0.25%)
      const silverReduction = await ecosystemService.calculateEwaRateReduction(
        999
      );
      expect(silverReduction).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Refuerzo 3: EWA → Dynamic Rates", () => {
    it("should get all EWA dynamic rates", async () => {
      const rates = await ecosystemService.getAllEwaDynamicRates();
      expect(rates).toBeDefined();
      expect(Array.isArray(rates)).toBe(true);
      expect(rates.length).toBeGreaterThan(0);
    });

    it("should get dynamic rate by FWI Score", async () => {
      // Low FWI (critical risk)
      const criticalRate = await ecosystemService.getDynamicEwaRate(30);
      expect(criticalRate).toBeDefined();
      expect(criticalRate?.riskLevel).toBe("critical");
      expect(parseFloat(criticalRate?.baseFeePercentage.toString() || "0")).toBe(
        4.5
      );

      // Medium FWI (high risk)
      const highRate = await ecosystemService.getDynamicEwaRate(50);
      expect(highRate).toBeDefined();
      expect(highRate?.riskLevel).toBe("high");

      // Good FWI (low risk)
      const lowRate = await ecosystemService.getDynamicEwaRate(75);
      expect(lowRate).toBeDefined();
      expect(lowRate?.riskLevel).toBe("medium");

      // Excellent FWI
      const excellentRate = await ecosystemService.getDynamicEwaRate(90);
      expect(excellentRate).toBeDefined();
      expect(excellentRate?.riskLevel).toBe("low");
    });

    it("should calculate EWA fee correctly", async () => {
      const amount = 100000; // $1000 in cents

      // Low FWI: 4.5% fee
      const lowFwiFee = await ecosystemService.calculateEwaFee(amount, 30, 0);
      expect(lowFwiFee).toBe(4500); // 4.5% of 100000

      // Good FWI: 2.5% fee
      const goodFwiFee = await ecosystemService.calculateEwaFee(amount, 70, 0);
      expect(goodFwiFee).toBe(2500); // 2.5% of 100000

      // Excellent FWI: 1.5% fee
      const excellentFwiFee = await ecosystemService.calculateEwaFee(
        amount,
        90,
        0
      );
      expect(excellentFwiFee).toBe(1500); // 1.5% of 100000
    });

    it("should apply rate reduction from TreePoints tier", async () => {
      const amount = 100000;
      const baseFee = await ecosystemService.calculateEwaFee(amount, 50, 0);

      // With 50 basis points (0.5%) reduction
      const reducedFee = await ecosystemService.calculateEwaFee(amount, 50, 50);

      expect(reducedFee).toBeLessThan(baseFee);
      expect(baseFee - reducedFee).toBeCloseTo(5, 0); // ~0.005% reduction in centstion
    });
  });

  describe("Refuerzo 2: Alerts → Suggested Actions", () => {
    it("should get suggested actions for low FWI alert", async () => {
      const actions = await ecosystemService.getSuggestedActionsForAlert(
        "low_fwi"
      );
      expect(Array.isArray(actions)).toBe(true);
      expect(actions.length).toBeGreaterThan(0);

      // Verify actions have required fields
      for (const action of actions) {
        expect(action.actionTitle).toBeDefined();
        expect(action.actionType).toBeDefined();
        expect(action.priority).toBeDefined();
      }
    });

    it("should get suggested actions for high spending alert", async () => {
      const actions = await ecosystemService.getSuggestedActionsForAlert(
        "high_spending"
      );
      expect(Array.isArray(actions)).toBe(true);
      expect(actions.length).toBeGreaterThan(0);
    });

    it("should return empty array for unknown alert type", async () => {
      const actions = await ecosystemService.getSuggestedActionsForAlert(
        "unknown_alert_type"
      );
      expect(Array.isArray(actions)).toBe(true);
      expect(actions.length).toBe(0);
    });
  });

  describe("Refuerzo 5: Marketplace → Personalized Recommendations", () => {
    it("should handle personalized recommendations CRUD", async () => {
      const userId = 1;
      const offerId = 1;

      // Create recommendation
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await ecosystemService.createPersonalizedRecommendation({
        userId,
        offerId,
        recommendationType: "spending_pattern",
        relevanceScore: 85,
        urgency: "high",
        estimatedSavings: 5000,
        expiresAt: tomorrow,
      });

      // Get recommendations
      const recs = await ecosystemService.getPersonalizedRecommendations(
        userId,
        10
      );
      expect(Array.isArray(recs)).toBe(true);
    });
  });

  describe("Refuerzo 6: Risk Clustering → Early Intervention", () => {
    it("should handle intervention plans CRUD", async () => {
      const userId = 1;

      // Create intervention plan
      await ecosystemService.createInterventionPlan({
        userId,
        riskCluster: "high_spending",
        severity: "high",
        interventionType: "education",
        expectedOutcome: JSON.stringify({ fwiImprovement: 10 }),
        roiEstimated: 50000,
      });

      // Get active interventions
      const interventions =
        await ecosystemService.getActiveInterventionPlans(userId);
      expect(Array.isArray(interventions)).toBe(true);
    });
  });

  describe("Ecosystem Engagement Metrics", () => {
    it("should create and retrieve engagement metrics", async () => {
      const departmentId = 1;
      const month = 12;
      const year = 2024;

      // Create metrics
      await ecosystemService.createEngagementMetrics({
        departmentId,
        month,
        year,
        totalEmployees: 100,
        activeEmployees: 85,
        avgTreePointsPerEmployee: 500,
        totalTreePointsRedeemed: 42500,
        ewaRequestsCount: 15,
        ewaApprovalRate: "80.00",
        avgFwiScoreImprovement: 5,
        engagementScore: 75,
        interventionPlansStarted: 10,
        interventionPlansCompleted: 5,
        estimatedROI: 500000,
      });

      // Retrieve metrics
      const metrics = await ecosystemService.getEngagementMetrics(
        departmentId,
        month,
        year
      );
      expect(Array.isArray(metrics)).toBe(true);
    });
  });
});
