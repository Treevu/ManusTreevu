/**
 * Predictive Analytics Service
 * 
 * Provides machine learning models for:
 * - Intervention success rate prediction
 * - Employee churn risk modeling
 * - ROI forecasting by department
 */

export interface InterventionSuccessPrediction {
  interventionId: number;
  employeeId: number;
  interventionType: string;
  successProbability: number; // 0-1
  confidenceScore: number; // 0-1
  recommendedActions: string[];
  estimatedTimeToSuccess: number; // days
  riskFactors: string[];
}

export interface ChurnRiskPrediction {
  employeeId: number;
  churnRiskScore: number; // 0-1
  riskLevel: "low" | "medium" | "high" | "critical";
  riskFactors: string[];
  recommendedInterventions: string[];
  timeUntilRisk: number; // days
  retentionProbability: number; // 0-1
}

export interface ROIForecast {
  departmentId: string;
  departmentName: string;
  currentROI: number;
  forecastedROI: number;
  forecastPeriod: "1month" | "3months" | "6months" | "12months";
  growthRate: number; // percentage
  confidenceInterval: { lower: number; upper: number };
  drivingFactors: string[];
  interventionImpact: Record<string, number>;
}

export interface EmployeeEngagementPrediction {
  employeeId: number;
  engagementScore: number; // 0-100
  engagementTrend: "improving" | "stable" | "declining";
  predictedEngagement3Months: number;
  keyInfluencers: string[];
  recommendedActions: string[];
}

/**
 * Predict intervention success rate
 * Uses historical data and intervention characteristics
 */
export function predictInterventionSuccess(
  interventionType: string,
  employeeData: {
    fwiScore: number;
    tier: string;
    treePoints: number;
    previousInterventions: number;
    completionRate: number;
  }
): InterventionSuccessPrediction {
  // Simplified ML model - in production, use TensorFlow.js or similar
  
  // Base success rates by type
  const baseSuccessRates: Record<string, number> = {
    education: 0.72,
    goals: 0.68,
    offers: 0.85,
    counseling: 0.75,
    manager_alert: 0.62,
  };

  const baseRate = baseSuccessRates[interventionType] || 0.70;

  // Adjust based on employee characteristics
  let adjustedRate = baseRate;

  // FWI Score impact (lower FWI = higher success)
  const fwiAdjustment = (100 - employeeData.fwiScore) / 100 * 0.15;
  adjustedRate += fwiAdjustment;

  // Tier impact (higher tier = higher success)
  const tierMultiplier: Record<string, number> = {
    Bronze: 0.9,
    Silver: 1.0,
    Gold: 1.1,
    Platinum: 1.2,
  };
  adjustedRate *= tierMultiplier[employeeData.tier] || 1.0;

  // Previous intervention impact
  const interventionBoost = Math.min(employeeData.previousInterventions * 0.05, 0.2);
  adjustedRate += interventionBoost;

  // Completion rate impact
  const completionBoost = employeeData.completionRate * 0.1;
  adjustedRate += completionBoost;

  // Cap between 0 and 1
  adjustedRate = Math.max(0, Math.min(1, adjustedRate));

  // Determine confidence based on data quality
  const confidenceScore = Math.min(0.95, 0.6 + employeeData.previousInterventions * 0.08);

  // Identify risk factors
  const riskFactors: string[] = [];
  if (employeeData.fwiScore > 70) riskFactors.push("High financial stress");
  if (employeeData.completionRate < 0.5) riskFactors.push("Low past completion rate");
  if (employeeData.previousInterventions === 0) riskFactors.push("No intervention history");

  // Recommended actions
  const recommendedActions: string[] = [];
  if (adjustedRate < 0.6) {
    recommendedActions.push("Increase manager support");
    recommendedActions.push("Pair with peer mentor");
  }
  if (riskFactors.length > 0) {
    recommendedActions.push("Address risk factors first");
  }

  // Estimate time to success (in days)
  const estimatedTimeToSuccess = Math.round(
    30 + (1 - adjustedRate) * 60 // Higher risk = longer time
  );

  return {
    interventionId: 0, // Will be set by caller
    employeeId: 0, // Will be set by caller
    interventionType,
    successProbability: adjustedRate,
    confidenceScore,
    recommendedActions,
    estimatedTimeToSuccess,
    riskFactors,
  };
}

/**
 * Predict employee churn risk
 * Uses financial wellness, engagement, and intervention data
 */
