/**
 * Executive Reporting Service
 * 
 * Generates automated reports and maintains executive dashboard metrics
 * Provides insights for C-suite decision-making
 */

import { getDb } from '../db';
import { 
  executiveReports, 
  executiveDashboardMetrics,
  reportSubscriptions 
} from '../../drizzle/schema';
import { eq, desc, gte, lte } from 'drizzle-orm';

export interface ExecutiveReportRequest {
  reportType: string;
  reportPeriod: string;
  departmentId?: number;
  generatedBy: number;
}

/**
 * Generate an executive report
 */
export async function generateExecutiveReport(
  request: ExecutiveReportRequest
): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const reportData = await buildReportData(request.reportType, request.reportPeriod, request.departmentId);
  const summary = generateReportSummary(reportData);
  const keyMetrics = extractKeyMetrics(reportData);
  const recommendations = generateRecommendations(reportData);

  const result = await db.insert(executiveReports).values({
    reportType: request.reportType as any,
    reportPeriod: request.reportPeriod,
    departmentId: request.departmentId,
    reportData: JSON.stringify(reportData),
    summary: JSON.stringify(summary),
    keyMetrics: JSON.stringify(keyMetrics),
    recommendations: JSON.stringify(recommendations),
    generatedBy: request.generatedBy,
    generatedAt: new Date(),
    createdAt: new Date(),
  });

  return (result as any).insertId || 1;
}

/**
 * Get a specific report
 */
export async function getExecutiveReport(reportId: number): Promise<any> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const reports = await db
    .select()
    .from(executiveReports)
    .where(eq(executiveReports.id, reportId));

  return reports[0] || null;
}

/**
 * Get reports by type and period
 */
export async function getReportsByType(
  reportType: string,
  limit: number = 10
): Promise<any[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const reports = await db
    .select()
    .from(executiveReports)
    .where(eq(executiveReports.reportType, reportType as any))
    .orderBy(desc(executiveReports.generatedAt))
    .limit(limit);

  return reports as unknown as any[];
}

/**
 * Record dashboard metrics for a specific date
 */
