import { getDb } from '../db';
import { ewaRequests } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Tipos de eventos de auditoría
 */
export type AuditEventType = 
  | 'ewa.created'
  | 'ewa.approved'
  | 'ewa.rejected'
  | 'ewa.disbursed'
  | 'ewa.failed'
  | 'ewa.retried'
  | 'limit.created'
  | 'limit.updated'
  | 'limit.deleted'
  | 'webhook.received'
  | 'webhook.processed'
  | 'webhook.failed';

/**
 * Interfaz para registro de auditoría
 */
export interface AuditLog {
  id?: number;
  eventType: AuditEventType;
  userId: number;
  requestId?: number;
  amount?: number;
  status?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  complianceChecks?: {
    fwiScoreValid: boolean;
    limitRespected: boolean;
    documentationComplete: boolean;
    antiMoneyLaundering: boolean;
  };
}

/**
 * Servicio de auditoría y compliance para EWA
 */
export class EWAAuditService {
  /**
   * Registrar evento de auditoría
   */
  static async logEvent(
    eventType: AuditEventType,
    userId: number,
    details: Record<string, any>,
    options?: {
      requestId?: number;
      amount?: number;
      status?: string;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<void> {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      // En producción, guardar en tabla de auditoría
      console.log(`[AUDIT] ${eventType}`, {
        userId,
        requestId: options?.requestId,
        amount: options?.amount,
        status: options?.status,
        details,
        timestamp: new Date().toISOString(),
        ipAddress: options?.ipAddress,
      });

      // Aquí se guardaría en base de datos si existe tabla de auditoría
      // await db.insert(auditLogs).values({...})
    } catch (error) {
      console.error('Error logging audit event:', error);
    }
  }

  /**
   * Validar compliance antes de aprobar EWA
   */
  static async validateCompliance(requestId: number): Promise<{
    compliant: boolean;
    checks: {
      fwiScoreValid: boolean;
      limitRespected: boolean;
      documentationComplete: boolean;
      antiMoneyLaundering: boolean;
    };
    issues: string[];
  }> {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      const ewaRequest = await db.query.ewaRequests.findFirst({
        where: eq(ewaRequests, { id: requestId }),
      });

      if (!ewaRequest) {
        return {
          compliant: false,
          checks: {
            fwiScoreValid: false,
            limitRespected: false,
            documentationComplete: false,
            antiMoneyLaundering: false,
          },
          issues: ['Solicitud EWA no encontrada'],
        };
      }

      const issues: string[] = [];
      const checks = {
        fwiScoreValid: ewaRequest.fwiScoreAtRequest >= 30,
        limitRespected: ewaRequest.amount <= 500000, // S/ 5,000 máximo
        documentationComplete: !!ewaRequest.daysWorked && !!ewaRequest.monthlyIncome,
        antiMoneyLaundering: ewaRequest.amount <= 1000000, // Límite AML
      };

      if (!checks.fwiScoreValid) {
        issues.push(`FWI Score insuficiente: ${ewaRequest.fwiScoreAtRequest} (mínimo 30)`);
      }

      if (!checks.limitRespected) {
        issues.push(`Monto excede límite: S/ ${(ewaRequest.amount / 100).toFixed(2)}`);
      }

      if (!checks.documentationComplete) {
        issues.push('Documentación incompleta');
      }

      if (!checks.antiMoneyLaundering) {
        issues.push('Monto excede límite de prevención de lavado de dinero');
      }

      return {
        compliant: Object.values(checks).every(v => v),
        checks,
        issues,
      };
    } catch (error) {
      console.error('Error validating compliance:', error);
      return {
        compliant: false,
        checks: {
          fwiScoreValid: false,
          limitRespected: false,
          documentationComplete: false,
          antiMoneyLaundering: false,
        },
        issues: ['Error al validar compliance'],
      };
    }
  }

