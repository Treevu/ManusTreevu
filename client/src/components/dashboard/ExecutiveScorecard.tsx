import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KPI {
  id: string;
  label: string;
  value: number;
  target: number;
  unit?: string;
  status: 'green' | 'yellow' | 'red';
  trend?: 'up' | 'down' | 'stable';
  trendPercent?: number;
  description?: string;
}

interface ExecutiveScorecardProps {
  kpis?: KPI[];
  isLoading?: boolean;
}

export default function ExecutiveScorecard({
  kpis = [],
  isLoading = false,
}: ExecutiveScorecardProps) {
  // Default KPIs if none provided
  const displayKPIs = kpis.length > 0 ? kpis : [
    {
      id: 'fwi-score',
      label: 'FWI Score Promedio',
      value: 72.5,
      target: 75,
      unit: 'pts',
      status: 'green',
      trend: 'up',
      trendPercent: 2.5,
      description: 'Bienestar financiero de empleados',
    },
    {
      id: 'employee-count',
      label: 'Empleados Totales',
      value: 150,
      target: 160,
      status: 'yellow',
      trend: 'down',
      trendPercent: -5,
      description: 'Cantidad de empleados activos',
    },
    {
      id: 'high-risk',
      label: 'Empleados en Riesgo',
      value: 12,
      target: 8,
      unit: 'empleados',
      status: 'red',
      trend: 'up',
      trendPercent: 50,
      description: 'Empleados con FWI < 40',
    },
    {
      id: 'churn-rate',
      label: 'Tasa de Rotación',
      value: 4.2,
      target: 3,
      unit: '%',
      status: 'yellow',
      trend: 'down',
      trendPercent: -8,
      description: 'Rotación mensual',
    },
    {
      id: 'ewa-pending',
      label: 'Solicitudes EWA Pendientes',
      value: 23,
      target: 15,
      unit: 'solicitudes',
      status: 'yellow',
      trend: 'up',
      trendPercent: 15,
      description: 'Adelantos pendientes de aprobación',
    },
    {
      id: 'intervention-success',
      label: 'Éxito de Intervenciones',
      value: 78.5,
      target: 85,
      unit: '%',
      status: 'green',
      trend: 'up',
      trendPercent: 5,
      description: 'Tasa de éxito de intervenciones',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'yellow':
        return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
      case 'red':
        return 'bg-red-500/20 border-red-500/30 text-red-400';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'green':
        return '●';
      case 'yellow':
        return '◐';
      case 'red':
        return '○';
      default:
        return '●';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getProgressValue = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">Cargando scorecard...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-lg text-white">Scorecard Ejecutivo</CardTitle>
        <CardDescription className="text-gray-400">
          KPIs principales de la organización
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayKPIs.map(kpi => (
            <div
              key={kpi.id}
              className={`p-4 border rounded-lg transition-colors ${getStatusColor(kpi.status)}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getStatusIcon(kpi.status)}</span>
                    <h4 className="font-semibold text-sm text-white">{kpi.label}</h4>
                  </div>
                  {kpi.description && (
                    <p className="text-xs text-gray-400 mt-1">{kpi.description}</p>
                  )}
                </div>
                {kpi.trend && getTrendIcon(kpi.trend)}
              </div>

              {/* Value */}
              <div className="mb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">
                    {kpi.value.toFixed(1)}
                  </span>
                  {kpi.unit && (
                    <span className="text-xs text-gray-400">{kpi.unit}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">Meta: {kpi.target.toFixed(1)}</span>
                  {kpi.trendPercent && (
                    <span className={`text-xs font-semibold ${
                      kpi.trendPercent > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {kpi.trendPercent > 0 ? '+' : ''}{kpi.trendPercent.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Progress */}
              <Progress
                value={getProgressValue(kpi.value, kpi.target)}
                className="h-2 bg-white/10"
              />

              {/* Status Bar */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-gray-400">Progreso</span>
                <span className="font-mono text-white">
                  {((getProgressValue(kpi.value, kpi.target) / 100) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {displayKPIs.filter(k => k.status === 'green').length}
              </div>
              <div className="text-xs text-gray-400 mt-1">En Meta</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">
                {displayKPIs.filter(k => k.status === 'yellow').length}
              </div>
              <div className="text-xs text-gray-400 mt-1">Atención</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {displayKPIs.filter(k => k.status === 'red').length}
              </div>
              <div className="text-xs text-gray-400 mt-1">Crítico</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
