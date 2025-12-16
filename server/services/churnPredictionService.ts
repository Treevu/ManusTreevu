/**
 * Churn Prediction Service
 * 
 * Machine learning model to predict employee churn risk
 */

import { getDb } from '../db';

export interface ChurnPrediction {
  userId: number;
  churnProbability: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'minimal';
  predictedChurnDate: Date;
  mainRiskFactors: string[];
  recommendedInterventions: string[];
}

export interface ChurnFeatures {
  fwiScore: number;
  spendingLevel: string;
  engagementScore: number;
  alertCount: number;
  interventionCount: number;
  completedInterventionCount: number;
  daysInSegment: number;
  segmentTrend: number;
  lastActivityDays: number;
}

/**
 * Predict churn probability for a user
 */
export async function predictChurn(userId: number): Promise<ChurnPrediction> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Get user features from database
  const features = await getUserChurnFeatures(userId);

  // Calculate churn probability using ML model
  const churnProbability = calculateChurnProbability(features);
  const riskLevel = determineRiskLevel(churnProbability);
  const mainRiskFactors = identifyRiskFactors(features);
  const recommendedInterventions = recommendInterventions(mainRiskFactors, riskLevel);

  // Calculate predicted churn date (90 days from now for high risk)
  const predictedChurnDate = new Date();
  predictedChurnDate.setDate(predictedChurnDate.getDate() + (90 - churnProbability * 90));

  const prediction: ChurnPrediction = {
    userId,
    churnProbability: Math.round(churnProbability * 100) / 100,
    riskLevel,
    predictedChurnDate,
    mainRiskFactors,
    recommendedInterventions,
  };

  // Store prediction in database
  await storeChurnPrediction(prediction);

  return prediction;
}

/**
 * Get user features for churn prediction
 */
async function getUserChurnFeatures(userId: number): Promise<ChurnFeatures> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT 
      es.fwiScore,
      es.spendingLevel,
      es.engagementScore,
      (SELECT COUNT(*) FROM alerts WHERE userId = ? AND status = 'active') as alertCount,
      (SELECT COUNT(*) FROM risk_intervention_plans WHERE userId = ?) as interventionCount,
      (SELECT COUNT(*) FROM risk_intervention_plans WHERE userId = ? AND status = 'completed') as completedInterventionCount,
      DATEDIFF(NOW(), es.lastUpdated) as daysInSegment,
      0 as segmentTrend,
      DATEDIFF(NOW(), (SELECT MAX(createdAt) FROM notifications WHERE userId = ?)) as lastActivityDays
     FROM employee_segments es
     WHERE es.userId = ?`,
    [userId, userId, userId, userId, userId]
  );

  const row = (result as any[])[0];

  return {
    fwiScore: row?.fwiScore || 50,
    spendingLevel: row?.spendingLevel || 'moderate',
    engagementScore: row?.engagementScore || 50,
    alertCount: row?.alertCount || 0,
    interventionCount: row?.interventionCount || 0,
    completedInterventionCount: row?.completedInterventionCount || 0,
    daysInSegment: row?.daysInSegment || 30,
    segmentTrend: row?.segmentTrend || 0,
    lastActivityDays: row?.lastActivityDays || 7,
  };
}

/**
 * Calculate churn probability using ML model
 * 
 * Features weighted by importance:
 * - FWI Score (30%): Lower score = higher churn risk
 * - Spending Level (20%): Excessive spending = higher risk
 * - Engagement Score (20%): Lower engagement = higher risk
 * - Alert Count (15%): More alerts = higher risk
 * - Last Activity (15%): More days inactive = higher risk
 */
function calculateChurnProbability(features: ChurnFeatures): number {
  // Normalize features to 0-1 scale
  const fwiNorm = Math.max(0, 1 - features.fwiScore / 100);
  const spendingNorm = features.spendingLevel === 'excessive' ? 1 : features.spendingLevel === 'high' ? 0.7 : features.spendingLevel === 'moderate' ? 0.3 : 0.1;
  const engagementNorm = Math.max(0, 1 - features.engagementScore / 100);
  const alertNorm = Math.min(1, features.alertCount / 10);
  const activityNorm = Math.min(1, features.lastActivityDays / 30);

  // Calculate weighted churn probability
  const churnProb =
    fwiNorm * 0.3 +
    spendingNorm * 0.2 +
    engagementNorm * 0.2 +
    alertNorm * 0.15 +
    activityNorm * 0.15;

  // Apply sigmoid function for smoother probability curve
  return 1 / (1 + Math.exp(-5 * (churnProb - 0.5)));
}

/**
 * Determine risk level based on churn probability
 */
function determineRiskLevel(probability: number): 'critical' | 'high' | 'medium' | 'low' | 'minimal' {
  if (probability >= 0.8) return 'critical';
  if (probability >= 0.6) return 'high';
  if (probability >= 0.4) return 'medium';
  if (probability >= 0.2) return 'low';
  return 'minimal';
}

/**
 * Identify main risk factors for a user
 */
function identifyRiskFactors(features: ChurnFeatures): string[] {
  const factors: string[] = [];

  if (features.fwiScore < 40) factors.push('Very low FWI Score (< 40)');
  else if (features.fwiScore < 50) factors.push('Low FWI Score (< 50)');

  if (features.spendingLevel === 'excessive') factors.push('Excessive spending patterns');
  else if (features.spendingLevel === 'high') factors.push('High spending level');

  if (features.engagementScore < 30) factors.push('Very low engagement (< 30)');
  else if (features.engagementScore < 50) factors.push('Low engagement (< 50)');

  if (features.alertCount > 5) factors.push(`Multiple active alerts (${features.alertCount})`);

  if (features.lastActivityDays > 14) factors.push(`Inactive for ${features.lastActivityDays} days`);

  if (features.interventionCount > 0 && features.completedInterventionCount === 0) {
    factors.push('No completed interventions');
  }

  return factors.slice(0, 5); // Return top 5 factors
}

/**
 * Recommend interventions based on risk factors
 */
function recommendInterventions(riskFactors: string[], riskLevel: string): string[] {
  const interventions: string[] = [];

  if (riskLevel === 'critical' || riskLevel === 'high') {
    interventions.push('Urgent manager outreach');
    interventions.push('1-on-1 counseling session');
  }

  if (riskFactors.some((f) => f.includes('FWI'))) {
    interventions.push('Financial wellness assessment');
    interventions.push('Personalized education program');
  }

  if (riskFactors.some((f) => f.includes('spending'))) {
    interventions.push('Spending analysis and budgeting');
    interventions.push('Debt management resources');
  }

  if (riskFactors.some((f) => f.includes('engagement'))) {
    interventions.push('Engagement boost program');
    interventions.push('Peer mentoring');
  }

  if (riskFactors.some((f) => f.includes('Inactive'))) {
    interventions.push('Re-engagement campaign');
    interventions.push('Personalized recommendations');
  }

  return interventions.slice(0, 4); // Return top 4 interventions
}

/**
 * Store churn prediction in database
 */
async function storeChurnPrediction(prediction: ChurnPrediction): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  await pool.execute(
    `INSERT INTO churn_predictions 
     (userId, churnProbability, riskLevel, predictedChurnDate, mainRiskFactors, recommendedInterventions)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     churnProbability = VALUES(churnProbability),
     riskLevel = VALUES(riskLevel),
     predictedChurnDate = VALUES(predictedChurnDate),
     mainRiskFactors = VALUES(mainRiskFactors),
     recommendedInterventions = VALUES(recommendedInterventions),
     predictionDate = CURRENT_TIMESTAMP`,
    [
      prediction.userId,
      prediction.churnProbability,
      prediction.riskLevel,
      prediction.predictedChurnDate,
      JSON.stringify(prediction.mainRiskFactors),
      JSON.stringify(prediction.recommendedInterventions),
    ]
  );
}

/**
 * Get churn prediction for user
 */
export async function getChurnPrediction(userId: number): Promise<ChurnPrediction | null> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT * FROM churn_predictions WHERE userId = ? ORDER BY predictionDate DESC LIMIT 1`,
    [userId]
  );

  const row = (result as any[])[0];
  if (!row) return null;

  return {
    userId: row.userId,
    churnProbability: row.churnProbability,
    riskLevel: row.riskLevel,
    predictedChurnDate: new Date(row.predictedChurnDate),
    mainRiskFactors: JSON.parse(row.mainRiskFactors || '[]'),
    recommendedInterventions: JSON.parse(row.recommendedInterventions || '[]'),
  };
}

