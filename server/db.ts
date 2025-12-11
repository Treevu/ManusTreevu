import { eq, and, desc, gte, lte, sql, gt, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  transactions, InsertTransaction,
  financialGoals, InsertFinancialGoal,
  ewaRequests, InsertEwaRequest,
  treePointsTransactions, InsertTreePointsTransaction,
  marketOffers, InsertMarketOffer,
  departments, InsertDepartment,
  employeeRiskAnalysis, InsertEmployeeRiskAnalysis,
  securitySessions, InsertSecuritySession,
  fwiScoreHistory, InsertFwiScoreHistory,
  auditLogs, InsertAuditLog,
  notifications, InsertNotification,
  notificationPreferences, InsertNotificationPreference,
  achievements, Achievement,
  userAchievements, UserAchievement, InsertUserAchievement,
  referrals, Referral, InsertReferral,
  departmentAlertThresholds, InsertDepartmentAlertThreshold,
  departmentAlertHistory, InsertDepartmentAlertHistory,
  leads, InsertLead,
  monthlyMetricsSnapshots, InsertMonthlyMetricsSnapshot,
  organizationAlertThresholds, InsertOrganizationAlertThreshold
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================
// USER OPERATIONS
// ============================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, userId));
}

export async function getUsersByRole(role: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(users).where(eq(users.role, role as any));
}

export async function getUsersByDepartment(departmentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(users).where(eq(users.departmentId, departmentId));
}

// ============================================
// TRANSACTION OPERATIONS
// ============================================

export async function createTransaction(data: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(transactions).values(data);
  return result[0].insertId;
}

export async function getTransactionsByUser(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.transactionDate))
    .limit(limit);
}

export async function getTransactionsByCategory(userId: number, category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(transactions)
    .where(and(
      eq(transactions.userId, userId),
      eq(transactions.category, category as any)
    ))
    .orderBy(desc(transactions.transactionDate));
}

export async function getTransactionSummary(userId: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select({
    category: transactions.category,
    total: sql<number>`SUM(${transactions.amount})`,
    count: sql<number>`COUNT(*)`,
  })
    .from(transactions)
    .where(and(
      eq(transactions.userId, userId),
      gte(transactions.transactionDate, startDate),
      lte(transactions.transactionDate, endDate)
    ))
    .groupBy(transactions.category);
  
  return result;
}

// ============================================
// FINANCIAL GOALS OPERATIONS
// ============================================

export async function createFinancialGoal(data: InsertFinancialGoal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(financialGoals).values(data);
  return result[0].insertId;
}

export async function getFinancialGoalsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(financialGoals)
    .where(eq(financialGoals.userId, userId))
    .orderBy(desc(financialGoals.isPriority), desc(financialGoals.createdAt));
}

export async function updateFinancialGoal(goalId: number, data: Partial<InsertFinancialGoal>) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(financialGoals).set({ ...data, updatedAt: new Date() }).where(eq(financialGoals.id, goalId));
}

export async function contributeToGoal(goalId: number, amount: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(financialGoals)
    .set({ 
      currentAmount: sql`${financialGoals.currentAmount} + ${amount}`,
      updatedAt: new Date()
    })
    .where(eq(financialGoals.id, goalId));
}

// ============================================
// EWA OPERATIONS
// ============================================

export async function createEwaRequest(data: InsertEwaRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(ewaRequests).values(data);
  return result[0].insertId;
}

export async function getEwaRequestsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(ewaRequests)
    .where(eq(ewaRequests.userId, userId))
    .orderBy(desc(ewaRequests.createdAt));
}

export async function getPendingEwaRequests() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(ewaRequests)
    .where(eq(ewaRequests.status, "pending_approval"))
    .orderBy(desc(ewaRequests.createdAt));
}

export async function updateEwaStatus(
  requestId: number, 
  status: "pending_approval" | "processing_transfer" | "disbursed" | "rejected",
  approvedBy?: number,
  rejectionReason?: string
) {
  const db = await getDb();
  if (!db) return;
  
  const updateData: Partial<InsertEwaRequest> = { 
    status,
    updatedAt: new Date()
  };
  
  if (approvedBy) updateData.approvedBy = approvedBy;
  if (rejectionReason) updateData.rejectionReason = rejectionReason;
  if (status === "disbursed") updateData.disbursedAt = new Date();
  
  await db.update(ewaRequests).set(updateData).where(eq(ewaRequests.id, requestId));
}

export async function getActiveEwaByUser(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select()
    .from(ewaRequests)
    .where(and(
      eq(ewaRequests.userId, userId),
      eq(ewaRequests.status, "pending_approval")
    ))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

// ============================================
// TREEPOINTS OPERATIONS
// ============================================

export async function createTreePointsTransaction(data: InsertTreePointsTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(treePointsTransactions).values(data);
  
  // Update user's total points
  await db.update(users)
    .set({ 
      treePoints: sql`${users.treePoints} + ${data.amount}`,
      updatedAt: new Date()
    })
    .where(eq(users.id, data.userId));
  
  return result[0].insertId;
}

export async function getTreePointsHistory(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(treePointsTransactions)
    .where(eq(treePointsTransactions.userId, userId))
    .orderBy(desc(treePointsTransactions.createdAt))
    .limit(limit);
}

export async function getTreePointsByDepartment(departmentId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select({
    totalIssued: sql<number>`SUM(CASE WHEN ${treePointsTransactions.amount} > 0 THEN ${treePointsTransactions.amount} ELSE 0 END)`,
    totalRedeemed: sql<number>`SUM(CASE WHEN ${treePointsTransactions.amount} < 0 THEN ABS(${treePointsTransactions.amount}) ELSE 0 END)`,
    transactionCount: sql<number>`COUNT(*)`,
  })
    .from(treePointsTransactions)
    .where(eq(treePointsTransactions.departmentId, departmentId));
  
  return result[0];
}

// ============================================
// MARKET OFFERS OPERATIONS
// ============================================

export async function createMarketOffer(data: InsertMarketOffer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(marketOffers).values(data);
  return result[0].insertId;
}

export async function getActiveOffers(fwiSegment?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (fwiSegment && fwiSegment !== 'all') {
    return db.select()
      .from(marketOffers)
      .where(and(
        eq(marketOffers.isActive, true),
        sql`${marketOffers.targetFwiSegment} IN ('all', ${fwiSegment})`
      ))
      .orderBy(desc(marketOffers.createdAt));
  }
  
  return db.select()
    .from(marketOffers)
    .where(eq(marketOffers.isActive, true))
    .orderBy(desc(marketOffers.createdAt));
}

export async function getOffersByMerchant(merchantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(marketOffers)
    .where(eq(marketOffers.merchantId, merchantId))
    .orderBy(desc(marketOffers.createdAt));
}

export async function updateOfferStats(offerId: number, redemptions: number, conversions: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(marketOffers)
    .set({ 
      totalRedemptions: sql`${marketOffers.totalRedemptions} + ${redemptions}`,
      totalConversions: sql`${marketOffers.totalConversions} + ${conversions}`,
      updatedAt: new Date()
    })
    .where(eq(marketOffers.id, offerId));
}

// ============================================
// DEPARTMENT OPERATIONS
// ============================================

export async function createDepartment(data: InsertDepartment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(departments).values(data);
  return result[0].insertId;
}

export async function getDepartments() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(departments).orderBy(departments.name);
}

