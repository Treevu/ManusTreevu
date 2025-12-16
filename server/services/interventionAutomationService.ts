/**
 * Intervention Automation Service
 * 
 * Automated workflows triggered by churn risk levels
 * Manages intervention creation, execution, and success tracking
 */

import { getDb } from '../db';
import { interventionWorkflows, interventionActions, interventionSuccessMetrics } from '../../drizzle/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

export interface InterventionRequest {
  userId: number;
  churnProbability: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'minimal';
  segment: string;
  fwiScore: number;
}

export interface InterventionWorkflowData {
  id: number;
  userId: number;
  churnProbability: number;
  riskLevel: string;
  segment: string;
  interventionType: string;
  status: string;
  priority: string;
  successMetrics?: any;
  actualResults?: any;
  roiEstimated?: number;
  roiActual?: number;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create an intervention workflow based on churn risk
 */
export async function createInterventionWorkflow(
  request: InterventionRequest
): Promise<InterventionWorkflowData> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const { userId, churnProbability, riskLevel, segment, fwiScore } = request;

  // Determine intervention type based on risk level and segment
  const interventionType = determineInterventionType(riskLevel, segment, fwiScore);
  const priority = determinePriority(riskLevel);

  // Define success metrics based on intervention type
  const successMetrics = defineSuccessMetrics(interventionType, fwiScore);

  const result = await db.insert(interventionWorkflows).values({
    userId,
    churnProbability: churnProbability as any,
    riskLevel: riskLevel as any,
    segment,
    interventionType: interventionType as any,
    status: 'pending',
    priority: priority as any,
    successMetrics: JSON.stringify(successMetrics),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const id = (result as any).insertId || 1;
  return getInterventionWorkflow(id);
}

/**
 * Get intervention workflow by ID
 */
export async function getInterventionWorkflow(id: number): Promise<InterventionWorkflowData> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const workflows = await db.select().from(interventionWorkflows).where(eq(interventionWorkflows.id, id));
  if (workflows.length === 0) {
    throw new Error(`Intervention workflow ${id} not found`);
  }
  return workflows[0] as unknown as InterventionWorkflowData;
}

/**
 * Get all active workflows for a user
 */
export async function getUserActiveWorkflows(userId: number): Promise<InterventionWorkflowData[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const workflows = await db
    .select()
    .from(interventionWorkflows)
    .where(
      and(
        eq(interventionWorkflows.userId, userId),
        eq(interventionWorkflows.status, 'active')
      )
    )
    .orderBy(desc(interventionWorkflows.priority));

  return workflows as unknown as InterventionWorkflowData[];
}

/**
 * Get high-priority workflows requiring immediate action
 */
export async function getHighPriorityWorkflows(limit: number = 50): Promise<InterventionWorkflowData[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const workflows = await db
    .select()
    .from(interventionWorkflows)
    .where(
      and(
        eq(interventionWorkflows.status, 'pending'),
        eq(interventionWorkflows.priority, 'critical')
      )
    )
    .orderBy(desc(interventionWorkflows.createdAt))
    .limit(limit);

  return workflows as unknown as InterventionWorkflowData[];
}

/**
 * Start an intervention workflow
 */
export async function startInterventionWorkflow(workflowId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db
    .update(interventionWorkflows)
    .set({
      status: 'active',
      startedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(interventionWorkflows.id, workflowId));
}

/**
 * Complete an intervention workflow
 */
export async function completeInterventionWorkflow(
  workflowId: number,
  actualResults: any
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db
    .update(interventionWorkflows)
    .set({
      status: 'completed',
      actualResults: JSON.stringify(actualResults),
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(interventionWorkflows.id, workflowId));
}

/**
 * Add an action to an intervention workflow
 */
export async function addInterventionAction(
  workflowId: number,
  userId: number,
  actionType: string,
  description: string,
  actionData: any
): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const result = await db.insert(interventionActions).values({
    workflowId,
    userId,
    actionType,
    description,
    actionData: JSON.stringify(actionData),
    status: 'pending',
    createdAt: new Date(),
  });

  return (result as any).insertId || 1;
}

/**
 * Mark an action as completed
 */
export async function completeInterventionAction(
  actionId: number,
  result: any
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db
    .update(interventionActions)
    .set({
      status: 'completed',
      result: JSON.stringify(result),
      completedAt: new Date(),
    })
    .where(eq(interventionActions.id, actionId));
}

/**
 * Record intervention success metrics
 */
export async function recordSuccessMetrics(
  workflowId: number,
  userId: number,
  interventionType: string,
  preInterventionFwi: number,
  postInterventionFwi: number,
  churnRiskBefore: number,
  churnRiskAfter: number,
  engagementIncrease: number,
  estimatedSavings: number,
  actualSavings: number
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const fwiImprovement = postInterventionFwi - preInterventionFwi;
  const churnRiskReduction = churnRiskBefore - churnRiskAfter;
  const successScore = calculateSuccessScore(
    fwiImprovement,
    churnRiskReduction,
    engagementIncrease,
    actualSavings,
    estimatedSavings
  );

  await db.insert(interventionSuccessMetrics).values({
    workflowId,
    userId,
    interventionType,
    preInterventionFwi,
    postInterventionFwi,
    fwiImprovement,
    churnRiskBefore: churnRiskBefore as any,
    churnRiskAfter: churnRiskAfter as any,
    churnRiskReduction: churnRiskReduction as any,
    engagementIncrease,
    estimatedSavings,
    actualSavings,
    successScore,
    createdAt: new Date(),
  });
}

/**
 * Get success metrics for an intervention
 */
export async function getInterventionSuccessMetrics(workflowId: number): Promise<any> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const metrics = await db
    .select()
    .from(interventionSuccessMetrics)
    .where(eq(interventionSuccessMetrics.workflowId, workflowId));

  if (metrics.length === 0) {
    return null;
  }

  return metrics[0];
}

/**
 * Get intervention effectiveness by type
 */
export async function getInterventionEffectiveness(
  interventionType: string
): Promise<{
  totalInterventions: number;
  successfulInterventions: number;
  successRate: number;
  avgFwiImprovement: number;
  avgChurnRiskReduction: number;
  avgROI: number;
}> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const metrics = await db
    .select()
    .from(interventionSuccessMetrics)
    .where(eq(interventionSuccessMetrics.interventionType, interventionType));

