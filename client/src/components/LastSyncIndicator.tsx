import { useState, useEffect } from 'react';
import { RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface LastSyncIndicatorProps {
  /** Clase adicional */
  className?: string;
}

/**
 * LastSyncIndicator - Muestra el estado de conexión y última sincronización
 */
export function LastSyncIndicator({ className = '' }: LastSyncIndicatorProps) {
  const { isOnline } = useOffline();
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [timeAgo, setTimeAgo] = useState<string>('');

  // Actualizar última sincronización cuando está online
  useEffect(() => {
    if (isOnline) {
      setLastSync(new Date());
    }
  }, [isOnline]);

  // Actualizar tiempo relativo cada minuto
  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastSync) {
        setTimeAgo('Sin sincronizar');
        return;
      }

      const now = new Date();
      const diffMs = now.getTime() - lastSync.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);

      if (diffSecs < 60) {
        setTimeAgo('Ahora mismo');
      } else if (diffMins < 60) {
        setTimeAgo(`Hace ${diffMins} min`);
      } else if (diffHours < 24) {
        setTimeAgo(`Hace ${diffHours}h`);
      } else {
        setTimeAgo(lastSync.toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }));
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000); // Actualizar cada 30s
    return () => clearInterval(interval);
  }, [lastSync]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            isOnline 
              ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
              : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
          } ${className}`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span>Conectado</span>
              <span className="text-white/40">•</span>
              <Clock className="w-3 h-3 opacity-60" />
              <span className="opacity-80">{timeAgo}</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Sin conexión</span>
            </>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 font-medium">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                Conexión activa
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-yellow-500" />
                Modo offline
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isOnline 
              ? 'Los datos se sincronizan automáticamente con el servidor.'
              : 'Estás viendo datos guardados en tu dispositivo. Se sincronizarán cuando recuperes conexión.'
            }
          </p>
          {lastSync && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 pt-1 border-t border-white/10">
              <RefreshCw className="w-3 h-3" />
              Última sincronización: {lastSync.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default LastSyncIndicator;
