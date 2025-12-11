import { cn } from '@/lib/utils';

interface PulsingBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'primary';
  size?: 'sm' | 'md';
  className?: string;
  pulse?: boolean;
}

/**
 * PulsingBadge - Badge con animación de pulso para llamar la atención
 * Uso: <PulsingBadge variant="success">Disponible</PulsingBadge>
 */
export function PulsingBadge({ 
  children, 
  variant = 'success',
  size = 'sm',
  className,
  pulse = true
}: PulsingBadgeProps) {
  const variantClasses = {
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    primary: 'bg-brand-primary/20 text-brand-primary border-brand-primary/30',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  const pulseColors = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    info: 'bg-blue-400',
    primary: 'bg-brand-primary',
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span 
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              pulseColors[variant]
            )} 
          />
          <span 
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              pulseColors[variant]
            )} 
          />
        </span>
      )}
      {children}
    </span>
  );
}

export default PulsingBadge;
