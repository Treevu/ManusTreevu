import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { trpc } from "@/lib/trpc";

interface FWITrendWidgetProps {
  organizationId?: number;
  className?: string;
}

export function FWITrendWidget({ organizationId, className }: FWITrendWidgetProps) {
  const { data: comparison, isLoading } = trpc.reports.getB2BMonthlyComparison.useQuery(
    { months: 3, organizationId },
    { 
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false 
    }
  );

  const chartData = useMemo(() => {
    if (!comparison || comparison.length === 0) return [];
    
    // Sort by date ascending
    return [...comparison]
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
      .map(item => ({
        name: getMonthName(item.month),
        fwi: item.data?.avgFwiScore || 0,
        month: item.month,
        year: item.year
      }));
  }, [comparison]);

  const trend = useMemo(() => {
    if (chartData.length < 2) return { direction: 'neutral', change: 0 };
    
    const latest = chartData[chartData.length - 1]?.fwi || 0;
    const previous = chartData[chartData.length - 2]?.fwi || 0;
    
    if (previous === 0) return { direction: 'neutral', change: 0 };
    
    const change = ((latest - previous) / previous) * 100;
    
    return {
      direction: change > 1 ? 'up' : change < -1 ? 'down' : 'neutral',
      change: Math.abs(change).toFixed(1)
    };
  }, [chartData]);

  const currentFWI = chartData.length > 0 ? chartData[chartData.length - 1]?.fwi : 0;
  
  const fwiColor = currentFWI >= 70 ? "#10B981" : currentFWI >= 50 ? "#F59E0B" : "#EF4444";
  const trendColor = trend.direction === 'up' ? "#10B981" : trend.direction === 'down' ? "#EF4444" : "#6B7280";

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Tendencia FWI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-20 flex items-center justify-center">
            <div className="animate-pulse bg-muted rounded h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          Tendencia FWI (3 meses)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ color: fwiColor }}>
              {currentFWI}
            </span>
            <span className="text-xs text-muted-foreground">puntos</span>
          </div>
          <div className="flex items-center gap-1" style={{ color: trendColor }}>
            {trend.direction === 'up' ? (
              <TrendingUp className="h-4 w-4" />
            ) : trend.direction === 'down' ? (
              <TrendingDown className="h-4 w-4" />
            ) : (
              <Minus className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {trend.direction === 'neutral' ? 'Estable' : `${trend.change}%`}
            </span>
          </div>
        </div>
        
        {chartData.length > 0 ? (
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fwiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={fwiColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={fwiColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  interval={0}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border rounded-lg shadow-lg p-2 text-xs">
                        <p className="font-medium">{data.name} {data.year}</p>
                        <p style={{ color: fwiColor }}>FWI: {data.fwi}</p>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="fwi"
                  stroke={fwiColor}
                  strokeWidth={2}
                  fill="url(#fwiGradient)"
                  dot={{ fill: fwiColor, strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-16 flex items-center justify-center text-xs text-muted-foreground">
            No hay datos históricos disponibles
          </div>
        )}
        
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>
            {currentFWI >= 70 ? "Saludable" : currentFWI >= 50 ? "Moderado" : "En riesgo"}
          </span>
          <span>
            {chartData.length > 0 && `${chartData[0]?.name} - ${chartData[chartData.length - 1]?.name}`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function getMonthName(month: number): string {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return months[month - 1] || '';
}

export default FWITrendWidget;
