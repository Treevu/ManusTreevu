import { useEffect } from 'react';
import { useOffline } from '@/hooks/useOffline';
import { Wifi, WifiOff } from 'lucide-react';

/**
 * Componente de banner para mostrar estado offline/online
 */
export function OfflineBanner() {
  const { isOnline, wasOffline, resetWasOffline } = useOffline();

  useEffect(() => {
    if (wasOffline && isOnline) {
      // Auto-ocultar mensaje de reconexión después de 3 segundos
      const timer = setTimeout(resetWasOffline, 3000);
      return () => clearTimeout(timer);
    }
  }, [wasOffline, isOnline, resetWasOffline]);

  if (isOnline && !wasOffline) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 transition-all ${
        isOnline
          ? 'bg-green-600 text-white'
          : 'bg-yellow-600 text-white'
      }`}
    >
      {isOnline ? (
        <Wifi className="w-4 h-4" />
      ) : (
        <WifiOff className="w-4 h-4 animate-pulse" />
      )}
      <span className="text-sm font-medium">
        {isOnline ? '¡Conexión restaurada!' : 'Sin conexión a internet'}
      </span>
    </div>
  );
}

export default OfflineBanner;
