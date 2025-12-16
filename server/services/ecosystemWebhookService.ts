import { getDb } from "../db";
import { notifications } from "../../drizzle/schema";
import { notifyOwner } from "../_core/notification";

export type WebhookEvent = 
  | "reward_tier_upgrade"
  | "reward_tier_downgrade"
  | "new_recommendation"
  | "intervention_started"
  | "intervention_completed"
  | "ewa_rate_improved"
  | "fwi_milestone";

export interface WebhookPayload {
  event: WebhookEvent;
  userId?: number;
  departmentId?: number;
  data: Record<string, any>;
  timestamp: Date;
}

/**
 * Trigger notification when employee upgrades reward tier
 */
export async function triggerRewardTierUpgrade(
  userId: number,
  oldTierName: string,
  newTierName: string,
  newDiscount: number,
  ewaReduction: number
) {
  const title = `🎉 Congratulations! You've reached ${newTierName} tier!`;
  const message = `You now have ${newDiscount}% discount on marketplace offers and ${(ewaReduction / 100).toFixed(2)}% reduction on EWA rates.`;
  
  await createNotification(userId, title, message, "reward_tier_upgrade", {
    oldTier: oldTierName,
    newTier: newTierName,
    discount: newDiscount,
    ewaReduction,
  });

  // Notify owner about tier upgrade
  await notifyOwner({
    title: `Employee Tier Upgrade: ${newTierName}`,
    content: `User ${userId} has been promoted to ${newTierName} tier with ${newDiscount}% discount benefits.`,
  });
}

/**
 * Trigger notification when new personalized recommendation is created
 */
export async function triggerNewRecommendation(
  userId: number,
  recommendationType: string,
  estimatedSavings: number,
  urgency: "low" | "medium" | "high"
) {
  const urgencyEmoji = urgency === "high" ? "🔥" : urgency === "medium" ? "⭐" : "💡";
  const title = `${urgencyEmoji} New Personalized Offer for You!`;
  const message = `We found an offer that could save you $${estimatedSavings}. Check it out now!`;
  
  await createNotification(userId, title, message, "new_recommendation", {
    type: recommendationType,
    savings: estimatedSavings,
    urgency,
  });
}

/**
 * Trigger notification when intervention plan starts
 */
export async function triggerInterventionStarted(
  userId: number,
  interventionType: string,
  expectedOutcome: string
) {
  const title = `📋 Financial Wellness Plan Started`;
  const message = `We've created a personalized plan to help you: ${expectedOutcome}`;
  
  await createNotification(userId, title, message, "intervention_started", {
    type: interventionType,
    outcome: expectedOutcome,
  });
}

/**
 * Trigger notification when intervention plan completes
 */
export async function triggerInterventionCompleted(
  userId: number,
  interventionType: string,
  actualOutcome: string,
  roiActual: number
) {
  const title = `✅ Wellness Plan Completed!`;
  const message = `Great job! You've achieved: ${actualOutcome}. Estimated value: $${roiActual}`;
  
  await createNotification(userId, title, message, "intervention_completed", {
    type: interventionType,
    outcome: actualOutcome,
    roi: roiActual,
  });
}

/**
 * Trigger notification when EWA rate improves
 */
export async function triggerEWARateImproved(
  userId: number,
  oldRate: number,
  newRate: number,
  fwiScore: number
) {
  const savings = oldRate - newRate;
  const title = `📉 Your EWA Rate Just Improved!`;
  const message = `Your rate dropped from ${oldRate}% to ${newRate}% (FWI: ${fwiScore}). You're saving money!`;
  
  await createNotification(userId, title, message, "ewa_rate_improved", {
    oldRate,
    newRate,
    savings,
    fwiScore,
  });
}

/**
 * Trigger notification when FWI milestone is reached
 */
export async function triggerFWIMilestone(
  userId: number,
  fwiScore: number,
  milestone: number
) {
  const title = `🏆 FWI Milestone Reached!`;
  const message = `Your FWI Score reached ${fwiScore}! You're making great progress on your financial wellness journey.`;
  
  await createNotification(userId, title, message, "fwi_milestone", {
    score: fwiScore,
    milestone,
  });
}

/**
 * Create a notification in the database
 */
async function createNotification(
  userId: number,
  title: string,
  message: string,
  type: WebhookEvent,
  metadata: Record<string, any>
) {
  try {
    const db = await getDb();
    if (!db) return;
    await db.insert(notifications).values({
      userId,
      title,
      message,
      type: type as any,
      metadata: JSON.stringify(metadata),
      isRead: false,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

/**
 * Create webhook event log
 */
export async function logWebhookEvent(payload: WebhookPayload) {
  try {
    // In a real app, you'd save this to a webhook_events table
    console.log(`[Webhook Event] ${payload.event}:`, payload.data);
  } catch (error) {
    console.error("Error logging webhook event:", error);
  }
}

/**
 * Batch trigger notifications for department milestone
 */
export async function triggerDepartmentMilestone(
  departmentId: number,
  engagementScore: number,
  totalROI: number,
  employeeIds: number[]
) {
  const title = `🎯 Department Milestone Achieved!`;
  const message = `Your department reached ${engagementScore}% engagement with $${totalROI} estimated ROI!`;
  
  // Notify all employees in department
  for (const userId of employeeIds) {
    await createNotification(userId, title, message, "fwi_milestone", {
      departmentId,
      engagementScore,
      roi: totalROI,
    });
  }

  // Notify owner
  await notifyOwner({
    title: `Department Engagement Milestone`,
    content: `Department ${departmentId} achieved ${engagementScore}% engagement with $${totalROI} ROI.`,
  });
}
