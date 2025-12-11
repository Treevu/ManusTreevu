/**
 * Notification Triggers Service
 * Automatically sends notifications when specific events occur
 */

import { getDb } from '../db';
import { notifications, notificationPreferences, users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { sendPushToUser, PushPayload } from './pushService';
import { sendEmail, queueEmail } from './emailService';

interface NotificationData {
  userId: number;
  type: string;
  title: string;
  message: string;
  icon?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

/**
 * Get user preferences for a notification type
 */
async function getUserPreferences(userId: number): Promise<{
  inApp: boolean;
  push: boolean;
  email: boolean;
  userEmail?: string;
  userName?: string;
}> {
  const db = await getDb();
  if (!db) return { inApp: true, push: false, email: false };

  try {
    // Get user info
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userResult[0];

    // Get preferences
    const prefResult = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId))
      .limit(1);

    const prefs = prefResult[0];

    return {
      inApp: prefs?.inAppEnabled ?? true,
      push: prefs?.pushEnabled ?? false,
      email: prefs?.emailEnabled ?? false,
      userEmail: user?.email || undefined,
      userName: user?.name || undefined,
    };
  } catch (error) {
    console.error('[NotificationTriggers] Error getting preferences:', error);
    return { inApp: true, push: false, email: false };
  }
}

/**
 * Check if a specific notification type is enabled for the user
 */
async function isNotificationTypeEnabled(userId: number, type: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return true;

  try {
    const prefResult = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId))
      .limit(1);

    if (!prefResult[0]) return true; // Default to enabled

    const prefs = prefResult[0] as Record<string, any>;
    
    // Map notification type to preference key
    const typeToKey: Record<string, string> = {
      ewa_approved: 'ewaApproved',
      ewa_rejected: 'ewaRejected',
      ewa_disbursed: 'ewaDisbursed',
      treepoints_received: 'treepointsReceived',
      treepoints_redeemed: 'treepointsRedeemed',
      goal_progress: 'goalProgress',
      goal_completed: 'goalCompleted',
      fwi_improved: 'fwiImproved',
      fwi_alert: 'fwiAlert',
      level_up: 'levelUp',
      streak_milestone: 'streakMilestone',
      offer_available: 'offerAvailable',
      system_announcement: 'systemAnnouncement',
      security_alert: 'securityAlert',
    };

    const key = typeToKey[type];
    if (!key) return true;

    return prefs[key] !== false;
  } catch (error) {
    console.error('[NotificationTriggers] Error checking type enabled:', error);
    return true;
  }
}

/**
 * Create in-app notification
 */
async function createInAppNotification(data: NotificationData): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(notifications).values({
      userId: data.userId,
      type: data.type as any,
      title: data.title,
      message: data.message,
      icon: data.icon,
      actionUrl: data.actionUrl,
      actionLabel: data.actionLabel,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    });

    return result[0]?.insertId || null;
  } catch (error) {
    console.error('[NotificationTriggers] Error creating notification:', error);
    return null;
  }
}

/**
 * Send notification through all enabled channels
 */
async function sendNotification(data: NotificationData): Promise<{
  inApp: boolean;
  push: boolean;
  email: boolean;
}> {
  const result = { inApp: false, push: false, email: false };

  // Check if this notification type is enabled
  const typeEnabled = await isNotificationTypeEnabled(data.userId, data.type);
  if (!typeEnabled) {
    console.log(`[NotificationTriggers] Type ${data.type} disabled for user ${data.userId}`);
    return result;
  }

  // Get user preferences
  const prefs = await getUserPreferences(data.userId);

  // In-app notification
  if (prefs.inApp) {
    const notificationId = await createInAppNotification(data);
    result.inApp = notificationId !== null;
  }

  // Push notification
  if (prefs.push) {
    const pushPayload: PushPayload = {
      title: data.title,
      body: data.message,
      type: data.type,
      actionUrl: data.actionUrl,
      icon: data.icon,
    };
    const pushResult = await sendPushToUser(data.userId, pushPayload);
    result.push = pushResult.success > 0;
  }

  // Email notification
  if (prefs.email && prefs.userEmail) {
    const emailData = {
      ...data.metadata,
      userName: prefs.userName,
      actionUrl: data.actionUrl,
    };
    
    // Queue email for async sending
    result.email = await queueEmail(
      data.userId,
      prefs.userEmail,
      data.type,
      emailData
    );
  }

  return result;
}