/**
 * Get high-risk users for proactive intervention
 */
export async function getHighRiskUsers(riskLevel: string = 'high', limit: number = 100): Promise<ChurnPrediction[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT * FROM churn_predictions 
     WHERE riskLevel IN ('critical', 'high') AND actualChurned = FALSE
     ORDER BY churnProbability DESC
     LIMIT ?`,
    [limit]
  );

  return (result as any[]).map((row) => ({
    userId: row.userId,
    churnProbability: row.churnProbability,
    riskLevel: row.riskLevel,
    predictedChurnDate: new Date(row.predictedChurnDate),
    mainRiskFactors: JSON.parse(row.mainRiskFactors || '[]'),
    recommendedInterventions: JSON.parse(row.recommendedInterventions || '[]'),
  }));
}

/**
 * Batch predict churn for all users
 */
export async function batchPredictChurn(userIds: number[]): Promise<ChurnPrediction[]> {
  const predictions: ChurnPrediction[] = [];

  for (const userId of userIds) {
    try {
      const prediction = await predictChurn(userId);
      predictions.push(prediction);
    } catch (error) {
      console.error(`Failed to predict churn for user ${userId}:`, error);
    }
  }

  return predictions;
}

/**
 * Get churn prediction statistics
 */
export async function getChurnPredictionStats(): Promise<{
  totalPredictions: number;
  criticalRisk: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  avgChurnProbability: number;
  predictionsWithAccuracy: number;
}> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT 
      COUNT(*) as totalPredictions,
      SUM(CASE WHEN riskLevel = 'critical' THEN 1 ELSE 0 END) as criticalRisk,
      SUM(CASE WHEN riskLevel = 'high' THEN 1 ELSE 0 END) as highRisk,
      SUM(CASE WHEN riskLevel = 'medium' THEN 1 ELSE 0 END) as mediumRisk,
      SUM(CASE WHEN riskLevel = 'low' THEN 1 ELSE 0 END) as lowRisk,
      AVG(churnProbability) as avgChurnProbability,
      SUM(CASE WHEN predictionAccuracy IS NOT NULL THEN 1 ELSE 0 END) as predictionsWithAccuracy
     FROM churn_predictions`
  );

  const row = (result as any[])[0];

  return {
    totalPredictions: row?.totalPredictions || 0,
    criticalRisk: row?.criticalRisk || 0,
    highRisk: row?.highRisk || 0,
    mediumRisk: row?.mediumRisk || 0,
    lowRisk: row?.lowRisk || 0,
    avgChurnProbability: Math.round((row?.avgChurnProbability || 0) * 100) / 100,
    predictionsWithAccuracy: row?.predictionsWithAccuracy || 0,
  };
}
