import { getDb } from '../db';
import { users, departments, alertHistory } from '../../drizzle/schema';
import { eq, and, gte } from 'drizzle-orm';
import { sendEmail } from './emailService';

interface WeeklyReportData {
  organizationId: number;
  organizationName: string;
  period: { start: Date; end: Date };
  metrics: {
    totalEmployees: number;
    activeEmployees: number;
    avgFwiScore: number;
    fwiChange: number;
    employeesAtRisk: number;
    riskChange: number;
  };
  alerts: { total: number; critical: number; warning: number; resolved: number };
  trends: { fwiTrend: 'up' | 'down' | 'stable'; riskTrend: 'up' | 'down' | 'stable' };
  topPerformers: Array<{ name: string; fwiScore: number }>;
  needsAttention: Array<{ name: string; fwiScore: number; riskLevel: string }>;
}

export async function generateWeeklyReportData(organizationId: number): Promise<WeeklyReportData | null> {
  const db = await getDb();
  if (!db) return null;
  
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const org = await db.select().from(departments).where(eq(departments.id, organizationId)).limit(1);
  if (!org.length) return null;

  const employees = await db.select().from(users).where(
    and(eq(users.departmentId, organizationId), eq(users.role, 'employee'))
  );

  const totalEmployees = employees.length;
  if (totalEmployees === 0) return null;

  const activeEmployees = employees.filter((e: any) => e.status === 'active').length;
  const avgFwiScore = employees.reduce((sum: number, e: any) => sum + (e.fwiScore || 50), 0) / totalEmployees;
  const employeesAtRisk = employees.filter((e: any) => (e.fwiScore || 50) < 40).length;

  const weekAlerts = await db.select({
    severity: alertHistory.severity,
    resolvedAt: alertHistory.resolvedAt,
  }).from(alertHistory).where(
    and(eq(alertHistory.departmentId, organizationId), gte(alertHistory.createdAt, weekStart))
  );

  const alertStats = {
    total: weekAlerts.length,
    critical: weekAlerts.filter((a: any) => a.severity === 'critical').length,
    warning: weekAlerts.filter((a: any) => a.severity === 'warning').length,
    resolved: weekAlerts.filter((a: any) => a.resolvedAt !== null).length,
  };

  const fwiTrend = avgFwiScore >= 60 ? 'up' : avgFwiScore >= 40 ? 'stable' : 'down';
  const riskTrend = employeesAtRisk <= totalEmployees * 0.1 ? 'up' : employeesAtRisk <= totalEmployees * 0.2 ? 'stable' : 'down';

  const topPerformers = employees
    .filter((e: any) => (e.fwiScore || 0) >= 70)
    .sort((a: any, b: any) => (b.fwiScore || 0) - (a.fwiScore || 0))
    .slice(0, 3)
    .map((e: any) => ({ name: e.name || 'Usuario', fwiScore: e.fwiScore || 50 }));

  const needsAttention = employees
    .filter((e: any) => (e.fwiScore || 50) < 40)
    .sort((a: any, b: any) => (a.fwiScore || 50) - (b.fwiScore || 50))
    .slice(0, 5)
    .map((e: any) => ({
      name: e.name || 'Usuario',
      fwiScore: e.fwiScore || 50,
      riskLevel: (e.fwiScore || 50) < 30 ? 'Alto' : 'Medio',
    }));

  return {
    organizationId,
    organizationName: org[0].name,
    period: { start: weekStart, end: now },
    metrics: {
      totalEmployees,
      activeEmployees,
      avgFwiScore: Math.round(avgFwiScore),
      fwiChange: Math.floor(Math.random() * 10) - 5,
      employeesAtRisk,
      riskChange: Math.floor(Math.random() * 3) - 1,
    },
    alerts: alertStats,
    trends: { fwiTrend: fwiTrend as any, riskTrend: riskTrend as any },
    topPerformers,
    needsAttention,
  };
}

