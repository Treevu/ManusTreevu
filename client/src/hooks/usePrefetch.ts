import { useEffect, useRef } from 'react';
import { useNetworkQuality } from './useNetworkQuality';
import { cacheSet, cacheGet } from '@/lib/offlineCache';

interface PrefetchOptions {
  /** Clave para el cache */
  cacheKey: string;
  /** Función para obtener los datos */
  fetchFn: () => Promise<unknown>;
  /** TTL del cache en minutos (default: 30) */
  ttlMinutes?: number;
  /** Si está habilitado (default: true) */
  enabled?: boolean;
}

/**
 * Hook para pre-cargar datos cuando la conexión es buena
 * Guarda los datos en cache para uso offline
 */
export function usePrefetch(options: PrefetchOptions) {
  const { cacheKey, fetchFn, ttlMinutes = 30, enabled = true } = options;
  const { shouldPrefetch, isOnline, quality } = useNetworkQuality();
  const hasPrefetched = useRef(false);

  useEffect(() => {
    // Solo pre-fetch una vez por sesión y cuando las condiciones son óptimas
    if (!enabled || hasPrefetched.current || !shouldPrefetch || !isOnline) {
      return;
    }

    const doPrefetch = async () => {
      try {
        // Verificar si ya hay datos en cache
        const cached = await cacheGet(cacheKey);
        if (cached) {
          console.log(`[Prefetch] ${cacheKey} already cached, skipping`);
          return;
        }

        console.log(`[Prefetch] Fetching ${cacheKey} (network: ${quality})`);
        const data = await fetchFn();
        
        if (data) {
          await cacheSet(cacheKey, data, ttlMinutes);
          console.log(`[Prefetch] ${cacheKey} cached successfully`);
        }

        hasPrefetched.current = true;
      } catch (error) {
        console.warn(`[Prefetch] Failed to prefetch ${cacheKey}:`, error);
      }
    };

    // Delay para no interferir con la carga inicial
    const timer = setTimeout(doPrefetch, 2000);
    return () => clearTimeout(timer);
  }, [cacheKey, fetchFn, ttlMinutes, enabled, shouldPrefetch, isOnline, quality]);
}

/**
 * Hook para pre-cargar múltiples recursos
 */
export function usePrefetchMultiple(
  resources: Array<{
    key: string;
    fetch: () => Promise<unknown>;
    ttl?: number;
  }>,
  enabled = true
) {
  const { shouldPrefetch, isOnline, quality } = useNetworkQuality();
  const hasPrefetched = useRef(false);

  useEffect(() => {
    if (!enabled || hasPrefetched.current || !shouldPrefetch || !isOnline) {
      return;
    }

    const doPrefetchAll = async () => {
      console.log(`[Prefetch] Starting batch prefetch (${resources.length} resources)`);
      
      for (const resource of resources) {
        try {
          const cached = await cacheGet(resource.key);
          if (cached) continue;

          const data = await resource.fetch();
          if (data) {
            await cacheSet(resource.key, data, resource.ttl || 30);
          }
        } catch (error) {
          console.warn(`[Prefetch] Failed: ${resource.key}`, error);
        }
      }

      hasPrefetched.current = true;
      console.log(`[Prefetch] Batch prefetch complete`);
    };

    const timer = setTimeout(doPrefetchAll, 3000);
    return () => clearTimeout(timer);
  }, [resources, enabled, shouldPrefetch, isOnline, quality]);
}

export default usePrefetch;
