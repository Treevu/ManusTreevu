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
  secret: varchar("secret", { length: 64 }).notNull(), // TOTP secret (encrypted)
  enabled: boolean("enabled").default(false).notNull(),
  verifiedAt: timestamp("verifiedAt"), // When MFA was first verified
  backupCodes: text("backupCodes"), // JSON array of hashed backup codes
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
  organizationId: int("organizationId"), // NULL = global survey
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
  options: text("options"), // JSON for choice questions
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
  responseValue: int("responseValue"), // 1-5 for scale/emoji
  responseText: text("responseText"), // For text responses
  responseChoice: varchar("responseChoice", { length: 200 }), // For choice questions
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
