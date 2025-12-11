import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { cn } from '@/lib/utils';

interface InfoTooltipProps {
  content: string;
  title?: string;
  className?: string;
  iconClassName?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * InfoTooltip - Componente para mostrar información contextual
 * Uso: <InfoTooltip content="Explicación del término" title="FWI" />
 */
export function InfoTooltip({ 
  content, 
  title,
  className,
  iconClassName,
  side = 'top'
}: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button 
          type="button"
          className={cn(
            "inline-flex items-center justify-center rounded-full p-0.5 hover:bg-white/10 transition-colors cursor-help",
            className
          )}
          aria-label={title ? `Información sobre ${title}` : "Más información"}
        >
          <HelpCircle className={cn("w-4 h-4 text-gray-400 hover:text-brand-primary transition-colors", iconClassName)} />
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side={side}
        className="max-w-xs bg-treevu-surface border border-white/10 text-white shadow-xl"
      >
        {title && (
          <p className="font-semibold text-brand-primary mb-1">{title}</p>
        )}
        <p className="text-gray-300 text-xs leading-relaxed">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default InfoTooltip;
