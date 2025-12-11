import { cn } from '@/lib/utils';

interface EwaIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * EwaIcon - Icono unificado para EWA (Earned Wage Access)
 * Representa una billetera con flecha hacia arriba (acceso al salario)
 */
export function EwaIcon({ className, size = 'md' }: EwaIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(sizeClasses[size], className)}
      aria-label="Adelanto de Salario (EWA)"
    >
      {/* Wallet base */}
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9" />
      <path d="M3 7l9 6 9-6" />
      
      {/* Arrow up (represents money access) */}
      <path d="M18 22v-6" />
      <path d="M15 19l3-3 3 3" />
    </svg>
  );
}

export default EwaIcon;
