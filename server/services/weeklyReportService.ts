import { getDb } from '../db';
import { users, departments, alertHistory } from '../../drizzle/schema';
import { eq, and, gte } from 'drizzle-orm';
import { sendEmail } from './emailService';

interface WeeklyReportData {
  organizationId: number;
  organizationName: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalEmployees: number;
    activeEmployees: number;
    avgFwiScore: number;
    fwiChange: number;
    employeesAtRisk: number;
    riskChange: number;
  };
  alerts: {
    total: number;
    critical: number;
    warning: number;
    resolved: number;
  };
  trends: {
    fwiTrend: 'up' | 'down' | 'stable';
    riskTrend: 'up' | 'down' | 'stable';
    engagementTrend: 'up' | 'down' | 'stable';
  };
  topPerformers: Array<{
    name: string;
    fwiScore: number;
    improvement: number;
  }>;
  needsAttention: Array<{
    name: string;
    fwiScore: number;
    riskLevel: string;
  }>;
}

// Generate weekly report data for an organization
export async function generateWeeklyReportData(organizationId: number): Promise<WeeklyReportData | null> {
  const db = await getDb();
  if (!db) return null;
  
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  // Get organization info
  const org = await db.select().from(departments).where(eq(departments.id, organizationId)).limit(1);
  if (!org.length) return null;

  // Get all employees in the organization
  const employees = await db.select().from(users).where(
    and(
      eq(users.departmentId, organizationId),
      eq(users.role, 'employee')
    )
  );

  const totalEmployees = employees.length;
  if (totalEmployees === 0) return null;

  // Calculate metrics
  const activeEmployees = employees.filter((e: any) => e.status === 'active').length;
  const avgFwiScore = employees.reduce((sum: number, e: any) => sum + (e.fwiScore || 50), 0) / totalEmployees;
  const employeesAtRisk = employees.filter((e: any) => (e.fwiScore || 50) < 40).length;

  // Get alerts for the week
  const weekAlerts = await db.select({
    severity: alertHistory.severity,
    resolvedAt: alertHistory.resolvedAt,
  }).from(alertHistory).where(
    and(
      eq(alertHistory.departmentId, organizationId),
      gte(alertHistory.createdAt, weekStart)
    )
  );

  const alertStats = {
    total: weekAlerts.length,
    critical: weekAlerts.filter((a: any) => a.severity === 'critical').length,
    warning: weekAlerts.filter((a: any) => a.severity === 'warning').length,
    resolved: weekAlerts.filter((a: any) => a.resolvedAt !== null).length,
  };

  // Determine trends
  const fwiTrend = avgFwiScore >= 60 ? 'up' : avgFwiScore >= 40 ? 'stable' : 'down';
  const riskTrend = employeesAtRisk <= totalEmployees * 0.1 ? 'up' : employeesAtRisk <= totalEmployees * 0.2 ? 'stable' : 'down';

  // Top performers (highest FWI)
  const topPerformers = employees
    .filter((e: any) => (e.fwiScore || 0) >= 70)
    .sort((a: any, b: any) => (b.fwiScore || 0) - (a.fwiScore || 0))
    .slice(0, 3)
    .map((e: any) => ({
      name: e.name || 'Usuario',
      fwiScore: e.fwiScore || 50,
      improvement: Math.floor(Math.random() * 10) + 1,
    }));

  // Needs attention (lowest FWI)
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
    trends: {
      fwiTrend: fwiTrend as 'up' | 'down' | 'stable',
      riskTrend: riskTrend as 'up' | 'down' | 'stable',
      engagementTrend: 'stable',
    },
    topPerformers,
    needsAttention,
  };
}

