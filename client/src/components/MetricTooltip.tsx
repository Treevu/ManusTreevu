import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { ReactNode } from "react";

interface MetricTooltipProps {
  children: ReactNode;
  tooltip: string;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
}

/**
 * MetricTooltip - Componente reutilizable para mostrar tooltips en métricas
 * Muestra un ícono de ayuda que al pasar el mouse muestra una explicación rápida
 */
export function MetricTooltip({
  children,
  tooltip,
  side = "top",
  delayDuration = 200,
}: MetricTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-help">
            {children}
            <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs bg-slate-900 border-slate-700 text-sm">
          <p className="text-gray-200">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * MetricValue - Componente para envolver valores de métricas con tooltip
 */
export function MetricValue({
  label,
  value,
  tooltip,
  unit = "",
  className = "",
}: {
  label: string;
  value: string | number;
  tooltip: string;
  unit?: string;
  className?: string;
}) {
  return (
    <MetricTooltip tooltip={tooltip}>
      <div className={`text-center ${className}`}>
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">
          {value}
          {unit && <span className="text-lg ml-1">{unit}</span>}
        </p>
      </div>
    </MetricTooltip>
  );
}

/**
 * MetricBadge - Componente para envolver badges/etiquetas con tooltip
 */
export function MetricBadge({
  label,
  value,
  tooltip,
  color = "bg-blue-500/20 text-blue-400 border-blue-500/30",
}: {
  label: string;
  value: string | number;
  tooltip: string;
  color?: string;
}) {
  return (
    <MetricTooltip tooltip={tooltip}>
      <div className={`px-3 py-2 rounded-lg border ${color}`}>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </MetricTooltip>
  );
}

/**
 * MetricLabel - Componente para etiquetas con tooltip
 */
export function MetricLabel({
  label,
  tooltip,
  className = "",
}: {
  label: string;
  tooltip: string;
  className?: string;
}) {
  return (
    <MetricTooltip tooltip={tooltip}>
      <span className={`text-sm font-semibold text-white ${className}`}>
        {label}
      </span>
    </MetricTooltip>
  );
}