export async function getDepartmentById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateDepartmentStats(departmentId: number) {
  const db = await getDb();
  if (!db) return;
  
  // Calculate average FWI score and employee count
  const stats = await db.select({
    avgFwi: sql<number>`AVG(${users.fwiScore})`,
    count: sql<number>`COUNT(*)`,
  })
    .from(users)
    .where(eq(users.departmentId, departmentId));
  
  if (stats[0]) {
    await db.update(departments)
      .set({ 
        avgFwiScore: Math.round(stats[0].avgFwi || 50),
        employeeCount: stats[0].count || 0,
        updatedAt: new Date()
      })
      .where(eq(departments.id, departmentId));
  }
}

// ============================================
// EMPLOYEE RISK ANALYSIS OPERATIONS
// ============================================

export async function upsertEmployeeRiskAnalysis(data: InsertEmployeeRiskAnalysis) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(employeeRiskAnalysis)
    .values(data)
    .onDuplicateKeyUpdate({
      set: {
        absenteeismRisk: data.absenteeismRisk,
        turnoverPropensity: data.turnoverPropensity,
        ewaFrequency: data.ewaFrequency,
        lastFwiScore: data.lastFwiScore,
        projectedLoss: data.projectedLoss,
        lastAnalysisDate: new Date(),
        updatedAt: new Date(),
      }
    });
}

export async function getEmployeeRiskByDepartment(departmentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(employeeRiskAnalysis)
    .where(eq(employeeRiskAnalysis.departmentId, departmentId))
    .orderBy(desc(employeeRiskAnalysis.turnoverPropensity));
}

export async function getHighRiskEmployees(minTurnoverPropensity = 60) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(employeeRiskAnalysis)
    .where(gte(employeeRiskAnalysis.turnoverPropensity, minTurnoverPropensity))
    .orderBy(desc(employeeRiskAnalysis.turnoverPropensity));
}

export async function getRiskSummaryByDepartment() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    departmentId: employeeRiskAnalysis.departmentId,
    avgTurnoverPropensity: sql<number>`AVG(${employeeRiskAnalysis.turnoverPropensity})`,
    highRiskCount: sql<number>`SUM(CASE WHEN ${employeeRiskAnalysis.turnoverPropensity} >= 60 THEN 1 ELSE 0 END)`,
    totalProjectedLoss: sql<number>`SUM(${employeeRiskAnalysis.projectedLoss})`,
    employeeCount: sql<number>`COUNT(*)`,
  })
    .from(employeeRiskAnalysis)
    .groupBy(employeeRiskAnalysis.departmentId);
}

// ============================================
// FWI SCORE HISTORY OPERATIONS
// ============================================

export async function recordFwiScore(userId: number, score: number, factors?: object) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(fwiScoreHistory).values({
    userId,
    score,
    factors: factors ? JSON.stringify(factors) : null,
  });
  
  // Update user's current FWI score
  await db.update(users)
    .set({ fwiScore: score, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function getFwiScoreHistory(userId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(fwiScoreHistory)
    .where(eq(fwiScoreHistory.userId, userId))
    .orderBy(desc(fwiScoreHistory.recordedAt))
    .limit(limit);
}

// ============================================
// SECURITY SESSION OPERATIONS
// ============================================

export async function createSecuritySession(data: InsertSecuritySession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(securitySessions).values(data);
  return result[0].insertId;
}

export async function getActiveSessionsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(securitySessions)
    .where(and(
      eq(securitySessions.userId, userId),
      eq(securitySessions.isActive, true)
    ))
    .orderBy(desc(securitySessions.lastActivity));
}

export async function invalidateSession(sessionToken: string) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(securitySessions)
    .set({ isActive: false })
    .where(eq(securitySessions.sessionToken, sessionToken));
}

export async function invalidateAllUserSessions(userId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(securitySessions)
    .set({ isActive: false })
    .where(eq(securitySessions.userId, userId));
}

// ============================================
// AUDIT LOG OPERATIONS
// ============================================

export async function createAuditLog(data: InsertAuditLog) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(auditLogs).values(data);
}

export async function getAuditLogsByUser(userId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(auditLogs)
    .where(eq(auditLogs.userId, userId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);
}

export async function getAuditLogsByResource(resource: string, resourceId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(auditLogs)
    .where(and(
      eq(auditLogs.resource, resource),
      eq(auditLogs.resourceId, resourceId)
    ))
    .orderBy(desc(auditLogs.createdAt));
}


// ============================================
// NOTIFICATION OPERATIONS
// ============================================

export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check user preferences before creating notification
  const prefs = await getNotificationPreferences(data.userId);
  if (prefs) {
    const typeToPreference: Record<string, keyof typeof prefs> = {
      'ewa_approved': 'ewaApproved',
      'ewa_rejected': 'ewaRejected',
      'ewa_disbursed': 'ewaDisbursed',
      'treepoints_received': 'treepointsReceived',
      'treepoints_redeemed': 'treepointsRedeemed',
      'goal_progress': 'goalProgress',
      'goal_completed': 'goalCompleted',
      'fwi_improved': 'fwiImproved',
      'fwi_alert': 'fwiAlert',
      'level_up': 'levelUp',
      'streak_milestone': 'streakMilestone',
      'offer_available': 'offerAvailable',
      'system_announcement': 'systemAnnouncement',
      'security_alert': 'securityAlert',
    };
    
    const prefKey = typeToPreference[data.type];
    if (prefKey && prefs[prefKey] === false) {
      return null; // User has disabled this notification type
    }
    
    if (!prefs.inAppEnabled) {
      return null; // User has disabled in-app notifications
    }
  }
  
  const result = await db.insert(notifications).values(data);
  return result[0].insertId;
}

export async function getNotificationsByUser(userId: number, limit = 50, unreadOnly = false) {
  const db = await getDb();
  if (!db) return [];
  
  if (unreadOnly) {
    return db.select()
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }
  
  return db.select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadNotificationCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({
    count: sql<number>`COUNT(*)`
  })
    .from(notifications)
    .where(and(
      eq(notifications.userId, userId),
      eq(notifications.isRead, false)
    ));
  
  return result[0]?.count ?? 0;
}

