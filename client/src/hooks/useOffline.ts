import { useState, useEffect, useCallback } from 'react';

interface OfflineState {
  isOnline: boolean;
  wasOffline: boolean;
  lastOnlineAt: Date | null;
}

/**
 * useOffline - Hook para detectar estado de conexión a internet
 * 
 * @example
 * const { isOnline, wasOffline } = useOffline();
 * if (!isOnline) return <OfflineBanner />;
 */
export function useOffline() {
  const [state, setState] = useState<OfflineState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    wasOffline: false,
    lastOnlineAt: null,
  });

  const handleOnline = useCallback(() => {
    setState(prev => ({
      isOnline: true,
      wasOffline: !prev.isOnline ? true : prev.wasOffline,
      lastOnlineAt: new Date(),
    }));
  }, []);

  const handleOffline = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOnline: false,
    }));
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  // Resetear wasOffline después de mostrar mensaje de reconexión
  const resetWasOffline = useCallback(() => {
    setState(prev => ({ ...prev, wasOffline: false }));
  }, []);

  return {
    ...state,
    resetWasOffline,
  };
}

export default useOffline;
