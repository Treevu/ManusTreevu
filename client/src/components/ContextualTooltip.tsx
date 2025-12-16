import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";

interface ContextualTooltipProps {
  label: string;
  value: number | string;
  status: "good" | "warning" | "critical" | "neutral";
  tooltip: string;
  contextualAction?: string;
  trend?: "up" | "down" | "stable";
  children?: ReactNode;
}

/**
 * Componente para tooltips contextuales que cambian basado en el estado actual
 * Muestra diferentes mensajes según si la métrica está mejorando o empeorando
 */
export function ContextualTooltip({
  label,
  value,
  status,
  tooltip,
  contextualAction,
  trend,
  children,
}: ContextualTooltipProps) {
  const statusColors = {
    good: "text-green-400",
    warning: "text-yellow-400",
    critical: "text-red-400",
    neutral: "text-gray-400",
  };

  const statusBgColors = {
    good: "bg-green-500/10 border-green-500/30",
    warning: "bg-yellow-500/10 border-yellow-500/30",
    critical: "bg-red-500/10 border-red-500/30",
    neutral: "bg-gray-500/10 border-gray-500/30",
  };

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-400" />;
    return null;
  };

  const getContextualMessage = () => {
    if (status === "critical") {
      return "⚠️ Esta métrica necesita atención inmediata. Considera tomar acciones correctivas.";
    }
    if (status === "warning") {
      return "⚡ Esta métrica está en zona de alerta. Monitorea de cerca.";
    }
    if (status === "good") {
      return "✅ Excelente. Mantén este ritmo.";
    }
    return "ℹ️ Métrica neutral. Sin cambios significativos.";
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center gap-2 p-2 rounded-lg border cursor-help transition-all ${statusBgColors[status]}`}
          >
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className={`text-lg font-bold ${statusColors[status]}`}>{value}</p>
            </div>
            <div className="ml-auto flex flex-col items-center gap-1">
              {getTrendIcon()}
              <HelpCircle className="h-4 w-4 text-gray-500 hover:text-gray-300 transition-colors" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-sm bg-gray-900 text-white border border-gray-700 text-sm"
        >
          <div className="space-y-2">
            <p className="font-semibold text-white">{label}</p>
            <p className="text-gray-200">{tooltip}</p>
            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs font-medium text-gray-300 mb-1">Estado Actual:</p>
              <p className="text-xs text-gray-400">{getContextualMessage()}</p>
            </div>
            {contextualAction && (
              <div className="pt-2 border-t border-gray-700">
                <p className="text-xs font-medium text-gray-300 mb-1">Acción Recomendada:</p>
                <p className="text-xs text-gray-400">{contextualAction}</p>
              </div>
            )}
            {children && <div className="mt-2 text-xs text-gray-300">{children}</div>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Ejemplos de tooltips contextuales para diferentes métricas
 */
export const contextualTooltipExamples = {
  fwiScore: {
    good: {
      status: "good" as const,
      tooltip: "Tu FWI Score está en excelente estado. Significa que tienes una salud financiera sólida.",
      contextualAction: "Mantén tus hábitos de ahorro y gasto responsable.",
    },
    warning: {
      status: "warning" as const,
      tooltip: "Tu FWI Score está bajando. Revisa tus gastos recientes.",
      contextualAction: "Identifica gastos hormiga y reduce categorías con mayor gasto.",
    },
    critical: {
      status: "critical" as const,
      tooltip: "Tu FWI Score está en nivel crítico. Necesitas actuar inmediatamente.",
      contextualAction: "Contacta con un asesor financiero o usa Early Wage Access si lo necesitas.",
    },
  },
  monthlyExpenses: {
    good: {
      status: "good" as const,
      tooltip: "Tus gastos están dentro del presupuesto. Excelente control.",
      contextualAction: "Continúa monitoreando para mantener este nivel.",
    },
    warning: {
      status: "warning" as const,
      tooltip: "Tus gastos están cerca del límite del presupuesto.",
      contextualAction: "Reduce gastos discrecionales para evitar exceder el presupuesto.",
    },
    critical: {
      status: "critical" as const,
      tooltip: "Has excedido tu presupuesto mensual.",
      contextualAction: "Analiza gastos hormiga y ajusta tu presupuesto para próximos meses.",
    },
  },
  buyerReadiness: {
    good: {
      status: "good" as const,
      tooltip: "Tienes muchos compradores listos. Excelente oportunidad de ventas.",
      contextualAction: "Contacta a estos compradores inmediatamente para cerrar ventas.",
    },
    warning: {
      status: "warning" as const,
      tooltip: "Tienes algunos compradores listos pero pocos en pipeline.",
      contextualAction: "Enfócate en nurturing de compradores potenciales.",
    },
    critical: {
      status: "critical" as const,
      tooltip: "Muy pocos compradores listos. Necesitas generar más leads.",
      contextualAction: "Aumenta tu actividad de marketing y prospecting.",
    },
  },
};