export async function markNotificationAsRead(notificationId: number, userId: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.update(notifications)
    .set({ 
      isRead: true,
      readAt: new Date()
    })
    .where(and(
      eq(notifications.id, notificationId),
      eq(notifications.userId, userId)
    ));
  
  return true;
}

export async function markAllNotificationsAsRead(userId: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.update(notifications)
    .set({ 
      isRead: true,
      readAt: new Date()
    })
    .where(and(
      eq(notifications.userId, userId),
      eq(notifications.isRead, false)
    ));
  
  return true;
}

export async function deleteNotification(notificationId: number, userId: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(notifications)
    .where(and(
      eq(notifications.id, notificationId),
      eq(notifications.userId, userId)
    ));
  
  return true;
}

export async function deleteAllNotifications(userId: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(notifications)
    .where(eq(notifications.userId, userId));
  
  return true;
}

// ============================================
// NOTIFICATION PREFERENCES OPERATIONS
// ============================================

export async function getNotificationPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, userId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function upsertNotificationPreferences(userId: number, data: Partial<InsertNotificationPreference>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getNotificationPreferences(userId);
  
  if (existing) {
    await db.update(notificationPreferences)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(notificationPreferences.userId, userId));
  } else {
    await db.insert(notificationPreferences).values({
      userId,
      ...data,
    });
  }
  
  return true;
}

// ============================================
// NOTIFICATION HELPER FUNCTIONS
// ============================================

export async function sendEwaNotification(
  userId: number, 
  type: 'ewa_approved' | 'ewa_rejected' | 'ewa_disbursed',
  amount: number,
  reason?: string
) {
  const titles: Record<string, string> = {
    'ewa_approved': '¡Adelanto Aprobado!',
    'ewa_rejected': 'Adelanto No Aprobado',
    'ewa_disbursed': '¡Dinero en Camino!',
  };
  
  const messages: Record<string, string> = {
    'ewa_approved': `Tu solicitud de adelanto por $${(amount / 100).toFixed(2)} ha sido aprobada.`,
    'ewa_rejected': `Tu solicitud de adelanto no fue aprobada. ${reason || 'Contacta a soporte para más información.'}`,
    'ewa_disbursed': `Tu adelanto de $${(amount / 100).toFixed(2)} está siendo transferido a tu cuenta.`,
  };
  
  const icons: Record<string, string> = {
    'ewa_approved': 'CheckCircle',
    'ewa_rejected': 'XCircle',
    'ewa_disbursed': 'Wallet',
  };
  
  return createNotification({
    userId,
    type,
    title: titles[type],
    message: messages[type],
    icon: icons[type],
    actionUrl: '/ewa',
    actionLabel: 'Ver Detalles',
  });
}

export async function sendTreePointsNotification(
  userId: number,
  type: 'treepoints_received' | 'treepoints_redeemed',
  amount: number,
  reason?: string
) {
  const isReceived = type === 'treepoints_received';
  
  return createNotification({
    userId,
    type,
    title: isReceived ? '¡TreePoints Recibidos!' : 'TreePoints Canjeados',
    message: isReceived 
      ? `Has recibido ${amount} TreePoints. ${reason || '¡Sigue así!'}`
      : `Has canjeado ${Math.abs(amount)} TreePoints. ${reason || ''}`,
    icon: isReceived ? 'Gift' : 'ShoppingBag',
    actionUrl: '/offers',
    actionLabel: isReceived ? 'Ver Ofertas' : 'Ver Historial',
  });
}

export async function sendGoalNotification(
  userId: number,
  type: 'goal_progress' | 'goal_completed',
  goalName: string,
  progress?: number
) {
  return createNotification({
    userId,
    type,
    title: type === 'goal_completed' ? '¡Meta Alcanzada!' : 'Progreso en tu Meta',
    message: type === 'goal_completed'
      ? `¡Felicidades! Has completado tu meta "${goalName}".`
      : `Tu meta "${goalName}" está al ${progress}%. ¡Sigue adelante!`,
    icon: type === 'goal_completed' ? 'Trophy' : 'Target',
    actionUrl: '/dashboard/employee',
    actionLabel: 'Ver Metas',
  });
}

export async function sendFwiNotification(
  userId: number,
  type: 'fwi_improved' | 'fwi_alert',
  currentScore: number,
  previousScore?: number
) {
  const improved = type === 'fwi_improved';
  const change = previousScore ? currentScore - previousScore : 0;
  
  return createNotification({
    userId,
    type,
    title: improved ? '¡Tu FWI Score Mejoró!' : 'Alerta de FWI Score',
    message: improved
      ? `Tu score subió ${change} puntos a ${currentScore}. ¡Excelente trabajo!`
      : `Tu FWI Score bajó a ${currentScore}. Revisa tus finanzas.`,
    icon: improved ? 'TrendingUp' : 'AlertTriangle',
    actionUrl: '/dashboard/employee',
    actionLabel: 'Ver Detalles',
  });
}

export async function sendLevelUpNotification(userId: number, newLevel: number) {
  return createNotification({
    userId,
    type: 'level_up',
    title: '¡Subiste de Nivel!',
    message: `¡Felicidades! Ahora eres nivel ${newLevel}. Desbloquea nuevos beneficios.`,
    icon: 'Star',
    actionUrl: '/dashboard/employee',
    actionLabel: 'Ver Beneficios',
  });
}

export async function sendStreakNotification(userId: number, streakDays: number) {
  return createNotification({
    userId,
    type: 'streak_milestone',
    title: '¡Racha Alcanzada!',
    message: `¡Increíble! Llevas ${streakDays} días consecutivos usando Treevü.`,
    icon: 'Flame',
    actionUrl: '/dashboard/employee',
    actionLabel: 'Ver Racha',
  });
}

export async function sendOfferNotification(userId: number, offerTitle: string, offerId: number) {
  return createNotification({
    userId,
    type: 'offer_available',
    title: '¡Nueva Oferta Disponible!',
    message: `Hay una nueva oferta para ti: "${offerTitle}"`,
    icon: 'Tag',
    actionUrl: '/offers',
    actionLabel: 'Ver Oferta',
    metadata: JSON.stringify({ offerId }),
  });
}

export async function sendSystemNotification(userId: number, title: string, message: string) {
  return createNotification({
    userId,
    type: 'system_announcement',
    title,
    message,
    icon: 'Bell',
  });
}

export async function sendSecurityAlert(userId: number, message: string, details?: string) {
  return createNotification({
    userId,
    type: 'security_alert',
    title: '⚠️ Alerta de Seguridad',
    message,
    icon: 'Shield',
    metadata: details ? JSON.stringify({ details }) : undefined,
  });
}