export function predictChurnRisk(employeeData: {
  fwiScore: number;
  engagementScore: number;
  monthsWithCompany: number;
  activeInterventions: number;
  lastEngagementDate: Date;
  tier: string;
  treePoints: number;
}): ChurnRiskPrediction {
  // Calculate churn risk score (0-1)
  let churnScore = 0;

  // FWI Score impact (higher FWI = higher churn risk)
  churnScore += (employeeData.fwiScore / 100) * 0.3;

  // Engagement impact (lower engagement = higher churn risk)
  churnScore += (1 - employeeData.engagementScore / 100) * 0.25;

  // Tenure impact (newer employees = higher churn risk)
  const tenureMonths = Math.max(1, employeeData.monthsWithCompany);
  const tenureRisk = Math.max(0, 1 - tenureMonths / 36); // 3 years = low risk
  churnScore += tenureRisk * 0.2;

  // Intervention engagement impact
  const daysSinceEngagement = Math.floor(
    (Date.now() - employeeData.lastEngagementDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const disengagementRisk = Math.min(1, daysSinceEngagement / 90); // 90 days = high risk
  churnScore += disengagementRisk * 0.15;

  // Active interventions reduce churn risk
  const interventionBoost = Math.min(employeeData.activeInterventions * 0.05, 0.1);
  churnScore -= interventionBoost;

  // Cap between 0 and 1
  churnScore = Math.max(0, Math.min(1, churnScore));

  // Determine risk level
  let riskLevel: "low" | "medium" | "high" | "critical";
  if (churnScore < 0.25) riskLevel = "low";
  else if (churnScore < 0.5) riskLevel = "medium";
  else if (churnScore < 0.75) riskLevel = "high";
  else riskLevel = "critical";

  // Identify risk factors
  const riskFactors: string[] = [];
  if (employeeData.fwiScore > 70) riskFactors.push("High financial stress");
  if (employeeData.engagementScore < 40) riskFactors.push("Low engagement");
  if (employeeData.monthsWithCompany < 6) riskFactors.push("New to organization");
  if (daysSinceEngagement > 60) riskFactors.push("Disengaged from programs");

  // Recommended interventions
  const recommendedInterventions: string[] = [];
  if (churnScore > 0.6) {
    recommendedInterventions.push("Immediate manager check-in");
    recommendedInterventions.push("Personalized counseling");
    recommendedInterventions.push("Career development discussion");
  } else if (churnScore > 0.4) {
    recommendedInterventions.push("Increase engagement offers");
    recommendedInterventions.push("Peer mentoring program");
  }

  // Time until risk (in days)
  const timeUntilRisk = Math.max(7, Math.round(90 * (1 - churnScore)));

  // Retention probability
  const retentionProbability = 1 - churnScore;

  return {
    employeeId: 0, // Will be set by caller
    churnRiskScore: churnScore,
    riskLevel,
    riskFactors,
    recommendedInterventions,
    timeUntilRisk,
    retentionProbability,
  };
}

/**
 * Forecast ROI by department
 * Uses historical intervention data and trends
 */
export function forecastDepartmentROI(
  departmentData: {
    departmentId: string;
    departmentName: string;
    currentROI: number;
    employeeCount: number;
    interventionCount: number;
    averageInterventionROI: number;
    growthTrend: number; // percentage month-over-month
    interventionTypes: Record<string, number>; // type -> count
  },
  forecastPeriod: "1month" | "3months" | "6months" | "12months" = "6months"
): ROIForecast {
  // Calculate months in forecast period
  const monthsMap = {
    "1month": 1,
    "3months": 3,
    "6months": 6,
    "12months": 12,
  };
  const forecastMonths = monthsMap[forecastPeriod];

  // Base forecast using growth trend
  let forecastedROI = departmentData.currentROI;

  // Apply growth trend
  const monthlyGrowthRate = departmentData.growthTrend / 100;
  for (let i = 0; i < forecastMonths; i++) {
    forecastedROI *= 1 + monthlyGrowthRate;
  }

  // Adjust for intervention type mix
  const interventionTypeROI: Record<string, number> = {
    education: 1.0,
    goals: 1.15,
    offers: 1.3,
    counseling: 1.2,
    manager_alert: 0.8,
  };

  let mixAdjustment = 0;
  let totalInterventions = 0;
  for (const [type, count] of Object.entries(departmentData.interventionTypes)) {
    mixAdjustment += (interventionTypeROI[type] || 1.0) * count;
    totalInterventions += count;
  }
  if (totalInterventions > 0) {
    mixAdjustment /= totalInterventions;
    forecastedROI *= mixAdjustment;
  }

  // Calculate confidence interval (±15%)
  const confidenceInterval = {
    lower: forecastedROI * 0.85,
    upper: forecastedROI * 1.15,
  };

  // Calculate growth rate
  const growthRate = ((forecastedROI - departmentData.currentROI) / departmentData.currentROI) * 100;

  // Identify driving factors
  const drivingFactors: string[] = [];
  if (departmentData.growthTrend > 0) {
    drivingFactors.push("Positive historical trend");
  }
  if (departmentData.interventionCount > 50) {
    drivingFactors.push("High intervention volume");
  }
  if (departmentData.interventionTypes["offers"] > 0) {
    drivingFactors.push("Strong offer-based interventions");
  }

  // Intervention impact breakdown
  const interventionImpact: Record<string, number> = {};
  for (const [type, count] of Object.entries(departmentData.interventionTypes)) {
    const roi = count * (interventionTypeROI[type] || 1.0) * 1000; // Simplified
    interventionImpact[type] = roi;
  }

  return {
    departmentId: departmentData.departmentId,
    departmentName: departmentData.departmentName,
    currentROI: departmentData.currentROI,
    forecastedROI: Math.round(forecastedROI),
    forecastPeriod,
    growthRate: Math.round(growthRate * 100) / 100,
    confidenceInterval: {
      lower: Math.round(confidenceInterval.lower),
      upper: Math.round(confidenceInterval.upper),
    },
    drivingFactors,
    interventionImpact,
  };
}

/**
 * Predict employee engagement trajectory
 * Uses intervention participation and FWI trends
 */
export function predictEngagementTrajectory(employeeData: {
  currentEngagementScore: number;
  engagementTrend: number; // percentage change month-over-month
  activeInterventions: number;
  completedInterventions: number;
  fwiScore: number;
  treePoints: number;
}): EmployeeEngagementPrediction {
  // Current engagement
  let engagementScore = employeeData.currentEngagementScore;

  // Determine current trend
  let engagementTrend: "improving" | "stable" | "declining";
  if (employeeData.engagementTrend > 5) engagementTrend = "improving";
  else if (employeeData.engagementTrend < -5) engagementTrend = "declining";
  else engagementTrend = "stable";

  // Predict engagement in 3 months
  let predicted3Months = engagementScore;

  // Apply trend
  const monthlyChange = (employeeData.engagementTrend / 100) * engagementScore;
  predicted3Months += monthlyChange * 3;

  // Intervention impact
  const interventionBoost = Math.min(employeeData.activeInterventions * 2, 10);
  predicted3Months += interventionBoost;

  // FWI impact (improving FWI = improving engagement)
  const fwiImpact = (100 - employeeData.fwiScore) / 10;
  predicted3Months += fwiImpact;

  // Cap between 0 and 100
  predicted3Months = Math.max(0, Math.min(100, predicted3Months));

  // Key influencers
  const keyInfluencers: string[] = [];
  if (employeeData.activeInterventions > 0) {
    keyInfluencers.push("Active intervention participation");
  }
  if (employeeData.engagementTrend > 0) {
    keyInfluencers.push("Positive engagement trend");
  }
  if (employeeData.treePoints > 1000) {
    keyInfluencers.push("High TreePoints accumulation");
  }
  if (employeeData.fwiScore < 50) {
    keyInfluencers.push("Improving financial wellness");
  }

  // Recommended actions
  const recommendedActions: string[] = [];
  if (predicted3Months < 50) {
    recommendedActions.push("Increase personalized recommendations");
    recommendedActions.push("Schedule manager check-in");
  }
  if (employeeData.activeInterventions === 0) {
    recommendedActions.push("Recommend new intervention");
  }
  if (employeeData.fwiScore > 70) {
    recommendedActions.push("Prioritize financial education");
  }

  return {
    employeeId: 0, // Will be set by caller
    engagementScore,
    engagementTrend,
    predictedEngagement3Months: Math.round(predicted3Months),
    keyInfluencers,
    recommendedActions,
  };
}

/**
 * Get analytics summary for dashboard
 */
export function getAnalyticsSummary(data: {
  totalEmployees: number;
  activeInterventions: number;
  averageROI: number;
  departmentCount: number;
}): {
  successRateAverage: number;
  churnRiskAverage: number;
  roiForecastAverage: number;
  engagementTrendAverage: number;
} {
  // Simplified aggregation
  const successRateAverage = 0.72; // Based on historical data
  const churnRiskAverage = 0.35; // Based on historical data
  const roiForecastAverage = data.averageROI * 1.15; // 15% growth expected
  const engagementTrendAverage = 65; // Out of 100

  return {
    successRateAverage,
    churnRiskAverage,
    roiForecastAverage,
    engagementTrendAverage,
  };
}