// ============================================
// TRIGGER FUNCTIONS
// ============================================

/**
 * Trigger: EWA Request Approved
 */
export async function triggerEwaApproved(
  userId: number,
  amount: number,
  fee: number
): Promise<void> {
  await sendNotification({
    userId,
    type: 'ewa_approved',
    title: '¡Adelanto Aprobado!',
    message: `Tu solicitud de adelanto por $${(amount / 100).toFixed(2)} ha sido aprobada.`,
    icon: 'CheckCircle',
    actionUrl: '/ewa',
    actionLabel: 'Ver detalles',
    metadata: { amount, fee },
  });
}

/**
 * Trigger: EWA Request Rejected
 */
export async function triggerEwaRejected(
  userId: number,
  reason?: string
): Promise<void> {
  await sendNotification({
    userId,
    type: 'ewa_rejected',
    title: 'Solicitud No Aprobada',
    message: reason || 'Tu solicitud de adelanto no pudo ser aprobada en este momento.',
    icon: 'XCircle',
    actionUrl: '/dashboard/employee',
    actionLabel: 'Ver alternativas',
    metadata: { reason },
  });
}

/**
 * Trigger: EWA Disbursed
 */
export async function triggerEwaDisbursed(
  userId: number,
  amount: number,
  fee: number
): Promise<void> {
  await sendNotification({
    userId,
    type: 'ewa_disbursed',
    title: '¡Dinero Transferido!',
    message: `Tu adelanto de $${((amount - fee) / 100).toFixed(2)} ha sido transferido a tu cuenta.`,
    icon: 'Wallet',
    actionUrl: '/ewa',
    actionLabel: 'Ver historial',
    metadata: { amount, fee },
  });
}

/**
 * Trigger: TreePoints Received
 */
export async function triggerTreepointsReceived(
  userId: number,
  points: number,
  reason: string,
  newBalance: number
): Promise<void> {
  await sendNotification({
    userId,
    type: 'treepoints_received',
    title: `+${points} TreePoints`,
    message: `Has ganado ${points} TreePoints por ${reason}. Balance: ${newBalance} pts.`,
    icon: 'Gift',
    actionUrl: '/offers',
    actionLabel: 'Canjear puntos',
    metadata: { points, reason, balance: newBalance },
  });
}

/**
 * Trigger: TreePoints Redeemed
 */
export async function triggerTreepointsRedeemed(
  userId: number,
  points: number,
  offerName: string,
  newBalance: number
): Promise<void> {
  await sendNotification({
    userId,
    type: 'treepoints_redeemed',
    title: 'Puntos Canjeados',
    message: `Has canjeado ${points} TreePoints por "${offerName}". Balance: ${newBalance} pts.`,
    icon: 'ShoppingBag',
    actionUrl: '/offers',
    actionLabel: 'Ver ofertas',
    metadata: { points, offerName, balance: newBalance },
  });
}

/**
 * Trigger: Goal Progress Update
 */
export async function triggerGoalProgress(
  userId: number,
  goalName: string,
  currentAmount: number,
  targetAmount: number
): Promise<void> {
  const percentage = Math.round((currentAmount / targetAmount) * 100);
  
  await sendNotification({
    userId,
    type: 'goal_progress',
    title: `Meta "${goalName}" al ${percentage}%`,
    message: `Has alcanzado $${(currentAmount / 100).toFixed(2)} de $${(targetAmount / 100).toFixed(2)} en tu meta.`,
    icon: 'Target',
    actionUrl: '/dashboard/employee',
    actionLabel: 'Ver metas',
    metadata: { goalName, currentAmount, targetAmount, percentage },
  });
}

/**
 * Trigger: Goal Completed
 */
export async function triggerGoalCompleted(
  userId: number,
  goalName: string,
  targetAmount: number
): Promise<void> {
  await sendNotification({
    userId,
    type: 'goal_completed',
    title: '🎯 ¡Meta Completada!',
    message: `¡Felicitaciones! Has alcanzado tu meta "${goalName}" de $${(targetAmount / 100).toFixed(2)}.`,
    icon: 'Trophy',
    actionUrl: '/dashboard/employee',
    actionLabel: 'Crear nueva meta',
    metadata: { goalName, targetAmount },
  });
}