// ============================================
// EXPORT FUNCTIONS (Admin)
// ============================================

export async function getAdminUsers() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(users)
    .where(eq(users.role, 'admin'));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    fwiScore: users.fwiScore,
    treePoints: users.treePoints,
    level: users.level,
    departmentId: users.departmentId,
    monthlyIncome: users.monthlyIncome,
    createdAt: users.createdAt,
    lastSignedIn: users.lastSignedIn,
  }).from(users);
  
  return result;
}

export async function getAllTransactions(startDate?: string, endDate?: string) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select({
    id: transactions.id,
    userId: transactions.userId,
    amount: transactions.amount,
    category: transactions.category,
    merchant: transactions.merchant,
    description: transactions.description,
    transactionDate: transactions.transactionDate,
    createdAt: transactions.createdAt,
  }).from(transactions);
  
  // Note: Date filtering would need proper SQL conditions
  // For now, return all and filter in service if needed
  
  const result = await query.orderBy(desc(transactions.createdAt)).limit(10000);
  return result;
}

export async function getAllEwaRequests() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    id: ewaRequests.id,
    userId: ewaRequests.userId,
    amount: ewaRequests.amount,
    fee: ewaRequests.fee,
    status: ewaRequests.status,
    rejectionReason: ewaRequests.rejectionReason,
    approvedBy: ewaRequests.approvedBy,
    createdAt: ewaRequests.createdAt,
    disbursedAt: ewaRequests.disbursedAt,
  }).from(ewaRequests)
    .orderBy(desc(ewaRequests.createdAt))
    .limit(10000);
  
  return result;
}

export async function getAllTreePointsTransactions() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    id: treePointsTransactions.id,
    userId: treePointsTransactions.userId,
    amount: treePointsTransactions.amount,
    type: treePointsTransactions.type,
    reason: treePointsTransactions.reason,
    createdAt: treePointsTransactions.createdAt,
  }).from(treePointsTransactions)
    .orderBy(desc(treePointsTransactions.createdAt))
    .limit(10000);
  
  return result;
}

export async function getAllGoals() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    id: financialGoals.id,
    userId: financialGoals.userId,
    name: financialGoals.name,
    targetAmount: financialGoals.targetAmount,
    currentAmount: financialGoals.currentAmount,
    deadline: financialGoals.deadline,
    isCompleted: financialGoals.isCompleted,
    createdAt: financialGoals.createdAt,
  }).from(financialGoals)
    .orderBy(desc(financialGoals.createdAt))
    .limit(10000);
  
  return result;
}

export async function getDepartmentMetrics() {
  const db = await getDb();
  if (!db) return [];
  
  const depts = await db.select().from(departments);
  
  // Get metrics for each department
  const metrics = await Promise.all(depts.map(async (dept) => {
    const employees = await db.select()
      .from(users)
      .where(eq(users.departmentId, dept.id));
    
    const avgFwi = employees.length > 0 
      ? employees.reduce((sum, e) => sum + (e.fwiScore || 0), 0) / employees.length 
      : 0;
    
    const totalPoints = employees.reduce((sum, e) => sum + (e.treePoints || 0), 0);
    
    return {
      name: dept.name,
      employeeCount: employees.length,
      avgFwiScore: Math.round(avgFwi),
      totalTreePoints: totalPoints,
      ewaRequestCount: 0, // Would need join
      riskLevel: avgFwi >= 60 ? 'Bajo' : avgFwi >= 40 ? 'Medio' : 'Alto',
    };
  }));
  
  return metrics;
}


// ============================================
// ACHIEVEMENTS FUNCTIONS
// ============================================

export async function getAllAchievements(): Promise<Achievement[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(achievements).orderBy(achievements.sortOrder);
}

export async function getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    id: userAchievements.id,
    userId: userAchievements.userId,
    achievementId: userAchievements.achievementId,
    unlockedAt: userAchievements.unlockedAt,
    progress: userAchievements.progress,
    notified: userAchievements.notified,
    achievement: achievements,
  })
    .from(userAchievements)
    .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
    .where(eq(userAchievements.userId, userId));
  
  return result as any;
}

export async function hasAchievement(userId: number, achievementCode: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const achievement = await db.select()
    .from(achievements)
    .where(eq(achievements.code, achievementCode))
    .limit(1);
  
  if (achievement.length === 0) return false;
  
  const userAch = await db.select()
    .from(userAchievements)
    .where(and(
      eq(userAchievements.userId, userId),
      eq(userAchievements.achievementId, achievement[0].id)
    ))
    .limit(1);
  
  return userAch.length > 0;
}

export async function unlockAchievement(userId: number, achievementCode: string): Promise<{ success: boolean; achievement?: Achievement; pointsAwarded?: number }> {
  const db = await getDb();
  if (!db) return { success: false };
  
  // Check if achievement exists
  const achievementResult = await db.select()
    .from(achievements)
    .where(eq(achievements.code, achievementCode))
    .limit(1);
  
  if (achievementResult.length === 0) return { success: false };
  
  const achievement = achievementResult[0];
  
  // Check if already unlocked
  const existing = await db.select()
    .from(userAchievements)
    .where(and(
      eq(userAchievements.userId, userId),
      eq(userAchievements.achievementId, achievement.id)
    ))
    .limit(1);
  
  if (existing.length > 0) return { success: false };
  
  // Unlock achievement
  await db.insert(userAchievements).values({
    userId,
    achievementId: achievement.id,
    progress: 100,
    notified: false,
  });
  
  // Award TreePoints
  if (achievement.pointsReward > 0) {
    await db.update(users)
      .set({ treePoints: sql`${users.treePoints} + ${achievement.pointsReward}` })
      .where(eq(users.id, userId));
  }
  
  return { success: true, achievement, pointsAwarded: achievement.pointsReward };
}

export async function getAchievementByCode(code: string): Promise<Achievement | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select()
    .from(achievements)
    .where(eq(achievements.code, code))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

// ============================================
// LEADERBOARD FUNCTIONS
// ============================================

export async function getLeaderboardByLevel(limit: number = 10): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    id: users.id,
    name: users.name,
    level: users.level,
    treePoints: users.treePoints,
    fwiScore: users.fwiScore,
    streakDays: users.streakDays,
  })
    .from(users)
    .where(eq(users.role, 'employee'))
    .orderBy(desc(users.level), desc(users.treePoints))
    .limit(limit);
  
  return result;
}

export async function getLeaderboardByPoints(limit: number = 10): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    id: users.id,
    name: users.name,
    level: users.level,
    treePoints: users.treePoints,
    fwiScore: users.fwiScore,
    streakDays: users.streakDays,
  })
    .from(users)
    .where(eq(users.role, 'employee'))
    .orderBy(desc(users.treePoints))
    .limit(limit);
  
  return result;
}