  /**
   * Generar reporte de compliance
   */
  static async generateComplianceReport(dateFrom: Date, dateTo: Date): Promise<{
    period: { from: Date; to: Date };
    totalRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    complianceRate: number;
    issues: {
      fwiScoreFailures: number;
      limitExceeded: number;
      documentationIssues: number;
      amlFlags: number;
    };
    recommendations: string[];
  }> {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      // Obtener solicitudes en el período
      const requests = await db.query.ewaRequests.findMany();

      const filtered = requests.filter((r: any) => {
        const createdAt = new Date(r.createdAt);
        return createdAt >= dateFrom && createdAt <= dateTo;
      });

      const approved = filtered.filter(r => r.status === 'processing_transfer' || r.status === 'disbursed');
      const rejected = filtered.filter(r => r.status === 'rejected');

      // Analizar issues
      const issues = {
        fwiScoreFailures: filtered.filter(r => r.fwiScoreAtRequest < 30).length,
        limitExceeded: filtered.filter(r => r.amount > 500000).length,
        documentationIssues: filtered.filter(r => !r.daysWorked || !r.monthlyIncome).length,
        amlFlags: filtered.filter(r => r.amount > 1000000).length,
      };

      const complianceRate = filtered.length > 0 ? (approved.length / filtered.length) * 100 : 0;

      const recommendations: string[] = [];
      if (issues.fwiScoreFailures > 0) {
        recommendations.push(`${issues.fwiScoreFailures} solicitudes con FWI Score bajo - Revisar criterios`);
      }
      if (issues.amlFlags > 0) {
        recommendations.push(`${issues.amlFlags} solicitudes flagueadas por AML - Investigación requerida`);
      }
      if (complianceRate < 80) {
        recommendations.push('Tasa de compliance baja - Revisar políticas de aprobación');
      }

      return {
        period: { from: dateFrom, to: dateTo },
        totalRequests: filtered.length,
        approvedRequests: approved.length,
        rejectedRequests: rejected.length,
        complianceRate,
        issues,
        recommendations,
      };
    } catch (error) {
      console.error('Error generating compliance report:', error);
      return {
        period: { from: dateFrom, to: dateTo },
        totalRequests: 0,
        approvedRequests: 0,
        rejectedRequests: 0,
        complianceRate: 0,
        issues: {
          fwiScoreFailures: 0,
          limitExceeded: 0,
          documentationIssues: 0,
          amlFlags: 0,
        },
        recommendations: ['Error al generar reporte'],
      };
    }
  }

  /**
   * Detectar patrones sospechosos (AML)
   */
  static async detectSuspiciousPatterns(userId: number): Promise<{
    suspicious: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    flags: string[];
  }> {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      const userRequests = await db.query.ewaRequests.findMany();
      const filtered = userRequests.filter((r: any) => r.userId === userId);

      const flags: string[] = [];
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

      // Verificar múltiples solicitudes en corto tiempo
      const last30Days = filtered.filter((r: any) => {
        const createdAt = new Date(r.createdAt);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return createdAt >= thirtyDaysAgo;
      });

      if (last30Days.length > 5) {
        flags.push('Múltiples solicitudes en 30 días');
        riskLevel = 'medium';
      }

      // Verificar montos inusualmente altos
      const highAmountRequests = filtered.filter((r: any) => r.amount > 1000000);
      if (highAmountRequests.length > 0) {
        flags.push(`${highAmountRequests.length} solicitud(es) con monto alto (>S/ 10,000)`);
        riskLevel = 'high';
      }

      // Verificar cambios de cuenta
      const uniqueAccounts = new Set(
        filtered
          .map(r => r.id)
          .filter(id => id) // Placeholder para cuenta bancaria
      );

      if (uniqueAccounts.size > 3) {
        flags.push('Múltiples cuentas bancarias diferentes');
        riskLevel = 'high';
      }

      // Verificar rechazo frecuente
      const rejectedCount = filtered.filter((r: any) => r.status === 'rejected').length;
      if (rejectedCount > 2) {
        flags.push(`${rejectedCount} solicitudes rechazadas recientemente`);
        if (riskLevel === 'low') riskLevel = 'medium';
      }

      return {
        suspicious: flags.length > 0,
        riskLevel,
        flags,
      };
    } catch (error) {
      console.error('Error detecting suspicious patterns:', error);
      return {
        suspicious: false,
        riskLevel: 'low',
        flags: [],
      };
    }
  }

  /**
   * Exportar reporte de auditoría
   */
  static async exportAuditReport(format: 'json' | 'csv' = 'json'): Promise<string> {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      const requests = await db.query.ewaRequests.findMany();

      if (format === 'csv') {
        const headers = [
          'ID',
          'Usuario',
          'Monto',
          'Estado',
          'FWI Score',
          'Fecha Creación',
          'Fecha Aprobación',
          'Fecha Desembolso',
        ];

        const rows = requests.map((r: any) => [
          r.id,
          r.userId,
          (r.amount / 100).toFixed(2),
          r.status,
          r.fwiScoreAtRequest,
          new Date(r.createdAt).toISOString(),
          r.approvedAt ? new Date(r.approvedAt).toISOString() : '',
          r.disbursedAt ? new Date(r.disbursedAt).toISOString() : '',
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
      } else {
        return JSON.stringify(requests, null, 2);
      }
    } catch (error) {
      console.error('Error exporting audit report:', error);
      return '';
    }
  }
}
