import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface LiveMetricCardProps {
  title: string;
  value: number | string;
  previousValue?: number;
  icon?: React.ReactNode;
  suffix?: string;
  prefix?: string;
  isConnected?: boolean;
  showTrend?: boolean;
  formatValue?: (value: number | string) => string;
  className?: string;
  accentColor?: "green" | "blue" | "purple" | "orange" | "red";
}

export function LiveMetricCard({
  title,
  value,
  previousValue,
  icon,
  suffix = "",
  prefix = "",
  isConnected = true,
  showTrend = true,
  formatValue,
  className,
  accentColor = "green"
}: LiveMetricCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  // Detectar cambios y mostrar animación
  useEffect(() => {
    if (value !== displayValue) {
      setIsUpdating(true);
      setDisplayValue(value);
      
      const timer = setTimeout(() => {
        setIsUpdating(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  // Calcular tendencia
  const trend = previousValue !== undefined && typeof value === "number" && typeof previousValue === "number"
    ? value > previousValue ? "up" : value < previousValue ? "down" : "neutral"
    : null;

  const change = previousValue !== undefined && typeof value === "number" && typeof previousValue === "number"
    ? value - previousValue
    : 0;

  const formattedValue = formatValue 
    ? formatValue(displayValue) 
    : typeof displayValue === "number" 
      ? displayValue.toLocaleString() 
      : displayValue;

  const accentColors = {
    green: "from-green-500/20 to-green-600/5 border-green-500/30",
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/30",
    orange: "from-orange-500/20 to-orange-600/5 border-orange-500/30",
    red: "from-red-500/20 to-red-600/5 border-red-500/30"
  };

  const pulseColors = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    red: "bg-red-500"
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300",
      `bg-gradient-to-br ${accentColors[accentColor]}`,
      isUpdating && "ring-2 ring-green-500/50",
      className
    )}>
      {/* Indicador de conexión en tiempo real */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        {isConnected ? (
          <>
            <motion.div
              className={cn("w-2 h-2 rounded-full", pulseColors[accentColor])}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Wifi className="w-3 h-3 text-green-500" />
          </>
        ) : (
          <WifiOff className="w-3 h-3 text-gray-400" />
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {title}
            </p>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={String(displayValue)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-baseline gap-1"
              >
                <span className="text-2xl font-bold">
                  {prefix}{formattedValue}{suffix}
                </span>
                
                {showTrend && trend && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "flex items-center text-xs font-medium",
                      trend === "up" && "text-green-500",
                      trend === "down" && "text-red-500",
                      trend === "neutral" && "text-gray-400"
                    )}
                  >
                    {trend === "up" && <TrendingUp className="w-3 h-3 mr-0.5" />}
                    {trend === "down" && <TrendingDown className="w-3 h-3 mr-0.5" />}
                    {trend === "neutral" && <Minus className="w-3 h-3 mr-0.5" />}
                    {change !== 0 && (
                      <span>{change > 0 ? "+" : ""}{change}</span>
                    )}
                  </motion.span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {icon && (
            <div className={cn(
              "p-2 rounded-lg",
              `bg-${accentColor}-500/20`
            )}>
              {icon}
            </div>
          )}
        </div>

        {/* Barra de actualización animada */}
        <AnimatePresence>
          {isUpdating && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={cn(
                "absolute bottom-0 left-0 right-0 h-1",
                pulseColors[accentColor]
              )}
              style={{ transformOrigin: "left" }}
            />
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// Componente para mostrar indicador de conexión global
export function RealtimeConnectionIndicator({ connected }: { connected: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
      connected 
        ? "bg-green-500/10 text-green-500 border border-green-500/20" 
        : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
    )}>
      {connected ? (
        <>
          <motion.div
            className="w-2 h-2 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span>En vivo</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 rounded-full bg-gray-400" />
          <span>Desconectado</span>
        </>
      )}
    </div>
  );
}

// Grid de métricas en tiempo real
interface LiveMetricsGridProps {
  metrics: Array<{
    title: string;
    value: number | string;
    previousValue?: number;
    icon?: React.ReactNode;
    suffix?: string;
    prefix?: string;
    accentColor?: "green" | "blue" | "purple" | "orange" | "red";
  }>;
  isConnected?: boolean;
  columns?: 2 | 3 | 4;
}

export function LiveMetricsGrid({ metrics, isConnected = true, columns = 4 }: LiveMetricsGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns])}>
      {metrics.map((metric, index) => (
        <LiveMetricCard
          key={index}
          {...metric}
          isConnected={isConnected}
        />
      ))}
    </div>
  );
}
