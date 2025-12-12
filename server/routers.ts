import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { sql, eq } from "drizzle-orm";
import * as db from "./db";
import { 
  users, 
  transactions, 
  marketOffers, 
  ewaRequests,
  offerRedemptions,
  educationProgress,
  userBadges,
  notifications,
  treePointsTransactions,
  financialGoals
} from "../drizzle/schema";
import { 
  classifyExpense, 
  getFinancialAdvice, 
  generateSmartOffer, 
  chatWithAdvisor,
  analyzeFwiFactors 
} from "./services/geminiService";
import { notifyOwner } from './_core/notification';
import * as exportService from './services/exportService';
import { 
  getVapidPublicKey, 
  savePushSubscription, 
  removePushSubscription,
  getUserSubscriptionCount,
  sendPushToUser 
} from "./services/pushService";
import * as triggers from "./services/notificationTriggers";
import { sendEmail, processEmailQueue } from "./services/emailService";
import { generateMonthlyReportData, generateReportHTML, getAvailableReportMonths } from "./services/pdfService";
import * as alertService from "./services/alertService";
import { generateExecutiveReportPDF, getExecutiveReportData } from "./services/pdfReportService";
import * as mfaService from "./services/mfaService";
import * as pulseSurveyService from "./services/pulseSurveyService";
import { triggerWeeklyReportNow } from "./services/weeklyReportService";
import { 
  getAnalyticsUserStats, 
  getAnalyticsEwaStats, 
  getAnalyticsEngagementStats, 
  getAnalyticsDepartmentStats,
  getAnalyticsMonthlyTrends 
} from "./db";

// ============================================
// ROLE-BASED MIDDLEWARE
// ============================================

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

const b2bAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'b2b_admin' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'B2B Admin access required' });
  }
  return next({ ctx });
});

const merchantProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'merchant' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Merchant access required' });
  }
  return next({ ctx });
});

const employeeProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'employee' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Employee access required' });
  }
  return next({ ctx });
});

// ============================================
// ROUTERS
// ============================================