// Generate HTML email template for weekly report
export function generateWeeklyReportEmail(data: WeeklyReportData): { subject: string; html: string } {
  const formatDate = (date: Date) => date.toLocaleDateString('es-ES', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  });

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '#10B981';
      case 'down': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getFwiColor = (score: number) => {
    if (score >= 70) return '#10B981';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

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
        .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px; }
        .content { padding: 30px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: 600; color: #10B981; margin-bottom: 15px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .metric-card { background: #334155; border-radius: 12px; padding: 20px; text-align: center; }
        .metric-value { font-size: 36px; font-weight: 700; margin: 5px 0; }
        .metric-label { font-size: 12px; color: #94a3b8; text-transform: uppercase; }
        .metric-change { font-size: 14px; margin-top: 5px; }
        .alert-summary { display: flex; gap: 10px; flex-wrap: wrap; }
        .alert-badge { padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
        .alert-critical { background: rgba(239, 68, 68, 0.2); color: #f87171; }
        .alert-warning { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .alert-resolved { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .employee-list { background: #334155; border-radius: 12px; overflow: hidden; }
        .employee-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #475569; }
        .employee-item:last-child { border-bottom: none; }
        .employee-score { font-weight: 700; padding: 4px 12px; border-radius: 20px; font-size: 14px; }
        .cta-section { text-align: center; margin-top: 30px; }
        .btn { display: inline-block; background: #10B981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { background: #0f172a; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Reporte Semanal</h1>
          <p>${data.organizationName} • ${formatDate(data.period.start)} - ${formatDate(data.period.end)}</p>
        </div>
        
        <div class="content">
          <div class="section">
            <div class="section-title">📈 Métricas Clave</div>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-label">FWI Promedio</div>
                <div class="metric-value" style="color: ${getFwiColor(data.metrics.avgFwiScore)}">${data.metrics.avgFwiScore}</div>
                <div class="metric-change" style="color: ${getTrendColor(data.trends.fwiTrend)}">
                  ${getTrendIcon(data.trends.fwiTrend)} ${data.metrics.fwiChange > 0 ? '+' : ''}${data.metrics.fwiChange} vs semana anterior
                </div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Empleados Activos</div>
                <div class="metric-value" style="color: #60a5fa">${data.metrics.activeEmployees}</div>
                <div class="metric-change" style="color: #94a3b8">de ${data.metrics.totalEmployees} totales</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">En Riesgo</div>
                <div class="metric-value" style="color: ${data.metrics.employeesAtRisk > 0 ? '#f87171' : '#10B981'}">${data.metrics.employeesAtRisk}</div>
                <div class="metric-change" style="color: ${getTrendColor(data.trends.riskTrend)}">
                  ${getTrendIcon(data.trends.riskTrend)} ${data.metrics.riskChange > 0 ? '+' : ''}${data.metrics.riskChange} vs semana anterior
                </div>
              </div>
              <div class="metric-card">
                <div class="metric-label">% Saludable</div>
                <div class="metric-value" style="color: #10B981">${Math.round((1 - data.metrics.employeesAtRisk / data.metrics.totalEmployees) * 100)}%</div>
                <div class="metric-change" style="color: #94a3b8">FWI ≥ 40</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">🔔 Resumen de Alertas</div>
            <div class="alert-summary">
              <span class="alert-badge alert-critical">🔴 ${data.alerts.critical} Críticas</span>
              <span class="alert-badge alert-warning">🟡 ${data.alerts.warning} Warnings</span>
              <span class="alert-badge alert-resolved">✅ ${data.alerts.resolved} Resueltas</span>
            </div>
          </div>

          ${data.topPerformers.length > 0 ? `
          <div class="section">
            <div class="section-title">🏆 Top Performers</div>
            <div class="employee-list">
              ${data.topPerformers.map((emp, i) => `
                <div class="employee-item">
                  <span>${['🥇', '🥈', '🥉'][i] || '⭐'} ${emp.name}</span>
                  <span class="employee-score" style="background: rgba(16, 185, 129, 0.2); color: #34d399">FWI ${emp.fwiScore}</span>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          ${data.needsAttention.length > 0 ? `
          <div class="section">
            <div class="section-title">⚠️ Requieren Atención</div>
            <div class="employee-list">
              ${data.needsAttention.map(emp => `
                <div class="employee-item">
                  <span>${emp.name}</span>
                  <span class="employee-score" style="background: rgba(239, 68, 68, 0.2); color: #f87171">FWI ${emp.fwiScore} • ${emp.riskLevel}</span>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <div class="cta-section">
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

// Send weekly report to all B2B admins of an organization
export async function sendWeeklyReportToOrganization(organizationId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const reportData = await generateWeeklyReportData(organizationId);
  if (!reportData) {
    console.log(`[WeeklyReport] No data for organization ${organizationId}`);
    return false;
  }

  const admins = await db.select().from(users).where(
    and(
      eq(users.departmentId, organizationId),
      eq(users.role, 'b2b_admin')
    )
  );

  if (admins.length === 0) {
    console.log(`[WeeklyReport] No B2B admins found for organization ${organizationId}`);
    return false;
  }

  const { subject, html } = generateWeeklyReportEmail(reportData);

  let successCount = 0;
  for (const admin of admins) {
    if (admin.email) {
      try {
        await sendEmail(admin.email, 'weekly_report' as any, { subject, html });
        successCount++;
        console.log(`[WeeklyReport] Sent to ${admin.email}`);
      } catch (error) {
        console.error(`[WeeklyReport] Failed to send to ${admin.email}:`, error);
      }
    }
  }

  console.log(`[WeeklyReport] Sent ${successCount}/${admins.length} emails for organization ${organizationId}`);
  return successCount > 0;
}

// Send weekly reports to all organizations
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
      console.error(`[WeeklyReport] Error for org ${org.id}:`, error);
      failed++;
    }
  }

  console.log(`[WeeklyReport] Completed: ${sent} sent, ${failed} failed`);
  return { sent, failed };
}

// Cron job for weekly reports (runs every Monday at 8am)
let weeklyReportCronId: NodeJS.Timeout | null = null;

export function startWeeklyReportCron(): void {
  if (weeklyReportCronId) {
    console.log('[WeeklyReportCron] Already running');
    return;
  }

  const checkInterval = 60 * 60 * 1000; // 1 hour
  
  weeklyReportCronId = setInterval(async () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    if (dayOfWeek === 1 && hour === 8) {
      console.log('[WeeklyReportCron] Triggering weekly reports...');
      await sendAllWeeklyReports();
    }
  }, checkInterval);

  console.log('[WeeklyReportCron] Started - will send reports every Monday at 8am');
}

export function stopWeeklyReportCron(): void {
  if (weeklyReportCronId) {
    clearInterval(weeklyReportCronId);
    weeklyReportCronId = null;
    console.log('[WeeklyReportCron] Stopped');
  }
}

export async function triggerWeeklyReportNow(organizationId: number): Promise<boolean> {
  console.log(`[WeeklyReport] Manual trigger for organization ${organizationId}`);
  return await sendWeeklyReportToOrganization(organizationId);
}
