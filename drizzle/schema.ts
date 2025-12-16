import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * User roles for RBAC
 * - admin: Full system access
 * - employee: Individual user with financial features
 * - merchant: Business partner with offers management
 * - b2b_admin: HR/Company admin with workforce analytics
 */
export const userRoleEnum = mysqlEnum("role", ["admin", "employee", "merchant", "b2b_admin"]);

/**
 * Core user table with RBAC roles
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "employee", "merchant", "b2b_admin"]).default("employee").notNull(),
  
  // Employee-specific fields
  departmentId: int("departmentId"),
  monthlyIncome: int("monthlyIncome").default(0),
  fwiScore: int("fwiScore").default(50), // Financial Wellness Index 0-100
  treePoints: int("treePoints").default(0),
  streakDays: int("streakDays").default(0),
  level: int("level").default(1),
  workModality: mysqlEnum("workModality", ["remote", "hybrid", "onsite"]).default("onsite"),
  
  // Merchant-specific fields
  merchantLevel: mysqlEnum("merchantLevel", ["bronze", "silver", "gold"]),
  merchantRole: mysqlEnum("merchantRole", ["admin", "editor", "viewer"]),
  
  // Status and timestamps
  status: mysqlEnum("status", ["active", "pending", "suspended"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Departments for organizational structure
 */
