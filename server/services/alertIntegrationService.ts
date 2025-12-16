import { getDb } from "../db";
import { 
  triggerRewardTierUpgrade,
  triggerNewRecommendation,
  triggerInterventionStarted,
  triggerEWARateImproved,
  triggerFWIMilestone
} from "./ecosystemWebhookService";

/**
 * Process low FWI alert and trigger appropriate ecosystem actions
 */
export async function processLowFwiAlert(userId: number, fwiScore: number) {
  // If FWI is critically low, start intervention
  if (fwiScore < 30) {
    await triggerInterventionStarted(
      userId,
      "counseling",
      "Personalized financial counseling to improve your FWI Score"
    );
  }
  
  // Suggest educational content
  if (fwiScore < 50) {
    await triggerNewRecommendation(
      userId,
      "Financial Education Course",
      0,
      "high"
    );
  }
}

/**
 * Process high spending alert and trigger ecosystem actions
 */
export async function processHighSpendingAlert(
  userId: number,
  spendingAmount: number,
  category: string
) {
  // Recommend marketplace offers to reduce spending
  const estimatedSavings = Math.round(spendingAmount * 0.15); // 15% savings estimate
  
  await triggerNewRecommendation(
    userId,
    `${category} Spending Reduction Offer`,
    estimatedSavings,
    "high"
  );

  // If spending is very high, start goal-based intervention
  if (spendingAmount > 5000) {
    await triggerInterventionStarted(
      userId,
      "goals",
      `Create a spending goal for ${category} to reduce expenses`
    );
  }
}

/**
 * Process frequent EWA alert and trigger ecosystem actions
 */
export async function processFrequentEwaAlert(userId: number, ewaCount: number) {
  // If too many EWA requests, suggest financial education
  if (ewaCount > 5) {
    await triggerInterventionStarted(
      userId,
      "education",
      "Financial literacy program to reduce dependency on EWA"
    );
  }

  // Recommend offers to improve financial health
  await triggerNewRecommendation(
    userId,
    "Budget Optimization Plan",
    0,
    "medium"
  );
}

/**
 * Process FWI improvement milestone
 */
export async function processFwiImprovement(
  userId: number,
  oldFwiScore: number,
  newFwiScore: number
) {
  // Check if crossed a milestone (every 10 points)
  const oldMilestone = Math.floor(oldFwiScore / 10) * 10;
  const newMilestone = Math.floor(newFwiScore / 10) * 10;

  if (newMilestone > oldMilestone) {
    await triggerFWIMilestone(userId, newFwiScore, newMilestone);
  }

  // If improved significantly, reduce EWA rates
  if (newFwiScore - oldFwiScore >= 5) {
    await triggerEWARateImproved(
      userId,
      4.5, // Assume old rate
      3.5, // New rate
      newFwiScore
    );
  }
}

/**
 * Process tier upgrade based on TreePoints
 */
export async function processTierUpgrade(
  userId: number,
  oldTierName: string,
  newTierName: string,
  newDiscount: number,
  ewaReduction: number
) {
  await triggerRewardTierUpgrade(
    userId,
    oldTierName,
    newTierName,
    newDiscount,
    ewaReduction
  );
}

/**
 * Integrate alert with ecosystem - main entry point
 */
export async function integrateAlertWithEcosystem(
  userId: number,
  alertType: string,
  alertData: Record<string, any>
) {
  try {
    switch (alertType) {
      case "low_fwi":
        await processLowFwiAlert(userId, alertData.fwiScore);
        break;

      case "high_spending":
        await processHighSpendingAlert(
          userId,
          alertData.amount,
          alertData.category
        );
        break;

      case "frequent_ewa":
        await processFrequentEwaAlert(userId, alertData.count);
        break;

      case "fwi_improvement":
        await processFwiImprovement(
          userId,
          alertData.oldScore,
          alertData.newScore
        );
        break;

      case "tier_upgrade":
        await processTierUpgrade(
          userId,
          alertData.oldTier,
          alertData.newTier,
          alertData.discount,
          alertData.ewaReduction
        );
        break;

      default:
        console.log(`Unknown alert type: ${alertType}`);
    }
  } catch (error) {
    console.error(`Error integrating alert ${alertType}:`, error);
  }
}

/**
 * Create alert-triggered action log
 */
export async function logAlertAction(
  userId: number,
  alertType: string,
  action: string,
  result: "success" | "failed"
) {
  try {
    const db = await getDb();
    if (!db) return;

    // In a real app, you'd save this to an alert_actions table
    console.log(`[Alert Action] User: ${userId}, Type: ${alertType}, Action: ${action}, Result: ${result}`);
  } catch (error) {
    console.error("Error logging alert action:", error);
  }
}

/**
 * Batch process alerts for a department
 */
export async function processDepartmentAlerts(
  departmentId: number,
  alerts: Array<{
    userId: number;
    alertType: string;
    alertData: Record<string, any>;
  }>
) {
  const results = [];

  for (const alert of alerts) {
    try {
      await integrateAlertWithEcosystem(
        alert.userId,
        alert.alertType,
        alert.alertData
      );
      results.push({
        userId: alert.userId,
        status: "processed",
      });
    } catch (error) {
      results.push({
        userId: alert.userId,
        status: "failed",
        error: (error as Error).message,
      });
    }
  }

  return results;
}