export async function getLeaderboardByFwi(limit: number = 10): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    id: users.id,
    name: users.name,
    level: users.level,
    treePoints: users.treePoints,
    fwiScore: users.fwiScore,
    streakDays: users.streakDays,
  })
    .from(users)
    .where(eq(users.role, 'employee'))
    .orderBy(desc(users.fwiScore))
    .limit(limit);
  
  return result;
}

export async function getUserRank(userId: number, type: 'level' | 'points' | 'fwi'): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (user.length === 0) return 0;
  
  const orderField = type === 'level' ? users.level : type === 'points' ? users.treePoints : users.fwiScore;
  const userValue = type === 'level' ? user[0].level : type === 'points' ? user[0].treePoints : user[0].fwiScore;
  
  const higherRanked = await db.select({ count: sql<number>`count(*)` })
    .from(users)
    .where(and(
      eq(users.role, 'employee'),
      gt(orderField, userValue || 0)
    ));
  
  return (higherRanked[0]?.count || 0) + 1;
}

export async function getLeaderboardByDepartment(departmentId: number, limit: number = 10): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    id: users.id,
    name: users.name,
    level: users.level,
    treePoints: users.treePoints,
    fwiScore: users.fwiScore,
    streakDays: users.streakDays,
  })
    .from(users)
    .where(and(
      eq(users.role, 'employee'),
      eq(users.departmentId, departmentId)
    ))
    .orderBy(desc(users.level), desc(users.treePoints))
    .limit(limit);
  
  return result;
}


// ============================================
// REFERRAL FUNCTIONS
// ============================================

export async function generateReferralCode(): Promise<string> {
  return nanoid(8).toUpperCase();
}

export async function getUserReferralCode(userId: number): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  
  // Check if user already has a referral code
  const existing = await db.select()
    .from(referrals)
    .where(and(
      eq(referrals.referrerId, userId),
      eq(referrals.status, 'pending'),
      isNull(referrals.referredEmail)
    ))
    .limit(1);
  
  if (existing.length > 0) {
    return existing[0].referralCode;
  }
  
  // Generate new referral code
  const code = await generateReferralCode();
  await db.insert(referrals).values({
    referrerId: userId,
    referralCode: code,
    status: 'pending',
    rewardAmount: 500,
  });
  
  return code;
}

export async function getReferralByCode(code: string): Promise<Referral | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select()
    .from(referrals)
    .where(eq(referrals.referralCode, code.toUpperCase()))
    .limit(1);
  
  return result[0] || null;
}

export async function getUserReferrals(userId: number): Promise<Referral[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(referrals)
    .where(eq(referrals.referrerId, userId))
    .orderBy(desc(referrals.createdAt));
}

export async function getUserReferralStats(userId: number): Promise<{
  totalInvited: number;
  totalRegistered: number;
  totalRewarded: number;
  totalPointsEarned: number;
}> {
  const db = await getDb();
  if (!db) return { totalInvited: 0, totalRegistered: 0, totalRewarded: 0, totalPointsEarned: 0 };
  
  const allReferrals = await db.select()
    .from(referrals)
    .where(eq(referrals.referrerId, userId));
  
  const totalInvited = allReferrals.length;
  const totalRegistered = allReferrals.filter(r => r.status === 'registered' || r.status === 'rewarded').length;
  const totalRewarded = allReferrals.filter(r => r.status === 'rewarded').length;
  const totalPointsEarned = allReferrals
    .filter(r => r.referrerRewarded)
    .reduce((sum, r) => sum + r.rewardAmount, 0);
  
  return { totalInvited, totalRegistered, totalRewarded, totalPointsEarned };
}

export async function createReferralInvite(referrerId: number, email: string): Promise<Referral | null> {
  const db = await getDb();
  if (!db) return null;
  
  const code = await generateReferralCode();
  
  await db.insert(referrals).values({
    referrerId,
    referralCode: code,
    referredEmail: email,
    status: 'pending',
    rewardAmount: 500,
  });
  
  const result = await db.select()
    .from(referrals)
    .where(eq(referrals.referralCode, code))
    .limit(1);
  
  return result[0] || null;
}

export async function processReferralRegistration(
  referralCode: string, 
  newUserId: number
): Promise<{ success: boolean; referrerId?: number; referrerReward?: number; referredReward?: number }> {
  const db = await getDb();
  if (!db) return { success: false };
  
  const referral = await getReferralByCode(referralCode);
  if (!referral || referral.status !== 'pending') {
    return { success: false };
  }
  
  // Update referral status
  await db.update(referrals)
    .set({
      referredId: newUserId,
      status: 'registered',
      registeredAt: new Date(),
    })
    .where(eq(referrals.id, referral.id));
  
  // Award TreePoints to referrer
  await db.update(users)
    .set({
      treePoints: sql`${users.treePoints} + ${referral.rewardAmount}`,
    })
    .where(eq(users.id, referral.referrerId));
  
  // Award TreePoints to referred user (bonus)
  const referredBonus = Math.floor(referral.rewardAmount / 2);
  await db.update(users)
    .set({
      treePoints: sql`${users.treePoints} + ${referredBonus}`,
    })
    .where(eq(users.id, newUserId));
  
  // Mark as rewarded
  await db.update(referrals)
    .set({
      status: 'rewarded',
      referrerRewarded: true,
      referredRewarded: true,
    })
    .where(eq(referrals.id, referral.id));
  
  return { 
    success: true, 
    referrerId: referral.referrerId,
    referrerReward: referral.rewardAmount,
    referredReward: referredBonus 
  };
}


// ============================================
// ANALYTICS OPERATIONS
// ============================================

export async function getAnalyticsUserStats(startDate?: string) {
  const db = await getDb();
  if (!db) return { total: 0, activeToday: 0, newThisWeek: 0, byRole: {} };

  const allUsers = await db.select().from(users);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const filterDate = startDate ? new Date(startDate) : null;

  // Filter users by date range if specified
  const filteredUsers = filterDate 
    ? allUsers.filter(u => u.createdAt && new Date(u.createdAt) >= filterDate)
    : allUsers;

  const activeToday = allUsers.filter(u => u.lastSignedIn && new Date(u.lastSignedIn) >= today).length;
  const newThisWeek = allUsers.filter(u => u.createdAt && new Date(u.createdAt) >= weekAgo).length;

  const byRole: Record<string, number> = {};
  filteredUsers.forEach(u => {
    byRole[u.role] = (byRole[u.role] || 0) + 1;
  });

  return {
    total: filteredUsers.length,
    activeToday,
    newThisWeek,
    byRole
  };
}

