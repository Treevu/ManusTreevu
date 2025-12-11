import { getDb } from "../db";
import * as dbHelpers from "../db";
import { alertRules, alertHistory, users, departments, organizationAlertThresholds } from "../../drizzle/schema";
import { eq, and, desc, sql, gt, isNull } from "drizzle-orm";
import { sendEmail } from "./emailService";
import { notifyOwner } from "../_core/notification";
import { sendPushToUser } from "./pushService";
import { sendAlertToSlack, isValidSlackWebhook } from "./slackService";

// Alert types
export type AlertType = 
  | "fwi_department_low"
  | "fwi_individual_low"
  | "fwi_trend_negative"
  | "ewa_pending_count"
  | "ewa_pending_amount"
  | "ewa_user_excessive"
  | "high_risk_percentage"
  | "new_high_risk_user"
  | "weekly_risk_summary";

export type AlertSeverity = "info" | "warning" | "critical";

export interface AlertRuleInput {
  name: string;
  description?: string;
  alertType: AlertType;
  threshold: number;
  comparisonOperator?: "lt" | "lte" | "gt" | "gte" | "eq";
  departmentId?: number;
  notifyEmail?: boolean;
  notifyPush?: boolean;
  notifyInApp?: boolean;
  notifyAdmins?: boolean;
  notifyB2BAdmin?: boolean;
  cooldownMinutes?: number;
  createdBy: number;
}

export interface AlertTriggerResult {
  triggered: boolean;
  alertId?: number;
  message?: string;
  severity?: AlertSeverity;
}

// Get severity based on how far the value is from threshold
function getSeverity(currentValue: number, threshold: number, alertType: AlertType): AlertSeverity {
  const percentDiff = Math.abs((currentValue - threshold) / threshold) * 100;
  
  if (alertType.includes("fwi") || alertType.includes("risk")) {
    if (percentDiff > 30) return "critical";
    if (percentDiff > 15) return "warning";
    return "info";
  }
  
  if (percentDiff > 50) return "critical";
  if (percentDiff > 25) return "warning";
  return "info";
}

// Generate alert message based on type
function generateAlertMessage(
  alertType: AlertType,
  currentValue: number,
  threshold: number,
  departmentName?: string,
  userName?: string
): string {
  const messages: Record<AlertType, string> = {
    fwi_department_low: `⚠️ Alerta FWI: El departamento ${departmentName || "desconocido"} tiene un FWI promedio de ${currentValue}, por debajo del umbral de ${threshold}.`,
    fwi_individual_low: `🚨 Alerta de Riesgo: ${userName || "Un empleado"} tiene un FWI de ${currentValue}, indicando alto riesgo financiero.`,
    fwi_trend_negative: `📉 Tendencia Negativa: El FWI de ${userName || departmentName || "la organización"} ha bajado durante 3 meses consecutivos.`,
    ewa_pending_count: `📋 EWA Pendientes: Hay ${currentValue} solicitudes de adelanto pendientes de aprobación (umbral: ${threshold}).`,
    ewa_pending_amount: `💰 Monto EWA Alto: El monto total de EWA pendiente es $${currentValue.toLocaleString()}, superando el umbral de $${threshold.toLocaleString()}.`,
    ewa_user_excessive: `⚠️ Uso Excesivo EWA: ${userName || "Un empleado"} ha solicitado ${currentValue} adelantos este mes (umbral: ${threshold}).`,
    high_risk_percentage: `🔴 Alto Riesgo Elevado: ${currentValue}% de empleados están en alto riesgo financiero (umbral: ${threshold}%).`,
    new_high_risk_user: `🆕 Nuevo Alto Riesgo: ${userName || "Un empleado"} ha entrado en categoría de alto riesgo con FWI de ${currentValue}.`,
    weekly_risk_summary: `📊 Resumen Semanal: ${currentValue} empleados en alto riesgo. Tendencia: ${currentValue > threshold ? "↑ aumentando" : "↓ disminuyendo"}.`
  };
  
  return messages[alertType];
}

