/**
 * Alert Cron Job
 * Ejecuta evaluateAlertRules() periódicamente para monitoreo proactivo
 */

import { evaluateAlertRules, AlertTriggerResult } from '../services/alertService';

// Intervalo en milisegundos (1 hora = 3600000ms)
const ALERT_CHECK_INTERVAL = 60 * 60 * 1000; // 1 hora

let intervalId: NodeJS.Timeout | null = null;
let isRunning = false;

/**
 * Ejecuta la verificación de alertas
 */
async function runAlertCheck(): Promise<void> {
  if (isRunning) {
    console.log('[AlertCron] Verificación ya en progreso, saltando...');
    return;
  }

  isRunning = true;
  const startTime = Date.now();
  
  try {
    console.log('[AlertCron] Iniciando verificación de alertas...');
    const results = await evaluateAlertRules();
    
    const triggeredCount = results.filter((r: AlertTriggerResult) => r.triggered).length;
    const duration = Date.now() - startTime;
    
    console.log(`[AlertCron] Verificación completada en ${duration}ms`);
    console.log(`[AlertCron] Reglas evaluadas: ${results.length}`);
    console.log(`[AlertCron] Alertas disparadas: ${triggeredCount}`);
    
    // Log detallado de alertas disparadas
    results.forEach((result: AlertTriggerResult) => {
      if (result.triggered && result.message) {
        console.log(`[AlertCron] - ${result.message} (${result.severity})`);
      }
    });
    
  } catch (error) {
    console.error('[AlertCron] Error en verificación de alertas:', error);
  } finally {
    isRunning = false;
  }
}

/**
 * Inicia el cron job de alertas
 */
export function startAlertCron(): void {
  if (intervalId) {
    console.log('[AlertCron] Cron job ya está corriendo');
    return;
  }

  console.log('[AlertCron] Iniciando cron job de alertas');
  console.log(`[AlertCron] Intervalo: ${ALERT_CHECK_INTERVAL / 1000 / 60} minutos`);
  
  // Ejecutar inmediatamente al iniciar
  runAlertCheck();
  
  // Programar ejecuciones periódicas
  intervalId = setInterval(runAlertCheck, ALERT_CHECK_INTERVAL);
  
  console.log('[AlertCron] Cron job iniciado correctamente');
}

/**
 * Detiene el cron job de alertas
 */
export function stopAlertCron(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('[AlertCron] Cron job detenido');
  }
}

/**
 * Ejecuta una verificación manual de alertas
 */
export async function triggerManualCheck(): Promise<{
  success: boolean;
  results?: AlertTriggerResult[];
  error?: string;
}> {
  try {
    const results = await evaluateAlertRules();
    return { success: true, results };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}

/**
 * Obtiene el estado del cron job
 */
export function getCronStatus(): {
  isRunning: boolean;
  intervalMs: number;
  intervalMinutes: number;
} {
  return {
    isRunning: intervalId !== null,
    intervalMs: ALERT_CHECK_INTERVAL,
    intervalMinutes: ALERT_CHECK_INTERVAL / 1000 / 60
  };
}