export async function getAnalyticsEwaStats(startDate?: string) {
  const db = await getDb();
  if (!db) return { total: 0, pending: 0, approved: 0, rejected: 0, totalAmount: 0, approvedAmount: 0 };

  const allEwa = await db.select().from(ewaRequests);
  const filterDate = startDate ? new Date(startDate) : null;
  
  // Filter by date range if specified
  const filteredEwa = filterDate
    ? allEwa.filter(e => e.createdAt && new Date(e.createdAt) >= filterDate)
    : allEwa;
  
  const pending = filteredEwa.filter(e => e.status === 'pending_approval').length;
  const approved = filteredEwa.filter(e => e.status === 'disbursed').length;
  const rejected = filteredEwa.filter(e => e.status === 'rejected').length;
  const totalAmount = filteredEwa.reduce((sum, e) => sum + e.amount, 0);
  const approvedAmount = filteredEwa.filter(e => e.status === 'disbursed').reduce((sum, e) => sum + e.amount, 0);

  return {
    total: filteredEwa.length,
    pending,
    approved,
    rejected,
    totalAmount,
    approvedAmount
  };
}

export async function getAnalyticsEngagementStats(startDate?: string) {
  const db = await getDb();
  if (!db) return { achievements: 0, goals: 0, transactions: 0, referrals: 0, treePoints: { emitted: 0, redeemed: 0 } };

  const [allAchievements, allGoals, allTransactions, allReferrals, allTreePoints] = await Promise.all([
    db.select().from(userAchievements),
    db.select().from(financialGoals),
    db.select().from(transactions),
    db.select().from(referrals),
    db.select().from(treePointsTransactions)
  ]);
  
  const filterDate = startDate ? new Date(startDate) : null;
  
  // Filter by date range if specified
  const filteredAchievements = filterDate
    ? allAchievements.filter(a => a.unlockedAt && new Date(a.unlockedAt) >= filterDate)
    : allAchievements;
  const filteredGoals = filterDate
    ? allGoals.filter(g => g.createdAt && new Date(g.createdAt) >= filterDate)
    : allGoals;
  const filteredTransactions = filterDate
    ? allTransactions.filter(t => t.transactionDate && new Date(t.transactionDate) >= filterDate)
    : allTransactions;
  const filteredReferrals = filterDate
    ? allReferrals.filter(r => r.createdAt && new Date(r.createdAt) >= filterDate)
    : allReferrals;
  const filteredTreePoints = filterDate
    ? allTreePoints.filter(t => t.createdAt && new Date(t.createdAt) >= filterDate)
    : allTreePoints;

  const completedGoals = filteredGoals.filter(g => g.currentAmount >= g.targetAmount).length;
  const successfulReferrals = filteredReferrals.filter(r => r.status === 'rewarded').length;
  const emittedPoints = filteredTreePoints.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.amount, 0);
  const redeemedPoints = filteredTreePoints.filter(t => t.type === 'redeemed').reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return {
    achievements: filteredAchievements.length,
    goals: completedGoals,
    transactions: filteredTransactions.length,
    referrals: successfulReferrals,
    treePoints: {
      emitted: emittedPoints,
      redeemed: redeemedPoints
    }
  };
}

export async function getAnalyticsDepartmentStats(startDate?: string) {
  const db = await getDb();
  if (!db) return [];

  const [allDepts, allUsers, allRisk] = await Promise.all([
    db.select().from(departments),
    db.select().from(users),
    db.select().from(employeeRiskAnalysis)
  ]);

  return allDepts.map(dept => {
    const deptUsers = allUsers.filter(u => u.id); // In real app, would filter by departmentId
    const deptRisk = allRisk.filter(r => r.departmentId === dept.id);
    const highRisk = deptRisk.filter(r => r.turnoverPropensity && r.turnoverPropensity > 70).length;
    const avgFwi = deptRisk.length > 0 
      ? Math.round(deptRisk.reduce((sum, r) => sum + 65, 0) / deptRisk.length)
      : 65;

    return {
      id: dept.id,
      name: dept.name,
      employees: dept.employeeCount,
      avgFwi,
      highRisk
    };
  });
}

export async function getAnalyticsMonthlyTrends(numMonths: number = 6) {
  const db = await getDb();
  if (!db) return [];

  const [allUsers, allEwa, allTreePoints] = await Promise.all([
    db.select().from(users),
    db.select().from(ewaRequests),
    db.select().from(treePointsTransactions)
  ]);

  // Generate data for specified number of months
  const months = [];
  const now = new Date();
  for (let i = numMonths - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthName = monthDate.toLocaleDateString('es-ES', { month: 'short' });

    const usersInMonth = allUsers.filter(u => 
      u.createdAt && new Date(u.createdAt) <= monthEnd
    ).length;

    const activeInMonth = allUsers.filter(u => 
      u.lastSignedIn && 
      new Date(u.lastSignedIn) >= monthDate && 
      new Date(u.lastSignedIn) <= monthEnd
    ).length;

    const ewaInMonth = allEwa.filter(e => 
      e.createdAt && 
      new Date(e.createdAt) >= monthDate && 
      new Date(e.createdAt) <= monthEnd
    );

    const tpInMonth = allTreePoints.filter(t => 
      t.createdAt && 
      new Date(t.createdAt) >= monthDate && 
      new Date(t.createdAt) <= monthEnd
    );

    months.push({
      month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      users: usersInMonth,
      active: activeInMonth,
      ewaRequests: ewaInMonth.length,
      ewaApproved: ewaInMonth.filter(e => e.status === 'disbursed').length,
      ewaAmount: ewaInMonth.filter(e => e.status === 'disbursed').reduce((sum, e) => sum + e.amount, 0),
      tpEmitted: tpInMonth.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.amount, 0),
      tpRedeemed: tpInMonth.filter(t => t.type === 'redeemed').reduce((sum, t) => sum + Math.abs(t.amount), 0)
    });
  }

  return months;
}


// ============================================
// DEPARTMENT ALERT OPERATIONS
// ============================================