// Check if comparison passes
function checkComparison(
  currentValue: number,
  threshold: number,
  operator: "lt" | "lte" | "gt" | "gte" | "eq"
): boolean {
  switch (operator) {
    case "lt": return currentValue < threshold;
    case "lte": return currentValue <= threshold;
    case "gt": return currentValue > threshold;
    case "gte": return currentValue >= threshold;
    case "eq": return currentValue === threshold;
    default: return false;
  }
}

// Check cooldown period
async function isInCooldown(ruleId: number, cooldownMinutes: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return true;
  
  const cooldownTime = new Date(Date.now() - cooldownMinutes * 60 * 1000);
  
  const recentAlert = await db
    .select()
    .from(alertHistory)
    .where(
      and(
        eq(alertHistory.ruleId, ruleId),
        gt(alertHistory.createdAt, cooldownTime)
      )
    )
    .limit(1);
  
  return recentAlert.length > 0;
}

// Create alert rule
export async function createAlertRule(input: AlertRuleInput) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(alertRules).values({
    name: input.name,
    description: input.description,
    alertType: input.alertType,
    threshold: input.threshold,
    comparisonOperator: input.comparisonOperator || "lt",
    departmentId: input.departmentId,
    notifyEmail: input.notifyEmail ?? true,
    notifyPush: input.notifyPush ?? true,
    notifyInApp: input.notifyInApp ?? true,
    notifyAdmins: input.notifyAdmins ?? true,
    notifyB2BAdmin: input.notifyB2BAdmin ?? true,
    cooldownMinutes: input.cooldownMinutes ?? 60,
    createdBy: input.createdBy,
  });
  
  return result;
}

// Get all alert rules
export async function getAlertRules(departmentId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (departmentId) {
    return db
      .select()
      .from(alertRules)
      .where(
        sql`${alertRules.departmentId} = ${departmentId} OR ${alertRules.departmentId} IS NULL`
      )
      .orderBy(desc(alertRules.createdAt));
  }
  
  return db
    .select()
    .from(alertRules)
    .orderBy(desc(alertRules.createdAt));
}