  if (metrics.length === 0) {
    return {
      totalInterventions: 0,
      successfulInterventions: 0,
      successRate: 0,
      avgFwiImprovement: 0,
      avgChurnRiskReduction: 0,
      avgROI: 0,
    };
  }

  const successful = metrics.filter((m: any) => m.successScore >= 70);
  const avgFwiImprovement =
    metrics.reduce((sum: number, m: any) => sum + (m.fwiImprovement || 0), 0) / metrics.length;
  const avgChurnRiskReduction =
    metrics.reduce((sum: number, m: any) => sum + parseFloat(m.churnRiskReduction || 0), 0) /
    metrics.length;
  const avgROI =
    metrics.reduce((sum: number, m: any) => sum + (m.actualSavings - m.estimatedSavings), 0) /
    metrics.length;

  return {
    totalInterventions: metrics.length,
    successfulInterventions: successful.length,
    successRate: (successful.length / metrics.length) * 100,
    avgFwiImprovement,
    avgChurnRiskReduction,
    avgROI,
  };
}

// ============ HELPER FUNCTIONS ============

/**
 * Determine intervention type based on risk level and segment
 */
function determineInterventionType(
  riskLevel: string,
  segment: string,
  fwiScore: number
): string {
  if (riskLevel === 'critical') {
    return 'counseling'; // Immediate 1-on-1 counseling
  }

  if (riskLevel === 'high') {
    if (fwiScore < 30) {
      return 'counseling'; // Low FWI needs counseling
    }
    return 'personalized_offer'; // High risk gets special offers
  }

  if (segment === 'at_risk') {
    return 'education'; // Education program for at-risk
  }

  if (segment === 'crisis_intervention') {
    return 'manager_alert'; // Alert manager for crisis
  }

  return 'engagement_boost'; // Default: boost engagement
}

/**
 * Determine priority based on risk level
 */
function determinePriority(riskLevel: string): string {
  const priorityMap: { [key: string]: string } = {
    critical: 'critical',
    high: 'high',
    medium: 'medium',
    low: 'low',
    minimal: 'low',
  };

  return priorityMap[riskLevel] || 'medium';
}

/**
 * Define success metrics for intervention type
 */
function defineSuccessMetrics(interventionType: string, currentFwi: number): any {
  const baseMetrics = {
    targetFwiImprovement: 10, // Points
    targetChurnRiskReduction: 0.15, // 15 percentage points
    targetEngagementIncrease: 20, // Points
    targetSavingsAmount: 5000, // Cents (50 USD)
  };

  const typeSpecificMetrics: { [key: string]: any } = {
    counseling: {
      ...baseMetrics,
      targetFwiImprovement: 15,
      targetChurnRiskReduction: 0.25,
      durationDays: 30,
    },
    education: {
      ...baseMetrics,
      targetFwiImprovement: 8,
      durationDays: 60,
    },
    personalized_offer: {
      ...baseMetrics,
      targetSavingsAmount: 10000,
      durationDays: 14,
    },
    manager_alert: {
      ...baseMetrics,
      targetFwiImprovement: 20,
      targetChurnRiskReduction: 0.3,
      durationDays: 45,
    },
    ewa_support: {
      ...baseMetrics,
      targetFwiImprovement: 12,
      durationDays: 30,
    },
    goal_creation: {
      ...baseMetrics,
      targetFwiImprovement: 5,
      durationDays: 90,
    },
    engagement_boost: {
      ...baseMetrics,
      targetEngagementIncrease: 30,
      durationDays: 21,
    },
  };

  return typeSpecificMetrics[interventionType] || baseMetrics;
}

/**
 * Calculate success score (0-100)
 */
function calculateSuccessScore(
  fwiImprovement: number,
  churnRiskReduction: number,
  engagementIncrease: number,
  actualSavings: number,
  estimatedSavings: number
): number {
  let score = 0;

  // FWI improvement (max 25 points)
  score += Math.min(fwiImprovement * 2.5, 25);

  // Churn risk reduction (max 25 points)
  score += Math.min(churnRiskReduction * 83.33, 25); // 0.3 = 25 points

  // Engagement increase (max 25 points)
  score += Math.min(engagementIncrease * 0.833, 25); // 30 = 25 points

  // ROI (max 25 points)
  const roi = estimatedSavings > 0 ? (actualSavings / estimatedSavings) * 100 : 0;
  score += Math.min(roi * 0.25, 25); // 100% ROI = 25 points

  return Math.min(Math.round(score), 100);
}
