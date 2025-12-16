/**
 * HR Integration & Psychological Pricing Service
 * 
 * Integrates with Workday/BambooHR and implements psychological pricing strategies
 */

import { getDb } from '../db';

// ============ HR INTEGRATION TYPES ============

export interface HRIntegration {
  integrationType: 'workday' | 'bamboohr';
  isActive: boolean;
  lastSyncDate: Date | null;
  syncStatus: 'success' | 'pending' | 'failed';
  employeesSynced: number;
  departmentsSynced: number;
}

export interface SyncedEmployee {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  manager: string;
  jobTitle: string;
  startDate: Date;
}

// ============ PSYCHOLOGICAL PRICING TYPES ============

export interface PricingRule {
  ruleType: 'charm' | 'decoy' | 'bundling' | 'tiered';
  segment: string;
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  description: string;
}

export interface ABTest {
  testName: string;
  controlPrice: number;
  variantPrice: number;
  controlConversions: number;
  variantConversions: number;
  controlImpressions: number;
  variantImpressions: number;
  winner: 'control' | 'variant' | null;
}

// ============ HR INTEGRATION FUNCTIONS ============

/**
 * Configure HR integration
 */
export async function configureHRIntegration(
  integrationType: 'workday' | 'bamboohr',
  apiKey: string,
  apiSecret: string,
  webhookUrl?: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  await pool.execute(
    `INSERT INTO hr_integrations (integrationType, apiKey, apiSecret, webhookUrl, isActive)
     VALUES (?, ?, ?, ?, TRUE)
     ON DUPLICATE KEY UPDATE
     apiKey = VALUES(apiKey),
     apiSecret = VALUES(apiSecret),
     webhookUrl = VALUES(webhookUrl),
     isActive = TRUE`,
    [integrationType, apiKey, apiSecret, webhookUrl || null]
  );
}

/**
 * Get HR integration status
 */
export async function getHRIntegrationStatus(
  integrationType: 'workday' | 'bamboohr'
): Promise<HRIntegration | null> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT * FROM hr_integrations WHERE integrationType = ?`,
    [integrationType]
  );

  const row = (result as any[])[0];
  if (!row) return null;

  return {
    integrationType: row.integrationType,
    isActive: row.isActive,
    lastSyncDate: row.lastSyncDate ? new Date(row.lastSyncDate) : null,
    syncStatus: row.syncStatus || 'pending',
    employeesSynced: row.employeesSynced || 0,
    departmentsSynced: row.departmentsSynced || 0,
  };
}

/**
 * Sync employees from Workday
 */
export async function syncWorkdayEmployees(): Promise<{ synced: number; failed: number }> {
  // In production, this would call Workday API
  // For now, simulate with mock data
  const mockEmployees: SyncedEmployee[] = [
    {
      employeeId: 'WD001',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com',
      department: 'Finance',
      manager: 'Jane Doe',
      jobTitle: 'Financial Analyst',
      startDate: new Date('2020-01-15'),
    },
    {
      employeeId: 'WD002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@company.com',
      department: 'HR',
      manager: 'Mike Wilson',
      jobTitle: 'HR Manager',
      startDate: new Date('2019-06-20'),
    },
  ];

  // Update sync status
  const db = await getDb();
  if (db) {
    const pool = (db as any).$client;
    await pool.execute(
      `UPDATE hr_integrations SET lastSyncDate = NOW(), syncStatus = 'success', employeesSynced = ? 
       WHERE integrationType = 'workday'`,
      [mockEmployees.length]
    );
  }

  return { synced: mockEmployees.length, failed: 0 };
}

/**
 * Sync employees from BambooHR
 */
export async function syncBambooHREmployees(): Promise<{ synced: number; failed: number }> {
  // In production, this would call BambooHR API
  // For now, simulate with mock data
  const mockEmployees: SyncedEmployee[] = [
    {
      employeeId: 'BH001',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@company.com',
      department: 'Engineering',
      manager: 'David Lee',
      jobTitle: 'Senior Engineer',
      startDate: new Date('2018-03-10'),
    },
    {
      employeeId: 'BH002',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@company.com',
      department: 'Marketing',
      manager: 'Lisa Anderson',
      jobTitle: 'Marketing Specialist',
      startDate: new Date('2021-09-01'),
    },
  ];

  // Update sync status
  const db = await getDb();
  if (db) {
    const pool = (db as any).$client;
    await pool.execute(
      `UPDATE hr_integrations SET lastSyncDate = NOW(), syncStatus = 'success', employeesSynced = ? 
       WHERE integrationType = 'bamboohr'`,
      [mockEmployees.length]
    );
  }

  return { synced: mockEmployees.length, failed: 0 };
}

// ============ PSYCHOLOGICAL PRICING FUNCTIONS ============

/**
 * Create charm pricing rule (e.g., $9.99 instead of $10)
 */
export async function createCharmPricingRule(
  segment: string,
  basePrice: number,
  charmPrice: number
): Promise<PricingRule> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const discountPercentage = ((basePrice - charmPrice) / basePrice) * 100;

  const pool = (db as any).$client;
  await pool.execute(
    `INSERT INTO psychological_pricing_rules 
     (ruleType, segment, basePrice, discountPercentage, finalPrice, description)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      'charm',
      segment,
      basePrice,
      discountPercentage,
      charmPrice,
      `Charm pricing: $${basePrice} → $${charmPrice}`,
    ]
  );

  return {
    ruleType: 'charm',
    segment,
    basePrice,
    discountPercentage: Math.round(discountPercentage * 100) / 100,
    finalPrice: charmPrice,
    description: `Charm pricing: $${basePrice} → $${charmPrice}`,
  };
}