// Get alert history
export async function getAlertHistory(options?: {
  departmentId?: number;
  alertType?: AlertType;
  limit?: number;
  onlyUnresolved?: boolean;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(alertHistory);
  
  const conditions = [];
  
  if (options?.departmentId) {
    conditions.push(eq(alertHistory.departmentId, options.departmentId));
  }
  
  if (options?.alertType) {
    conditions.push(eq(alertHistory.alertType, options.alertType));
  }
  
  if (options?.onlyUnresolved) {
    conditions.push(isNull(alertHistory.resolvedAt));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }
  
  return query
    .orderBy(desc(alertHistory.createdAt))
    .limit(options?.limit || 50);
}

// Trigger an alert
export async function triggerAlert(
  ruleId: number,
  currentValue: number,
  options?: {
    departmentId?: number;
    departmentName?: string;
    userId?: number;
    userName?: string;
    previousValue?: number;
  }
): Promise<AlertTriggerResult> {
  const db = await getDb();
  if (!db) return { triggered: false };
  
  // Get the rule
  const [rule] = await db
    .select()
    .from(alertRules)
    .where(eq(alertRules.id, ruleId));
  
  if (!rule || !rule.isEnabled) {
    return { triggered: false };
  }
  
  // Check if comparison triggers
  if (!checkComparison(currentValue, rule.threshold, rule.comparisonOperator)) {
    return { triggered: false };
  }
  
  // Check cooldown
  if (await isInCooldown(ruleId, rule.cooldownMinutes)) {
    return { triggered: false, message: "En período de cooldown" };
  }
  
  // Generate message and severity
  const severity = getSeverity(currentValue, rule.threshold, rule.alertType);
  const message = generateAlertMessage(
    rule.alertType,
    currentValue,
    rule.threshold,
    options?.departmentName,
    options?.userName
  );
  
  // Create alert history entry
  const result = await db.insert(alertHistory).values({
    ruleId: rule.id,
    alertType: rule.alertType,
    departmentId: options?.departmentId || rule.departmentId,
    userId: options?.userId,
    previousValue: options?.previousValue,
    currentValue,
    threshold: rule.threshold,
    message,
    severity,
    notifiedViaEmail: false,
    notifiedViaPush: false,
    notifiedViaInApp: false,
  });
  
  const alertId = result[0].insertId;
  
  // Get users to notify
  const usersToNotify: number[] = [];
  
  if (rule.notifyAdmins) {
    const admins = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "admin"));
    usersToNotify.push(...admins.map((a) => a.id));
  }
  
  if (rule.notifyB2BAdmin && options?.departmentId) {
    const b2bAdmins = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "b2b_admin"));
    usersToNotify.push(...b2bAdmins.map((a) => a.id));
  }
  
  // Send email notifications
  if (rule.notifyEmail && usersToNotify.length > 0) {
    const adminUsers = await db
      .select({ email: users.email, name: users.name })
      .from(users)
      .where(sql`${users.id} IN (${usersToNotify.join(",")})`);
    
    for (const admin of adminUsers) {
      if (admin.email) {
        await sendEmail(
          admin.email,
          `Alerta Treevü: ${rule.name}`,
          `<h2>${severity === 'critical' ? '🚨' : '⚠️'} ${rule.name}</h2><p>${message}</p><p>Fecha: ${new Date().toLocaleString()}</p>`
        ).catch(console.error);
      }
    }
    
    await db
      .update(alertHistory)
      .set({ notifiedViaEmail: true })
      .where(eq(alertHistory.id, alertId));
  }
  
  // Send push notifications for critical and warning alerts
  if (rule.notifyPush && (severity === "critical" || severity === "warning") && usersToNotify.length > 0) {
    const pushPayload = {
      title: severity === "critical" ? `🚨 Alerta Crítica: ${rule.name}` : `⚠️ Alerta: ${rule.name}`,
      body: message,
      icon: '/icons/alert-icon.png',
      type: 'alert',
      actionUrl: '/dashboard/alerts',
      tag: `alert-${alertId}`,
      requireInteraction: severity === "critical"
    };
    
    let pushSuccess = 0;
    for (const userId of usersToNotify) {
      const result = await sendPushToUser(userId, pushPayload).catch(() => ({ success: 0, failed: 0 }));
      pushSuccess += result.success;
    }
    
    if (pushSuccess > 0) {
      await db
        .update(alertHistory)
        .set({ notifiedViaPush: true })
        .where(eq(alertHistory.id, alertId));
    }
    
    console.log(`[AlertService] Push notifications sent to ${pushSuccess} devices for alert ${alertId}`);
  }
  
  // Notify owner for critical alerts
  if (severity === "critical") {
    await notifyOwner({
      title: `🚨 Alerta Crítica: ${rule.name}`,
      content: message
    }).catch(console.error);
  }
  
  // Update notified users
  await db
    .update(alertHistory)
    .set({ notifiedUsers: JSON.stringify(usersToNotify) })
    .where(eq(alertHistory.id, alertId));
  
  return {
    triggered: true,
    alertId,
    message,
    severity
  };
}

// Acknowledge an alert
export async function acknowledgeAlert(alertId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(alertHistory)
    .set({
      acknowledgedBy: userId,
      acknowledgedAt: new Date()
    })
    .where(eq(alertHistory.id, alertId));
}

// Resolve an alert
export async function resolveAlert(alertId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(alertHistory)
    .set({ resolvedAt: new Date() })
    .where(eq(alertHistory.id, alertId));
}

// Toggle alert rule
export async function toggleAlertRule(ruleId: number, isEnabled: boolean) {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(alertRules)
    .set({ isEnabled })
    .where(eq(alertRules.id, ruleId));
}

// Delete alert rule
export async function deleteAlertRule(ruleId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db
    .delete(alertRules)
    .where(eq(alertRules.id, ruleId));
}

