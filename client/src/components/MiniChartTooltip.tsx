import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface MiniChartTooltipProps {
  label: string;
  tooltip: string;
  chartType: "line" | "bar";
  data: Array<{ name: string; value: number }>;
  children?: ReactNode;
}

/**
 * Componente para tooltips con mini-gráficos
 * Muestra un pequeño gráfico dentro del tooltip para contexto visual
 */
export function MiniChartTooltip({
  label,
  tooltip,
  chartType,
  data,
  children,
}: MiniChartTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <span className="font-semibold text-sm">{label}</span>
            <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-md bg-gray-900 text-white border border-gray-700 text-sm"
        >
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-white mb-1">{label}</p>
              <p className="text-gray-200 text-xs">{tooltip}</p>
            </div>

            {/* Mini Chart */}
            <div className="h-32 w-full bg-gray-800/50 rounded p-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={data}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={data}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {children && <div className="text-xs text-gray-300">{children}</div>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Datos de ejemplo para mini-gráficos
 */
export const miniChartData = {
  fwiTrend: [
    { name: "Sem 1", value: 65 },
    { name: "Sem 2", value: 68 },
    { name: "Sem 3", value: 72 },
    { name: "Sem 4", value: 75 },
  ],
  expenseTrend: [
    { name: "Sem 1", value: 1200 },
    { name: "Sem 2", value: 1350 },
    { name: "Sem 3", value: 1100 },
    { name: "Sem 4", value: 950 },
  ],
  buyerReadinessTrend: [
    { name: "Sem 1", value: 45 },
    { name: "Sem 2", value: 52 },
    { name: "Sem 3", value: 58 },
    { name: "Sem 4", value: 82 },
  ],
  conversionFunnel: [
    { name: "Vistas", value: 500 },
    { name: "Interesados", value: 200 },
    { name: "Listos", value: 82 },
    { name: "Cerrados", value: 35 },
  ],
  categoryBreakdown: [
    { name: "Alimentación", value: 450 },
    { name: "Transporte", value: 320 },
    { name: "Entretenimiento", value: 180 },
    { name: "Servicios", value: 250 },
    { name: "Otros", value: 100 },
  ],
  priceImpact: [
    { name: "Precio Actual", value: 48000 },
    { name: "Precio Recomendado", value: 44500 },
    { name: "Precio Máximo", value: 52000 },
    { name: "Precio Mínimo", value: 40000 },
  ],
};