export const appRouter = router({
  system: systemRouter,
  
  // ============================================
  // CONTACT ROUTER (Public - Demo Requests)
  // ============================================
  contact: router({
    submitDemoRequest: publicProcedure
      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        company: z.string().min(1),
        employeeCount: z.string(),
      }))
      .mutation(async ({ input }) => {
        const content = `
**Nueva Solicitud de Demo - Treevü**

**Contacto:**
- Nombre: ${input.firstName} ${input.lastName}
- Email: ${input.email}
- Empresa: ${input.company}
- Tamaño: ${input.employeeCount} empleados

**Fecha:** ${new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })}

---
Responder a: ${input.email}
        `.trim();

        const success = await notifyOwner({
          title: `🌱 Nueva Demo: ${input.company}`,
          content,
        });

        return { success, message: success ? 'Solicitud enviada correctamente' : 'Error al enviar, intenta de nuevo' };
      }),
  }),

  // ============================================
  // NOTIFICATIONS ROUTER
  // ============================================
  notifications: router({
    // Get all notifications for current user
    list: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(50),
        unreadOnly: z.boolean().default(false),
      }).optional())
      .query(async ({ ctx, input }) => {
        const { limit = 50, unreadOnly = false } = input || {};
        return db.getNotificationsByUser(ctx.user.id, limit, unreadOnly);
      }),

    // Get unread count
    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      return db.getUnreadNotificationCount(ctx.user.id);
    }),

    // Mark single notification as read
    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.markNotificationAsRead(input.notificationId, ctx.user.id);
        return { success: true };
      }),

    // Mark all notifications as read
    markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
      await db.markAllNotificationsAsRead(ctx.user.id);
      return { success: true };
    }),

    // Delete single notification
    delete: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteNotification(input.notificationId, ctx.user.id);
        return { success: true };
      }),

    // Delete all notifications
    deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
      await db.deleteAllNotifications(ctx.user.id);
      return { success: true };
    }),

    // Get notification preferences
    getPreferences: protectedProcedure.query(async ({ ctx }) => {
      const prefs = await db.getNotificationPreferences(ctx.user.id);
      if (!prefs) {
        // Return default preferences if none exist
        return {
          ewaApproved: true,
          ewaRejected: true,
          ewaDisbursed: true,
          treepointsReceived: true,
          treepointsRedeemed: true,
          goalProgress: true,
          goalCompleted: true,
          fwiImproved: true,
          fwiAlert: true,
          levelUp: true,
          streakMilestone: true,
          offerAvailable: true,
          systemAnnouncement: true,
          securityAlert: true,
          inAppEnabled: true,
          emailEnabled: false,
          pushEnabled: false,
        };
      }
      return prefs;
    }),

    // Update notification preferences
    updatePreferences: protectedProcedure
      .input(z.object({
        ewaApproved: z.boolean().optional(),
        ewaRejected: z.boolean().optional(),
        ewaDisbursed: z.boolean().optional(),
        treepointsReceived: z.boolean().optional(),
        treepointsRedeemed: z.boolean().optional(),
        goalProgress: z.boolean().optional(),
        goalCompleted: z.boolean().optional(),
        fwiImproved: z.boolean().optional(),
        fwiAlert: z.boolean().optional(),
        levelUp: z.boolean().optional(),
        streakMilestone: z.boolean().optional(),
        offerAvailable: z.boolean().optional(),
        systemAnnouncement: z.boolean().optional(),
        securityAlert: z.boolean().optional(),
        inAppEnabled: z.boolean().optional(),
        emailEnabled: z.boolean().optional(),
        pushEnabled: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertNotificationPreferences(ctx.user.id, input);
        return { success: true };
      }),

    // Admin: Send notification to specific user
    sendToUser: adminProcedure
      .input(z.object({
        userId: z.number(),
        title: z.string().min(1).max(200),
        message: z.string().min(1),
        type: z.enum(['system_announcement', 'security_alert']).default('system_announcement'),
      }))
      .mutation(async ({ input }) => {
        if (input.type === 'security_alert') {
          await db.sendSecurityAlert(input.userId, input.message);
        } else {
          await db.sendSystemNotification(input.userId, input.title, input.message);
        }
        return { success: true };
      }),

    // Admin: Send notification to all users
    sendToAll: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(200),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const users = await db.getUsersByRole('employee');
        for (const user of users) {
          await db.sendSystemNotification(user.id, input.title, input.message);
        }
        return { success: true, count: users.length };
      }),

    // ============================================
    // PUSH NOTIFICATIONS
    // ============================================
    
    // Get VAPID public key for push subscription
    getVapidKey: publicProcedure.query(() => {
      return { publicKey: getVapidPublicKey() };
    }),

    // Subscribe to push notifications
    subscribePush: protectedProcedure
      .input(z.object({
        endpoint: z.string().url(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
        userAgent: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const success = await savePushSubscription(
          ctx.user.id,
          { endpoint: input.endpoint, keys: input.keys },
          input.userAgent
        );
        
        // Enable push in preferences
        if (success) {
          await db.upsertNotificationPreferences(ctx.user.id, { pushEnabled: true });
        }
        
        return { success };
      }),

    // Unsubscribe from push notifications
    unsubscribePush: protectedProcedure
      .input(z.object({ endpoint: z.string().url() }))
      .mutation(async ({ ctx, input }) => {
        const success = await removePushSubscription(ctx.user.id, input.endpoint);
        return { success };
      }),

    // Get push subscription status
    getPushStatus: protectedProcedure.query(async ({ ctx }) => {
      const count = await getUserSubscriptionCount(ctx.user.id);
      return { subscribed: count > 0, deviceCount: count };
    }),

    // Test push notification
    testPush: protectedProcedure.mutation(async ({ ctx }) => {
      const result = await sendPushToUser(ctx.user.id, {
        title: '🔔 Notificación de Prueba',
        body: '¡Las notificaciones push están funcionando correctamente!',
        type: 'test',
        actionUrl: '/settings/notifications',
      });
      return { success: result.success > 0, sent: result.success, failed: result.failed };
    }),

    // ============================================
    // EMAIL NOTIFICATIONS
    // ============================================
    
    // Test email notification
    testEmail: protectedProcedure.mutation(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user?.email) {
        return { success: false, error: 'No email configured' };
      }
      
      const result = await sendEmail(user.email, 'welcome', {
        userName: user.name || 'Usuario',
      });
      
      return result;
    }),

    // Admin: Process email queue
    processEmailQueue: adminProcedure
      .input(z.object({ limit: z.number().min(1).max(100).default(10) }).optional())
      .mutation(async ({ input }) => {
        const result = await processEmailQueue(input?.limit || 10);
        return result;
      }),

    // Admin: Send mass notification
    sendMass: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(200),
        message: z.string().min(1).max(1000),
        type: z.enum(['system_announcement', 'offer_available', 'security_alert']),
        targetRole: z.enum(['employee', 'merchant', 'b2b_admin']).optional(),
      }))
      .mutation(async ({ input }) => {
        // Get users by role or all roles
        const roles = input.targetRole 
          ? [input.targetRole] 
          : ['employee', 'merchant', 'b2b_admin'];
        
        let count = 0;
        for (const role of roles) {
          const users = await db.getUsersByRole(role);
          for (const user of users) {
            await db.createNotification({
              userId: user.id,
              type: input.type,
              title: input.title,
              message: input.message,
            });
            count++;
          }
        }
        
        return { success: true, count };
      }),
  }),

  // ============================================
  // EXPORT ROUTER (Admin only)
  // ============================================
  export: router({
    users: adminProcedure.query(async () => {
      const users = await db.getAllUsers();
      const csv = exportService.exportUsersToCSV(users);
      return { csv, filename: `usuarios_${new Date().toISOString().split('T')[0]}.csv` };
    }),

    transactions: adminProcedure
      .input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const transactions = await db.getAllTransactions(input?.startDate, input?.endDate);
        const csv = exportService.exportTransactionsToCSV(transactions);
        return { csv, filename: `transacciones_${new Date().toISOString().split('T')[0]}.csv` };
      }),

    ewaRequests: adminProcedure.query(async () => {
      const requests = await db.getAllEwaRequests();
      const csv = exportService.exportEwaRequestsToCSV(requests);
      return { csv, filename: `solicitudes_ewa_${new Date().toISOString().split('T')[0]}.csv` };
    }),

    treePoints: adminProcedure.query(async () => {
      const transactions = await db.getAllTreePointsTransactions();
      const csv = exportService.exportTreePointsToCSV(transactions);
      return { csv, filename: `treepoints_${new Date().toISOString().split('T')[0]}.csv` };
    }),

    goals: adminProcedure.query(async () => {
      const goals = await db.getAllGoals();
      const csv = exportService.exportGoalsToCSV(goals);
      return { csv, filename: `metas_${new Date().toISOString().split('T')[0]}.csv` };
    }),

    departments: b2bAdminProcedure.query(async () => {
      const departments = await db.getDepartmentMetrics();
      const csv = exportService.exportDepartmentMetricsToCSV(departments);
      return { csv, filename: `departamentos_${new Date().toISOString().split('T')[0]}.csv` };
    }),
  }),

  // REPORTS ROUTER
  // ============================================
  reports: router({
    // Get available months for reports
    getAvailableMonths: protectedProcedure.query(async ({ ctx }) => {
      return getAvailableReportMonths(ctx.user.id);
    }),

    // Generate monthly report data
    getMonthlyReport: protectedProcedure
      .input(z.object({
        month: z.number().min(0).max(11),
        year: z.number().min(2020).max(2030),
      }))
      .query(async ({ ctx, input }) => {
        const data = await generateMonthlyReportData(ctx.user.id, input.month, input.year);
        if (!data) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'No se encontraron datos para este período' });
        }
        return data;
      }),

    // Generate HTML for PDF download
    getReportHTML: protectedProcedure
      .input(z.object({
        month: z.number().min(0).max(11),
        year: z.number().min(2020).max(2030),
      }))
      .query(async ({ ctx, input }) => {
        const data = await generateMonthlyReportData(ctx.user.id, input.month, input.year);
        if (!data) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'No se encontraron datos para este período' });
        }
        return { html: generateReportHTML(data) };
      }),

    // Get monthly comparison (last 6 months)
    getMonthlyComparison: protectedProcedure.query(async ({ ctx }) => {
      const now = new Date();
      const months = [];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = date.getMonth();
        const year = date.getFullYear();
        const data = await generateMonthlyReportData(ctx.user.id, month, year);
        
        months.push({
          month,
          year,
          monthName: date.toLocaleDateString('es-MX', { month: 'short' }),
          fwiScore: (data as any)?.fwiScore || 0,
          totalExpenses: (data as any)?.totalExpenses || 0,
          totalIncome: (data as any)?.totalIncome || 0,
          treePointsEarned: (data as any)?.treePointsEarned || 0,
          treePointsRedeemed: (data as any)?.treePointsRedeemed || 0,
          goalsCompleted: (data as any)?.goalsCompleted || 0,
          ewaRequested: (data as any)?.ewaRequested || 0,
        });
      }
      
      // Calculate variations
      const current = months[months.length - 1];
      const previous = months[months.length - 2];
      
      const variations = {
        fwiScore: previous.fwiScore > 0 
          ? Math.round(((current.fwiScore - previous.fwiScore) / previous.fwiScore) * 100) 
          : 0,
        expenses: previous.totalExpenses > 0 
          ? Math.round(((current.totalExpenses - previous.totalExpenses) / previous.totalExpenses) * 100) 
          : 0,
        treePoints: previous.treePointsEarned > 0 
          ? Math.round(((current.treePointsEarned - previous.treePointsEarned) / previous.treePointsEarned) * 100) 
          : 0,
      };
      
      return { months, variations };
    }),

    // Admin: Generate report for any user
    getReportForUser: adminProcedure
      .input(z.object({
        userId: z.number(),
        month: z.number().min(0).max(11),
        year: z.number().min(2020).max(2030),
      }))
      .query(async ({ input }) => {
        const data = await generateMonthlyReportData(input.userId, input.month, input.year);
        if (!data) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'No se encontraron datos para este período' });
        }
        return data;
      }),

    // B2B: Generate executive PDF report
    generateExecutivePDF: b2bAdminProcedure
      .input(z.object({
        organizationName: z.string().optional(),
      }).optional())
      .mutation(async ({ input }) => {
        const reportData = await getExecutiveReportData();
        if (input?.organizationName) {
          reportData.organizationName = input.organizationName;
        }
        const pdfBuffer = await generateExecutiveReportPDF(reportData);
        const base64 = pdfBuffer.toString('base64');
        return {
          success: true,
          pdf: base64,
          filename: `reporte-ejecutivo-${new Date().toISOString().split('T')[0]}.pdf`,
        };
      }),

    // B2B: Get executive report data
    getExecutiveData: b2bAdminProcedure
      .query(async () => {
        return getExecutiveReportData();
      }),

    // B2B: Get monthly comparison data (historical snapshots)
    getB2BMonthlyComparison: b2bAdminProcedure
      .input(z.object({
        months: z.number().min(1).max(24).default(6),
        organizationId: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getMonthlyComparison(input?.months || 6, input?.organizationId);
      }),

    // B2B: Generate current month snapshot
    generateSnapshot: b2bAdminProcedure
      .input(z.object({
        organizationId: z.number().optional(),
      }).optional())
      .mutation(async ({ input }) => {
        return db.generateCurrentMonthSnapshot(input?.organizationId);
      }),

    // B2B: Get historical snapshots
    getSnapshots: b2bAdminProcedure
      .input(z.object({
        organizationId: z.number().optional(),
        departmentId: z.number().optional(),
        year: z.number().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getMonthlySnapshots(input);
      }),
  }),

  // ============================================
  // ORGANIZATION THRESHOLDS ROUTER
  // ============================================
  thresholds: router({
    // Get organization thresholds
    get: b2bAdminProcedure
      .input(z.object({ organizationId: z.number() }))
      .query(async ({ input }) => {
        const thresholds = await db.getOrganizationThresholds(input.organizationId);
        if (!thresholds) {
          return db.getDefaultThresholds();
        }
        return thresholds;
      }),

    // Get default thresholds
    getDefaults: b2bAdminProcedure
      .query(async () => {
        return db.getDefaultThresholds();
      }),

    // Update organization thresholds
    update: b2bAdminProcedure
      .input(z.object({
        organizationId: z.number(),
        fwiCriticalThreshold: z.number().min(0).max(100).optional(),
        fwiWarningThreshold: z.number().min(0).max(100).optional(),
        fwiHealthyThreshold: z.number().min(0).max(100).optional(),
        riskCriticalPercentage: z.number().min(0).max(100).optional(),
        riskWarningPercentage: z.number().min(0).max(100).optional(),
        ewaMaxPendingCount: z.number().min(0).optional(),
        ewaMaxPendingAmount: z.number().min(0).optional(),
        ewaMaxPerEmployee: z.number().min(0).optional(),
        notifyOnCritical: z.boolean().optional(),
        notifyOnWarning: z.boolean().optional(),
        notifyOnInfo: z.boolean().optional(),
        notifyEmails: z.string().optional(),
        notifySlackWebhook: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.upsertOrganizationThresholds({
          ...input,
          createdBy: ctx.user.id,
        });
      }),
  }),

  // ============================================
  // ACHIEVEMENTS ROUTER
  // ============================================
  achievements: router({
    // Get all achievements
    list: publicProcedure.query(async () => {
      return db.getAllAchievements();
    }),

    // Get user's unlocked achievements
    getUserAchievements: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserAchievements(ctx.user.id);
    }),

    // Check and unlock achievement
    checkAndUnlock: protectedProcedure
      .input(z.object({ code: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.unlockAchievement(ctx.user.id, input.code);
        if (result.success && result.achievement) {
          // Create notification for unlocked achievement
          await db.createNotification({
            userId: ctx.user.id,
            type: 'level_up',
            title: '¡Logro Desbloqueado!',
            message: `Has desbloqueado "${result.achievement.name}" y ganado ${result.pointsAwarded} TreePoints`,
          });
        }
        return result;
      }),

    // Check if user has specific achievement
    hasAchievement: protectedProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.hasAchievement(ctx.user.id, input.code);
      }),
  }),

  // ============================================
  // BADGES ROUTER
  // ============================================
  badges: router({
    // Get all available badges
    list: publicProcedure.query(async () => {
      return db.getAllBadges();
    }),

    // Get user's earned badges
    getUserBadges: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserBadges(ctx.user.id);
    }),

    // Check if user has specific badge
    hasBadge: protectedProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.hasBadge(ctx.user.id, input.code);
      }),

    // Get unnotified badges (for celebration)
    getUnnotified: protectedProcedure.query(async ({ ctx }) => {
      return db.getUnnotifiedBadges(ctx.user.id);
    }),

    // Mark badge as notified
    markNotified: protectedProcedure
      .input(z.object({ badgeId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.markBadgeNotified(ctx.user.id, input.badgeId);
        return { success: true };
      }),

    // Check and award education badges
    checkEducationBadges: protectedProcedure.mutation(async ({ ctx }) => {
      const awardedBadges = await db.checkAndAwardEducationBadges(ctx.user.id);
      
      // Create notifications for each awarded badge
      for (const badge of awardedBadges) {
        await db.createNotification({
          userId: ctx.user.id,
          type: 'level_up',
          title: '¡Nueva Insignia!',
          message: `Has obtenido la insignia "${badge.name}" y ganado ${badge.pointsReward} TreePoints`,
        });
        
        // Send push notification
        await triggers.triggerBadgeEarned(ctx.user.id, badge.name, badge.pointsReward);
      }
      
      return { awardedBadges };
    }),

    // Seed badges (admin only)
    seed: adminProcedure.mutation(async () => {
      await db.seedBadges();
      return { success: true };
    }),
  }),

  // ============================================
  // LEADERBOARD ROUTER (Enhanced)
  // ============================================
  leaderboard: router({
    // Get top users by level
    byLevel: protectedProcedure
      .input(z.object({ limit: z.number().min(1).max(100).default(10) }).optional())
      .query(async ({ input }) => {
        return db.getLeaderboardByLevel(input?.limit || 10);
      }),

    // Get top users by TreePoints
    byPoints: protectedProcedure
      .input(z.object({ limit: z.number().min(1).max(100).default(10) }).optional())
      .query(async ({ input }) => {
        return db.getLeaderboardByPoints(input?.limit || 10);
      }),

    // Get top users by FWI Score
    byFwi: protectedProcedure
      .input(z.object({ limit: z.number().min(1).max(100).default(10) }).optional())
      .query(async ({ input }) => {
        return db.getLeaderboardByFwi(input?.limit || 10);
      }),

    // Get user's rank
    getUserRank: protectedProcedure
      .input(z.object({ type: z.enum(['level', 'points', 'fwi']) }))
      .query(async ({ ctx, input }) => {
        return db.getUserRank(ctx.user.id, input.type);
      }),

    // Get leaderboard by department
    byDepartment: protectedProcedure
      .input(z.object({ 
        departmentId: z.number(),
        limit: z.number().min(1).max(100).default(10) 
      }))
      .query(async ({ input }) => {
        return db.getLeaderboardByDepartment(input.departmentId, input.limit);
      }),

    // Enhanced: Get TreePoints leaderboard with filters
    treePointsRanking: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(10),
        departmentId: z.number().optional(),
        period: z.enum(['all', 'month', 'week']).default('all'),
      }).optional())
      .query(async ({ input }) => {
        return db.getTreePointsLeaderboard({
          limit: input?.limit || 10,
          departmentId: input?.departmentId,
          period: input?.period || 'all',
        });
      }),

    // Get user's position in leaderboard
    getMyPosition: protectedProcedure
      .input(z.object({ departmentId: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return db.getUserLeaderboardPosition(ctx.user.id, input?.departmentId);
      }),

    // Get department leaderboard
    departmentRanking: protectedProcedure
      .input(z.object({ limit: z.number().min(1).max(50).default(10) }).optional())
      .query(async ({ input }) => {
        return db.getDepartmentLeaderboard(input?.limit || 10);
      }),
  }),

  // ============================================
  // REFERRALS ROUTER
  // ============================================
  referrals: router({
    // Get user's referral code
    getMyCode: protectedProcedure.query(async ({ ctx }) => {
      const code = await db.getUserReferralCode(ctx.user.id);
      return { code };
    }),

    // Get user's referral stats
    getMyStats: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserReferralStats(ctx.user.id);
    }),

    // Get user's referral history
    getMyReferrals: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserReferrals(ctx.user.id);
    }),

    // Create referral invite (send to email)
    createInvite: protectedProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ ctx, input }) => {
        const referral = await db.createReferralInvite(ctx.user.id, input.email);
        if (!referral) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create referral' });
        }
        return referral;
      }),

    // Validate referral code (for new users)
    validateCode: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const referral = await db.getReferralByCode(input.code);
        if (!referral || referral.status !== 'pending') {
          return { valid: false, referrerName: null };
        }
        const referrer = await db.getUserById(referral.referrerId);
        return { 
          valid: true, 
          referrerName: referrer?.name || 'Un usuario de Treevü' 
        };
      }),

    // Process referral after registration
    processRegistration: protectedProcedure
      .input(z.object({ code: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.processReferralRegistration(input.code, ctx.user.id);
        
        // Send notification to referrer about successful referral
        if (result.success && 'referrerId' in result && result.referrerId) {
          const referrerId = result.referrerId as number;
          
          // Create in-app notification
          await db.createNotification({
            userId: referrerId,
            type: 'referral_bonus',
            title: '¡Referido exitoso!',
            message: `${ctx.user.name || 'Un nuevo usuario'} se registró con tu código. ¡Ganaste 500 TreePoints!`,
            icon: 'Gift',
            actionUrl: '/referrals',
            actionLabel: 'Ver referidos',
            metadata: JSON.stringify({ 
              referredUserId: ctx.user.id, 
              referredName: ctx.user.name,
              pointsEarned: 500 
            }),
          });
          
          // Also send push notification if subscribed
          try {
            await sendPushToUser(referrerId, {
              title: '¡Referido exitoso! 🎉',
              body: `${ctx.user.name || 'Un nuevo usuario'} se registró con tu código. +500 TreePoints`
            });
          } catch (e) {
            console.log('Push notification failed:', e);
          }
          
          // Send email notification to referrer
          try {
            const referrer = await db.getUserById(referrerId);
            const stats = await db.getUserReferralStats(referrerId);
            if (referrer?.email) {
              await sendEmail(referrer.email, 'referral_success', {
                userName: referrer.name,
                referredName: ctx.user.name || 'Un nuevo usuario',
                pointsEarned: 500,
                totalReferrals: stats.totalRegistered,
                totalPointsEarned: stats.totalPointsEarned,
                actionUrl: '/referrals'
              });
            }
          } catch (e) {
            console.log('Referral email failed:', e);
          }
        }
        
        return result;
      }),
  }),

  // ============================================
  // ANALYTICS ROUTER
  // ============================================
  analytics: router({
    getUserStats: protectedProcedure
      .input(z.object({ startDate: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin' && ctx.user.role !== 'b2b_admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores pueden ver analytics' });
        }
        return await getAnalyticsUserStats(input?.startDate);
      }),
    getEwaStats: protectedProcedure
      .input(z.object({ startDate: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin' && ctx.user.role !== 'b2b_admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores pueden ver analytics' });
        }
        return await getAnalyticsEwaStats(input?.startDate);
      }),
    getEngagementStats: protectedProcedure
      .input(z.object({ startDate: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin' && ctx.user.role !== 'b2b_admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores pueden ver analytics' });
        }
        return await getAnalyticsEngagementStats(input?.startDate);
      }),
    getDepartmentStats: protectedProcedure
      .input(z.object({ startDate: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin' && ctx.user.role !== 'b2b_admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores pueden ver analytics' });
        }
        return await getAnalyticsDepartmentStats(input?.startDate);
      }),
    getMonthlyTrends: protectedProcedure
      .input(z.object({ months: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin' && ctx.user.role !== 'b2b_admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores pueden ver analytics' });
        }
        return await getAnalyticsMonthlyTrends(input?.months);
      }),
    
    // Department Alert Thresholds
    getAlertThresholds: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin' && ctx.user.role !== 'b2b_admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores pueden configurar alertas' });
        }
        return await db.getAllDepartmentAlertThresholds();
      }),
    
    setAlertThreshold: protectedProcedure
      .input(z.object({
        departmentId: z.number(),
        fwiThreshold: z.number().min(0).max(100).default(50),
        highRiskThreshold: z.number().min(0).default(3),
        isEnabled: z.boolean().default(true),
        notifyAdmins: z.boolean().default(true),
        notifyB2BAdmin: z.boolean().default(true),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin' && ctx.user.role !== 'b2b_admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores pueden configurar alertas' });
        }
        return await db.upsertDepartmentAlertThreshold(input);
      }),
    
    checkAlerts: protectedProcedure
      .mutation(async ({ ctx }) => {
        if (ctx.user.role !== 'admin' && ctx.user.role !== 'b2b_admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores pueden verificar alertas' });
        }
        
        const alerts = await db.checkDepartmentAlerts();
        
        // Create notifications for each alert
        for (const alert of alerts) {
          const dept = await db.getDepartmentById(alert.departmentId);
          const deptName = dept?.name || `Departamento ${alert.departmentId}`;
          
          // Log the alert
          await db.createDepartmentAlert({
            departmentId: alert.departmentId,
            alertType: alert.type as 'fwi_low' | 'high_risk_exceeded',
            previousValue: alert.threshold,
            currentValue: alert.value,
            threshold: alert.threshold,
            notifiedUsers: JSON.stringify([ctx.user.id]),
          });
          
          // Notify admins
          const admins = await db.getAdminUsers();
          for (const admin of admins) {
            await db.createNotification({
              userId: admin.id,
              type: 'fwi_alert',
              title: alert.type === 'fwi_low' 
                ? `⚠️ Alerta FWI: ${deptName}`
                : `⚠️ Alerta de Riesgo: ${deptName}`,
              message: alert.type === 'fwi_low'
                ? `El FWI promedio de ${deptName} (${alert.value}) está por debajo del umbral (${alert.threshold})`
                : `${deptName} tiene ${alert.value} empleados en alto riesgo, superando el umbral de ${alert.threshold}`,
              icon: 'AlertTriangle',
              actionUrl: `/departments/${alert.departmentId}`,
              actionLabel: 'Ver Departamento',
              metadata: JSON.stringify(alert),
            });
          }
        }
        
        return { alertsTriggered: alerts.length, alerts };
      }),
    
    getAlertHistory: protectedProcedure
      .input(z.object({ departmentId: z.number().optional(), limit: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin' && ctx.user.role !== 'b2b_admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores pueden ver historial de alertas' });
        }
        return await db.getDepartmentAlertHistory(input?.departmentId, input?.limit);
      }),
    
    // Department Detail
    getDepartmentDetail: protectedProcedure
      .input(z.object({ departmentId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin' && ctx.user.role !== 'b2b_admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores pueden ver detalles de departamento' });
        }
        
        const department = await db.getDepartmentById(input.departmentId);
        const employees = await db.getDepartmentEmployees(input.departmentId);
        const fwiHistory = await db.getDepartmentFwiHistory(input.departmentId);
        const tpHistory = await db.getDepartmentTreePointsHistory(input.departmentId);
        const alertThreshold = await db.getDepartmentAlertThreshold(input.departmentId);
        
        // Calculate current stats
        const avgFwi = employees.length > 0 
          ? Math.round(employees.reduce((sum, e) => sum + (e.fwiScore || 50), 0) / employees.length)
          : 0;
        const highRiskCount = employees.filter(e => (e.fwiScore || 50) < 40).length;
        const totalTreePoints = employees.reduce((sum, e) => sum + (e.treePoints || 0), 0);
        
        return {
          department,
          employees,
          fwiHistory,
          tpHistory,
          alertThreshold,
          stats: {
            avgFwi,
            highRiskCount,
            totalEmployees: employees.length,
            totalTreePoints,
            activeToday: employees.filter(e => {
              if (!e.lastSignedIn) return false;
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return new Date(e.lastSignedIn) >= today;
            }).length
          }
        };
      }),
  }),

  // ============================================
  // AUTH ROUTER
  // ============================================
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============================================
  // USER ROUTER
  // ============================================
  users: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      return user;
    }),

    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        monthlyIncome: z.number().optional(),
        workModality: z.enum(['remote', 'hybrid', 'onsite']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),

    updateRole: adminProcedure
      .input(z.object({
        userId: z.number(),
        role: z.enum(['admin', 'employee', 'merchant', 'b2b_admin']),
      }))
      .mutation(async ({ input }) => {
        await db.updateUserProfile(input.userId, { role: input.role });
        return { success: true };
      }),

    listByRole: adminProcedure
      .input(z.object({ role: z.enum(['admin', 'employee', 'merchant', 'b2b_admin']) }))
      .query(async ({ input }) => {
        return db.getUsersByRole(input.role);
      }),

    listByDepartment: b2bAdminProcedure
      .input(z.object({ departmentId: z.number() }))
      .query(async ({ input }) => {
        return db.getUsersByDepartment(input.departmentId);
      }),
  }),

  // ============================================
  // TRANSACTIONS ROUTER
  // ============================================
  transactions: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }).optional())
      .query(async ({ ctx, input }) => {
        return db.getTransactionsByUser(ctx.user.id, input?.limit || 50);
      }),

    create: protectedProcedure
      .input(z.object({
        description: z.string(),
        amount: z.number().optional(),
        merchant: z.string().optional(),
        category: z.enum(['food', 'transport', 'entertainment', 'services', 'health', 'shopping', 'other']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Use AI to classify if not all fields provided
        let classification;
        if (!input.amount || !input.merchant || !input.category) {
          classification = await classifyExpense(input.description);
        }

        const transactionId = await db.createTransaction({
          userId: ctx.user.id,
          merchant: input.merchant || classification?.merchant || 'Unknown',
          amount: input.amount || classification?.amount || 0,
          category: input.category || classification?.category || 'other',
          isDiscretionary: classification?.isDiscretionary ?? true,
          aiConfidence: classification?.confidence,
          description: input.description,
        });

        // Log audit
        await db.createAuditLog({
          userId: ctx.user.id,
          action: 'transaction.create',
          resource: 'transactions',
          resourceId: transactionId,
          details: JSON.stringify({ amount: input.amount || classification?.amount }),
        });

        return { 
          id: transactionId, 
          classification,
          success: true 
        };
      }),

    getByCategory: protectedProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getTransactionsByCategory(ctx.user.id, input.category);
      }),

    getSummary: protectedProcedure
      .input(z.object({
        startDate: z.string(),
        endDate: z.string(),
      }))
      .query(async ({ ctx, input }) => {
        return db.getTransactionSummary(
          ctx.user.id, 
          new Date(input.startDate), 
          new Date(input.endDate)
        );
      }),
  }),

  // ============================================
  // FWI SCORE ROUTER
  // ============================================
  fwi: router({
    getScore: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      return {
        score: user?.fwiScore || 50,
        level: user?.level || 1,
        streakDays: user?.streakDays || 0,
      };
    }),

    getHistory: protectedProcedure
      .input(z.object({ limit: z.number().default(30) }).optional())
      .query(async ({ ctx, input }) => {
        return db.getFwiScoreHistory(ctx.user.id, input?.limit || 30);
      }),

    recalculate: protectedProcedure.mutation(async ({ ctx }) => {
      // Get user data for analysis
      const transactions = await db.getTransactionsByUser(ctx.user.id, 100);
      const goals = await db.getFinancialGoalsByUser(ctx.user.id);
      const ewaHistory = await db.getEwaRequestsByUser(ctx.user.id);

      // Use AI to analyze and calculate new score
      const analysis = await analyzeFwiFactors(
        transactions.map(t => ({
          amount: t.amount,
          category: t.category,
          isDiscretionary: t.isDiscretionary ?? true,
        })),
        goals.map(g => ({
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount,
        })),
        ewaHistory.map(e => ({
          amount: e.amount,
          status: e.status,
        }))
      );

      // Record new score
      await db.recordFwiScore(ctx.user.id, analysis.score, analysis.factors);

      return analysis;
    }),
  }),

  // ============================================
  // FINANCIAL GOALS ROUTER
  // ============================================
  goals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getFinancialGoalsByUser(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        targetAmount: z.number(),
        category: z.enum(['emergency', 'vacation', 'purchase', 'investment', 'other']),
        deadline: z.string().optional(),
        isPriority: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const goalId = await db.createFinancialGoal({
          userId: ctx.user.id,
          name: input.name,
          targetAmount: input.targetAmount,
          category: input.category,
          deadline: input.deadline ? new Date(input.deadline) : undefined,
          isPriority: input.isPriority,
        });
        return { id: goalId, success: true };
      }),

    contribute: protectedProcedure
      .input(z.object({
        goalId: z.number(),
        amount: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.contributeToGoal(input.goalId, input.amount);
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        goalId: z.number(),
        name: z.string().optional(),
        targetAmount: z.number().optional(),
        isPriority: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { goalId, ...data } = input;
        await db.updateFinancialGoal(goalId, data);
        return { success: true };
      }),
  }),

  // ============================================
  // EWA (EARLY WAGE ACCESS) ROUTER
  // ============================================
  ewa: router({
    getAvailable: employeeProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

      // Check for pending requests
      const pendingRequest = await db.getActiveEwaByUser(ctx.user.id);
      if (pendingRequest) {
        return {
          available: 0,
          reason: 'pending_request',
          pendingAmount: pendingRequest.amount,
        };
      }

      // Calculate available amount (50% of monthly income based on days worked)
      const daysInMonth = 30;
      const currentDay = new Date().getDate();
      const daysWorked = Math.min(currentDay, daysInMonth);
      const earnedSoFar = Math.floor((user.monthlyIncome || 0) * (daysWorked / daysInMonth));
      const maxEwa = Math.floor(earnedSoFar * 0.5); // 50% of earned

      // Apply FWI score modifier
      const fwiModifier = (user.fwiScore || 50) >= 40 ? 1 : 0.5;
      const available = Math.floor(maxEwa * fwiModifier);

      return {
        available,
        daysWorked,
        earnedSoFar,
        fwiScore: user.fwiScore,
        monthlyIncome: user.monthlyIncome,
      };
    }),

    request: employeeProcedure
      .input(z.object({
        amount: z.number().min(1000), // Minimum $10 (in cents)
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

        // Validate FWI score
        if ((user.fwiScore || 0) < 40) {
          throw new TRPCError({ 
            code: 'PRECONDITION_FAILED', 
            message: 'FWI Score must be at least 40 to request EWA' 
          });
        }

        // Check for pending requests
        const pendingRequest = await db.getActiveEwaByUser(ctx.user.id);
        if (pendingRequest) {
          throw new TRPCError({ 
            code: 'CONFLICT', 
            message: 'You already have a pending EWA request' 
          });
        }

        // Calculate available and validate
        const daysInMonth = 30;
        const currentDay = new Date().getDate();
        const daysWorked = Math.min(currentDay, daysInMonth);
        const earnedSoFar = Math.floor((user.monthlyIncome || 0) * (daysWorked / daysInMonth));
        const maxEwa = Math.floor(earnedSoFar * 0.5);

        if (input.amount > maxEwa) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: `Maximum available is $${(maxEwa / 100).toFixed(2)}` 
          });
        }

        // Calculate fee (2.5% of amount)
        const fee = Math.floor(input.amount * 0.025);

        const requestId = await db.createEwaRequest({
          userId: ctx.user.id,
          amount: input.amount,
          fee,
          daysWorked,
          monthlyIncome: user.monthlyIncome || 0,
          fwiScoreAtRequest: user.fwiScore || 50,
          estimatedArrival: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        });

        // Log audit
        await db.createAuditLog({
          userId: ctx.user.id,
          action: 'ewa.request',
          resource: 'ewa_requests',
          resourceId: requestId,
          details: JSON.stringify({ amount: input.amount, fee }),
        });

        return { id: requestId, fee, success: true };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getEwaRequestsByUser(ctx.user.id);
    }),

    listPending: b2bAdminProcedure.query(async () => {
      return db.getPendingEwaRequests();
    }),

    // Get all pending EWA requests (for admins)
    getPendingRequests: b2bAdminProcedure.query(async () => {
      const pending = await db.getPendingEwaRequests();
      return pending;
    }),

    approve: b2bAdminProcedure
      .input(z.object({ requestId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.updateEwaStatus(input.requestId, 'processing_transfer', ctx.user.id);
        
        // Log audit
        await db.createAuditLog({
          userId: ctx.user.id,
          action: 'ewa.approve',
          resource: 'ewa_requests',
          resourceId: input.requestId,
        });

        return { success: true };
      }),

    reject: b2bAdminProcedure
      .input(z.object({
        requestId: z.number(),
        reason: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateEwaStatus(input.requestId, 'rejected', ctx.user.id, input.reason);
        
        await db.createAuditLog({
          userId: ctx.user.id,
          action: 'ewa.reject',
          resource: 'ewa_requests',
          resourceId: input.requestId,
          details: JSON.stringify({ reason: input.reason }),
        });

        return { success: true };
      }),
  }),

  // ============================================
  // TREEPOINTS ROUTER
  // ============================================
  treePoints: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      return { balance: user?.treePoints || 0 };
    }),

    getHistory: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }).optional())
      .query(async ({ ctx, input }) => {
        return db.getTreePointsHistory(ctx.user.id, input?.limit || 50);
      }),

    issue: b2bAdminProcedure
      .input(z.object({
        userId: z.number(),
        amount: z.number().min(1),
        reason: z.string(),
        departmentId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const txId = await db.createTreePointsTransaction({
          userId: input.userId,
          amount: input.amount,
          type: 'issued',
          reason: input.reason,
          issuedBy: ctx.user.id,
          departmentId: input.departmentId,
        });

        await db.createAuditLog({
          userId: ctx.user.id,
          action: 'treePoints.issue',
          resource: 'tree_points_transactions',
          resourceId: txId,
          details: JSON.stringify({ toUser: input.userId, amount: input.amount }),
        });

        return { id: txId, success: true };
      }),

    redeem: protectedProcedure
      .input(z.object({
        offerId: z.number(),
        points: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (!user || (user.treePoints || 0) < input.points) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Insufficient points' });
        }

        const txId = await db.createTreePointsTransaction({
          userId: ctx.user.id,
          amount: -input.points,
          type: 'redeemed',
          offerId: input.offerId,
        });

        // Update offer stats
        await db.updateOfferStats(input.offerId, 1, 0);

        return { id: txId, success: true };
      }),

    getDepartmentStats: b2bAdminProcedure
      .input(z.object({ departmentId: z.number() }))
      .query(async ({ input }) => {
        return db.getTreePointsByDepartment(input.departmentId);
      }),
  }),

  // ============================================
  // B2B DASHBOARD ROUTER
  // ============================================
  b2b: router({
    getMetrics: b2bAdminProcedure.query(async () => {
      const departments = await db.getDepartments();
      const riskSummary = await db.getRiskSummaryByDepartment();
      const highRiskEmployees = await db.getHighRiskEmployees(60);

      return {
        totalDepartments: departments.length,
        totalEmployees: departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0),
        avgFwiScore: departments.length > 0 
          ? Math.round(departments.reduce((sum, d) => sum + (d.avgFwiScore || 0), 0) / departments.length)
          : 50,
        highRiskCount: highRiskEmployees.length,
        riskSummary,
      };
    }),

    getRiskAnalysis: b2bAdminProcedure
      .input(z.object({ departmentId: z.number().optional() }))
      .query(async ({ input }) => {
        if (input.departmentId) {
          return db.getEmployeeRiskByDepartment(input.departmentId);
        }
        return db.getHighRiskEmployees(40);
      }),

    getDepartments: b2bAdminProcedure.query(async () => {
      return db.getDepartments();
    }),

    createDepartment: b2bAdminProcedure
      .input(z.object({
        name: z.string(),
        managerId: z.number().optional(),
        treePointsBudget: z.number().default(10000),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createDepartment({
          name: input.name,
          managerId: input.managerId,
          treePointsBudget: input.treePointsBudget,
        });
        return { id, success: true };
      }),

    updateEmployeeRisk: b2bAdminProcedure
      .input(z.object({
        userId: z.number(),
        departmentId: z.number().optional(),
        absenteeismRisk: z.enum(['low', 'medium', 'high', 'critical']),
        turnoverPropensity: z.number().min(0).max(100),
        projectedLoss: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.upsertEmployeeRiskAnalysis({
          userId: input.userId,
          departmentId: input.departmentId,
          absenteeismRisk: input.absenteeismRisk,
          turnoverPropensity: input.turnoverPropensity,
          projectedLoss: input.projectedLoss,
        });
        return { success: true };
      }),
  }),

  // ============================================
  // MERCHANT ROUTER
  // ============================================
  merchant: router({
    getStats: merchantProcedure.query(async ({ ctx }) => {
      const offers = await db.getOffersByMerchant(ctx.user.id);
      const totalRedemptions = offers.reduce((sum, o) => sum + (o.totalRedemptions || 0), 0);
      const totalConversions = offers.reduce((sum, o) => sum + (o.totalConversions || 0), 0);
      
      return {
        totalOffers: offers.length,
        activeOffers: offers.filter(o => o.isActive).length,
        totalRedemptions,
        totalConversions,
        conversionRate: totalRedemptions > 0 
          ? Math.round((totalConversions / totalRedemptions) * 100) 
          : 0,
      };
    }),

    getOffers: merchantProcedure.query(async ({ ctx }) => {
      return db.getOffersByMerchant(ctx.user.id);
    }),

    createOffer: merchantProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        costPoints: z.number().min(1),
        discountValue: z.string().optional(),
        category: z.enum(['financial', 'lifestyle', 'emergency', 'investment']),
        targetFwiSegment: z.enum(['low', 'mid', 'high', 'all']).default('all'),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createMarketOffer({
          merchantId: ctx.user.id,
          title: input.title,
          description: input.description,
          costPoints: input.costPoints,
          discountValue: input.discountValue,
          category: input.category,
          targetFwiSegment: input.targetFwiSegment,
        });
        return { id, success: true };
      }),

    generateSmartOffer: merchantProcedure.mutation(async ({ ctx }) => {
      const offers = await db.getOffersByMerchant(ctx.user.id);
      const topOffers = offers
        .sort((a, b) => (b.totalConversions || 0) - (a.totalConversions || 0))
        .slice(0, 5)
        .map(o => ({
          title: o.title,
          conversions: o.totalConversions || 0,
          redemptions: o.totalRedemptions || 0,
        }));

      return generateSmartOffer(topOffers);
    }),

    // Validate coupon by QR code
    validateCoupon: merchantProcedure
      .input(z.object({ couponCode: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return db.validateCoupon(input.couponCode, ctx.user.id, ctx.user.id);
      }),

    // Get merchant's redemption history
    getRedemptions: merchantProcedure.query(async ({ ctx }) => {
      return db.getMerchantRedemptions(ctx.user.id);
    }),
  }),

  // ============================================
  // MARKET OFFERS (PUBLIC)
  // ============================================
  offers: router({
    list: protectedProcedure
      .input(z.object({ fwiSegment: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return db.getActiveOffers(input?.fwiSegment);
      }),
  }),

  // ============================================
  // AI ASSISTANT ROUTER
  // ============================================
  ai: router({
    chat: protectedProcedure
      .input(z.object({
        message: z.string(),
        history: z.array(z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string(),
        })).default([]),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        const response = await chatWithAdvisor(
          input.message,
          user?.fwiScore || 50,
          user?.monthlyIncome || 0,
          input.history
        );
        return { response };
      }),

    getAdvice: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      const transactions = await db.getTransactionsByUser(ctx.user.id, 10);
      
      return getFinancialAdvice(
        user?.fwiScore || 50,
        user?.monthlyIncome || 0,
        transactions.map(t => ({
          merchant: t.merchant,
          amount: t.amount,
          category: t.category,
        }))
      );
    }),

    classifyExpense: protectedProcedure
      .input(z.object({ description: z.string() }))
      .mutation(async ({ input }) => {
        return classifyExpense(input.description);
      }),
  }),

  // ============================================
  // AUDIT LOGS ROUTER
  // ============================================
  audit: router({
    getMyLogs: protectedProcedure
      .input(z.object({ limit: z.number().default(100) }).optional())
      .query(async ({ ctx, input }) => {
        return db.getAuditLogsByUser(ctx.user.id, input?.limit || 100);
      }),

    getByResource: adminProcedure
      .input(z.object({
        resource: z.string(),
        resourceId: z.number(),
      }))
      .query(async ({ input }) => {
        return db.getAuditLogsByResource(input.resource, input.resourceId);
      }),
  }),

  // ============================================
  // LEADS ROUTER (Public for landing page forms)
  // ============================================
  // ============================================
  // ALERTS ROUTER
  // ============================================
  alerts: router({
    // Get all alert rules
    getRules: b2bAdminProcedure
      .input(z.object({ departmentId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return alertService.getAlertRules(input?.departmentId);
      }),

    // Create new alert rule
    createRule: b2bAdminProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        alertType: z.enum([
          "fwi_department_low",
          "fwi_individual_low",
          "fwi_trend_negative",
          "ewa_pending_count",
          "ewa_pending_amount",
          "ewa_user_excessive",
          "high_risk_percentage",
          "new_high_risk_user",
          "weekly_risk_summary"
        ]),
        threshold: z.number(),
        comparisonOperator: z.enum(["lt", "lte", "gt", "gte", "eq"]).optional(),
        departmentId: z.number().optional(),
        notifyEmail: z.boolean().optional(),
        notifyPush: z.boolean().optional(),
        notifyInApp: z.boolean().optional(),
        notifyAdmins: z.boolean().optional(),
        notifyB2BAdmin: z.boolean().optional(),
        cooldownMinutes: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return alertService.createAlertRule({
          ...input,
          createdBy: ctx.user.id,
        });
      }),

    // Toggle alert rule
    toggleRule: b2bAdminProcedure
      .input(z.object({
        ruleId: z.number(),
        isEnabled: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        await alertService.toggleAlertRule(input.ruleId, input.isEnabled);
        return { success: true };
      }),

    // Delete alert rule
    deleteRule: b2bAdminProcedure
      .input(z.object({ ruleId: z.number() }))
      .mutation(async ({ input }) => {
        await alertService.deleteAlertRule(input.ruleId);
        return { success: true };
      }),

    // Get alert history
    getHistory: b2bAdminProcedure
      .input(z.object({
        departmentId: z.number().optional(),
        alertType: z.enum([
          "fwi_department_low",
          "fwi_individual_low",
          "fwi_trend_negative",
          "ewa_pending_count",
          "ewa_pending_amount",
          "ewa_user_excessive",
          "high_risk_percentage",
          "new_high_risk_user",
          "weekly_risk_summary"
        ]).optional(),
        limit: z.number().optional(),
        onlyUnresolved: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return alertService.getAlertHistory(input);
      }),

    // Acknowledge an alert
    acknowledge: b2bAdminProcedure
      .input(z.object({ alertId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await alertService.acknowledgeAlert(input.alertId, ctx.user.id);
        return { success: true };
      }),

    // Resolve an alert
    resolve: b2bAdminProcedure
      .input(z.object({ alertId: z.number() }))
      .mutation(async ({ input }) => {
        await alertService.resolveAlert(input.alertId);
        return { success: true };
      }),

    // Manually trigger alert evaluation (admin only)
    evaluate: adminProcedure
      .mutation(async () => {
        const results = await alertService.evaluateAlertRules();
        return { 
          evaluated: results.length,
          triggered: results.filter(r => r.triggered).length,
          results 
        };
      }),

    // Create default rules for a department
    createDefaults: b2bAdminProcedure
      .input(z.object({ departmentId: z.number().optional() }))
      .mutation(async ({ ctx, input }) => {
        await alertService.createDefaultAlertRules(ctx.user.id, input.departmentId);
        return { success: true };
      }),

    // Get unresolved alerts count (for badges)
    getUnresolvedCount: b2bAdminProcedure
      .query(async () => {
        return alertService.getUnresolvedAlertCount();
      }),

    // Get unresolved alerts summary (for badges with severity)
    getUnresolvedSummary: b2bAdminProcedure
      .query(async () => {
        return alertService.getUnresolvedAlertsSummary();
      }),
  }),

  // ============================================
  // LEADS ROUTER (Public for landing page forms)
  // ============================================
  leads: router({
    submit: publicProcedure
      .input(z.object({
        companyName: z.string().min(1, "Nombre de empresa requerido"),
        contactName: z.string().min(1, "Nombre de contacto requerido"),
        email: z.string().email("Email inválido"),
        phone: z.string().optional(),
        employeeCount: z.string().optional(),
        industry: z.string().optional(),
        source: z.string().default("founders_form"),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const lead = await db.createLead(input);
        
        // Notify owner about new lead
        await notifyOwner({
          title: `🌟 Nuevo Lead: ${input.companyName}`,
          content: `Contacto: ${input.contactName}\nEmail: ${input.email}\nEmpleados: ${input.employeeCount || 'No especificado'}\nFuente: ${input.source}`,
        });
        
        // Send confirmation email to the user
        try {
          await sendEmail(
            input.email,
            'lead_confirmation',
            {
              contactName: input.contactName,
              companyName: input.companyName,
              email: input.email,
              employeeCount: input.employeeCount,
            }
          );
        } catch (emailError) {
          console.error('[Leads] Error sending confirmation email:', emailError);
          // Don't fail the lead submission if email fails
        }
        
        return { success: true, id: lead.id };
      }),

    getAll: adminProcedure
      .input(z.object({ status: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return db.getLeads(input?.status);
      }),

    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
      }))
      .mutation(async ({ input }) => {
        return db.updateLeadStatus(input.id, input.status);
      }),
  }),

  // ============================================
  // MFA ROUTER
  // ============================================
  mfa: router({
    getStatus: protectedProcedure
      .query(async ({ ctx }) => {
        return mfaService.getMFAStatus(ctx.user.id);
      }),

    setup: protectedProcedure
      .mutation(async ({ ctx }) => {
        const result = await mfaService.setupMFA(ctx.user.id);
        if (!result) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to setup MFA' });
        }
        return { qrCode: result.qrCode, backupCodes: result.backupCodes };
      }),

    verify: protectedProcedure
      .input(z.object({ token: z.string().length(6) }))
      .mutation(async ({ ctx, input }) => {
        const success = await mfaService.verifyAndEnableMFA(ctx.user.id, input.token);
        if (!success) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid verification code' });
        }
        return { success: true };
      }),

    verifyToken: publicProcedure
      .input(z.object({ userId: z.number(), token: z.string().min(6).max(8) }))
      .mutation(async ({ input }) => {
        const success = await mfaService.verifyMFAToken(input.userId, input.token);
        return { valid: success };
      }),

    disable: protectedProcedure
      .input(z.object({ token: z.string().length(6) }))
      .mutation(async ({ ctx, input }) => {
        const success = await mfaService.disableMFA(ctx.user.id, input.token);
        if (!success) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid verification code' });
        }
        return { success: true };
      }),

    regenerateBackupCodes: protectedProcedure
      .input(z.object({ token: z.string().length(6) }))
      .mutation(async ({ ctx, input }) => {
        const codes = await mfaService.regenerateBackupCodes(ctx.user.id, input.token);
        if (!codes) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid verification code' });
        }
        return { backupCodes: codes };
      }),

    isRequired: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        const enabled = await mfaService.isMFAEnabled(input.userId);
        return { required: enabled };
      }),
  }),

  // ============================================
  // PULSE SURVEYS ROUTER
  // ============================================
  surveys: router({
    getActive: protectedProcedure
      .query(async ({ ctx }) => {
        return pulseSurveyService.getActiveSurveyForUser(ctx.user.id);
      }),

    submit: protectedProcedure
      .input(z.object({
        surveyId: z.number(),
        responses: z.array(z.object({
          questionId: z.number(),
          responseValue: z.number().optional(),
          responseText: z.string().optional(),
          responseChoice: z.string().optional(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const success = await pulseSurveyService.submitSurveyResponses(
          ctx.user.id,
          input.surveyId,
          input.responses
        );
        if (!success) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Failed to submit survey' });
        }
        return { success: true };
      }),

    getResults: b2bAdminProcedure
      .input(z.object({ surveyId: z.number() }))
      .query(async ({ input }) => {
        return pulseSurveyService.getSurveyResults(input.surveyId);
      }),

    getWellbeingScore: protectedProcedure
      .query(async ({ ctx }) => {
        const score = await pulseSurveyService.calculateWellbeingScore(ctx.user.id);
        return { score };
      }),

    create: b2bAdminProcedure
      .input(z.object({
        title: z.string().optional(),
        organizationId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const surveyId = await pulseSurveyService.createDefaultSurvey(
          input.organizationId || ctx.user.departmentId,
          ctx.user.id,
          input.title
        );
        if (!surveyId) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create survey' });
        }
        return { surveyId };
      }),

    getAll: b2bAdminProcedure
      .input(z.object({ organizationId: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return pulseSurveyService.getOrganizationSurveys(input?.organizationId || ctx.user.departmentId);
      }),

    sendReminders: b2bAdminProcedure
      .input(z.object({ surveyId: z.number() }))
      .mutation(async ({ input }) => {
        const count = await pulseSurveyService.sendSurveyReminders(input.surveyId);
        return { sentCount: count };
      }),
  }),

  // ============================================
  // WEEKLY REPORTS ROUTER
  // ============================================
  weeklyReports: router({
    triggerNow: b2bAdminProcedure
      .input(z.object({ organizationId: z.number() }))
      .mutation(async ({ input }) => {
        const success = await triggerWeeklyReportNow(input.organizationId);
        return { success };
      }),
  }),

  // ============================================
  // EDUCATION PROGRESS ROUTER
  // ============================================
  education: router({
    getProgress: protectedProcedure
      .input(z.object({ tutorialType: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getEducationProgress(ctx.user.id, input.tutorialType);
      }),

    getAllProgress: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getAllEducationProgress(ctx.user.id);
      }),

    updateProgress: protectedProcedure
      .input(z.object({
        tutorialType: z.string(),
        stepsCompleted: z.number(),
        totalSteps: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.updateEducationProgress(
          ctx.user.id,
          input.tutorialType,
          input.stepsCompleted,
          input.totalSteps
        );
      }),

    completeTutorial: protectedProcedure
      .input(z.object({
        tutorialType: z.string(),
        totalSteps: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.updateEducationProgress(
          ctx.user.id,
          input.tutorialType,
          input.totalSteps,
          input.totalSteps
        );
      }),
  }),

  // ============================================
  // DEMO MODE ROUTER (Admin only)
  // ============================================
  demo: router({
    getStats: adminProcedure
      .query(async () => {
        const dbInstance = await db.getDb();
        if (!dbInstance) return { employees: 0, transactions: 0, offers: 0, ewaRequests: 0 };
        
        const [employeeCount] = await dbInstance.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, 'employee'));
        const [txCount] = await dbInstance.select({ count: sql<number>`count(*)` }).from(transactions);
        const [offerCount] = await dbInstance.select({ count: sql<number>`count(*)` }).from(marketOffers);
        const [ewaCount] = await dbInstance.select({ count: sql<number>`count(*)` }).from(ewaRequests);
        
        return {
          employees: Number(employeeCount?.count || 0),
          transactions: Number(txCount?.count || 0),
          offers: Number(offerCount?.count || 0),
          ewaRequests: Number(ewaCount?.count || 0),
        };
      }),

    resetData: adminProcedure
      .mutation(async () => {
        const dbInstance = await db.getDb();
        if (!dbInstance) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        // Limpiar datos transaccionales (mantener usuarios y config)
        await dbInstance.delete(offerRedemptions);
        await dbInstance.delete(educationProgress);
        await dbInstance.delete(userBadges);
        await dbInstance.delete(notifications);
        await dbInstance.delete(treePointsTransactions);
        await dbInstance.delete(ewaRequests);
        await dbInstance.delete(financialGoals);
        await dbInstance.delete(transactions);
        
        return { success: true };
      }),

    seedData: adminProcedure
      .mutation(async () => {
        // Ejecutar el seed script programáticamente
        const dbInstance = await db.getDb();
        if (!dbInstance) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        // Crear transacciones de ejemplo para usuarios existentes
        const existingUsers = await dbInstance.select().from(users).where(eq(users.role, 'employee')).limit(50);
        
        let txCount = 0;
        const categories = ['food', 'transport', 'entertainment', 'services', 'health', 'shopping', 'other'] as const;
        const merchants = ['Starbucks', 'Uber', 'Netflix', 'CFE', 'Farmacia', 'Liverpool', 'Oxxo'];
        
        for (const user of existingUsers) {
          // Crear 5-15 transacciones por usuario
          const numTx = Math.floor(Math.random() * 11) + 5;
          for (let i = 0; i < numTx; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const merchant = merchants[Math.floor(Math.random() * merchants.length)];
            const amount = Math.floor(Math.random() * 500) + 50;
            const daysAgo = Math.floor(Math.random() * 30);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            
            await dbInstance.insert(transactions).values({
              userId: user.id,
              amount: amount * 100, // centavos
              category,
              merchant,
              description: `Compra en ${merchant}`,
              transactionDate: date,
              createdAt: date,
            });
            txCount++;
          }
        }
        
        return {
          employees: existingUsers.length,
          transactions: txCount,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
