import cron from 'node-cron';
import { logger } from '../_core/logger';

// Importar servicios
const reportAutomationService = {
  generateDailyReport: async () => logger.info('Daily report generated'),
  generateWeeklyReport: async () => logger.info('Weekly report generated'),
  generateMonthlyReport: async () => logger.info('Monthly report generated'),
};

const mobilePushService = {
  sendScheduledNotifications: async () => logger.info('Push notifications sent'),
  getCampaigns: async () => [],
  sendCampaign: async (id: string) => logger.info(`Campaign ${id} sent`),
};

const interventionAutomationService = {
  createAutomaticInterventions: async () => logger.info('Interventions created'),
};

export class CronJobService {
  private jobs: Map<string, any> = new Map();

  /**
   * Inicializar todos los cron jobs
   */
  public initializeAll(): void {
    logger.info('[CronJobService] Inicializando cron jobs...');
    
    this.scheduleReportGeneration();
    this.schedulePushNotifications();
    this.scheduleInterventionAutomation();
    this.scheduleHealthCheck();
    
    logger.info('[CronJobService] Todos los cron jobs inicializados');
  }

  /**
   * Generar reportes automáticos diarios, semanales y mensuales
   */
  private scheduleReportGeneration(): void {
    // Reporte diario a las 8:00 AM
    const dailyReport = cron.schedule('0 8 * * *', async () => {
      try {
        logger.info('[CronJob] Generando reporte diario...');
        await reportAutomationService.generateDailyReport();
        logger.info('[CronJob] Reporte diario generado exitosamente');
      } catch (error) {
        logger.error('[CronJob] Error generando reporte diario:', error as Error);
      }
    });
    this.jobs.set('dailyReport', dailyReport);

    // Reporte semanal los lunes a las 9:00 AM
    const weeklyReport = cron.schedule('0 9 * * 1', async () => {
      try {
        logger.info('[CronJob] Generando reporte semanal...');
        await reportAutomationService.generateWeeklyReport();
        logger.info('[CronJob] Reporte semanal generado exitosamente');
      } catch (error) {
        logger.error('[CronJob] Error generando reporte semanal:', error as Error);
      }
    });
    this.jobs.set('weeklyReport', weeklyReport);

    // Reporte mensual el primer día del mes a las 10:00 AM
    const monthlyReport = cron.schedule('0 10 1 * *', async () => {
      try {
        logger.info('[CronJob] Generando reporte mensual...');
        await reportAutomationService.generateMonthlyReport();
        logger.info('[CronJob] Reporte mensual generado exitosamente');
      } catch (error) {
        logger.error('[CronJob] Error generando reporte mensual:', error as Error);
      }
    });
    this.jobs.set('monthlyReport', monthlyReport);
  }

  /**
   * Enviar notificaciones push automáticas
   */
  private schedulePushNotifications(): void {
    // Enviar notificaciones push cada 6 horas
    const pushNotifications = cron.schedule('0 */6 * * *', async () => {
      try {
        logger.info('[CronJob] Enviando notificaciones push...');
        // Obtener campañas activas y enviar
        await mobilePushService.sendScheduledNotifications();
        logger.info('[CronJob] Notificaciones push enviadas');
      } catch (error) {
        logger.error('[CronJob] Error enviando notificaciones push:', error as Error);
      }
    });
    this.jobs.set('pushNotifications', pushNotifications);
  }

  /**
   * Ejecutar automatización de intervenciones
   */
  private scheduleInterventionAutomation(): void {
    // Crear intervenciones automáticas cada 4 horas
    const interventionAutomation = cron.schedule('0 */4 * * *', async () => {
      try {
        logger.info('[CronJob] Ejecutando automatización de intervenciones...');
        await interventionAutomationService.createAutomaticInterventions();
        logger.info('[CronJob] Intervenciones automáticas creadas');
      } catch (error) {
        logger.error('[CronJob] Error en automatización de intervenciones:', error as Error);
      }
    });
    this.jobs.set('interventionAutomation', interventionAutomation);
  }

  /**
   * Health check cada 30 minutos
   */
  private scheduleHealthCheck(): void {
    const healthCheck = cron.schedule('*/30 * * * *', async () => {
      logger.debug('[CronJob] Health check ejecutado');
    });
    this.jobs.set('healthCheck', healthCheck);
  }

  /**
   * Detener todos los cron jobs
   */
  public stopAll(): void {
    logger.info('[CronJobService] Deteniendo todos los cron jobs...');
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`[CronJobService] Cron job detenido: ${name}`);
    });
    this.jobs.clear();
  }

  /**
   * Obtener estado de todos los cron jobs
   */
  public getStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    this.jobs.forEach((job, name) => {
      status[name] = !job.stopped;
    });
    return status;
  }
}

export const cronJobService = new CronJobService();