// Get organization thresholds with fallback to defaults
async function getEffectiveThresholds(organizationId?: number) {
  const defaults = await dbHelpers.getDefaultThresholds();
  
  if (!organizationId) return defaults;
  
  const orgThresholds = await dbHelpers.getOrganizationThresholds(organizationId);
  if (!orgThresholds) return defaults;
  
  return {
    fwiCriticalThreshold: orgThresholds.fwiCriticalThreshold ?? defaults.fwiCriticalThreshold,
    fwiWarningThreshold: orgThresholds.fwiWarningThreshold ?? defaults.fwiWarningThreshold,
    fwiHealthyThreshold: orgThresholds.fwiHealthyThreshold ?? defaults.fwiHealthyThreshold,
    riskCriticalPercentage: orgThresholds.riskCriticalPercentage ?? defaults.riskCriticalPercentage,
    riskWarningPercentage: orgThresholds.riskWarningPercentage ?? defaults.riskWarningPercentage,
    ewaMaxPendingCount: orgThresholds.ewaMaxPendingCount ?? defaults.ewaMaxPendingCount,
    ewaMaxPendingAmount: orgThresholds.ewaMaxPendingAmount ?? defaults.ewaMaxPendingAmount,
    ewaMaxPerEmployee: orgThresholds.ewaMaxPerEmployee ?? defaults.ewaMaxPerEmployee,
    notifyOnCritical: orgThresholds.notifyOnCritical ?? defaults.notifyOnCritical,
    notifyOnWarning: orgThresholds.notifyOnWarning ?? defaults.notifyOnWarning,
    notifyOnInfo: orgThresholds.notifyOnInfo ?? defaults.notifyOnInfo,
    notifySlackWebhook: orgThresholds.notifySlackWebhook || null,
    notifyEmails: orgThresholds.notifyEmails || null,
  };
}

// Check if notification should be sent based on severity and preferences
function shouldNotify(severity: AlertSeverity, thresholds: Awaited<ReturnType<typeof getEffectiveThresholds>>): boolean {
  switch (severity) {
    case 'critical': return thresholds.notifyOnCritical;
    case 'warning': return thresholds.notifyOnWarning;
    case 'info': return thresholds.notifyOnInfo;
    default: return false;
  }
}

// Evaluate all active rules (to be called periodically)
export async function evaluateAlertRules(organizationId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Get effective thresholds for the organization
  const thresholds = await getEffectiveThresholds(organizationId);
  
  const rules = await db
    .select()
    .from(alertRules)
    .where(eq(alertRules.isEnabled, true));
  
  const results: AlertTriggerResult[] = [];
  
  for (const rule of rules) {
    let currentValue: number | null = null;
    let departmentName: string | undefined;
    let effectiveThreshold = rule.threshold;
    
    // Override threshold based on organization settings
    switch (rule.alertType) {
      case "fwi_department_low":
        effectiveThreshold = thresholds.fwiWarningThreshold;
        if (rule.departmentId) {
          const [deptStats] = await db
            .select({
              avgFwi: sql<number>`AVG(${users.fwiScore})`,
              deptName: departments.name
            })
            .from(users)
            .innerJoin(departments, eq(users.departmentId, departments.id))
            .where(eq(users.departmentId, rule.departmentId))
            .groupBy(departments.id);
          
          if (deptStats) {
            currentValue = Math.round(deptStats.avgFwi);
            departmentName = deptStats.deptName;
          }
        }
        break;
        
      case "high_risk_percentage":
        effectiveThreshold = thresholds.riskWarningPercentage;
        const [riskStats] = await db
          .select({
            total: sql<number>`COUNT(*)`,
            highRisk: sql<number>`SUM(CASE WHEN ${users.fwiScore} < ${thresholds.fwiCriticalThreshold} THEN 1 ELSE 0 END)`
          })
          .from(users)
          .where(eq(users.role, "employee"));
        
        if (riskStats && riskStats.total > 0) {
          currentValue = Math.round((riskStats.highRisk / riskStats.total) * 100);
        }
        break;
        
      case "ewa_pending_count":
        effectiveThreshold = thresholds.ewaMaxPendingCount;
        const [ewaCount] = await db
          .select({
            count: sql<number>`COUNT(*)`
          })
          .from(sql`ewa_requests`)
          .where(sql`status = 'pending'`);
        
        if (ewaCount) {
          currentValue = ewaCount.count;
        }
        break;
        
      case "ewa_pending_amount":
        effectiveThreshold = thresholds.ewaMaxPendingAmount;
        const [ewaAmount] = await db
          .select({
            total: sql<number>`COALESCE(SUM(amount), 0)`
          })
          .from(sql`ewa_requests`)
          .where(sql`status = 'pending'`);
        
        if (ewaAmount) {
          currentValue = ewaAmount.total;
        }
        break;
    }
    
    if (currentValue !== null) {
      // Use effective threshold from organization settings
      const result = await triggerAlertWithThresholds(
        rule.id, 
        currentValue, 
        effectiveThreshold,
        thresholds,
        {
          departmentId: rule.departmentId || undefined,
          departmentName
        }
      );
      results.push(result);
    }
  }
  
  return results;
}

