/**
 * Advanced Segmentation Service
 * 
 * Segments employees based on financial wellness profiles and provides
 * hyper-personalized intervention recommendations and targeted campaigns
 */

import { getDb } from '../db';

export type EmployeeSegment =
  | 'financial_champions'
  | 'rising_stars'
  | 'steady_performers'
  | 'at_risk'
  | 'crisis_intervention';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'minimal';

export interface WellnessProfile {
  userId: number;
  wellnessScore: number; // 0-100
  fwiScore: number; // 0-100
  spendingLevel: 'low' | 'moderate' | 'high' | 'excessive';
  riskLevel: RiskLevel;
  engagementScore: number; // 0-100
  segment: EmployeeSegment;
  interventionType: string;
  recommendationCount: number;
}

export interface SegmentationRules {
  wellnessScoreRange: [number, number];
  fwiScoreRange: [number, number];
  engagementRange: [number, number];
  spendingThreshold: number;
  riskFactors: string[];
}

/**
 * Calculate wellness profile for a user
 */
export async function calculateWellnessProfile(userId: number): Promise<WellnessProfile> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Fetch user data
  const pool = (db as any).$client;
  const [userResult] = await pool.execute(
    `SELECT u.id, u.fwiScore, u.treePoints, 
            COUNT(DISTINCT a.id) as alertCount,
            AVG(CASE WHEN a.severity = 'high' THEN 1 ELSE 0 END) as highSeverityRatio,
            COUNT(DISTINCT r.id) as recommendationCount
     FROM users u
     LEFT JOIN alerts a ON u.id = a.userId
     LEFT JOIN personalized_recommendations r ON u.id = r.userId
     WHERE u.id = ?
     GROUP BY u.id`,
    [userId]
  );

  const user = (userResult as any[])[0];
  if (!user) throw new Error('User not found');

  // Calculate wellness score (0-100)
  const fwiScore = Math.max(0, Math.min(100, user.fwiScore || 50));
  const wellnessScore = (fwiScore + (100 - user.alertCount * 10) + (user.treePoints / 100)) / 3;

  // Determine spending level
  const spendingLevel = determineSpendingLevel(user.alertCount, user.highSeverityRatio);

  // Calculate risk level
  const riskLevel = calculateRiskLevel(fwiScore, user.alertCount, user.highSeverityRatio);

  // Calculate engagement score
  const engagementScore = Math.max(0, Math.min(100, (user.treePoints / 1000) * 100));

  // Determine segment
  const segment = determineSegment(wellnessScore, fwiScore, riskLevel, engagementScore);

  // Determine intervention type
  const interventionType = determineInterventionType(segment, riskLevel);

  return {
    userId,
    wellnessScore: Math.round(wellnessScore),
    fwiScore,
    spendingLevel,
    riskLevel,
    engagementScore: Math.round(engagementScore),
    segment,
    interventionType,
    recommendationCount: user.recommendationCount || 0,
  };
}

/**
 * Determine spending level based on alerts
 */
function determineSpendingLevel(
  alertCount: number,
  highSeverityRatio: number
): 'low' | 'moderate' | 'high' | 'excessive' {
  if (alertCount === 0) return 'low';
  if (alertCount <= 2 && highSeverityRatio < 0.5) return 'moderate';
  if (alertCount <= 5 && highSeverityRatio < 0.7) return 'high';
  return 'excessive';
}

/**
 * Calculate risk level based on multiple factors
 */
function calculateRiskLevel(fwiScore: number, alertCount: number, highSeverityRatio: number): RiskLevel {
  const riskScore = (100 - fwiScore) * 0.4 + alertCount * 5 + highSeverityRatio * 30;

  if (riskScore >= 80) return 'critical';
  if (riskScore >= 60) return 'high';
  if (riskScore >= 40) return 'medium';
  if (riskScore >= 20) return 'low';
  return 'minimal';
}

/**
 * Determine employee segment
 */
function determineSegment(
  wellnessScore: number,
  fwiScore: number,
  riskLevel: RiskLevel,
  engagementScore: number
): EmployeeSegment {
  // Crisis intervention - immediate action needed
  if (riskLevel === 'critical' || fwiScore < 30) {
    return 'crisis_intervention';
  }

  // At risk - needs support
  if (riskLevel === 'high' || (fwiScore < 50 && engagementScore < 40)) {
    return 'at_risk';
  }

  // Steady performers - maintaining good habits
  if (wellnessScore >= 60 && riskLevel === 'low') {
    return 'steady_performers';
  }

  // Rising stars - improving trajectory
  if (wellnessScore >= 70 && engagementScore >= 70) {
    return 'rising_stars';
  }

  // Financial champions - excellent performance
  if (wellnessScore >= 80 && fwiScore >= 80 && engagementScore >= 80) {
    return 'financial_champions';
  }

  return 'steady_performers';
}

/**
 * Determine intervention type based on segment
 */
function determineInterventionType(segment: EmployeeSegment, riskLevel: RiskLevel): string {
  switch (segment) {
    case 'financial_champions':
      return 'retention_and_advocacy';
    case 'rising_stars':
      return 'acceleration_and_mentoring';
    case 'steady_performers':
      return 'maintenance_and_optimization';
    case 'at_risk':
      return 'support_and_education';
    case 'crisis_intervention':
      return riskLevel === 'critical' ? 'emergency_counseling' : 'intensive_support';
    default:
      return 'standard_support';
  }
}

/**
 * Get personalized recommendations for a user
 */