/**
 * Create decoy pricing rule
 */
export async function createDecoyPricingRule(
  segment: string,
  standardPrice: number,
  premiumPrice: number,
  decoyPrice: number
): Promise<PricingRule> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  await pool.execute(
    `INSERT INTO psychological_pricing_rules 
     (ruleType, segment, basePrice, finalPrice, description)
     VALUES (?, ?, ?, ?, ?)`,
    [
      'decoy',
      segment,
      standardPrice,
      premiumPrice,
      `Decoy pricing: Standard $${standardPrice}, Premium $${premiumPrice}, Decoy $${decoyPrice}`,
    ]
  );

  return {
    ruleType: 'decoy',
    segment,
    basePrice: standardPrice,
    discountPercentage: 0,
    finalPrice: premiumPrice,
    description: `Decoy pricing: Standard $${standardPrice}, Premium $${premiumPrice}, Decoy $${decoyPrice}`,
  };
}

/**
 * Create bundling pricing rule
 */
export async function createBundlingPricingRule(
  segment: string,
  individualPrice: number,
  bundlePrice: number
): Promise<PricingRule> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const discountPercentage = ((individualPrice - bundlePrice) / individualPrice) * 100;

  const pool = (db as any).$client;
  await pool.execute(
    `INSERT INTO psychological_pricing_rules 
     (ruleType, segment, basePrice, discountPercentage, finalPrice, description)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      'bundling',
      segment,
      individualPrice,
      discountPercentage,
      bundlePrice,
      `Bundle pricing: Individual $${individualPrice}, Bundle $${bundlePrice}`,
    ]
  );

  return {
    ruleType: 'bundling',
    segment,
    basePrice: individualPrice,
    discountPercentage: Math.round(discountPercentage * 100) / 100,
    finalPrice: bundlePrice,
    description: `Bundle pricing: Individual $${individualPrice}, Bundle $${bundlePrice}`,
  };
}

/**
 * Get applicable pricing rule for user
 */
export async function getPricingRuleForUser(
  userId: number,
  segment: string,
  fwiScore: number
): Promise<PricingRule | null> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT * FROM psychological_pricing_rules 
     WHERE segment = ? AND isActive = TRUE
     AND (fwiScoreMin IS NULL OR fwiScore >= fwiScoreMin)
     AND (fwiScoreMax IS NULL OR fwiScore <= fwiScoreMax)
     ORDER BY discountPercentage DESC
     LIMIT 1`,
    [segment]
  );

  const row = (result as any[])[0];
  if (!row) return null;

  return {
    ruleType: row.ruleType,
    segment: row.segment,
    basePrice: row.basePrice,
    discountPercentage: row.discountPercentage,
    finalPrice: row.finalPrice,
    description: row.description,
  };
}