export const departments = mysqlTable("departments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  companyId: int("companyId"),
  managerId: int("managerId"),
  employeeCount: int("employeeCount").default(0),
  avgFwiScore: int("avgFwiScore").default(50),
  treePointsBudget: int("treePointsBudget").default(10000),
  treePointsUsed: int("treePointsUsed").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = typeof departments.$inferInsert;

/**
 * Transactions for expense tracking
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  merchant: varchar("merchant", { length: 200 }).notNull(),
  amount: int("amount").notNull(), // Amount in cents
  category: mysqlEnum("category", ["food", "transport", "entertainment", "services", "health", "shopping", "other"]).default("other").notNull(),
  isDiscretionary: boolean("isDiscretionary").default(true),
  aiConfidence: int("aiConfidence"), // 0-100
  description: text("description"),
  transactionDate: timestamp("transactionDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Financial Goals for savings tracking
 */
export const financialGoals = mysqlTable("financial_goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  targetAmount: int("targetAmount").notNull(), // Amount in cents
  currentAmount: int("currentAmount").default(0).notNull(),
  category: mysqlEnum("category", ["emergency", "vacation", "purchase", "investment", "other"]).default("other").notNull(),
  deadline: timestamp("deadline"),
  isPriority: boolean("isPriority").default(false),
  isCompleted: boolean("isCompleted").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FinancialGoal = typeof financialGoals.$inferSelect;
export type InsertFinancialGoal = typeof financialGoals.$inferInsert;

/**
 * EWA (Early Wage Access) Requests
 */
export const ewaRequests = mysqlTable("ewa_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(), // Amount in cents
  fee: int("fee").notNull(), // Fee in cents
  status: mysqlEnum("status", ["pending_approval", "processing_transfer", "disbursed", "rejected"]).default("pending_approval").notNull(),
  rejectionReason: text("rejectionReason"),
  approvedBy: int("approvedBy"),
  daysWorked: int("daysWorked").notNull(),
  monthlyIncome: int("monthlyIncome").notNull(),
  fwiScoreAtRequest: int("fwiScoreAtRequest").notNull(),
  estimatedArrival: timestamp("estimatedArrival"),
  disbursedAt: timestamp("disbursedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EwaRequest = typeof ewaRequests.$inferSelect;
export type InsertEwaRequest = typeof ewaRequests.$inferInsert;

/**
 * TreePoints balance and transactions
 */
export const treePointsTransactions = mysqlTable("tree_points_transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(), // Positive for earned, negative for spent
  type: mysqlEnum("type", ["earned", "redeemed", "issued", "expired", "bonus"]).notNull(),
  reason: varchar("reason", { length: 200 }),
  offerId: int("offerId"), // If redeemed for an offer
  issuedBy: int("issuedBy"), // Admin who issued points
  departmentId: int("departmentId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TreePointsTransaction = typeof treePointsTransactions.$inferSelect;
export type InsertTreePointsTransaction = typeof treePointsTransactions.$inferInsert;

/**
 * Market Offers from merchants
 */
export const marketOffers = mysqlTable("market_offers", {
  id: int("id").autoincrement().primaryKey(),
  merchantId: int("merchantId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  costPoints: int("costPoints").notNull(),
  discountValue: varchar("discountValue", { length: 50 }),
  category: mysqlEnum("category", ["financial", "lifestyle", "emergency", "investment"]).default("lifestyle").notNull(),
  targetFwiSegment: mysqlEnum("targetFwiSegment", ["low", "mid", "high", "all"]).default("all").notNull(),
  origin: mysqlEnum("origin", ["corporate", "global"]).default("global").notNull(),
  isActive: boolean("isActive").default(true),
  totalRedemptions: int("totalRedemptions").default(0),
  totalConversions: int("totalConversions").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MarketOffer = typeof marketOffers.$inferSelect;
export type InsertMarketOffer = typeof marketOffers.$inferInsert;

/**
 * Employee Risk Analysis for B2B Dashboard
 */
export const employeeRiskAnalysis = mysqlTable("employee_risk_analysis", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  departmentId: int("departmentId"),
  absenteeismRisk: mysqlEnum("absenteeismRisk", ["low", "medium", "high", "critical"]).default("low").notNull(),
  turnoverPropensity: int("turnoverPropensity").default(0), // IPR 0-100
  ewaFrequency: int("ewaFrequency").default(0), // Number of EWA requests in last 3 months
  lastFwiScore: int("lastFwiScore").default(50),
  tenure: int("tenure").default(0), // Months in company
  age: int("age"),
  projectedLoss: int("projectedLoss").default(0), // Estimated cost if employee leaves
  lastAnalysisDate: timestamp("lastAnalysisDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmployeeRiskAnalysis = typeof employeeRiskAnalysis.$inferSelect;
export type InsertEmployeeRiskAnalysis = typeof employeeRiskAnalysis.$inferInsert;

/**
 * Security Sessions for audit trail
 */
export const securitySessions = mysqlTable("security_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sessionToken: varchar("sessionToken", { length: 128 }).notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  deviceFingerprint: varchar("deviceFingerprint", { length: 128 }),
  isActive: boolean("isActive").default(true),
  lastActivity: timestamp("lastActivity").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SecuritySession = typeof securitySessions.$inferSelect;
export type InsertSecuritySession = typeof securitySessions.$inferInsert;

/**
 * FWI Score History for tracking changes
 */
export const fwiScoreHistory = mysqlTable("fwi_score_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  score: int("score").notNull(),
  factors: text("factors"), // JSON string with breakdown
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export type FwiScoreHistory = typeof fwiScoreHistory.$inferSelect;
export type InsertFwiScoreHistory = typeof fwiScoreHistory.$inferInsert;

/**
 * Audit Log for security tracking
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }),
  resourceId: int("resourceId"),
  details: text("details"), // JSON string
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  success: boolean("success").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;


/**
 * User Notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", [
    "ewa_approved", 
    "ewa_rejected", 
    "ewa_disbursed",
    "treepoints_received", 
    "treepoints_redeemed",
    "goal_progress", 
    "goal_completed",
    "fwi_improved", 
    "fwi_alert",
    "level_up",
    "streak_milestone",
    "offer_available",
    "system_announcement",
    "security_alert",
    "referral_bonus"
  ]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  icon: varchar("icon", { length: 50 }), // Lucide icon name
  actionUrl: varchar("actionUrl", { length: 500 }), // Link to related page
  actionLabel: varchar("actionLabel", { length: 100 }), // Button text
  metadata: text("metadata"), // JSON string with extra data
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * User Notification Preferences
 */
export const notificationPreferences = mysqlTable("notification_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // EWA notifications
  ewaApproved: boolean("ewaApproved").default(true).notNull(),
  ewaRejected: boolean("ewaRejected").default(true).notNull(),
  ewaDisbursed: boolean("ewaDisbursed").default(true).notNull(),
  
  // TreePoints notifications
  treepointsReceived: boolean("treepointsReceived").default(true).notNull(),
  treepointsRedeemed: boolean("treepointsRedeemed").default(true).notNull(),
  
  // Goals notifications
  goalProgress: boolean("goalProgress").default(true).notNull(),
  goalCompleted: boolean("goalCompleted").default(true).notNull(),
  
  // FWI notifications
  fwiImproved: boolean("fwiImproved").default(true).notNull(),
  fwiAlert: boolean("fwiAlert").default(true).notNull(),
  
  // Gamification notifications
  levelUp: boolean("levelUp").default(true).notNull(),
  streakMilestone: boolean("streakMilestone").default(true).notNull(),
  
  // Offers notifications
  offerAvailable: boolean("offerAvailable").default(true).notNull(),
  
  // System notifications
  systemAnnouncement: boolean("systemAnnouncement").default(true).notNull(),
  securityAlert: boolean("securityAlert").default(true).notNull(),
  
  // Delivery preferences
  inAppEnabled: boolean("inAppEnabled").default(true).notNull(),
  emailEnabled: boolean("emailEnabled").default(false).notNull(),
  pushEnabled: boolean("pushEnabled").default(false).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;


/**
 * Push Notification Subscriptions
 * Stores Web Push API subscription data for each user/device
 */
export const pushSubscriptions = mysqlTable("push_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  endpoint: text("endpoint").notNull(), // Push service endpoint URL
  p256dh: text("p256dh").notNull(), // Public key for encryption
  auth: text("auth").notNull(), // Auth secret
  userAgent: text("userAgent"), // Browser/device info
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  lastUsedAt: timestamp("lastUsedAt").defaultNow().notNull(),
});

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertPushSubscription = typeof pushSubscriptions.$inferInsert;

/**
 * Email Queue for async email sending
 */
export const emailQueue = mysqlTable("email_queue", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  toEmail: varchar("toEmail", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  templateType: mysqlEnum("templateType", [
    "ewa_approved",
    "ewa_rejected",
    "ewa_disbursed",
    "treepoints_received",
    "goal_completed",
    "fwi_improved",
    "fwi_alert",
    "security_alert",
    "welcome",
    "weekly_summary"
  ]).notNull(),
  templateData: text("templateData"), // JSON string with template variables
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  attempts: int("attempts").default(0).notNull(),
  lastError: text("lastError"),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailQueueItem = typeof emailQueue.$inferSelect;
export type InsertEmailQueueItem = typeof emailQueue.$inferInsert;


/**
 * Achievements/Badges for gamification
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(), // Unique identifier
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(), // Lucide icon name
  category: mysqlEnum("category", [
    "financial", // FWI Score related
    "savings", // Goals and savings
    "engagement", // App usage
    "social", // Referrals, sharing
    "milestone" // Special achievements
  ]).notNull(),
  rarity: mysqlEnum("rarity", ["common", "rare", "epic", "legendary"]).default("common").notNull(),
  pointsReward: int("pointsReward").default(0).notNull(), // TreePoints awarded
  requirement: text("requirement"), // JSON with unlock conditions
  isHidden: boolean("isHidden").default(false).notNull(), // Hidden until unlocked
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

/**
 * User Achievements - tracks which users have unlocked which achievements
 */
export const userAchievements = mysqlTable("user_achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementId: int("achievementId").notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
  progress: int("progress").default(100).notNull(), // 0-100 for partial progress
  notified: boolean("notified").default(false).notNull(), // Whether user was notified
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;


/**
 * Referral system for user invitations
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull(), // User who sent the referral
  referredId: int("referredId"), // User who was referred (null until they register)
  referralCode: varchar("referralCode", { length: 20 }).notNull().unique(),
  referredEmail: varchar("referredEmail", { length: 320 }), // Email of invited person
  status: mysqlEnum("status", ["pending", "registered", "rewarded", "expired"]).default("pending").notNull(),
  rewardAmount: int("rewardAmount").default(500).notNull(), // TreePoints reward
  referrerRewarded: boolean("referrerRewarded").default(false).notNull(),
  referredRewarded: boolean("referredRewarded").default(false).notNull(),
  expiresAt: timestamp("expiresAt"), // Optional expiration
  registeredAt: timestamp("registeredAt"), // When referred user registered
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;


/**
 * Alert Rules - configurable rules for automatic alerts
 */
export const alertRules = mysqlTable("alert_rules", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  alertType: mysqlEnum("alertType", [
    "fwi_department_low",      // FWI promedio de departamento bajo
    "fwi_individual_low",      // FWI individual bajo (alto riesgo)
    "fwi_trend_negative",      // Tendencia negativa de FWI
    "ewa_pending_count",       // Muchas solicitudes EWA pendientes
    "ewa_pending_amount",      // Monto total EWA pendiente alto
    "ewa_user_excessive",      // Uso excesivo de EWA por empleado
    "high_risk_percentage",    // % de empleados en alto riesgo
    "new_high_risk_user",      // Nuevo empleado en alto riesgo
    "weekly_risk_summary"      // Resumen semanal de riesgo
  ]).notNull(),
  threshold: int("threshold").notNull(), // Valor umbral para disparar alerta
  comparisonOperator: mysqlEnum("comparisonOperator", ["lt", "lte", "gt", "gte", "eq"]).default("lt").notNull(),
  departmentId: int("departmentId"), // NULL = aplica a todos los departamentos
  isEnabled: boolean("isEnabled").default(true).notNull(),
  notifyEmail: boolean("notifyEmail").default(true).notNull(),
  notifyPush: boolean("notifyPush").default(true).notNull(),
  notifyInApp: boolean("notifyInApp").default(true).notNull(),
  notifyAdmins: boolean("notifyAdmins").default(true).notNull(),
  notifyB2BAdmin: boolean("notifyB2BAdmin").default(true).notNull(),
  cooldownMinutes: int("cooldownMinutes").default(60).notNull(), // Tiempo mínimo entre alertas
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AlertRule = typeof alertRules.$inferSelect;
export type InsertAlertRule = typeof alertRules.$inferInsert;

/**
 * Alert History - log of all triggered alerts
 */
export const alertHistory = mysqlTable("alert_history", {
  id: int("id").autoincrement().primaryKey(),
  ruleId: int("ruleId").notNull(),
  alertType: mysqlEnum("alertType", [
    "fwi_department_low",
    "fwi_individual_low",
    "fwi_trend_negative",
    "ewa_pending_count",
    "ewa_pending_amount",
    "ewa_user_excessive",
    "high_risk_percentage",
    "new_high_risk_user",
    "weekly_risk_summary"
  ]).notNull(),
  departmentId: int("departmentId"),
  userId: int("userId"), // Para alertas individuales
  previousValue: int("previousValue"),
  currentValue: int("currentValue").notNull(),
  threshold: int("threshold").notNull(),
  message: text("message").notNull(),
  severity: mysqlEnum("severity", ["info", "warning", "critical"]).default("warning").notNull(),
  notifiedViaEmail: boolean("notifiedViaEmail").default(false).notNull(),
  notifiedViaPush: boolean("notifiedViaPush").default(false).notNull(),
  notifiedViaInApp: boolean("notifiedViaInApp").default(false).notNull(),
  notifiedUsers: text("notifiedUsers"), // JSON array of user IDs notified
  acknowledgedBy: int("acknowledgedBy"),
  acknowledgedAt: timestamp("acknowledgedAt"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AlertHistory = typeof alertHistory.$inferSelect;
export type InsertAlertHistory = typeof alertHistory.$inferInsert;

/**
 * Department Alert Thresholds - legacy table for backward compatibility
 */
export const departmentAlertThresholds = mysqlTable("department_alert_thresholds", {
  id: int("id").autoincrement().primaryKey(),
  departmentId: int("departmentId").notNull(),
  fwiThreshold: int("fwiThreshold").default(50).notNull(),
  highRiskThreshold: int("highRiskThreshold").default(3).notNull(),
  isEnabled: boolean("isEnabled").default(true).notNull(),
  notifyAdmins: boolean("notifyAdmins").default(true).notNull(),
  notifyB2BAdmin: boolean("notifyB2BAdmin").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DepartmentAlertThreshold = typeof departmentAlertThresholds.$inferSelect;
export type InsertDepartmentAlertThreshold = typeof departmentAlertThresholds.$inferInsert;

/**
 * Department Alert History - legacy table for backward compatibility
 */
export const departmentAlertHistory = mysqlTable("department_alert_history", {
  id: int("id").autoincrement().primaryKey(),
  departmentId: int("departmentId").notNull(),
  alertType: mysqlEnum("alertType", ["fwi_low", "high_risk_exceeded"]).notNull(),
  previousValue: int("previousValue").notNull(),
  currentValue: int("currentValue").notNull(),
  threshold: int("threshold").notNull(),
  notifiedUsers: text("notifiedUsers"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DepartmentAlertHistory = typeof departmentAlertHistory.$inferSelect;
export type InsertDepartmentAlertHistory = typeof departmentAlertHistory.$inferInsert;


/**
 * Leads from landing page contact forms
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  employeeCount: varchar("employeeCount", { length: 50 }),
  industry: varchar("industry", { length: 100 }),
  source: varchar("source", { length: 100 }).default("founders_form"),
  message: text("message"),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "converted", "lost"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;


/**
 * Monthly Metrics Snapshots - for historical comparisons
 */
export const monthlyMetricsSnapshots = mysqlTable("monthly_metrics_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId"), // NULL = global metrics
  departmentId: int("departmentId"), // NULL = organization-wide
  year: int("year").notNull(),
  month: int("month").notNull(), // 1-12
  avgFwiScore: int("avgFwiScore").notNull(),
  totalEmployees: int("totalEmployees").notNull(),
  employeesAtRisk: int("employeesAtRisk").default(0).notNull(),
  riskPercentage: int("riskPercentage").default(0).notNull(),
  totalEwaRequests: int("totalEwaRequests").default(0).notNull(),
  totalEwaAmount: int("totalEwaAmount").default(0).notNull(),
  avgEngagementScore: int("avgEngagementScore").default(0),
  totalTreePointsEarned: int("totalTreePointsEarned").default(0).notNull(),
  totalTreePointsRedeemed: int("totalTreePointsRedeemed").default(0).notNull(),
  goalsCreated: int("goalsCreated").default(0).notNull(),
  goalsCompleted: int("goalsCompleted").default(0).notNull(),
  alertsTriggered: int("alertsTriggered").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MonthlyMetricsSnapshot = typeof monthlyMetricsSnapshots.$inferSelect;
export type InsertMonthlyMetricsSnapshot = typeof monthlyMetricsSnapshots.$inferInsert;

/**
 * B2B Organization Alert Thresholds - customizable per organization
 */
export const organizationAlertThresholds = mysqlTable("organization_alert_thresholds", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  // FWI Thresholds
  fwiCriticalThreshold: int("fwiCriticalThreshold").default(30).notNull(),
  fwiWarningThreshold: int("fwiWarningThreshold").default(50).notNull(),
  fwiHealthyThreshold: int("fwiHealthyThreshold").default(70).notNull(),
  // Risk Thresholds
  riskCriticalPercentage: int("riskCriticalPercentage").default(25).notNull(),
  riskWarningPercentage: int("riskWarningPercentage").default(15).notNull(),
  // EWA Thresholds
  ewaMaxPendingCount: int("ewaMaxPendingCount").default(10).notNull(),
  ewaMaxPendingAmount: int("ewaMaxPendingAmount").default(50000).notNull(),
  ewaMaxPerEmployee: int("ewaMaxPerEmployee").default(3).notNull(),
  // Notification preferences
  notifyOnCritical: boolean("notifyOnCritical").default(true).notNull(),
  notifyOnWarning: boolean("notifyOnWarning").default(true).notNull(),
  notifyOnInfo: boolean("notifyOnInfo").default(false).notNull(),
  // Contact preferences
  notifyEmails: text("notifyEmails"), // JSON array of emails
  notifySlackWebhook: varchar("notifySlackWebhook", { length: 500 }),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OrganizationAlertThreshold = typeof organizationAlertThresholds.$inferSelect;
export type InsertOrganizationAlertThreshold = typeof organizationAlertThresholds.$inferInsert;


/**
 * MFA Settings - Multi-Factor Authentication configuration per user
 */
export const mfaSettings = mysqlTable("mfa_settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  secret: varchar("secret", { length: 64 }).notNull(),
  enabled: boolean("enabled").default(false).notNull(),
  verifiedAt: timestamp("verifiedAt"),
  backupCodes: text("backupCodes"),
  backupCodesUsed: int("backupCodesUsed").default(0).notNull(),
  lastUsedAt: timestamp("lastUsedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MfaSetting = typeof mfaSettings.$inferSelect;
export type InsertMfaSetting = typeof mfaSettings.$inferInsert;

/**
 * Pulse Surveys - Wellbeing survey definitions
 */
export const pulseSurveys = mysqlTable("pulse_surveys", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  organizationId: int("organizationId"),
  frequency: mysqlEnum("frequency", ["weekly", "biweekly", "monthly"]).default("weekly").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  startsAt: timestamp("startsAt"),
  endsAt: timestamp("endsAt"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PulseSurvey = typeof pulseSurveys.$inferSelect;
export type InsertPulseSurvey = typeof pulseSurveys.$inferInsert;

/**
 * Pulse Questions - Questions for wellbeing surveys
 */
export const pulseQuestions = mysqlTable("pulse_questions", {
  id: int("id").autoincrement().primaryKey(),
  surveyId: int("surveyId").notNull(),
  questionText: text("questionText").notNull(),
  questionType: mysqlEnum("questionType", ["scale", "emoji", "text", "choice"]).default("scale").notNull(),
  category: mysqlEnum("category", [
    "financial_stress",
    "work_life_balance",
    "job_satisfaction",
    "financial_confidence",
    "savings_habits",
    "overall_wellbeing"
  ]).default("overall_wellbeing").notNull(),
  options: text("options"),
  orderIndex: int("orderIndex").default(0).notNull(),
  isRequired: boolean("isRequired").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PulseQuestion = typeof pulseQuestions.$inferSelect;
export type InsertPulseQuestion = typeof pulseQuestions.$inferInsert;

/**
 * Pulse Responses - User responses to survey questions
 */
export const pulseResponses = mysqlTable("pulse_responses", {
  id: int("id").autoincrement().primaryKey(),
  surveyId: int("surveyId").notNull(),
  questionId: int("questionId").notNull(),
  userId: int("userId").notNull(),
  responseValue: int("responseValue"),
  responseText: text("responseText"),
  responseChoice: varchar("responseChoice", { length: 200 }),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export type PulseResponse = typeof pulseResponses.$inferSelect;
export type InsertPulseResponse = typeof pulseResponses.$inferInsert;

/**
 * Pulse Survey Assignments - Track which users should complete which surveys
 */
export const pulseSurveyAssignments = mysqlTable("pulse_survey_assignments", {
  id: int("id").autoincrement().primaryKey(),
  surveyId: int("surveyId").notNull(),
  userId: int("userId").notNull(),
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
  dueAt: timestamp("dueAt"),
  completedAt: timestamp("completedAt"),
  reminderSentAt: timestamp("reminderSentAt"),
});

export type PulseSurveyAssignment = typeof pulseSurveyAssignments.$inferSelect;
export type InsertPulseSurveyAssignment = typeof pulseSurveyAssignments.$inferInsert;


/**
 * Offer Redemptions - Track TreePoints redemptions with QR codes
 */
export const offerRedemptions = mysqlTable("offer_redemptions", {
  id: int("id").autoincrement().primaryKey(),
  offerId: int("offerId").notNull(),
  userId: int("userId").notNull(),
  merchantId: int("merchantId").notNull(),
  pointsSpent: int("pointsSpent").notNull(),
  couponCode: varchar("couponCode", { length: 50 }).notNull().unique(),
  qrCodeData: text("qrCodeData"), // Base64 QR code image
  status: mysqlEnum("status", ["pending", "validated", "expired", "cancelled"]).default("pending").notNull(),
  validatedAt: timestamp("validatedAt"),
  validatedBy: int("validatedBy"), // Merchant user who validated
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OfferRedemption = typeof offerRedemptions.$inferSelect;
export type InsertOfferRedemption = typeof offerRedemptions.$inferInsert;

/**
 * Education Progress - Track user progress through educational tutorials
 */
export const educationProgress = mysqlTable("education_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tutorialType: varchar("tutorialType", { length: 50 }).notNull(), // 'fwi', 'ewa', 'b2b', 'merchant'
  stepsCompleted: int("stepsCompleted").default(0).notNull(),
  totalSteps: int("totalSteps").notNull(),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  pointsAwarded: int("pointsAwarded").default(0).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EducationProgress = typeof educationProgress.$inferSelect;
export type InsertEducationProgress = typeof educationProgress.$inferInsert;


/**
 * Badges - Gamification badges/insignias for user achievements
 */
export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(), // Unique identifier like 'fwi_master'
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(), // Lucide icon name
  color: varchar("color", { length: 20 }).notNull(), // Tailwind color class
  category: mysqlEnum("category", [
    "education",    // Tutorial completion badges
    "financial",    // FWI and financial health badges
    "engagement",   // Platform usage badges
    "social",       // Referral and community badges
    "merchant",     // Merchant-specific badges
    "b2b"           // B2B admin badges
  ]).notNull(),
  requirement: text("requirement").notNull(), // JSON describing how to earn
  pointsReward: int("pointsReward").default(0).notNull(), // TreePoints awarded
  rarity: mysqlEnum("rarity", ["common", "rare", "epic", "legendary"]).default("common").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

/**
 * User Badges - Junction table for user-badge relationships
 */
export const userBadges = mysqlTable("user_badges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeId: int("badgeId").notNull(),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
  notified: boolean("notified").default(false).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(), // For showcase ordering
});

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;


/**
 * Weekly Challenges - Rotating challenges with rewards
 */
export const weeklyChallenges = mysqlTable("weekly_challenges", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  category: mysqlEnum("category", [
    "spending",     // Track/reduce spending
    "savings",      // Savings goals
    "education",    // Complete tutorials
    "engagement",   // Daily logins/activity
    "social",       // Referrals/sharing
    "fwi"           // Improve FWI score
  ]).notNull(),
  targetValue: int("targetValue").notNull(), // Goal to achieve
  targetUnit: varchar("targetUnit", { length: 30 }).notNull(), // 'transactions', 'points', 'days', etc.
  pointsReward: int("pointsReward").notNull(),
  badgeReward: varchar("badgeReward", { length: 50 }), // Optional badge code to award
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WeeklyChallenge = typeof weeklyChallenges.$inferSelect;
export type InsertWeeklyChallenge = typeof weeklyChallenges.$inferInsert;

/**
 * Active Challenge Instances - Currently running challenges
 */
export const activeChallenges = mysqlTable("active_challenges", {
  id: int("id").autoincrement().primaryKey(),
  challengeId: int("challengeId").notNull(),
  weekNumber: int("weekNumber").notNull(), // ISO week number
  year: int("year").notNull(),
  startsAt: timestamp("startsAt").notNull(),
  endsAt: timestamp("endsAt").notNull(),
  participantCount: int("participantCount").default(0).notNull(),
  completionCount: int("completionCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActiveChallenge = typeof activeChallenges.$inferSelect;
export type InsertActiveChallenge = typeof activeChallenges.$inferInsert;

/**
 * User Challenge Progress - Track individual user progress
 */
export const userChallengeProgress = mysqlTable("user_challenge_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  activeChallengeId: int("activeChallengeId").notNull(),
  currentProgress: int("currentProgress").default(0).notNull(),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  pointsAwarded: int("pointsAwarded").default(0).notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;
export type InsertUserChallengeProgress = typeof userChallengeProgress.$inferInsert;

/**
 * User Profile Settings - Privacy and display preferences
 */
export const userProfileSettings = mysqlTable("user_profile_settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  isPublic: boolean("isPublic").default(true).notNull(),
  showBadges: boolean("showBadges").default(true).notNull(),
  showLevel: boolean("showLevel").default(true).notNull(),
  showFwiScore: boolean("showFwiScore").default(false).notNull(), // Private by default
  showStreak: boolean("showStreak").default(true).notNull(),
  showLeaderboardRank: boolean("showLeaderboardRank").default(true).notNull(),
  bio: varchar("bio", { length: 300 }),
  avatarUrl: text("avatarUrl"),
  featuredBadges: text("featuredBadges"), // JSON array of badge IDs to showcase
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfileSettings = typeof userProfileSettings.$inferSelect;
export type InsertUserProfileSettings = typeof userProfileSettings.$inferInsert;

/**
 * Streak History - Track daily activity for streak badges
 */
export const streakHistory = mysqlTable("streak_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  activityDate: timestamp("activityDate").notNull(),
  activityType: mysqlEnum("activityType", [
    "login",
    "transaction",
    "tutorial",
    "challenge",
    "goal_update"
  ]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StreakHistory = typeof streakHistory.$inferSelect;
export type InsertStreakHistory = typeof streakHistory.$inferInsert;


/**
 * REFUERZO 1: Reward Tiers - Descuentos progresivos por nivel de TreePoints
 */
export const rewardTiers = mysqlTable("reward_tiers", {
  id: int("id").autoincrement().primaryKey(),
  minPoints: int("minPoints").notNull(), // Mínimo de puntos para acceder
  maxPoints: int("maxPoints"), // Máximo de puntos (null = sin límite)
  discountPercentage: int("discountPercentage").notNull(), // 5, 10, 15, etc.
  ewaRateReduction: int("ewaRateReduction").default(0).notNull(), // Reducción en tasa de EWA (en basis points, ej: 50 = 0.5%)
  tierName: varchar("tierName", { length: 50 }).notNull(), // "Bronze", "Silver", "Gold", "Platinum"
  tierColor: varchar("tierColor", { length: 20 }).notNull(), // Tailwind color
  tierIcon: varchar("tierIcon", { length: 50 }).notNull(), // Lucide icon name
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RewardTier = typeof rewardTiers.$inferSelect;
export type InsertRewardTier = typeof rewardTiers.$inferInsert;

/**
 * REFUERZO 2: Alert Suggested Actions - Acciones recomendadas para cada alerta
 */
export const alertSuggestedActions = mysqlTable("alert_suggested_actions", {
  id: int("id").autoincrement().primaryKey(),
  alertType: varchar("alertType", { length: 50 }).notNull(), // 'low_fwi', 'high_spending', etc.
  actionType: varchar("actionType", { length: 50 }).notNull(), // 'education', 'goal_creation', 'ewa_info', etc.
  actionTitle: varchar("actionTitle", { length: 150 }).notNull(),
  actionDescription: text("actionDescription"),
  actionUrl: varchar("actionUrl", { length: 500 }), // Link to education content or feature
  educationContentId: int("educationContentId"), // Link to education content
  priority: int("priority").default(1).notNull(), // 1 = highest priority
  estimatedImpact: varchar("estimatedImpact", { length: 100 }), // "FWI +5 points", "Save $50/month", etc.
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AlertSuggestedAction = typeof alertSuggestedActions.$inferSelect;
export type InsertAlertSuggestedAction = typeof alertSuggestedActions.$inferInsert;

/**
 * REFUERZO 3: EWA Dynamic Rates - Tasas dinámicas basadas en FWI Score
 */
export const ewaDynamicRates = mysqlTable("ewa_dynamic_rates", {
  id: int("id").autoincrement().primaryKey(),
  minFwiScore: int("minFwiScore").notNull(), // Mínimo FWI Score
  maxFwiScore: int("maxFwiScore").notNull(), // Máximo FWI Score
  baseFeePercentage: decimal("baseFeePercentage", { precision: 5, scale: 2 }).notNull(), // 2.5%, 3%, etc.
  feeDescription: varchar("feeDescription", { length: 200 }),
  riskLevel: mysqlEnum("riskLevel", ["low", "medium", "high", "critical"]).notNull(),
  incentiveMessage: text("incentiveMessage"), // "Improve FWI to 75+ to reduce fee to 2%"
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EwaDynamicRate = typeof ewaDynamicRates.$inferSelect;
export type InsertEwaDynamicRate = typeof ewaDynamicRates.$inferInsert;

/**
 * REFUERZO 4: Spending Insights - Análisis de gastos para recomendaciones
 */
export const spendingInsights = mysqlTable("spending_insights", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  month: int("month").notNull(), // 1-12
  year: int("year").notNull(),
  totalSpending: int("totalSpending").notNull(), // Total en centavos
  budgetRecommended: int("budgetRecommended").notNull(), // Presupuesto recomendado
  savingsOpportunity: int("savingsOpportunity").notNull(), // Potencial de ahorro
  topCategory: varchar("topCategory", { length: 50 }),
  topCategoryAmount: int("topCategoryAmount"),
  anomalies: text("anomalies"), // JSON array de anomalías detectadas
  predictions: text("predictions"), // JSON con predicciones de gasto
  recommendedActions: text("recommendedActions"), // JSON array de acciones recomendadas
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SpendingInsight = typeof spendingInsights.$inferSelect;
export type InsertSpendingInsight = typeof spendingInsights.$inferInsert;

/**
 * REFUERZO 5: Personalized Recommendations - Recomendaciones IA personalizadas
 */
export const personalizedRecommendations = mysqlTable("personalized_recommendations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  offerId: int("offerId").notNull(),
  recommendationType: varchar("recommendationType", { length: 50 }).notNull(), // 'spending_pattern', 'fwi_improvement', 'goal_support', etc.
  relevanceScore: int("relevanceScore").notNull(), // 0-100
  urgency: mysqlEnum("urgency", ["low", "medium", "high"]).default("medium").notNull(),
  estimatedSavings: int("estimatedSavings"), // Ahorro estimado
  socialProof: text("socialProof"), // JSON con datos de otros usuarios
  isViewed: boolean("isViewed").default(false).notNull(),
  isConverted: boolean("isConverted").default(false).notNull(),
  convertedAt: timestamp("convertedAt"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PersonalizedRecommendation = typeof personalizedRecommendations.$inferSelect;
export type InsertPersonalizedRecommendation = typeof personalizedRecommendations.$inferInsert;

/**
 * REFUERZO 6: Risk Intervention Plans - Planes de intervención para empleados en riesgo
 */
export const riskInterventionPlans = mysqlTable("risk_intervention_plans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  riskCluster: varchar("riskCluster", { length: 100 }).notNull(), // 'high_spending', 'low_fwi', 'frequent_ewa', etc.
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).notNull(),
  interventionType: mysqlEnum("interventionType", [
    "education",        // Automated education program
    "personalized_goal", // Create personalized savings goal
    "merchant_offers",  // Targeted merchant offers
    "ewa_counseling",   // EWA counseling
    "manager_alert"     // Alert to manager
  ]).notNull(),
  interventionStatus: mysqlEnum("interventionStatus", ["pending", "active", "paused", "completed", "failed"]).default("pending").notNull(),
  expectedOutcome: text("expectedOutcome"), // JSON con métricas esperadas
  actualOutcome: text("actualOutcome"), // JSON con resultados reales
  roiEstimated: int("roiEstimated"), // ROI estimado en centavos
  roiActual: int("roiActual"), // ROI real en centavos
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RiskInterventionPlan = typeof riskInterventionPlans.$inferSelect;
export type InsertRiskInterventionPlan = typeof riskInterventionPlans.$inferInsert;

/**
 * Ecosystem Engagement Metrics - Métricas de engagement por empresa
 */
export const ecosystemEngagementMetrics = mysqlTable("ecosystem_engagement_metrics", {
  id: int("id").autoincrement().primaryKey(),
  departmentId: int("departmentId").notNull(),
  month: int("month").notNull(),
  year: int("year").notNull(),
  totalEmployees: int("totalEmployees").notNull(),
  activeEmployees: int("activeEmployees").notNull(), // Usuarios activos en el mes
  avgTreePointsPerEmployee: int("avgTreePointsPerEmployee").notNull(),
  totalTreePointsRedeemed: int("totalTreePointsRedeemed").notNull(),
  ewaRequestsCount: int("ewaRequestsCount").notNull(),
  ewaApprovalRate: decimal("ewaApprovalRate", { precision: 5, scale: 2 }).notNull(),
  avgFwiScoreImprovement: int("avgFwiScoreImprovement").notNull(), // En puntos
  engagementScore: int("engagementScore").notNull(), // 0-100
  interventionPlansStarted: int("interventionPlansStarted").notNull(),
  interventionPlansCompleted: int("interventionPlansCompleted").notNull(),
  estimatedROI: int("estimatedROI").notNull(), // En centavos
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EcosystemEngagementMetrics = typeof ecosystemEngagementMetrics.$inferSelect;
export type InsertEcosystemEngagementMetrics = typeof ecosystemEngagementMetrics.$inferInsert;

/**
 * PHASE 1: Intervention Automation Engine
 * Automated workflows triggered by churn risk levels
 */
export const interventionWorkflows = mysqlTable("intervention_workflows", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  churnProbability: decimal("churnProbability", { precision: 5, scale: 4 }).notNull(), // 0-1
  riskLevel: mysqlEnum("riskLevel", ["critical", "high", "medium", "low", "minimal"]).notNull(),
  segment: varchar("segment", { length: 50 }).notNull(), // financial_champions, rising_stars, etc.
  interventionType: mysqlEnum("interventionType", [
    "counseling",           // 1-on-1 financial counseling
    "education",            // Automated education program
    "personalized_offer",   // Special pricing offer
    "manager_alert",        // Alert to manager
    "ewa_support",          // EWA support and guidance
    "goal_creation",        // Personalized goal creation
    "engagement_boost"      // Engagement activities
  ]).notNull(),
  status: mysqlEnum("status", ["pending", "active", "paused", "completed", "failed"]).default("pending").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).notNull(),
  successMetrics: text("successMetrics"), // JSON with target metrics
  actualResults: text("actualResults"), // JSON with actual results
  roiEstimated: int("roiEstimated"), // Estimated ROI in cents
  roiActual: int("roiActual"), // Actual ROI in cents
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InterventionWorkflow = typeof interventionWorkflows.$inferSelect;
export type InsertInterventionWorkflow = typeof interventionWorkflows.$inferInsert;

/**
 * Intervention Actions - Individual actions within a workflow
 */
export const interventionActions = mysqlTable("intervention_actions", {
  id: int("id").autoincrement().primaryKey(),
  workflowId: int("workflowId").notNull(),
  userId: int("userId").notNull(),
  actionType: varchar("actionType", { length: 50 }).notNull(), // counseling_session, email_sent, offer_created, etc.
  description: text("description"),
  actionData: text("actionData"), // JSON with action-specific data
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "failed"]).default("pending").notNull(),
  completedAt: timestamp("completedAt"),
  result: text("result"), // JSON with action result
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InterventionAction = typeof interventionActions.$inferSelect;
export type InsertInterventionAction = typeof interventionActions.$inferInsert;

/**
 * Intervention Success Tracking
 */
export const interventionSuccessMetrics = mysqlTable("intervention_success_metrics", {
  id: int("id").autoincrement().primaryKey(),
  workflowId: int("workflowId").notNull(),
  userId: int("userId").notNull(),
  interventionType: varchar("interventionType", { length: 50 }).notNull(),
  preInterventionFwi: int("preInterventionFwi"),
  postInterventionFwi: int("postInterventionFwi"),
  fwiImprovement: int("fwiImprovement"), // Puntos de mejora
  churnRiskBefore: decimal("churnRiskBefore", { precision: 5, scale: 4 }),
  churnRiskAfter: decimal("churnRiskAfter", { precision: 5, scale: 4 }),
  churnRiskReduction: decimal("churnRiskReduction", { precision: 5, scale: 4 }), // Porcentaje de reducción
  engagementIncrease: int("engagementIncrease"), // 0-100
  estimatedSavings: int("estimatedSavings"), // En centavos
  actualSavings: int("actualSavings"), // En centavos
  successScore: int("successScore"), // 0-100
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InterventionSuccessMetrics = typeof interventionSuccessMetrics.$inferSelect;
export type InsertInterventionSuccessMetrics = typeof interventionSuccessMetrics.$inferInsert;

/**
 * PHASE 2: Mobile Push Notifications
 * Configuration and delivery tracking for mobile push notifications
 */
export const mobilePushNotifications = mysqlTable("mobile_push_notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceToken: varchar("deviceToken", { length: 500 }).notNull(),
  deviceType: mysqlEnum("deviceType", ["ios", "android", "web"]).notNull(),
  appVersion: varchar("appVersion", { length: 20 }),
  osVersion: varchar("osVersion", { length: 20 }),
  isActive: boolean("isActive").default(true).notNull(),
  lastUsedAt: timestamp("lastUsedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MobilePushNotification = typeof mobilePushNotifications.$inferSelect;
export type InsertMobilePushNotification = typeof mobilePushNotifications.$inferInsert;

/**
 * Push Notification Campaigns
 */
export const pushNotificationCampaigns = mysqlTable("push_notification_campaigns", {
  id: int("id").autoincrement().primaryKey(),
  campaignName: varchar("campaignName", { length: 255 }).notNull(),
  campaignType: mysqlEnum("campaignType", [
    "churn_alert",          // Alertas de riesgo de churn
    "intervention_offer",   // Ofertas de intervención
    "engagement_boost",     // Actividades de engagement
    "achievement",          // Logros desbloqueados
    "goal_reminder",        // Recordatorios de metas
    "ewa_available",        // EWA disponible
    "educational",          // Contenido educativo
    "promotional"           // Promocional
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  actionUrl: varchar("actionUrl", { length: 500 }),
  targetSegment: varchar("targetSegment", { length: 100 }), // financial_champions, at_risk, etc.
  targetRiskLevel: varchar("targetRiskLevel", { length: 50 }), // critical, high, medium, low
  scheduledAt: timestamp("scheduledAt"),
  sentAt: timestamp("sentAt"),
  status: mysqlEnum("status", ["draft", "scheduled", "sent", "cancelled"]).default("draft").notNull(),
  totalSent: int("totalSent").default(0),
  totalOpened: int("totalOpened").default(0),
  totalClicked: int("totalClicked").default(0),
  openRate: decimal("openRate", { precision: 5, scale: 2 }).default('0'),
  clickRate: decimal("clickRate", { precision: 5, scale: 2 }).default('0'),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PushNotificationCampaign = typeof pushNotificationCampaigns.$inferSelect;
export type InsertPushNotificationCampaign = typeof pushNotificationCampaigns.$inferInsert;

/**
 * Push Notification Delivery Log
 */
export const pushNotificationDeliveryLog = mysqlTable("push_notification_delivery_log", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  userId: int("userId").notNull(),
  deviceToken: varchar("deviceToken", { length: 500 }).notNull(),
  status: mysqlEnum("status", ["pending", "sent", "delivered", "failed", "bounced"]).default("pending").notNull(),
  deliveredAt: timestamp("deliveredAt"),
  openedAt: timestamp("openedAt"),
  clickedAt: timestamp("clickedAt"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PushNotificationDeliveryLog = typeof pushNotificationDeliveryLog.$inferSelect;
export type InsertPushNotificationDeliveryLog = typeof pushNotificationDeliveryLog.$inferInsert;

/**
 * PHASE 3: Executive Reporting Dashboard
 * Automated reports and executive metrics
 */
export const executiveReports = mysqlTable("executive_reports", {
  id: int("id").autoincrement().primaryKey(),
  reportType: mysqlEnum("reportType", [
    "monthly_summary",      // Resumen mensual
    "churn_analysis",       // Análisis de churn
    "intervention_roi",     // ROI de intervenciones
    "segment_performance",  // Rendimiento por segmento
    "pricing_effectiveness",// Efectividad de pricing
    "engagement_trends",    // Tendencias de engagement
    "risk_dashboard"        // Dashboard de riesgo
  ]).notNull(),
  reportPeriod: varchar("reportPeriod", { length: 50 }).notNull(), // 2024-01, 2024-Q1, etc.
  departmentId: int("departmentId"), // NULL = global report
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  reportData: text("reportData"), // JSON with complete report data
  summary: text("summary"), // Executive summary
  keyMetrics: text("keyMetrics"), // JSON with key metrics
  recommendations: text("recommendations"), // JSON array of recommendations
  filePath: varchar("filePath", { length: 500 }), // Path to PDF/Excel file
  generatedBy: int("generatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExecutiveReport = typeof executiveReports.$inferSelect;
export type InsertExecutiveReport = typeof executiveReports.$inferInsert;

/**
 * Executive Dashboard Metrics - Real-time metrics for executives
 */
export const executiveDashboardMetrics = mysqlTable("executive_dashboard_metrics", {
  id: int("id").autoincrement().primaryKey(),
  departmentId: int("departmentId"), // NULL = global
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  totalEmployees: int("totalEmployees").notNull(),
  avgFwiScore: int("avgFwiScore").notNull(),
  employeesAtRisk: int("employeesAtRisk").notNull(),
  riskPercentage: decimal("riskPercentage", { precision: 5, scale: 2 }).notNull(),
  churnRiskAverage: decimal("churnRiskAverage", { precision: 5, scale: 4 }).notNull(),
  predictedChurnCount: int("predictedChurnCount").default(0),
  activeInterventions: int("activeInterventions").default(0),
  completedInterventions: int("completedInterventions").default(0),
  interventionSuccessRate: decimal("interventionSuccessRate", { precision: 5, scale: 2 }).default('0'),
  estimatedROI: int("estimatedROI").default(0), // En centavos
  totalTreePointsIssued: int("totalTreePointsIssued").default(0),
  totalTreePointsRedeemed: int("totalTreePointsRedeemed").default(0),
  ewaRequestsCount: int("ewaRequestsCount").default(0),
  ewaApprovalRate: decimal("ewaApprovalRate", { precision: 5, scale: 2 }).default('0'),
  engagementScore: int("engagementScore").default(0), // 0-100
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ExecutiveDashboardMetrics = typeof executiveDashboardMetrics.$inferSelect;
export type InsertExecutiveDashboardMetrics = typeof executiveDashboardMetrics.$inferInsert;

/**
 * Report Subscriptions - Users who receive automated reports
 */
export const reportSubscriptions = mysqlTable("report_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  reportType: varchar("reportType", { length: 50 }).notNull(),
  frequency: mysqlEnum("frequency", ["daily", "weekly", "monthly", "quarterly"]).notNull(),
  deliveryMethod: mysqlEnum("deliveryMethod", ["email", "dashboard", "both"]).default("email").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  lastSentAt: timestamp("lastSentAt"),
  nextSendAt: timestamp("nextSendAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReportSubscription = typeof reportSubscriptions.$inferSelect;
export type InsertReportSubscription = typeof reportSubscriptions.$inferInsert;


/**
 * OAuth Accounts - Link multiple OAuth providers to a single user
 */
export const oauthAccounts = mysqlTable("oauth_accounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  provider: mysqlEnum("provider", ["google", "github", "microsoft", "manus"]).notNull(),
  providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  name: varchar("name", { length: 255 }),
  picture: text("picture"),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  expiresAt: timestamp("expiresAt"),
  scope: text("scope"),
  tokenType: varchar("tokenType", { length: 50 }),
  idToken: text("idToken"),
  sessionState: varchar("sessionState", { length: 255 }),
  isLinked: boolean("isLinked").default(true).notNull(),
  isPrimary: boolean("isPrimary").default(false).notNull(),
  lastUsedAt: timestamp("lastUsedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OAuthAccount = typeof oauthAccounts.$inferSelect;
export type InsertOAuthAccount = typeof oauthAccounts.$inferInsert;

/**
 * OAuth Sessions - Track OAuth login sessions
 */
export const oauthSessions = mysqlTable("oauth_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  provider: mysqlEnum("provider", ["google", "github", "microsoft", "manus"]).notNull(),
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OAuthSession = typeof oauthSessions.$inferSelect;
export type InsertOAuthSession = typeof oauthSessions.$inferInsert;
