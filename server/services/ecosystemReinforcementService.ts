/**
 * Ecosystem Reinforcement Service
 * Implements 6 reinforcements to strengthen the Treevü ecosystem:
 * 1. Gamification → Real Rewards (discounts, reduced EWA rates)
 * 2. Alerts → Suggested Actions (contextual recommendations)
 * 3. EWA → Dynamic Rates (based on FWI Score)
 * 4. OCR → Predictive Intelligence (spending analysis + recommendations)
 * 5. Marketplace → AI Recommendations (personalized offers)
 * 6. Risk Clustering → Early Intervention (automatic recommendations)
 */

import { getDb } from "../db";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import {
  rewardTiers,
  ewaDynamicRates,
  alertSuggestedActions,
  spendingInsights,
  personalizedRecommendations,
  riskInterventionPlans,
  users,
  ewaRequests,
  marketOffers,
  ecosystemEngagementMetrics,
} from "../../drizzle/schema";

// ============================================
// REFUERZO 1: REWARD TIERS - Gamification → Real Rewards
// ============================================

export async function getRewardTierByPoints(points: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Find tier where minPoints <= points and (maxPoints is null or maxPoints >= points)
  const tiers = await db
    .select()
    .from(rewardTiers)
    .where(eq(rewardTiers.isActive, true))
    .orderBy(desc(rewardTiers.minPoints));

  for (const tier of tiers) {
    if (points >= tier.minPoints && (!tier.maxPoints || points <= tier.maxPoints)) {
      return tier;
    }
  }

  return null;
}

export async function getAllRewardTiers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(rewardTiers)
    .where(eq(rewardTiers.isActive, true))
    .orderBy(rewardTiers.minPoints);
}

export async function getUserRewardTier(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await db
    .select({ treePoints: users.treePoints })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user[0]) return null;

  return getRewardTierByPoints(user[0]?.treePoints || 0);
}

/**
 * Calculate discount percentage for a user based on their TreePoints
 */
export async function calculateUserDiscount(userId: number): Promise<number> {
  const tier = await getUserRewardTier(userId);
  return (tier?.discountPercentage) || 0;
}

/**
 * Calculate EWA fee reduction based on TreePoints tier
 */
export async function calculateEwaRateReduction(userId: number): Promise<number> {
  const tier = await getUserRewardTier(userId);
  return (tier?.ewaRateReduction) || 0; // in basis points (50 = 0.5%)
}

// ============================================
// REFUERZO 2: ALERT SUGGESTED ACTIONS
// ============================================

export async function getSuggestedActionsForAlert(alertType: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(alertSuggestedActions)
    .where(
      and(
        eq(alertSuggestedActions.alertType, alertType),
        eq(alertSuggestedActions.isActive, true)
      )
    )
    .orderBy(alertSuggestedActions.priority);
}

export async function createSuggestedAction(data: {
  alertType: string;
  actionType: string;
  actionTitle: string;
  actionDescription?: string;
  actionUrl?: string;
  educationContentId?: number;
  priority?: number;
  estimatedImpact?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(alertSuggestedActions).values({
    alertType: data.alertType,
    actionType: data.actionType,
    actionTitle: data.actionTitle,
    actionDescription: data.actionDescription,
    actionUrl: data.actionUrl,
    educationContentId: data.educationContentId,
    priority: data.priority || 1,
    estimatedImpact: data.estimatedImpact,
    isActive: true,
  });
}

// ============================================
// REFUERZO 3: EWA DYNAMIC RATES
// ============================================

export async function getDynamicEwaRate(fwiScore: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get all active rates and find the matching one
  const rates = await db
    .select()
    .from(ewaDynamicRates)
    .where(eq(ewaDynamicRates.isActive, true));

  // Find rate where minFwiScore <= fwiScore <= maxFwiScore
  for (const rate of rates) {
    if (fwiScore >= rate.minFwiScore && fwiScore <= rate.maxFwiScore) {
      return rate;
    }
  }

  return null;
}

export async function getEwaRateForUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await db
    .select({ fwiScore: users.fwiScore })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user[0]) return null;

  return getDynamicEwaRate(user[0]?.fwiScore || 50);
}

export async function calculateEwaFee(
  amount: number,
  fwiScore: number,
  ewaRateReduction: number = 0
): Promise<number> {
  const rate = await getDynamicEwaRate(fwiScore);
  if (!rate) return Math.round(amount * 0.03); // Default 3% if no rate found

  // Convert percentage to decimal, apply reduction, calculate fee
  const basePercentage = parseFloat(rate.baseFeePercentage.toString());
  const reductionPercentage = ewaRateReduction / 10000; // Convert basis points to percentage
  const finalPercentage = Math.max(0, basePercentage - reductionPercentage);

  return Math.round(amount * (finalPercentage / 100));
}