/**
 * Create A/B test for pricing
 */
export async function createABTest(
  testName: string,
  controlPrice: number,
  variantPrice: number,
  durationDays: number = 14
): Promise<ABTest> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + durationDays);

  const pool = (db as any).$client;
  await pool.execute(
    `INSERT INTO pricing_ab_tests 
     (testName, controlPrice, variantPrice, startDate, endDate, isActive)
     VALUES (?, ?, ?, NOW(), ?, TRUE)`,
    [testName, controlPrice, variantPrice, endDate]
  );

  return {
    testName,
    controlPrice,
    variantPrice,
    controlConversions: 0,
    variantConversions: 0,
    controlImpressions: 0,
    variantImpressions: 0,
    winner: null,
  };
}

/**
 * Record A/B test impression
 */
export async function recordABTestImpression(
  testName: string,
  variant: 'control' | 'variant'
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const column = variant === 'control' ? 'controlImpressions' : 'variantImpressions';

  await pool.execute(
    `UPDATE pricing_ab_tests SET ${column} = ${column} + 1 WHERE testName = ?`,
    [testName]
  );
}

/**
 * Record A/B test conversion
 */
export async function recordABTestConversion(
  testName: string,
  variant: 'control' | 'variant'
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const column = variant === 'control' ? 'controlConversions' : 'variantConversions';

  await pool.execute(
    `UPDATE pricing_ab_tests SET ${column} = ${column} + 1 WHERE testName = ?`,
    [testName]
  );
}

/**
 * Get A/B test results
 */
export async function getABTestResults(testName: string): Promise<ABTest | null> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT * FROM pricing_ab_tests WHERE testName = ?`,
    [testName]
  );

  const row = (result as any[])[0];
  if (!row) return null;

  // Calculate winner based on conversion rate
  const controlRate = row.controlImpressions > 0 ? row.controlConversions / row.controlImpressions : 0;
  const variantRate = row.variantImpressions > 0 ? row.variantConversions / row.variantImpressions : 0;

  let winner: 'control' | 'variant' | null = null;
  if (controlRate > variantRate * 1.05) winner = 'control';
  else if (variantRate > controlRate * 1.05) winner = 'variant';

  return {
    testName: row.testName,
    controlPrice: row.controlPrice,
    variantPrice: row.variantPrice,
    controlConversions: row.controlConversions,
    variantConversions: row.variantConversions,
    controlImpressions: row.controlImpressions,
    variantImpressions: row.variantImpressions,
    winner,
  };
}

/**
 * Get all active pricing rules
 */
export async function getAllPricingRules(): Promise<PricingRule[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT * FROM psychological_pricing_rules WHERE isActive = TRUE ORDER BY segment, ruleType`
  );

  return (result as any[]).map((row) => ({
    ruleType: row.ruleType,
    segment: row.segment,
    basePrice: row.basePrice,
    discountPercentage: row.discountPercentage,
    finalPrice: row.finalPrice,
    description: row.description,
  }));
}

/**
 * Get all active A/B tests
 */
export async function getAllABTests(): Promise<ABTest[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pool = (db as any).$client;
  const [result] = await pool.execute(
    `SELECT * FROM pricing_ab_tests WHERE isActive = TRUE ORDER BY startDate DESC`
  );

  return (result as any[]).map((row) => ({
    testName: row.testName,
    controlPrice: row.controlPrice,
    variantPrice: row.variantPrice,
    controlConversions: row.controlConversions,
    variantConversions: row.variantConversions,
    controlImpressions: row.controlImpressions,
    variantImpressions: row.variantImpressions,
    winner: row.winner,
  }));
}
