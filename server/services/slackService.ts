/**
 * Slack Notification Service
 * Sends alert notifications to configured Slack webhooks
 */

import type { AlertSeverity } from "./alertService";

interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  elements?: Array<{
    type: string;
    text?: string;
    style?: string;
  }>;
  fields?: Array<{
    type: string;
    text: string;
  }>;
}

interface SlackMessage {
  text: string;
  blocks?: SlackBlock[];
  attachments?: Array<{
    color: string;
    blocks?: SlackBlock[];
  }>;
}

// Severity colors for Slack
const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  critical: "#DC2626", // Red
  warning: "#F59E0B",  // Amber
  info: "#3B82F6"      // Blue
};

const SEVERITY_EMOJI: Record<AlertSeverity, string> = {
  critical: "🚨",
  warning: "⚠️",
  info: "ℹ️"
};

const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  critical: "CRÍTICO",
  warning: "ADVERTENCIA",
  info: "INFORMACIÓN"
};

/**
 * Validate a Slack webhook URL
 */
export function isValidSlackWebhook(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.hostname === "hooks.slack.com" && 
           parsed.pathname.startsWith("/services/");
  } catch {
    return false;
  }
}

/**
 * Format an alert as Slack blocks
 */
export function formatAlertForSlack(
  alertType: string,
  message: string,
  severity: AlertSeverity,
  currentValue: number,
  threshold: number,
  options?: {
    departmentName?: string;
    userName?: string;
    alertId?: number;
    dashboardUrl?: string;
  }
): SlackMessage {
  const emoji = SEVERITY_EMOJI[severity];
  const label = SEVERITY_LABELS[severity];
  const color = SEVERITY_COLORS[severity];
  
  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${emoji} Alerta Treevü: ${label}`,
        emoji: true
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: message
      }
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Tipo de Alerta:*\n${formatAlertType(alertType)}`
        },
        {
          type: "mrkdwn",
          text: `*Severidad:*\n${label}`
        },
        {
          type: "mrkdwn",
          text: `*Valor Actual:*\n${formatValue(currentValue, alertType)}`
        },
        {
          type: "mrkdwn",
          text: `*Umbral:*\n${formatValue(threshold, alertType)}`
        }
      ]
    }
  ];
  
  // Add context if available
  const contextElements: Array<{ type: string; text: string }> = [];
  
  if (options?.departmentName) {
    contextElements.push({
      type: "mrkdwn",
      text: `📁 Departamento: ${options.departmentName}`
    });
  }
  
  if (options?.userName) {
    contextElements.push({
      type: "mrkdwn",
      text: `👤 Usuario: ${options.userName}`
    });
  }
  
  contextElements.push({
    type: "mrkdwn",
    text: `🕐 ${new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })}`
  });
  
  if (contextElements.length > 0) {
    blocks.push({
      type: "context",
      elements: contextElements
    });
  }
  
  // Add action button if dashboard URL provided
  if (options?.dashboardUrl) {
    blocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Ver en Dashboard",
            emoji: true
          },
          url: options.dashboardUrl,
          style: "primary"
        } as any
      ]
    });
  }
  
  blocks.push({
    type: "divider"
  } as SlackBlock);
  
  return {
    text: `${emoji} Alerta Treevü: ${message}`,
    attachments: [
      {
        color,
        blocks
      }
    ]
  };
}

/**
 * Format alert type for display
 */
function formatAlertType(alertType: string): string {
  const typeLabels: Record<string, string> = {
    fwi_department_low: "FWI Departamento Bajo",
    fwi_individual_low: "FWI Individual Bajo",
    fwi_trend_negative: "Tendencia FWI Negativa",
    ewa_pending_count: "EWA Pendientes",
    ewa_pending_amount: "Monto EWA Alto",
    ewa_user_excessive: "Uso Excesivo EWA",
    high_risk_percentage: "% Alto Riesgo",
    new_high_risk_user: "Nuevo Usuario en Riesgo",
    weekly_risk_summary: "Resumen Semanal"
  };
  return typeLabels[alertType] || alertType;
}

/**
 * Format value based on alert type
 */
function formatValue(value: number, alertType: string): string {
  if (alertType.includes("amount")) {
    return `$${value.toLocaleString("es-MX")}`;
  }
  if (alertType.includes("percentage") || alertType.includes("fwi")) {
    return `${value}%`;
  }
  return value.toString();
}

/**
 * Send a message to a Slack webhook
 */
export async function sendSlackNotification(
  webhookUrl: string,
  message: SlackMessage
): Promise<{ success: boolean; error?: string }> {
  if (!isValidSlackWebhook(webhookUrl)) {
    return { success: false, error: "Invalid Slack webhook URL" };
  }
  
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error("[SlackService] Error sending notification:", text);
      return { success: false, error: `Slack API error: ${response.status}` };
    }
    
    console.log("[SlackService] Notification sent successfully");
    return { success: true };
  } catch (error) {
    console.error("[SlackService] Error sending notification:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Send an alert notification to Slack
 */
export async function sendAlertToSlack(
  webhookUrl: string,
  alertType: string,
  message: string,
  severity: AlertSeverity,
  currentValue: number,
  threshold: number,
  options?: {
    departmentName?: string;
    userName?: string;
    alertId?: number;
    dashboardUrl?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const slackMessage = formatAlertForSlack(
    alertType,
    message,
    severity,
    currentValue,
    threshold,
    options
  );
  
  return sendSlackNotification(webhookUrl, slackMessage);
}

/**
 * Send a simple text message to Slack
 */
export async function sendSimpleSlackMessage(
  webhookUrl: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  return sendSlackNotification(webhookUrl, { text });
}

/**
 * Send a daily summary to Slack
 */
export async function sendDailySummaryToSlack(
  webhookUrl: string,
  summary: {
    totalAlerts: number;
    criticalAlerts: number;
    warningAlerts: number;
    avgFwi: number;
    employeesAtRisk: number;
    totalEmployees: number;
    pendingEwa: number;
  }
): Promise<{ success: boolean; error?: string }> {
  const riskPercentage = summary.totalEmployees > 0 
    ? Math.round((summary.employeesAtRisk / summary.totalEmployees) * 100) 
    : 0;
  
  const healthEmoji = summary.avgFwi >= 70 ? "🟢" : summary.avgFwi >= 50 ? "🟡" : "🔴";
  
  const message: SlackMessage = {
    text: "📊 Resumen Diario de Treevü",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📊 Resumen Diario de Treevü",
          emoji: true
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*FWI Promedio:*\n${healthEmoji} ${summary.avgFwi}`
          },
          {
            type: "mrkdwn",
            text: `*Empleados en Riesgo:*\n${summary.employeesAtRisk} de ${summary.totalEmployees} (${riskPercentage}%)`
          },
          {
            type: "mrkdwn",
            text: `*Alertas Hoy:*\n🚨 ${summary.criticalAlerts} críticas, ⚠️ ${summary.warningAlerts} advertencias`
          },
          {
            type: "mrkdwn",
            text: `*EWA Pendientes:*\n${summary.pendingEwa} solicitudes`
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Generado: ${new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })}`
          }
        ]
      }
    ]
  };
  
  return sendSlackNotification(webhookUrl, message);
}
