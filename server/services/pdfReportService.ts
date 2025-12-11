import PDFDocument from 'pdfkit';
import * as db from '../db';
import * as alertService from './alertService';

interface ExecutiveReportData {
  organizationName: string;
  generatedAt: Date;
  period: string;
  metrics: {
    avgFwiScore: number;
    totalEmployees: number;
    employeesAtRisk: number;
    riskPercentage: number;
    estimatedROI: number;
  };
  alerts: {
    critical: number;
    warning: number;
    info: number;
    total: number;
  };
  financialImpact: {
    absenteeismSavings: number;
    turnoverSavings: number;
    productivityGains: number;
    totalSavings: number;
  };
  trends: {
    fwiChange: number;
    riskChange: number;
    engagementChange: number;
  };
  comparison?: {
    previousPeriod: string;
    fwiPrevious: number;
    employeesPrevious: number;
    riskPrevious: number;
  };
}

export async function generateExecutiveReportPDF(data: ExecutiveReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: `Reporte Ejecutivo - ${data.organizationName}`,
          Author: 'Treevü',
          Subject: 'Reporte de Bienestar Financiero',
          Creator: 'Treevü Platform'
        }
      });

      const chunks: Uint8Array[] = [];
      doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Colors
      const brandGreen = '#10B981';
      const darkBg = '#0B0B0C';
      const textGray = '#9CA3AF';
      const white = '#FFFFFF';

      // Header
      doc.rect(0, 0, doc.page.width, 120).fill(darkBg);
      
      doc.fontSize(28)
         .fillColor(white)
         .text('TREEVÜ', 50, 40, { continued: true })
         .fillColor(brandGreen)
         .text(' Executive Report');
      
      doc.fontSize(12)
         .fillColor(textGray)
         .text(data.organizationName, 50, 75);
      
      doc.fontSize(10)
         .text(`Generado: ${data.generatedAt.toLocaleDateString('es-ES', { 
           year: 'numeric', 
           month: 'long', 
           day: 'numeric',
           hour: '2-digit',
           minute: '2-digit'
         })}`, 50, 92);

      doc.fontSize(10)
         .text(`Período: ${data.period}`, 350, 75, { align: 'right' });

      // Main metrics section
      let yPos = 150;
      
      doc.fontSize(16)
         .fillColor(darkBg)
         .text('Métricas Principales', 50, yPos);
      
      yPos += 30;

      // Metric boxes
      const boxWidth = 120;
      const boxHeight = 80;
      const boxSpacing = 15;
      const startX = 50;

      // FWI Score
      drawMetricBox(doc, startX, yPos, boxWidth, boxHeight, {
        value: data.metrics.avgFwiScore.toString(),
        label: 'FWI Promedio',
        change: data.trends.fwiChange,
        color: getFwiColor(data.metrics.avgFwiScore)
      });

      // Total Employees
      drawMetricBox(doc, startX + boxWidth + boxSpacing, yPos, boxWidth, boxHeight, {
        value: data.metrics.totalEmployees.toString(),
        label: 'Empleados',
        color: brandGreen
      });

      // Risk Percentage
      drawMetricBox(doc, startX + (boxWidth + boxSpacing) * 2, yPos, boxWidth, boxHeight, {
        value: `${data.metrics.riskPercentage}%`,
        label: 'En Riesgo',
        change: data.trends.riskChange,
        color: getRiskColor(data.metrics.riskPercentage),
        invertChange: true
      });

      // ROI
      drawMetricBox(doc, startX + (boxWidth + boxSpacing) * 3, yPos, boxWidth, boxHeight, {
        value: `${data.metrics.estimatedROI}%`,
        label: 'ROI Estimado',
        color: brandGreen
      });

      yPos += boxHeight + 40;

      // Alerts Section
      doc.fontSize(16)
         .fillColor(darkBg)
         .text('Estado de Alertas', 50, yPos);
      
      yPos += 25;

      const alertBoxWidth = 100;
      
      // Critical alerts
      drawAlertBox(doc, startX, yPos, alertBoxWidth, 50, {
        count: data.alerts.critical,
        label: 'Críticas',
        color: '#EF4444'
      });

      // Warning alerts
      drawAlertBox(doc, startX + alertBoxWidth + 20, yPos, alertBoxWidth, 50, {
        count: data.alerts.warning,
        label: 'Advertencias',
        color: '#F59E0B'
      });

      // Info alerts
      drawAlertBox(doc, startX + (alertBoxWidth + 20) * 2, yPos, alertBoxWidth, 50, {
        count: data.alerts.info,
        label: 'Informativas',
        color: '#3B82F6'
      });

      // Total alerts
      drawAlertBox(doc, startX + (alertBoxWidth + 20) * 3, yPos, alertBoxWidth, 50, {
        count: data.alerts.total,
        label: 'Total',
        color: '#6B7280'
      });

      yPos += 90;

      // Financial Impact Section
      doc.fontSize(16)
         .fillColor(darkBg)
         .text('Impacto Financiero Estimado', 50, yPos);
      
      yPos += 25;

      // Financial impact table
      const tableData = [
        ['Concepto', 'Ahorro Estimado'],
        ['Reducción de Ausentismo', formatCurrency(data.financialImpact.absenteeismSavings)],
        ['Reducción de Rotación', formatCurrency(data.financialImpact.turnoverSavings)],
        ['Ganancia en Productividad', formatCurrency(data.financialImpact.productivityGains)],
        ['TOTAL', formatCurrency(data.financialImpact.totalSavings)]
      ];

      drawTable(doc, startX, yPos, 400, tableData, brandGreen);

      yPos += tableData.length * 25 + 40;

      // Comparison section (if available)
      if (data.comparison) {
        doc.fontSize(16)
           .fillColor(darkBg)
           .text('Comparativa con Período Anterior', 50, yPos);
        
        yPos += 25;

        const comparisonData = [
          ['Métrica', data.comparison.previousPeriod, data.period, 'Variación'],
          ['FWI Promedio', data.comparison.fwiPrevious.toString(), data.metrics.avgFwiScore.toString(), 
           formatChange(data.metrics.avgFwiScore - data.comparison.fwiPrevious)],
          ['Empleados', data.comparison.employeesPrevious.toString(), data.metrics.totalEmployees.toString(),
           formatChange(data.metrics.totalEmployees - data.comparison.employeesPrevious)],
          ['% en Riesgo', `${data.comparison.riskPrevious}%`, `${data.metrics.riskPercentage}%`,
           formatChange(data.metrics.riskPercentage - data.comparison.riskPrevious, true)]
        ];

        drawTable(doc, startX, yPos, 450, comparisonData, brandGreen);
      }

      // Footer
      const footerY = doc.page.height - 50;
      doc.fontSize(8)
         .fillColor(textGray)
         .text('Este reporte fue generado automáticamente por Treevü. Los datos presentados son estimaciones basadas en el análisis de bienestar financiero.', 
               50, footerY, { width: doc.page.width - 100, align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function drawMetricBox(
  doc: typeof PDFDocument.prototype, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  options: { value: string; label: string; change?: number; color: string; invertChange?: boolean }
) {
  // Box background
  doc.roundedRect(x, y, width, height, 8)
     .fillAndStroke('#F9FAFB', '#E5E7EB');

  // Value
  doc.fontSize(24)
     .fillColor(options.color)
     .text(options.value, x, y + 15, { width, align: 'center' });

  // Label
  doc.fontSize(9)
     .fillColor('#6B7280')
     .text(options.label, x, y + 45, { width, align: 'center' });

  // Change indicator
  if (options.change !== undefined) {
    const isPositive = options.invertChange ? options.change < 0 : options.change > 0;
    const changeColor = isPositive ? '#10B981' : '#EF4444';
    const arrow = isPositive ? '↑' : '↓';
    
    doc.fontSize(8)
       .fillColor(changeColor)
       .text(`${arrow} ${Math.abs(options.change).toFixed(1)}%`, x, y + 60, { width, align: 'center' });
  }
}

function drawAlertBox(
  doc: typeof PDFDocument.prototype,
  x: number,
  y: number,
  width: number,
  height: number,
  options: { count: number; label: string; color: string }
) {
  doc.roundedRect(x, y, width, height, 6)
     .fillAndStroke('#F9FAFB', options.color);

  doc.fontSize(20)
     .fillColor(options.color)
     .text(options.count.toString(), x, y + 8, { width, align: 'center' });

  doc.fontSize(8)
     .fillColor('#6B7280')
     .text(options.label, x, y + 32, { width, align: 'center' });
}

function drawTable(
  doc: typeof PDFDocument.prototype,
  x: number,
  y: number,
  width: number,
  data: string[][],
  headerColor: string
) {
  const rowHeight = 25;
  const colWidth = width / data[0].length;

  data.forEach((row, rowIndex) => {
    const rowY = y + rowIndex * rowHeight;
    
    // Header row
    if (rowIndex === 0) {
      doc.rect(x, rowY, width, rowHeight).fill(headerColor);
      doc.fillColor('#FFFFFF');
    } else if (rowIndex === data.length - 1) {
      // Total row
      doc.rect(x, rowY, width, rowHeight).fill('#F3F4F6');
      doc.fillColor('#111827');
    } else {
      doc.rect(x, rowY, width, rowHeight).fill('#FFFFFF');
      doc.fillColor('#374151');
    }

    row.forEach((cell, colIndex) => {
      const cellX = x + colIndex * colWidth;
      doc.fontSize(rowIndex === 0 || rowIndex === data.length - 1 ? 10 : 9)
         .text(cell, cellX + 5, rowY + 7, { 
           width: colWidth - 10, 
           align: colIndex === 0 ? 'left' : 'right' 
         });
    });

    // Reset color for next row
    doc.fillColor('#374151');
  });
}

function getFwiColor(score: number): string {
  if (score >= 70) return '#10B981';
  if (score >= 50) return '#F59E0B';
  return '#EF4444';
}

function getRiskColor(percentage: number): string {
  if (percentage <= 10) return '#10B981';
  if (percentage <= 20) return '#F59E0B';
  return '#EF4444';
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatChange(change: number, invert: boolean = false): string {
  const adjusted = invert ? -change : change;
  const sign = adjusted >= 0 ? '+' : '';
  return `${sign}${adjusted.toFixed(1)}`;
}

export async function getExecutiveReportData(organizationId?: string): Promise<ExecutiveReportData> {
  // Get metrics from database
  const departments = await db.getDepartments();
  const highRiskEmployees = await db.getHighRiskEmployees(40);
  const unresolvedAlerts = await alertService.getUnresolvedAlertsSummary();

  const totalEmployees = departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0);
  const avgFwiScore = departments.length > 0 
    ? Math.round(departments.reduce((sum, d) => sum + (d.avgFwiScore || 0), 0) / departments.length)
    : 50;

  const employeesAtRisk = highRiskEmployees.filter((r: any) => 
    r.absenteeismRisk === 'high' || r.absenteeismRisk === 'critical'
  ).length;

  const riskPercentage = totalEmployees 
    ? Math.round((employeesAtRisk / totalEmployees) * 100) 
    : 0;

  const estimatedROI = Math.round((avgFwiScore / 50) * 1200);

  // Calculate financial impact based on FWI
  const avgSalary = 45000; // Average annual salary assumption
  const absenteeismSavings = Math.round(totalEmployees * avgSalary * 0.02 * (avgFwiScore / 100));
  const turnoverSavings = Math.round(totalEmployees * avgSalary * 0.15 * (avgFwiScore / 100) * 0.3);
  const productivityGains = Math.round(totalEmployees * avgSalary * 0.05 * (avgFwiScore / 100));

  return {
    organizationName: 'Treevü Organization',
    generatedAt: new Date(),
    period: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
    metrics: {
      avgFwiScore,
      totalEmployees,
      employeesAtRisk,
      riskPercentage,
      estimatedROI
    },
    alerts: {
      critical: unresolvedAlerts.critical || 0,
      warning: unresolvedAlerts.warning || 0,
      info: unresolvedAlerts.info || 0,
      total: unresolvedAlerts.total || 0
    },
    financialImpact: {
      absenteeismSavings,
      turnoverSavings,
      productivityGains,
      totalSavings: absenteeismSavings + turnoverSavings + productivityGains
    },
    trends: {
      fwiChange: 3.2, // Would come from historical data
      riskChange: -1.5,
      engagementChange: 2.8
    }
  };
}
