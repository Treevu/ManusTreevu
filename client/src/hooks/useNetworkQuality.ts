import { useState, useEffect, useCallback } from 'react';

type ConnectionType = '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
type NetworkQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'offline';

interface NetworkInfo {
  /** Tipo de conexión efectiva */
  effectiveType: ConnectionType;
  /** Calidad de red calculada */
  quality: NetworkQuality;
  /** RTT estimado en ms */
  rtt: number;
  /** Ancho de banda estimado en Mbps */
  downlink: number;
  /** Si la conexión es lenta */
  isSlowConnection: boolean;
  /** Si está online */
  isOnline: boolean;
  /** Si debería hacer pre-fetch */
  shouldPrefetch: boolean;
}

/**
 * Hook para detectar la calidad de la conexión de red
 * Usa la Network Information API cuando está disponible
 */
export function useNetworkQuality(): NetworkInfo {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>(() => getInitialState());

  // Obtener estado inicial
  function getInitialState(): NetworkInfo {
    if (typeof navigator === 'undefined') {
      return createNetworkInfo('unknown', 0, 10, true);
    }

    const connection = (navigator as any).connection;
    if (connection) {
      return createNetworkInfo(
        connection.effectiveType || 'unknown',
        connection.rtt || 0,
        connection.downlink || 10,
        navigator.onLine
      );
    }

    return createNetworkInfo('unknown', 0, 10, navigator.onLine);
  }

  // Crear objeto de información de red
  function createNetworkInfo(
    effectiveType: ConnectionType,
    rtt: number,
    downlink: number,
    isOnline: boolean
  ): NetworkInfo {
    const quality = calculateQuality(effectiveType, rtt, isOnline);
    const isSlowConnection = quality === 'poor' || quality === 'fair';
    
    return {
      effectiveType,
      quality,
      rtt,
      downlink,
      isSlowConnection,
      isOnline,
      // Pre-fetch cuando la conexión es buena o excelente
      shouldPrefetch: isOnline && (quality === 'excellent' || quality === 'good'),
    };
  }

  // Calcular calidad de red
  function calculateQuality(
    effectiveType: ConnectionType,
    rtt: number,
    isOnline: boolean
  ): NetworkQuality {
    if (!isOnline) return 'offline';

    // Basado en tipo de conexión efectiva
    switch (effectiveType) {
      case '4g':
        return rtt < 100 ? 'excellent' : 'good';
      case '3g':
        return 'fair';
      case '2g':
      case 'slow-2g':
        return 'poor';
      default:
        // Si no hay info, asumir buena conexión
        return 'good';
    }
  }

  // Actualizar estado
  const updateNetworkInfo = useCallback(() => {
    const connection = (navigator as any).connection;
    if (connection) {
      setNetworkInfo(createNetworkInfo(
        connection.effectiveType || 'unknown',
        connection.rtt || 0,
        connection.downlink || 10,
        navigator.onLine
      ));
    } else {
      setNetworkInfo(prev => ({
        ...prev,
        isOnline: navigator.onLine,
        quality: navigator.onLine ? prev.quality : 'offline',
        shouldPrefetch: navigator.onLine && (prev.quality === 'excellent' || prev.quality === 'good'),
      }));
    }
  }, []);

  useEffect(() => {
    // Escuchar cambios en la conexión
    const connection = (navigator as any).connection;
    
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
    }

    // Escuchar cambios online/offline
    window.addEventListener('online', updateNetworkInfo);
    window.addEventListener('offline', updateNetworkInfo);

    return () => {
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
      window.removeEventListener('online', updateNetworkInfo);
      window.removeEventListener('offline', updateNetworkInfo);
    };
  }, [updateNetworkInfo]);

  return networkInfo;
}

export default useNetworkQuality;