export async function recordDashboardMetrics(
  departmentId: number | null,
  date: string,
  metrics: {
    totalEmployees: number;
    avgFwiScore: number;
    employeesAtRisk: number;
    riskPercentage: number;
    churnRiskAverage: number;
    predictedChurnCount: number;
    activeInterventions: number;
    completedInterventions: number;
    interventionSuccessRate: number;
    estimatedROI: number;
    totalTreePointsIssued: number;
    totalTreePointsRedeemed: number;
    ewaRequestsCount: number;
    ewaApprovalRate: number;
    engagementScore: number;
  }
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  await db.insert(executiveDashboardMetrics).values({
    departmentId,
    date,
    totalEmployees: metrics.totalEmployees,
    avgFwiScore: metrics.avgFwiScore,
    employeesAtRisk: metrics.employeesAtRisk,
    riskPercentage: metrics.riskPercentage as any,
    churnRiskAverage: metrics.churnRiskAverage as any,
    predictedChurnCount: metrics.predictedChurnCount,
    activeInterventions: metrics.activeInterventions,
    completedInterventions: metrics.completedInterventions,
    interventionSuccessRate: metrics.interventionSuccessRate as any,
    estimatedROI: metrics.estimatedROI,
    totalTreePointsIssued: metrics.totalTreePointsIssued,
    totalTreePointsRedeemed: metrics.totalTreePointsRedeemed,
    ewaRequestsCount: metrics.ewaRequestsCount,
    ewaApprovalRate: metrics.ewaApprovalRate as any,
    engagementScore: metrics.engagementScore,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

/**
 * Get dashboard metrics for a date range
 */
export async function getDashboardMetrics(
  startDate: string,
  endDate: string,
  departmentId?: number
): Promise<any[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const allMetrics = await db
    .select()
    .from(executiveDashboardMetrics)
    .orderBy(desc(executiveDashboardMetrics.date));
  
  const filtered = departmentId
    ? allMetrics.filter((m: any) => m.departmentId === departmentId)
    : allMetrics.filter((m: any) => m.departmentId === null);

  return filtered.filter((m: any) => m.date >= startDate && m.date <= endDate) as unknown as any[];
}

/**
 * Get latest dashboard metrics
 */
export async function getLatestDashboardMetrics(departmentId?: number): Promise<any> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const allMetrics = await db
    .select()
    .from(executiveDashboardMetrics)
    .orderBy(desc(executiveDashboardMetrics.date));
  
  const filtered = departmentId
    ? allMetrics.filter((m: any) => m.departmentId === departmentId)
    : allMetrics.filter((m: any) => m.departmentId === null);

  return filtered[0] || null;
}

/**
 * Subscribe a user to automated reports
 */
export async function subscribeToReport(
  userId: number,
  reportType: string,
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly',
  deliveryMethod: 'email' | 'dashboard' | 'both' = 'email'
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const nextSendAt = calculateNextSendDate(frequency);

  await db.insert(reportSubscriptions).values({
    userId,
    reportType,
    frequency: frequency as any,
    deliveryMethod: deliveryMethod as any,
    isActive: true,
    nextSendAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

/**
 * Get user's report subscriptions
 */
export async function getUserSubscriptions(userId: number): Promise<any[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const subscriptions = await db
    .select()
    .from(reportSubscriptions)
    .where(eq(reportSubscriptions.userId, userId));

  return subscriptions as unknown as any[];
}

/**
 * Get reports due for delivery
 */
export async function getReportsDueForDelivery(): Promise<any[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const now = new Date();
  const subscriptions = await db
    .select()
    .from(reportSubscriptions)
    .where(
      eq(reportSubscriptions.isActive, true)
    );

  return subscriptions.filter((sub: any) => {
    const nextSend = new Date(sub.nextSendAt);
    return nextSend <= now;
  }) as unknown as any[];
}

/**
 * Update report subscription
 */
export async function updateReportSubscription(
  subscriptionId: number,
  isActive: boolean
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');

  const nextSendAt = isActive ? calculateNextSendDate('monthly') : null;

  await db
    .update(reportSubscriptions)
    .set({
      isActive,
      nextSendAt,
      updatedAt: new Date(),
    })
    .where(eq(reportSubscriptions.id, subscriptionId));
}

/**
 * Generate monthly summary report
 */
export async function generateMonthlySummary(
  year: number,
  month: number,
  departmentId?: number
): Promise<any> {
  const dateStr = `${year}-${String(month).padStart(2, '0')}`;
  
  const reportRequest: ExecutiveReportRequest = {
    reportType: 'monthly_summary',
    reportPeriod: dateStr,
    departmentId,
    generatedBy: 1, // System user
  };

  const reportId = await generateExecutiveReport(reportRequest);
  return getExecutiveReport(reportId);
}

/**
 * Generate churn analysis report
 */
export async function generateChurnAnalysisReport(
  departmentId?: number
): Promise<any> {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  const reportRequest: ExecutiveReportRequest = {
    reportType: 'churn_analysis',
    reportPeriod: dateStr,
    departmentId,
    generatedBy: 1,
  };

  const reportId = await generateExecutiveReport(reportRequest);
  return getExecutiveReport(reportId);
}

/**
 * Generate intervention ROI report
 */
export async function generateInterventionROIReport(
  departmentId?: number
): Promise<any> {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  const reportRequest: ExecutiveReportRequest = {
    reportType: 'intervention_roi',
    reportPeriod: dateStr,
    departmentId,
    generatedBy: 1,
  };

  const reportId = await generateExecutiveReport(reportRequest);
  return getExecutiveReport(reportId);
}

// ============ HELPER FUNCTIONS ============

/**
 * Build report data based on type
 */
async function buildReportData(
  reportType: string,
  reportPeriod: string,
  departmentId?: number
): Promise<any> {
  // This would fetch data from various sources based on report type
  return {
    reportType,
    reportPeriod,
    departmentId,
    generatedAt: new Date(),
    dataPoints: [],
  };
}

/**
 * Generate executive summary
 */
function generateReportSummary(reportData: any): string {
  return `Executive Report for ${reportData.reportPeriod}: Key metrics and trends analyzed.`;
}

/**
 * Extract key metrics from report data
 */
function extractKeyMetrics(reportData: any): any {
  return {
    period: reportData.reportPeriod,
    totalDataPoints: reportData.dataPoints?.length || 0,
    generatedAt: reportData.generatedAt,
  };
}

/**
 * Generate recommendations based on report data
 */
function generateRecommendations(reportData: any): string[] {
  return [
    'Monitor key metrics closely',
    'Review intervention effectiveness',
    'Plan quarterly strategy review',
  ];
}

/**
 * Calculate next send date based on frequency
 */
function calculateNextSendDate(frequency: string): Date {
  const now = new Date();
  
  switch (frequency) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      now.setDate(now.getDate() + 7);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      break;
    case 'quarterly':
      now.setMonth(now.getMonth() + 3);
      break;
  }
  
  return now;
}