export async function getPersonalizedRecommendations(
  userId: number,
  limit: number = 5
): Promise<Array<{ title: string; description: string; priority: string; estimatedSavings: number }>> {
  const profile = await calculateWellnessProfile(userId);

  const recommendations: Array<{
    title: string;
    description: string;
    priority: string;
    estimatedSavings: number;
  }> = [];

  // Crisis intervention recommendations
  if (profile.segment === 'crisis_intervention') {
    recommendations.push({
      title: 'Emergency Financial Counseling',
      description: 'Schedule immediate 1-on-1 counseling with financial advisor',
      priority: 'critical',
      estimatedSavings: 500,
    });
    recommendations.push({
      title: 'Debt Management Program',
      description: 'Enroll in debt consolidation and management program',
      priority: 'critical',
      estimatedSavings: 1000,
    });
  }

  // At-risk recommendations
  if (profile.segment === 'at_risk') {
    recommendations.push({
      title: 'Financial Wellness Course',
      description: 'Complete 4-week financial literacy course',
      priority: 'high',
      estimatedSavings: 300,
    });
    recommendations.push({
      title: 'Budget Optimization',
      description: 'Get personalized budget review and optimization plan',
      priority: 'high',
      estimatedSavings: 250,
    });
  }

  // Steady performers recommendations
  if (profile.segment === 'steady_performers') {
    recommendations.push({
      title: 'Investment Opportunities',
      description: 'Explore low-risk investment options for wealth building',
      priority: 'medium',
      estimatedSavings: 200,
    });
    recommendations.push({
      title: 'Savings Optimization',
      description: 'Maximize savings account yields and benefits',
      priority: 'medium',
      estimatedSavings: 150,
    });
  }

  // Rising stars recommendations
  if (profile.segment === 'rising_stars') {
    recommendations.push({
      title: 'Advanced Wealth Planning',
      description: 'Strategic wealth building and investment planning',
      priority: 'low',
      estimatedSavings: 400,
    });
    recommendations.push({
      title: 'Mentorship Program',
      description: 'Become a peer mentor for other employees',
      priority: 'low',
      estimatedSavings: 0,
    });
  }

  // Champions recommendations
  if (profile.segment === 'financial_champions') {
    recommendations.push({
      title: 'Leadership Program',
      description: 'Join financial wellness leadership program',
      priority: 'low',
      estimatedSavings: 0,
    });
    recommendations.push({
      title: 'Exclusive Benefits',
      description: 'Access premium financial planning services',
      priority: 'low',
      estimatedSavings: 500,
    });
  }

  return recommendations.slice(0, limit);
}

/**
 * Get segment statistics
 */
export async function getSegmentStatistics(
  segment: EmployeeSegment
): Promise<{
  totalEmployees: number;
  averageWellnessScore: number;
  averageFwiScore: number;
  averageEngagementScore: number;
  riskDistribution: Record<RiskLevel, number>;
}> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT 
      COUNT(*) as totalEmployees,
      AVG(wellnessScore) as avgWellness,
      AVG(fwiScore) as avgFwi,
      AVG(engagementScore) as avgEngagement,
      riskLevel,
      COUNT(*) as riskCount
     FROM employee_segments
     WHERE segment = ?
     GROUP BY riskLevel`,
    [segment]
  );

  const rows = result as any[];
  const totalEmployees = rows.reduce((sum, row) => sum + row.totalEmployees, 0);

  const riskDistribution: Record<RiskLevel, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    minimal: 0,
  };

  rows.forEach((row) => {
    if (row.riskLevel in riskDistribution) {
      riskDistribution[row.riskLevel as RiskLevel] = row.riskCount;
    }
  });

  return {
    totalEmployees,
    averageWellnessScore: Math.round(rows[0]?.avgWellness || 0),
    averageFwiScore: Math.round(rows[0]?.avgFwi || 0),
    averageEngagementScore: Math.round(rows[0]?.avgEngagement || 0),
    riskDistribution,
  };
}

/**
 * Update employee segment in database
 */
export async function updateEmployeeSegment(userId: number, profile: WellnessProfile): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  await pool.execute(
    `INSERT INTO employee_segments 
     (userId, segment, wellnessScore, fwiScore, spendingLevel, riskLevel, engagementScore, interventionType, recommendationCount)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     segment = VALUES(segment),
     wellnessScore = VALUES(wellnessScore),
     fwiScore = VALUES(fwiScore),
     spendingLevel = VALUES(spendingLevel),
     riskLevel = VALUES(riskLevel),
     engagementScore = VALUES(engagementScore),
     interventionType = VALUES(interventionType),
     recommendationCount = VALUES(recommendationCount),
     lastUpdated = CURRENT_TIMESTAMP`,
    [
      userId,
      profile.segment,
      profile.wellnessScore,
      profile.fwiScore,
      profile.spendingLevel,
      profile.riskLevel,
      profile.engagementScore,
      profile.interventionType,
      profile.recommendationCount,
    ]
  );
}

/**
 * Get employees by segment
 */
export async function getEmployeesBySegment(
  segment: EmployeeSegment,
  limit: number = 100
): Promise<WellnessProfile[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT userId, segment, wellnessScore, fwiScore, spendingLevel, riskLevel, engagementScore, interventionType, recommendationCount
     FROM employee_segments
     WHERE segment = ?
     ORDER BY wellnessScore DESC
     LIMIT ?`,
    [segment, limit]
  );

  return (result as any[]).map((row) => ({
    userId: row.userId,
    wellnessScore: row.wellnessScore,
    fwiScore: row.fwiScore,
    spendingLevel: row.spendingLevel,
    riskLevel: row.riskLevel,
    engagementScore: row.engagementScore,
    segment: row.segment as EmployeeSegment,
    interventionType: row.interventionType,
    recommendationCount: row.recommendationCount,
  }));
}