export async function getAllEwaDynamicRates() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(ewaDynamicRates)
    .where(eq(ewaDynamicRates.isActive, true))
    .orderBy(ewaDynamicRates.minFwiScore);
}

// ============================================
// REFUERZO 4: SPENDING INSIGHTS
// ============================================

export async function getSpendingInsights(userId: number, month: number, year: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(spendingInsights)
    .where(
      and(
        eq(spendingInsights.userId, userId),
        eq(spendingInsights.month, month),
        eq(spendingInsights.year, year)
      )
    )
    .limit(1);
}

export async function createSpendingInsight(data: {
  userId: number;
  month: number;
  year: number;
  totalSpending: number;
  budgetRecommended: number;
  savingsOpportunity: number;
  topCategory?: string;
  topCategoryAmount?: number;
  anomalies?: string;
  predictions?: string;
  recommendedActions?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(spendingInsights).values(data);
}

// ============================================
// REFUERZO 5: PERSONALIZED RECOMMENDATIONS
// ============================================

export async function getPersonalizedRecommendations(userId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  return db
    .select()
    .from(personalizedRecommendations)
    .where(
      and(
        eq(personalizedRecommendations.userId, userId),
        eq(personalizedRecommendations.isViewed, false),
        lte(personalizedRecommendations.expiresAt, now)
      )
    )
    .orderBy(desc(personalizedRecommendations.relevanceScore))
    .limit(limit);
}

export async function createPersonalizedRecommendation(data: {
  userId: number;
  offerId: number;
  recommendationType: string;
  relevanceScore: number;
  urgency?: "low" | "medium" | "high";
  estimatedSavings?: number;
  socialProof?: string;
  expiresAt?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(personalizedRecommendations).values({
    userId: data.userId,
    offerId: data.offerId,
    recommendationType: data.recommendationType,
    relevanceScore: data.relevanceScore,
    urgency: data.urgency || "medium",
    estimatedSavings: data.estimatedSavings,
    socialProof: data.socialProof,
    expiresAt: data.expiresAt,
    isViewed: false,
    isConverted: false,
  });
}

export async function markRecommendationAsViewed(recommendationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(personalizedRecommendations)
    .set({ isViewed: true })
    .where(eq(personalizedRecommendations.id, recommendationId));
}

export async function markRecommendationAsConverted(recommendationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(personalizedRecommendations)
    .set({ isConverted: true, convertedAt: new Date() })
    .where(eq(personalizedRecommendations.id, recommendationId));
}

// ============================================
// REFUERZO 6: RISK INTERVENTION PLANS
// ============================================

export async function getActiveInterventionPlans(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(riskInterventionPlans)
    .where(
      and(
        eq(riskInterventionPlans.userId, userId),
        eq(riskInterventionPlans.interventionStatus, "active")
      )
    );
}

export async function createInterventionPlan(data: {
  userId: number;
  riskCluster: string;
  severity: "low" | "medium" | "high" | "critical";
  interventionType:
    | "education"
    | "personalized_goal"
    | "merchant_offers"
    | "ewa_counseling"
    | "manager_alert";
  expectedOutcome?: string;
  roiEstimated?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(riskInterventionPlans).values({
    userId: data.userId,
    riskCluster: data.riskCluster,
    severity: data.severity,
    interventionType: data.interventionType,
    interventionStatus: "pending",
    expectedOutcome: data.expectedOutcome,
    roiEstimated: data.roiEstimated,
  });
}

export async function startInterventionPlan(planId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(riskInterventionPlans)
    .set({ interventionStatus: "active", startedAt: new Date() })
    .where(eq(riskInterventionPlans.id, planId));
}

export async function completeInterventionPlan(planId: number, actualOutcome?: string, roiActual?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(riskInterventionPlans)
    .set({
      interventionStatus: "completed",
      completedAt: new Date(),
      actualOutcome,
      roiActual,
    })
    .where(eq(riskInterventionPlans.id, planId));
}

// ============================================
// ECOSYSTEM ENGAGEMENT METRICS
// ============================================

export async function getEngagementMetrics(
  departmentId: number,
  month: number,
  year: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(ecosystemEngagementMetrics)
    .where(
      and(
        eq(ecosystemEngagementMetrics.departmentId, departmentId),
        eq(ecosystemEngagementMetrics.month, month),
        eq(ecosystemEngagementMetrics.year, year)
      )
    )
    .limit(1);
}

export async function createEngagementMetrics(data: {
  departmentId: number;
  month: number;
  year: number;
  totalEmployees: number;
  activeEmployees: number;
  avgTreePointsPerEmployee: number;
  totalTreePointsRedeemed: number;
  ewaRequestsCount: number;
  ewaApprovalRate: string;
  avgFwiScoreImprovement: number;
  engagementScore: number;
  interventionPlansStarted: number;
  interventionPlansCompleted: number;
  estimatedROI: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(ecosystemEngagementMetrics).values([data]);
}

// ============================================
// INITIALIZATION: Seed Default Tiers and Rates
// ============================================

export async function initializeDefaultTiersAndRates() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if already initialized
  const existingTiers = await db.select().from(rewardTiers).limit(1);
  if (existingTiers.length > 0) return; // Already initialized

  // Create default reward tiers
  const defaultTiers = [
    {
      minPoints: 0,
      maxPoints: 499,
      discountPercentage: 0,
      ewaRateReduction: 0,
      tierName: "Bronze",
      tierColor: "amber",
      tierIcon: "Award",
      description: "Get started with Treevü",
    },
    {
      minPoints: 500,
      maxPoints: 999,
      discountPercentage: 5,
      ewaRateReduction: 25, // 0.25% reduction
      tierName: "Silver",
      tierColor: "gray",
      tierIcon: "Zap",
      description: "5% discount on marketplace offers",
    },
    {
      minPoints: 1000,
      maxPoints: 1999,
      discountPercentage: 10,
      ewaRateReduction: 50, // 0.5% reduction
      tierName: "Gold",
      tierColor: "yellow",
      tierIcon: "Star",
      description: "10% discount + reduced EWA rates",
    },
    {
      minPoints: 2000,
      maxPoints: null,
      discountPercentage: 15,
      ewaRateReduction: 100, // 1% reduction
      tierName: "Platinum",
      tierColor: "blue",
      tierIcon: "Crown",
      description: "15% discount + premium EWA rates",
    },
  ];

  for (const tier of defaultTiers) {
    await db.insert(rewardTiers).values({
      ...tier,
      isActive: true,
    });
  }

  // Create default EWA dynamic rates
  const defaultRates = [
    {
      minFwiScore: 0,
      maxFwiScore: 40,
      baseFeePercentage: "4.5",
      feeDescription: "High risk - FWI Score below 40",
      riskLevel: "critical" as const,
      incentiveMessage: "Improve your FWI Score to 50+ to reduce fees to 3.5%",
    },
    {
      minFwiScore: 41,
      maxFwiScore: 60,
      baseFeePercentage: "3.5",
      feeDescription: "Medium risk - FWI Score 41-60",
      riskLevel: "high" as const,
      incentiveMessage: "Improve your FWI Score to 70+ to reduce fees to 2.5%",
    },
    {
      minFwiScore: 61,
      maxFwiScore: 80,
      baseFeePercentage: "2.5",
      feeDescription: "Low risk - FWI Score 61-80",
      riskLevel: "medium" as const,
      incentiveMessage: "Improve your FWI Score to 85+ for premium rates of 1.5%",
    },
    {
      minFwiScore: 81,
      maxFwiScore: 100,
      baseFeePercentage: "1.5",
      feeDescription: "Excellent - FWI Score 81+",
      riskLevel: "low" as const,
      incentiveMessage: "Congratulations! You have the best EWA rates available",
    },
  ];

  for (const rate of defaultRates) {
    await db.insert(ewaDynamicRates).values({
      ...rate,
      isActive: true,
    });
  }

  // Create default suggested actions for common alerts
  const defaultActions = [
    {
      alertType: "low_fwi",
      actionType: "education",
      actionTitle: "Learn to Improve Your FWI Score",
      actionDescription: "Complete our financial wellness tutorial to understand the factors affecting your score",
      actionUrl: "/dashboard/employee#education",
      priority: 1,
      estimatedImpact: "FWI +10 points",
    },
    {
      alertType: "low_fwi",
      actionType: "goal_creation",
      actionTitle: "Create a Savings Goal",
      actionDescription: "Set a financial goal to improve your FWI Score",
      actionUrl: "/dashboard/employee#goals",
      priority: 2,
      estimatedImpact: "FWI +5 points",
    },
    {
      alertType: "high_spending",
      actionType: "education",
      actionTitle: "Spending Reduction Tips",
      actionDescription: "Learn strategies to reduce discretionary spending",
      actionUrl: "/blog/spending-reduction",
      priority: 1,
      estimatedImpact: "Save $100/month",
    },
    {
      alertType: "high_spending",
      actionType: "merchant_offers",
      actionTitle: "View Discounted Offers",
      actionDescription: "Check out special offers to reduce your spending",
      actionUrl: "/offers",
      priority: 2,
      estimatedImpact: "Save $50/month",
    },
    {
      alertType: "frequent_ewa",
      actionType: "education",
      actionTitle: "EWA Best Practices",
      actionDescription: "Learn when and how to use EWA responsibly",
      actionUrl: "/dashboard/employee#ewa",
      priority: 1,
      estimatedImpact: "Reduce EWA usage by 50%",
    },
  ];

  for (const action of defaultActions) {
    await db.insert(alertSuggestedActions).values({
      ...action,
      isActive: true,
    });
  }

  console.log("[EcosystemReinforcement] Default tiers, rates, and actions initialized");
}