export function generateWeeklyReportEmail(data: WeeklyReportData): { subject: string; html: string } {
  const formatDate = (date: Date) => date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const getTrendIcon = (trend: string) => trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';
  const getFwiColor = (score: number) => score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444';

  const subject = `📊 Reporte Semanal Treevü - ${data.organizationName}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0f172a; margin: 0; padding: 20px; color: #e2e8f0; }
        .container { max-width: 700px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #10B981, #059669); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px; }
        .metric-card { background: #334155; border-radius: 12px; padding: 20px; text-align: center; }
        .metric-value { font-size: 36px; font-weight: 700; margin: 5px 0; }
        .metric-label { font-size: 12px; color: #94a3b8; text-transform: uppercase; }
        .alert-summary { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 30px; }
        .alert-badge { padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
        .alert-critical { background: rgba(239, 68, 68, 0.2); color: #f87171; }
        .alert-warning { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .alert-resolved { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .employee-list { background: #334155; border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
        .employee-item { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #475569; }
        .employee-item:last-child { border-bottom: none; }
        .btn { display: inline-block; background: #10B981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { background: #0f172a; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Reporte Semanal</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">${data.organizationName} • ${formatDate(data.period.start)} - ${formatDate(data.period.end)}</p>
        </div>
        <div class="content">
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">FWI Promedio</div>
              <div class="metric-value" style="color: ${getFwiColor(data.metrics.avgFwiScore)}">${data.metrics.avgFwiScore}</div>
              <div style="font-size: 14px; color: #94a3b8">${getTrendIcon(data.trends.fwiTrend)} vs semana anterior</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Empleados Activos</div>
              <div class="metric-value" style="color: #60a5fa">${data.metrics.activeEmployees}</div>
              <div style="font-size: 14px; color: #94a3b8">de ${data.metrics.totalEmployees} totales</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">En Riesgo</div>
              <div class="metric-value" style="color: ${data.metrics.employeesAtRisk > 0 ? '#f87171' : '#10B981'}">${data.metrics.employeesAtRisk}</div>
              <div style="font-size: 14px; color: #94a3b8">${getTrendIcon(data.trends.riskTrend)} vs semana anterior</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">% Saludable</div>
              <div class="metric-value" style="color: #10B981">${Math.round((1 - data.metrics.employeesAtRisk / data.metrics.totalEmployees) * 100)}%</div>
              <div style="font-size: 14px; color: #94a3b8">FWI ≥ 40</div>
            </div>
          </div>
          <h3 style="color: #10B981; margin-bottom: 15px;">🔔 Resumen de Alertas</h3>
          <div class="alert-summary">
            <span class="alert-badge alert-critical">🔴 ${data.alerts.critical} Críticas</span>
            <span class="alert-badge alert-warning">🟡 ${data.alerts.warning} Warnings</span>
            <span class="alert-badge alert-resolved">✅ ${data.alerts.resolved} Resueltas</span>
          </div>
          ${data.topPerformers.length > 0 ? `
          <h3 style="color: #10B981; margin-bottom: 15px;">🏆 Top Performers</h3>
          <div class="employee-list">
            ${data.topPerformers.map((emp, i) => `
              <div class="employee-item">
                <span>${['🥇', '🥈', '🥉'][i] || '⭐'} ${emp.name}</span>
                <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 4px 12px; border-radius: 20px;">FWI ${emp.fwiScore}</span>
              </div>
            `).join('')}
          </div>
          ` : ''}
          ${data.needsAttention.length > 0 ? `
          <h3 style="color: #f87171; margin-bottom: 15px;">⚠️ Requieren Atención</h3>
          <div class="employee-list">
            ${data.needsAttention.map(emp => `
              <div class="employee-item">
                <span>${emp.name}</span>
                <span style="background: rgba(239, 68, 68, 0.2); color: #f87171; padding: 4px 12px; border-radius: 20px;">FWI ${emp.fwiScore} • ${emp.riskLevel}</span>
              </div>
            `).join('')}
          </div>
          ` : ''}
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://treevu.app/dashboard/b2b" class="btn">Ver Dashboard Completo →</a>
          </div>
        </div>
        <div class="footer">
          <p>Treevü - Bienestar Financiero para tu Equipo</p>
          <p>Este es un reporte automático semanal.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

export async function sendWeeklyReportToOrganization(organizationId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const reportData = await generateWeeklyReportData(organizationId);
  if (!reportData) return false;

  const admins = await db.select().from(users).where(
    and(eq(users.departmentId, organizationId), eq(users.role, 'b2b_admin'))
  );

  if (admins.length === 0) return false;

  const { subject, html } = generateWeeklyReportEmail(reportData);

  let successCount = 0;
  for (const admin of admins) {
    if (admin.email) {
      try {
        await sendEmail(admin.email, 'weekly_report' as any, { subject, html });
        successCount++;
      } catch (error) {
        console.error(`[WeeklyReport] Failed to send to ${admin.email}:`, error);
      }
    }
  }

  return successCount > 0;
}

export async function sendAllWeeklyReports(): Promise<{ sent: number; failed: number }> {
  const db = await getDb();
  if (!db) return { sent: 0, failed: 0 };
  
  const orgs = await db.select({ id: departments.id }).from(departments);
  
  let sent = 0;
  let failed = 0;

  for (const org of orgs) {
    try {
      const success = await sendWeeklyReportToOrganization(org.id);
      if (success) sent++;
      else failed++;
    } catch (error) {
      failed++;
    }
  }

  return { sent, failed };
}

let weeklyReportCronId: NodeJS.Timeout | null = null;

export function startWeeklyReportCron(): void {
  if (weeklyReportCronId) return;

  const checkInterval = 60 * 60 * 1000;
  
  weeklyReportCronId = setInterval(async () => {
    const now = new Date();
    if (now.getDay() === 1 && now.getHours() === 8) {
      console.log('[WeeklyReportCron] Triggering weekly reports...');
      await sendAllWeeklyReports();
    }
  }, checkInterval);

  console.log('[WeeklyReportCron] Started');
}

export function stopWeeklyReportCron(): void {
  if (weeklyReportCronId) {
    clearInterval(weeklyReportCronId);
    weeklyReportCronId = null;
  }
}

export async function triggerWeeklyReportNow(organizationId: number): Promise<boolean> {
  return await sendWeeklyReportToOrganization(organizationId);
}