// Trigger alert with custom thresholds and Slack notification
async function triggerAlertWithThresholds(
  ruleId: number,
  currentValue: number,
  effectiveThreshold: number,
  thresholds: Awaited<ReturnType<typeof getEffectiveThresholds>>,
  options?: {
    departmentId?: number;
    departmentName?: string;
    userId?: number;
    userName?: string;
    previousValue?: number;
  }
): Promise<AlertTriggerResult> {
  const db = await getDb();
  if (!db) return { triggered: false };
  
  // Get the rule
  const [rule] = await db
    .select()
    .from(alertRules)
    .where(eq(alertRules.id, ruleId));
  
  if (!rule || !rule.isEnabled) {
    return { triggered: false };
  }
  
  // Check if comparison triggers using effective threshold
  if (!checkComparison(currentValue, effectiveThreshold, rule.comparisonOperator)) {
    return { triggered: false };
  }
  
  // Check cooldown
  if (await isInCooldown(ruleId, rule.cooldownMinutes)) {
    return { triggered: false, message: "En período de cooldown" };
  }
  
  // Generate message and severity using effective threshold
  const severity = getSeverity(currentValue, effectiveThreshold, rule.alertType);
  const message = generateAlertMessage(
    rule.alertType,
    currentValue,
    effectiveThreshold,
    options?.departmentName,
    options?.userName
  );
  
  // Check if we should notify based on severity and preferences
  if (!shouldNotify(severity, thresholds)) {
    console.log(`[AlertService] Skipping notification for ${rule.alertType} (${severity}) - disabled in preferences`);
    return { triggered: false, message: "Notificación deshabilitada para esta severidad" };
  }
  
  // Create alert history entry
  const result = await db.insert(alertHistory).values({
    ruleId: rule.id,
    alertType: rule.alertType,
    departmentId: options?.departmentId || rule.departmentId,
    userId: options?.userId,
    previousValue: options?.previousValue,
    currentValue,
    threshold: effectiveThreshold,
    message,
    severity,
    notifiedViaEmail: false,
    notifiedViaPush: false,
    notifiedViaInApp: false,
  });
  
  const alertId = result[0].insertId;
  
  // Send Slack notification if webhook is configured
  if (thresholds.notifySlackWebhook && isValidSlackWebhook(thresholds.notifySlackWebhook)) {
    try {
      const slackResult = await sendAlertToSlack(
        thresholds.notifySlackWebhook,
        rule.alertType,
        message,
        severity,
        currentValue,
        effectiveThreshold,
        {
          departmentName: options?.departmentName,
          userName: options?.userName,
          alertId,
          dashboardUrl: process.env.VITE_APP_URL ? `${process.env.VITE_APP_URL}/dashboard/alerts` : undefined
        }
      );
      
      if (slackResult.success) {
        console.log(`[AlertService] Slack notification sent for alert ${alertId}`);
      } else {
        console.error(`[AlertService] Failed to send Slack notification: ${slackResult.error}`);
      }
    } catch (error) {
      console.error('[AlertService] Error sending Slack notification:', error);
    }
  }
  
  // Get users to notify (existing logic)
  const usersToNotify: number[] = [];
  
  if (rule.notifyAdmins) {
    const admins = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "admin"));
    usersToNotify.push(...admins.map((a) => a.id));
  }
  
  if (rule.notifyB2BAdmin && options?.departmentId) {
    const b2bAdmins = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "b2b_admin"));
    usersToNotify.push(...b2bAdmins.map((a) => a.id));
  }
  
  // Send push notifications for critical and warning alerts
  if ((severity === 'critical' || severity === 'warning') && usersToNotify.length > 0) {
    for (const userId of usersToNotify) {
      try {
        await sendPushToUser(userId, {
          title: severity === 'critical' ? '🚨 Alerta Crítica Treevü' : '⚠️ Advertencia Treevü',
          body: message,
          icon: '/icons/icon-192.png',
          tag: `alert-${alertId}`,
          type: 'alert',
          actionUrl: '/dashboard/alerts',
          requireInteraction: severity === 'critical'
        });
      } catch (error) {
        console.error(`[AlertService] Failed to send push to user ${userId}:`, error);
      }
    }
    
    await db
      .update(alertHistory)
      .set({ notifiedViaPush: true })
      .where(eq(alertHistory.id, alertId));
  }
  
  // Update notified users
  await db
    .update(alertHistory)
    .set({ notifiedUsers: JSON.stringify(usersToNotify) })
    .where(eq(alertHistory.id, alertId));
  
  return {
    triggered: true,
    alertId,
    message,
    severity
  };
}