/**
 * Trigger: FWI Score Improved
 */
export async function triggerFwiImproved(
  userId: number,
  oldScore: number,
  newScore: number
): Promise<void> {
  const improvement = newScore - oldScore;
  
  await sendNotification({
    userId,
    type: 'fwi_improved',
    title: `📈 FWI Score: ${newScore}`,
    message: `¡Tu FWI Score subió ${improvement} puntos! De ${oldScore} a ${newScore}.`,
    icon: 'TrendingUp',
    actionUrl: '/dashboard/employee',
    actionLabel: 'Ver detalles',
    metadata: { oldScore, newScore, improvement },
  });
}

/**
 * Trigger: FWI Score Alert (Low Score)
 */
export async function triggerFwiAlert(
  userId: number,
  score: number,
  reason?: string
): Promise<void> {
  await sendNotification({
    userId,
    type: 'fwi_alert',
    title: '⚠️ Alerta de FWI Score',
    message: reason || `Tu FWI Score ha bajado a ${score}. Te recomendamos revisar tus finanzas.`,
    icon: 'AlertTriangle',
    actionUrl: '/dashboard/employee',
    actionLabel: 'Mejorar FWI',
    metadata: { score, reason },
  });
}

/**
 * Trigger: Level Up
 */
export async function triggerLevelUp(
  userId: number,
  newLevel: number
): Promise<void> {
  await sendNotification({
    userId,
    type: 'level_up',
    title: `🌟 ¡Nivel ${newLevel}!`,
    message: `¡Felicitaciones! Has subido al nivel ${newLevel}. Sigue así para desbloquear más beneficios.`,
    icon: 'Star',
    actionUrl: '/dashboard/employee',
    actionLabel: 'Ver beneficios',
    metadata: { level: newLevel },
  });
}

/**
 * Trigger: Streak Milestone
 */
export async function triggerStreakMilestone(
  userId: number,
  streakDays: number
): Promise<void> {
  await sendNotification({
    userId,
    type: 'streak_milestone',
    title: `🔥 ¡${streakDays} días de racha!`,
    message: `¡Increíble! Llevas ${streakDays} días consecutivos mejorando tu bienestar financiero.`,
    icon: 'Flame',
    actionUrl: '/dashboard/employee',
    actionLabel: 'Ver logros',
    metadata: { streakDays },
  });
}

/**
 * Trigger: New Offer Available
 */
export async function triggerOfferAvailable(
  userId: number,
  offerTitle: string,
  costPoints: number
): Promise<void> {
  await sendNotification({
    userId,
    type: 'offer_available',
    title: '🏷️ Nueva Oferta',
    message: `"${offerTitle}" está disponible por ${costPoints} TreePoints.`,
    icon: 'Tag',
    actionUrl: '/offers',
    actionLabel: 'Ver oferta',
    metadata: { offerTitle, costPoints },
  });
}

/**
 * Trigger: Security Alert
 */
export async function triggerSecurityAlert(
  userId: number,
  alertType: string,
  details: {
    location?: string;
    device?: string;
    ipAddress?: string;
  }
): Promise<void> {
  await sendNotification({
    userId,
    type: 'security_alert',
    title: '⚠️ Alerta de Seguridad',
    message: `Se detectó actividad inusual: ${alertType}. Revisa tu cuenta.`,
    icon: 'Shield',
    actionUrl: '/settings/security',
    actionLabel: 'Revisar seguridad',
    metadata: { alertType, ...details, timestamp: new Date().toISOString() },
  });
}

/**
 * Trigger: System Announcement
 */
export async function triggerSystemAnnouncement(
  userId: number,
  title: string,
  message: string,
  actionUrl?: string
): Promise<void> {
  await sendNotification({
    userId,
    type: 'system_announcement',
    title,
    message,
    icon: 'Bell',
    actionUrl: actionUrl || '/app',
    actionLabel: 'Ver más',
    metadata: {},
  });
}
