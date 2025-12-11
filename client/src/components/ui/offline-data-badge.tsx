import { CloudOff, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface OfflineDataBadgeProps {
  /** Timestamp de la última actualización */
  lastUpdated?: Date | string | null;
  /** Tamaño del badge */
  size?: 'sm' | 'md';
  /** Clase adicional */
  className?: string;
}

/**
 * OfflineDataBadge - Indica que los datos mostrados provienen del cache offline
 */
export function OfflineDataBadge({ 
  lastUpdated, 
  size = 'sm',
  className = '' 
}: OfflineDataBadgeProps) {
  const formatTime = (date: Date | string | null | undefined) => {
    if (!date) return 'Hace un momento';
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-sm px-2 py-1 gap-1.5',
  };

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`inline-flex items-center rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-medium ${sizeClasses[size]} ${className}`}
        >
          <CloudOff className={iconSize} />
          <span>Offline</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 font-medium">
            <CloudOff className="w-4 h-4" />
            Datos sin conexión
          </div>
          <p className="text-xs text-muted-foreground">
            Estos datos fueron guardados en tu dispositivo y pueden no estar actualizados.
          </p>
          {lastUpdated && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Clock className="w-3 h-3" />
              Última actualización: {formatTime(lastUpdated)}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default OfflineDataBadge;
