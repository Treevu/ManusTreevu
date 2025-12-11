/**
 * Retry con Exponential Backoff
 * Reintenta una función asíncrona con tiempos de espera crecientes
 */

interface RetryOptions {
  /** Número máximo de reintentos (default: 3) */
  maxRetries?: number;
  /** Delay inicial en ms (default: 1000) */
  initialDelay?: number;
  /** Factor de multiplicación del delay (default: 2) */
  backoffFactor?: number;
  /** Delay máximo en ms (default: 30000) */
  maxDelay?: number;
  /** Callback al reintentar */
  onRetry?: (attempt: number, error: Error, nextDelay: number) => void;
  /** Función para determinar si debe reintentar basado en el error */
  shouldRetry?: (error: Error) => boolean;
}

interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
}

/**
 * Ejecuta una función con retry y exponential backoff
 * 
 * @example
 * const result = await retryWithBackoff(
 *   () => fetch('/api/data'),
 *   { maxRetries: 3, initialDelay: 1000 }
 * );
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    backoffFactor = 2,
    maxDelay = 30000,
    onRetry,
    shouldRetry = () => true,
  } = options;

  let attempts = 0;
  let delay = initialDelay;

  while (attempts <= maxRetries) {
    try {
      const data = await fn();
      return { success: true, data, attempts: attempts + 1 };
    } catch (error) {
      attempts++;
      const err = error instanceof Error ? error : new Error(String(error));

      // Si alcanzamos el máximo de reintentos o no debemos reintentar
      if (attempts > maxRetries || !shouldRetry(err)) {
        return { success: false, error: err, attempts };
      }

      // Calcular próximo delay con jitter para evitar thundering herd
      const jitter = Math.random() * 0.3 * delay; // 0-30% jitter
      const nextDelay = Math.min(delay + jitter, maxDelay);

      // Callback de retry
      if (onRetry) {
        onRetry(attempts, err, nextDelay);
      }

      // Esperar antes del próximo intento
      await sleep(nextDelay);

      // Incrementar delay para el próximo intento
      delay = Math.min(delay * backoffFactor, maxDelay);
    }
  }

  return { success: false, error: new Error('Max retries exceeded'), attempts };
}

/**
 * Función de sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Determina si un error es recuperable (vale la pena reintentar)
 */
export function isRetryableError(error: Error): boolean {
  const message = error.message.toLowerCase();
  
  // Errores de red
  if (message.includes('network') || 
      message.includes('fetch') ||
      message.includes('timeout') ||
      message.includes('connection')) {
    return true;
  }

  // Errores de servidor (5xx)
  if (message.includes('500') || 
      message.includes('502') ||
      message.includes('503') ||
      message.includes('504')) {
    return true;
  }

  // Errores de rate limiting
  if (message.includes('429') || message.includes('rate limit')) {
    return true;
  }

  return false;
}

/**
 * Hook-friendly wrapper para retry
 */
export function createRetryableFunction<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  options: RetryOptions = {}
): (...args: Args) => Promise<RetryResult<T>> {
  return (...args: Args) => retryWithBackoff(() => fn(...args), options);
}

export default retryWithBackoff;
