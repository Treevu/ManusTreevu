/**
 * PDF Report Generation Service
 * 
 * Generates monthly financial wellness reports for users
 */

import { getDb } from '../db';
import { 
  users, 
  transactions, 
  financialGoals, 
  treePointsTransactions,
  ewaRequests,
  fwiScoreHistory
} from '../../drizzle/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';

// Types
interface MonthlyReportData {
  user: {
    name: string;
    email: string | null;
    fwiScore: number;
    level: number;
    treePoints: number;
    streakDays: number;
  };
  period: {
    month: string;
    year: number;
    startDate: string;
    endDate: string;
  };
  fwiAnalysis: {
    currentScore: number;
    previousScore: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    category: string;
  };
  transactions: {
    total: number;
    byCategory: { category: string; amount: number; count: number; percentage: number }[];
    topMerchants: { merchant: string; amount: number; count: number }[];
    avgDaily: number;
  };
  goals: {
    active: number;
    completed: number;
    totalSaved: number;
    topGoals: { name: string; progress: number; target: number; current: number }[];
  };
  treePoints: {
    earned: number;
    redeemed: number;
    balance: number;
    transactions: { type: string; amount: number; reason: string; date: string }[];
  };
  ewa: {
    requested: number;
    approved: number;
    totalAmount: number;
  };
  recommendations: string[];
}

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function getFwiCategory(score: number): string {
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Bueno';
  if (score >= 40) return 'Regular';
  if (score >= 20) return 'En riesgo';
  return 'Crítico';
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Generate monthly report data for a user
 */
export async function generateMonthlyReportData(
  userId: number,
  month: number, // 0-11
  year: number
): Promise<MonthlyReportData | null> {
  const db = await getDb();
  if (!db) return null;

  // Calculate date range
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59);

  // Get user data
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return null;

  // Get transactions for the month
  const monthTransactions = await db.select()
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        gte(transactions.transactionDate, startDate),
        lte(transactions.transactionDate, endDate)
      )
    )
    .orderBy(desc(transactions.transactionDate));

  // Calculate transaction stats by category
  const categoryStats: Record<string, { amount: number; count: number }> = {};
  const merchantStats: Record<string, { amount: number; count: number }> = {};
  let totalSpent = 0;

  for (const tx of monthTransactions) {
    const cat = tx.category || 'other';
    if (!categoryStats[cat]) categoryStats[cat] = { amount: 0, count: 0 };
    categoryStats[cat].amount += tx.amount;
    categoryStats[cat].count += 1;
    totalSpent += tx.amount;

    const merchant = tx.merchant || 'Otro';
    if (!merchantStats[merchant]) merchantStats[merchant] = { amount: 0, count: 0 };
    merchantStats[merchant].amount += tx.amount;
    merchantStats[merchant].count += 1;
  }

  const byCategory = Object.entries(categoryStats)
    .map(([category, stats]) => ({
      category,
      amount: stats.amount,
      count: stats.count,
      percentage: totalSpent > 0 ? Math.round((stats.amount / totalSpent) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const topMerchants = Object.entries(merchantStats)
    .map(([merchant, stats]) => ({
      merchant,
      amount: stats.amount,
      count: stats.count,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Get goals
  const userGoals = await db.select()
    .from(financialGoals)
    .where(eq(financialGoals.userId, userId))
    .orderBy(desc(financialGoals.currentAmount));

  const activeGoals = userGoals.filter(g => !g.isCompleted);
  const completedGoals = userGoals.filter(g => g.isCompleted);
  const totalSaved = userGoals.reduce((sum, g) => sum + g.currentAmount, 0);

  const topGoals = activeGoals.slice(0, 5).map(g => ({
    name: g.name,
    progress: g.targetAmount > 0 ? Math.round((g.currentAmount / g.targetAmount) * 100) : 0,
    target: g.targetAmount,
    current: g.currentAmount,
  }));

  // Get TreePoints transactions
  const tpTransactions = await db.select()
    .from(treePointsTransactions)
    .where(
      and(
        eq(treePointsTransactions.userId, userId),
        gte(treePointsTransactions.createdAt, startDate),
        lte(treePointsTransactions.createdAt, endDate)
      )
    )
    .orderBy(desc(treePointsTransactions.createdAt))
    .limit(10);

  const earned = tpTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const redeemed = tpTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Get EWA requests
  const ewaReqs = await db.select()
    .from(ewaRequests)
    .where(
      and(
        eq(ewaRequests.userId, userId),
        gte(ewaRequests.createdAt, startDate),
        lte(ewaRequests.createdAt, endDate)
      )
    );

  const approvedEwa = ewaReqs.filter(e => e.status === 'disbursed' || e.status === 'processing_transfer');

  // Get FWI history for trend
  const fwiHistory = await db.select()
    .from(fwiScoreHistory)
    .where(eq(fwiScoreHistory.userId, userId))
    .orderBy(desc(fwiScoreHistory.recordedAt))
    .limit(2);

  const currentScore = user.fwiScore || 50;
  const previousScore = fwiHistory.length > 1 ? fwiHistory[1].score : currentScore;
  const scoreChange = currentScore - previousScore;

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (currentScore < 50) {
    recommendations.push('Tu FWI Score está por debajo del promedio. Considera reducir gastos discrecionales.');
  }
  if (byCategory.find(c => c.category === 'entertainment' && c.percentage > 20)) {
    recommendations.push('Tus gastos en entretenimiento superan el 20%. Considera establecer un presupuesto.');
  }
  if (activeGoals.length === 0) {
    recommendations.push('No tienes metas de ahorro activas. Establecer metas te ayudará a mejorar tu bienestar financiero.');
  }
  if (ewaReqs.length > 2) {
    recommendations.push('Has solicitado varios adelantos este mes. Considera crear un fondo de emergencia.');
  }
  if (user.streakDays && user.streakDays < 7) {
    recommendations.push('Mantén una racha de uso diario para ganar más TreePoints.');
  }
  if (recommendations.length === 0) {
    recommendations.push('¡Excelente trabajo! Continúa con tus buenos hábitos financieros.');
  }

  const daysInMonth = endDate.getDate();

  return {
    user: {
      name: user.name || 'Usuario',
      email: user.email,
      fwiScore: currentScore,
      level: user.level || 1,
      treePoints: user.treePoints || 0,
      streakDays: user.streakDays || 0,
    },
    period: {
      month: MONTHS_ES[month],
      year,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    },
    fwiAnalysis: {
      currentScore,
      previousScore,
      change: scoreChange,
      trend: scoreChange > 0 ? 'up' : scoreChange < 0 ? 'down' : 'stable',
      category: getFwiCategory(currentScore),
    },
    transactions: {
      total: totalSpent,
      byCategory,
      topMerchants,
      avgDaily: Math.round(totalSpent / daysInMonth),
    },
    goals: {
      active: activeGoals.length,
      completed: completedGoals.length,
      totalSaved,
      topGoals,
    },
    treePoints: {
      earned,
      redeemed,
      balance: user.treePoints || 0,
      transactions: tpTransactions.map(t => ({
        type: t.type,
        amount: t.amount,
        reason: t.reason || '',
        date: formatDate(t.createdAt),
      })),
    },
    ewa: {
      requested: ewaReqs.length,
      approved: approvedEwa.length,
      totalAmount: approvedEwa.reduce((sum, e) => sum + e.amount, 0),
    },
    recommendations,
  };
}

/**
 * Generate HTML content for PDF report
 */
export function generateReportHTML(data: MonthlyReportData): string {
  const trendIcon = data.fwiAnalysis.trend === 'up' ? '↑' : data.fwiAnalysis.trend === 'down' ? '↓' : '→';
  const trendColor = data.fwiAnalysis.trend === 'up' ? '#22c55e' : data.fwiAnalysis.trend === 'down' ? '#ef4444' : '#6b7280';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte Mensual - ${data.period.month} ${data.period.year}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      color: #1f2937; 
      line-height: 1.6;
      background: #f9fafb;
    }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    
    /* Header */
    .header { 
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      padding: 40px;
      border-radius: 16px;
      margin-bottom: 30px;
    }
    .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .logo { font-size: 28px; font-weight: bold; }
    .logo span { color: #bbf7d0; }
    .period { font-size: 14px; opacity: 0.9; }
    .user-info h1 { font-size: 24px; margin-bottom: 5px; }
    .user-info p { opacity: 0.9; }
    
    /* Cards */
    .card { 
      background: white; 
      border-radius: 12px; 
      padding: 24px; 
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .card-title { 
      font-size: 18px; 
      font-weight: 600; 
      color: #374151;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-title::before { content: ''; width: 4px; height: 20px; background: #22c55e; border-radius: 2px; }
    
    /* FWI Score */
    .fwi-container { display: flex; gap: 30px; align-items: center; }
    .fwi-score { 
      width: 120px; 
      height: 120px; 
      border-radius: 50%; 
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .fwi-score .number { font-size: 36px; font-weight: bold; }
    .fwi-score .label { font-size: 12px; opacity: 0.9; }
    .fwi-details { flex: 1; }
    .fwi-trend { 
      display: inline-flex; 
      align-items: center; 
      gap: 4px; 
      padding: 4px 12px; 
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }
    
    /* Stats Grid */
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .stat-item { text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px; }
    .stat-value { font-size: 24px; font-weight: bold; color: #22c55e; }
    .stat-label { font-size: 12px; color: #6b7280; margin-top: 4px; }
    
    /* Category List */
    .category-list { display: flex; flex-direction: column; gap: 12px; }
    .category-item { display: flex; align-items: center; gap: 12px; }
    .category-bar-container { flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
    .category-bar { height: 100%; background: #22c55e; border-radius: 4px; }
    .category-name { width: 100px; font-size: 14px; }
    .category-amount { width: 80px; text-align: right; font-size: 14px; font-weight: 500; }
    .category-percent { width: 40px; text-align: right; font-size: 12px; color: #6b7280; }
    
    /* Goals */
    .goal-item { 
      padding: 12px; 
      background: #f9fafb; 
      border-radius: 8px; 
      margin-bottom: 8px;
    }
    .goal-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .goal-name { font-weight: 500; }
    .goal-progress { font-size: 14px; color: #22c55e; }
    .goal-bar { height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
    .goal-bar-fill { height: 100%; background: #22c55e; border-radius: 3px; }
    
    /* Recommendations */
    .recommendation { 
      padding: 12px 16px; 
      background: #fef3c7; 
      border-left: 4px solid #f59e0b;
      border-radius: 0 8px 8px 0;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    /* Footer */
    .footer { 
      text-align: center; 
      padding: 20px; 
      color: #6b7280; 
      font-size: 12px;
      margin-top: 20px;
    }
    
    /* Two columns */
    .two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    
    @media print {
      body { background: white; }
      .container { padding: 0; }
      .card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-top">
        <div class="logo">Treev<span>ü</span></div>
        <div class="period">${data.period.month} ${data.period.year}</div>
      </div>
      <div class="user-info">
        <h1>Reporte de Bienestar Financiero</h1>
        <p>${data.user.name} • ${data.period.startDate} - ${data.period.endDate}</p>
      </div>
    </div>
    
    <!-- FWI Score -->
    <div class="card">
      <div class="card-title">Tu FWI Score</div>
      <div class="fwi-container">
        <div class="fwi-score">
          <div class="number">${data.fwiAnalysis.currentScore}</div>
          <div class="label">${data.fwiAnalysis.category}</div>
        </div>
        <div class="fwi-details">
          <div class="fwi-trend" style="background: ${trendColor}20; color: ${trendColor}">
            ${trendIcon} ${Math.abs(data.fwiAnalysis.change)} puntos vs mes anterior
          </div>
          <div class="stats-grid" style="margin-top: 16px;">
            <div class="stat-item">
              <div class="stat-value">${data.user.level}</div>
              <div class="stat-label">Nivel</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${data.user.treePoints.toLocaleString()}</div>
              <div class="stat-label">TreePoints</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${data.user.streakDays}</div>
              <div class="stat-label">Días de racha</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Transactions Summary -->
    <div class="card">
      <div class="card-title">Resumen de Gastos</div>
      <div class="stats-grid" style="margin-bottom: 20px;">
        <div class="stat-item">
          <div class="stat-value">${formatCurrency(data.transactions.total)}</div>
          <div class="stat-label">Total del mes</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${formatCurrency(data.transactions.avgDaily)}</div>
          <div class="stat-label">Promedio diario</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${data.transactions.byCategory.reduce((sum, c) => sum + c.count, 0)}</div>
          <div class="stat-label">Transacciones</div>
        </div>
      </div>
      <div class="category-list">
        ${data.transactions.byCategory.slice(0, 6).map(cat => `
          <div class="category-item">
            <div class="category-name">${cat.category}</div>
            <div class="category-bar-container">
              <div class="category-bar" style="width: ${cat.percentage}%"></div>
            </div>
            <div class="category-amount">${formatCurrency(cat.amount)}</div>
            <div class="category-percent">${cat.percentage}%</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="two-cols">
      <!-- Goals -->
      <div class="card">
        <div class="card-title">Metas de Ahorro</div>
        <div class="stats-grid" style="margin-bottom: 16px;">
          <div class="stat-item">
            <div class="stat-value">${data.goals.active}</div>
            <div class="stat-label">Activas</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${data.goals.completed}</div>
            <div class="stat-label">Completadas</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${formatCurrency(data.goals.totalSaved)}</div>
            <div class="stat-label">Ahorrado</div>
          </div>
        </div>
        ${data.goals.topGoals.slice(0, 3).map(goal => `
          <div class="goal-item">
            <div class="goal-header">
              <span class="goal-name">${goal.name}</span>
              <span class="goal-progress">${goal.progress}%</span>
            </div>
            <div class="goal-bar">
              <div class="goal-bar-fill" style="width: ${Math.min(goal.progress, 100)}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- TreePoints & EWA -->
      <div class="card">
        <div class="card-title">TreePoints & EWA</div>
        <div class="stats-grid" style="margin-bottom: 16px;">
          <div class="stat-item">
            <div class="stat-value">+${data.treePoints.earned}</div>
            <div class="stat-label">Ganados</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">-${data.treePoints.redeemed}</div>
            <div class="stat-label">Canjeados</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${data.treePoints.balance}</div>
            <div class="stat-label">Balance</div>
          </div>
        </div>
        <div style="padding: 12px; background: #f0fdf4; border-radius: 8px;">
          <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Adelantos (EWA)</div>
          <div style="display: flex; justify-content: space-between;">
            <span>${data.ewa.requested} solicitados</span>
            <span style="font-weight: 500;">${formatCurrency(data.ewa.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recommendations -->
    <div class="card">
      <div class="card-title">Recomendaciones</div>
      ${data.recommendations.map(rec => `
        <div class="recommendation">${rec}</div>
      `).join('')}
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>Este reporte fue generado automáticamente por Treevü</p>
      <p>Para más información, visita tu dashboard en la plataforma</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Get available report months for a user
 */
export async function getAvailableReportMonths(userId: number): Promise<{ month: number; year: number; label: string }[]> {
  const db = await getDb();
  if (!db) return [];

  // Get the earliest transaction date
  const [earliest] = await db.select({ date: sql<Date>`MIN(${transactions.transactionDate})` })
    .from(transactions)
    .where(eq(transactions.userId, userId));

  if (!earliest?.date) return [];

  const months: { month: number; year: number; label: string }[] = [];
  const now = new Date();
  const start = new Date(earliest.date);

  // Generate list of months from earliest to current
  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  while (current <= now) {
    months.push({
      month: current.getMonth(),
      year: current.getFullYear(),
      label: `${MONTHS_ES[current.getMonth()]} ${current.getFullYear()}`,
    });
    current.setMonth(current.getMonth() + 1);
  }

  return months.reverse(); // Most recent first
}