// Create default alert rules for a new organization
export async function createDefaultAlertRules(createdBy: number, departmentId?: number) {
  const defaultRules: Omit<AlertRuleInput, "createdBy">[] = [
    {
      name: "FWI Departamento Bajo",
      description: "Alerta cuando el FWI promedio del departamento baja de 50",
      alertType: "fwi_department_low",
      threshold: 50,
      comparisonOperator: "lt",
      departmentId,
      cooldownMinutes: 1440,
    },
    {
      name: "Alto Riesgo Elevado",
      description: "Alerta cuando más del 20% de empleados están en alto riesgo",
      alertType: "high_risk_percentage",
      threshold: 20,
      comparisonOperator: "gt",
      cooldownMinutes: 1440,
    },
    {
      name: "EWA Pendientes Alto",
      description: "Alerta cuando hay más de 10 solicitudes EWA pendientes",
      alertType: "ewa_pending_count",
      threshold: 10,
      comparisonOperator: "gt",
      cooldownMinutes: 240,
    },
    {
      name: "Monto EWA Pendiente Alto",
      description: "Alerta cuando el monto total de EWA pendiente supera $50,000",
      alertType: "ewa_pending_amount",
      threshold: 50000,
      comparisonOperator: "gt",
      cooldownMinutes: 480,
    }
  ];
  
  for (const rule of defaultRules) {
    await createAlertRule({ ...rule, createdBy });
  }
}


// Get count of unresolved alerts
export async function getUnresolvedAlertCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const [result] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(alertHistory)
    .where(isNull(alertHistory.resolvedAt));
  
  return result?.count || 0;
}

// Get unresolved alerts summary
export async function getUnresolvedAlertsSummary(): Promise<{
  total: number;
  critical: number;
  warning: number;
  info: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, critical: 0, warning: 0, info: 0 };
  
  const results = await db
    .select({
      severity: alertHistory.severity,
      count: sql<number>`COUNT(*)`
    })
    .from(alertHistory)
    .where(isNull(alertHistory.resolvedAt))
    .groupBy(alertHistory.severity);
  
  const summary = {
    total: 0,
    critical: 0,
    warning: 0,
    info: 0
  };
  
  for (const row of results) {
    const count = Number(row.count);
    summary.total += count;
    if (row.severity === 'critical') summary.critical = count;
    else if (row.severity === 'warning') summary.warning = count;
    else if (row.severity === 'info') summary.info = count;
  }
  
  return summary;
}