export async function getDepartmentAlertThreshold(departmentId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select()
    .from(departmentAlertThresholds)
    .where(eq(departmentAlertThresholds.departmentId, departmentId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getAllDepartmentAlertThresholds() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select()
    .from(departmentAlertThresholds)
    .where(eq(departmentAlertThresholds.isEnabled, true));
  
  return result;
}

export async function upsertDepartmentAlertThreshold(data: InsertDepartmentAlertThreshold) {
  const db = await getDb();
  if (!db) return null;
  
  // Check if threshold exists for this department
  const existing = await getDepartmentAlertThreshold(data.departmentId);
  
  if (existing) {
    await db.update(departmentAlertThresholds)
      .set({
        fwiThreshold: data.fwiThreshold,
        highRiskThreshold: data.highRiskThreshold,
        isEnabled: data.isEnabled,
        notifyAdmins: data.notifyAdmins,
        notifyB2BAdmin: data.notifyB2BAdmin,
      })
      .where(eq(departmentAlertThresholds.departmentId, data.departmentId));
    return { ...existing, ...data };
  } else {
    await db.insert(departmentAlertThresholds).values(data);
    return data;
  }
}

export async function createDepartmentAlert(data: InsertDepartmentAlertHistory) {
  const db = await getDb();
  if (!db) return null;
  
  await db.insert(departmentAlertHistory).values(data);
  return data;
}

export async function getDepartmentAlertHistory(departmentId?: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  if (departmentId) {
    return db.select()
      .from(departmentAlertHistory)
      .where(eq(departmentAlertHistory.departmentId, departmentId))
      .orderBy(desc(departmentAlertHistory.createdAt))
      .limit(limit);
  }
  
  return db.select()
    .from(departmentAlertHistory)
    .orderBy(desc(departmentAlertHistory.createdAt))
    .limit(limit);
}

export async function resolveDepartmentAlert(alertId: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.update(departmentAlertHistory)
    .set({ resolvedAt: new Date() })
    .where(eq(departmentAlertHistory.id, alertId));
  
  return true;
}

export async function checkDepartmentAlerts() {
  const db = await getDb();
  if (!db) return [];
  
  const thresholds = await getAllDepartmentAlertThresholds();
  const alerts: Array<{ departmentId: number; type: string; value: number; threshold: number }> = [];
  
  for (const threshold of thresholds) {
    // Get department stats
    const deptUsers = await db.select()
      .from(users)
      .where(eq(users.departmentId, threshold.departmentId));
    
    if (deptUsers.length === 0) continue;
    
    // Calculate average FWI
    const avgFwi = Math.round(
      deptUsers.reduce((sum, u) => sum + (u.fwiScore || 50), 0) / deptUsers.length
    );
    
    // Count high risk employees (FWI < 40)
    const highRiskCount = deptUsers.filter(u => (u.fwiScore || 50) < 40).length;
    
    // Check FWI threshold
    if (avgFwi < threshold.fwiThreshold) {
      alerts.push({
        departmentId: threshold.departmentId,
        type: 'fwi_low',
        value: avgFwi,
        threshold: threshold.fwiThreshold
      });
    }
    
    // Check high risk threshold
    if (highRiskCount > threshold.highRiskThreshold) {
      alerts.push({
        departmentId: threshold.departmentId,
        type: 'high_risk_exceeded',
        value: highRiskCount,
        threshold: threshold.highRiskThreshold
      });
    }
  }
  
  return alerts;
}

// ============================================
// DEPARTMENT HISTORY OPERATIONS
// ============================================

export async function getDepartmentFwiHistory(departmentId: number, months: number = 6) {
  const db = await getDb();
  if (!db) return [];
  
  // Get all users in the department
  const deptUsers = await db.select()
    .from(users)
    .where(eq(users.departmentId, departmentId));
  
  if (deptUsers.length === 0) return [];
  
  const userIds = deptUsers.map(u => u.id);
  
  // Get FWI history for all users in department
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months, 1);
  
  const history = await db.select()
    .from(fwiScoreHistory)
    .where(gte(fwiScoreHistory.recordedAt, startDate))
    .orderBy(fwiScoreHistory.recordedAt);
  
  // Filter to department users
  const deptHistory = history.filter(h => userIds.includes(h.userId));
  
  // Group by month and calculate averages
  const monthlyData: Record<string, { total: number; count: number }> = {};
  
  deptHistory.forEach(h => {
    const monthKey = new Date(h.recordedAt).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { total: 0, count: 0 };
    }
    monthlyData[monthKey].total += h.score;
    monthlyData[monthKey].count += 1;
  });
  
  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    avgFwi: Math.round(data.total / data.count),
    dataPoints: data.count
  }));
}

export async function getDepartmentEmployees(departmentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    fwiScore: users.fwiScore,
    treePoints: users.treePoints,
    level: users.level,
    streakDays: users.streakDays,
    lastSignedIn: users.lastSignedIn,
    createdAt: users.createdAt
  })
    .from(users)
    .where(eq(users.departmentId, departmentId))
    .orderBy(desc(users.fwiScore));
}

export async function getDepartmentTreePointsHistory(departmentId: number, months: number = 6) {
  const db = await getDb();
  if (!db) return [];
  
  // Get all users in the department
  const deptUsers = await db.select()
    .from(users)
    .where(eq(users.departmentId, departmentId));
  
  if (deptUsers.length === 0) return [];
  
  const userIds = deptUsers.map(u => u.id);
  
  // Get TreePoints transactions for department users
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months, 1);
  
  const transactions = await db.select()
    .from(treePointsTransactions)
    .where(gte(treePointsTransactions.createdAt, startDate))
    .orderBy(treePointsTransactions.createdAt);
  
  // Filter to department users
  const deptTransactions = transactions.filter(t => userIds.includes(t.userId));
  
  // Group by month
  const monthlyData: Record<string, { earned: number; redeemed: number }> = {};
  
  deptTransactions.forEach(t => {
    const monthKey = new Date(t.createdAt).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { earned: 0, redeemed: 0 };
    }
    if (t.type === 'earned') {
      monthlyData[monthKey].earned += t.amount;
    } else {
      monthlyData[monthKey].redeemed += Math.abs(t.amount);
    }
  });
  
  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    earned: data.earned,
    redeemed: data.redeemed
  }));
}


// ============ LEADS ============

export async function createLead(data: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.insert(leads).values(data);
  return { id: result[0].insertId, ...data };
}

export async function getLeads(status?: string) {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db.select().from(leads).where(eq(leads.status, status as any)).orderBy(desc(leads.createdAt));
  }
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(leads).where(eq(leads.id, id));
  return result[0] || null;
}

export async function updateLeadStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) return null;
  await db.update(leads).set({ status: status as any }).where(eq(leads.id, id));
  return getLeadById(id);
}


// ============================================
// MONTHLY METRICS SNAPSHOTS
// ============================================

export async function createMonthlySnapshot(data: InsertMonthlyMetricsSnapshot) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Check if snapshot already exists for this month
  const existing = await db.select()
    .from(monthlyMetricsSnapshots)
    .where(and(
      eq(monthlyMetricsSnapshots.year, data.year),
      eq(monthlyMetricsSnapshots.month, data.month),
      data.organizationId ? eq(monthlyMetricsSnapshots.organizationId, data.organizationId) : isNull(monthlyMetricsSnapshots.organizationId),
      data.departmentId ? eq(monthlyMetricsSnapshots.departmentId, data.departmentId) : isNull(monthlyMetricsSnapshots.departmentId)
    ))
    .limit(1);
  
  if (existing.length > 0) {
    // Update existing snapshot
    await db.update(monthlyMetricsSnapshots)
      .set(data)
      .where(eq(monthlyMetricsSnapshots.id, existing[0].id));
    return { ...existing[0], ...data };
  }
  
  const result = await db.insert(monthlyMetricsSnapshots).values(data);
  return { id: result[0].insertId, ...data };
}

export async function getMonthlySnapshots(options?: {
  organizationId?: number;
  departmentId?: number;
  year?: number;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(monthlyMetricsSnapshots);
  const conditions = [];
  
  if (options?.organizationId) {
    conditions.push(eq(monthlyMetricsSnapshots.organizationId, options.organizationId));
  }
  if (options?.departmentId) {
    conditions.push(eq(monthlyMetricsSnapshots.departmentId, options.departmentId));
  }
  if (options?.year) {
    conditions.push(eq(monthlyMetricsSnapshots.year, options.year));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return query
    .orderBy(desc(monthlyMetricsSnapshots.year), desc(monthlyMetricsSnapshots.month))
    .limit(options?.limit || 12);
}

export async function getMonthlyComparison(months: number = 6, organizationId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  const now = new Date();
  const snapshots = [];
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    const conditions = [
      eq(monthlyMetricsSnapshots.year, year),
      eq(monthlyMetricsSnapshots.month, month)
    ];
    
    if (organizationId) {
      conditions.push(eq(monthlyMetricsSnapshots.organizationId, organizationId));
    } else {
      conditions.push(isNull(monthlyMetricsSnapshots.organizationId));
    }
    conditions.push(isNull(monthlyMetricsSnapshots.departmentId));
    
    const snapshot = await db.select()
      .from(monthlyMetricsSnapshots)
      .where(and(...conditions))
      .limit(1);
    
    snapshots.push({
      year,
      month,
      monthName: date.toLocaleDateString('es-MX', { month: 'short' }),
      data: snapshot.length > 0 ? snapshot[0] : null
    });
  }
  
  return snapshots;
}

export async function generateCurrentMonthSnapshot(organizationId?: number) {
  const db = await getDb();
  if (!db) return null;
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  
  // Get current metrics
  const allDepts = await getDepartments();
  const allUsers = await db.select().from(users);
  const allEwa = await db.select().from(ewaRequests);
  const allTreePoints = await db.select().from(treePointsTransactions);
  const allGoals = await db.select().from(financialGoals);
  const allRisk = await db.select().from(employeeRiskAnalysis);
  
  const totalEmployees = allUsers.filter(u => u.role === 'employee').length;
  const avgFwiScore = totalEmployees > 0
    ? Math.round(allUsers.filter(u => u.role === 'employee').reduce((sum, u) => sum + (u.fwiScore || 50), 0) / totalEmployees)
    : 50;
  
  const employeesAtRisk = allRisk.filter(r => 
    r.absenteeismRisk === 'high' || r.absenteeismRisk === 'critical'
  ).length;
  
  const riskPercentage = totalEmployees > 0 
    ? Math.round((employeesAtRisk / totalEmployees) * 100)
    : 0;
  
  // This month's data
  const monthStart = new Date(year, month - 1, 1);
  const monthEwa = allEwa.filter(e => e.createdAt && new Date(e.createdAt) >= monthStart);
  const monthTreePoints = allTreePoints.filter(t => t.createdAt && new Date(t.createdAt) >= monthStart);
  const monthGoals = allGoals.filter(g => g.createdAt && new Date(g.createdAt) >= monthStart);
  
  const snapshotData: InsertMonthlyMetricsSnapshot = {
    organizationId: organizationId || null,
    departmentId: null,
    year,
    month,
    avgFwiScore,
    totalEmployees,
    employeesAtRisk,
    riskPercentage,
    totalEwaRequests: monthEwa.length,
    totalEwaAmount: monthEwa.reduce((sum, e) => sum + e.amount, 0),
    avgEngagementScore: 75, // Would calculate from actual engagement metrics
    totalTreePointsEarned: monthTreePoints.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.amount, 0),
    totalTreePointsRedeemed: monthTreePoints.filter(t => t.type === 'redeemed').reduce((sum, t) => sum + Math.abs(t.amount), 0),
    goalsCreated: monthGoals.length,
    goalsCompleted: monthGoals.filter(g => g.currentAmount >= g.targetAmount).length,
    alertsTriggered: 0, // Would count from alertHistory
  };
  
  return createMonthlySnapshot(snapshotData);
}

// ============================================
// ORGANIZATION ALERT THRESHOLDS
// ============================================

export async function getOrganizationThresholds(organizationId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select()
    .from(organizationAlertThresholds)
    .where(eq(organizationAlertThresholds.organizationId, organizationId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function upsertOrganizationThresholds(data: InsertOrganizationAlertThreshold) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const existing = await getOrganizationThresholds(data.organizationId);
  
  if (existing) {
    await db.update(organizationAlertThresholds)
      .set({
        fwiCriticalThreshold: data.fwiCriticalThreshold,
        fwiWarningThreshold: data.fwiWarningThreshold,
        fwiHealthyThreshold: data.fwiHealthyThreshold,
        riskCriticalPercentage: data.riskCriticalPercentage,
        riskWarningPercentage: data.riskWarningPercentage,
        ewaMaxPendingCount: data.ewaMaxPendingCount,
        ewaMaxPendingAmount: data.ewaMaxPendingAmount,
        ewaMaxPerEmployee: data.ewaMaxPerEmployee,
        notifyOnCritical: data.notifyOnCritical,
        notifyOnWarning: data.notifyOnWarning,
        notifyOnInfo: data.notifyOnInfo,
        notifyEmails: data.notifyEmails,
        notifySlackWebhook: data.notifySlackWebhook,
      })
      .where(eq(organizationAlertThresholds.organizationId, data.organizationId));
    return { ...existing, ...data };
  }
  
  const result = await db.insert(organizationAlertThresholds).values(data);
  return { id: result[0].insertId, ...data };
}

export async function getDefaultThresholds() {
  return {
    fwiCriticalThreshold: 30,
    fwiWarningThreshold: 50,
    fwiHealthyThreshold: 70,
    riskCriticalPercentage: 25,
    riskWarningPercentage: 15,
    ewaMaxPendingCount: 10,
    ewaMaxPendingAmount: 50000,
    ewaMaxPerEmployee: 3,
    notifyOnCritical: true,
    notifyOnWarning: true,
    notifyOnInfo: false,
    notifySlackWebhook: null as string | null,
    notifyEmails: null as string | null,
  };
}
