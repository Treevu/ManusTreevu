import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

export interface BenchmarkData {
  metric: string;
  yourCompany: number;
  industryAverage: number;
  industryLeader: number;
  percentile: number;
}

interface BenchmarkingProps {
  data?: BenchmarkData[];
  isLoading?: boolean;
}

export default function Benchmarking({
  data,
  isLoading = false,
}: BenchmarkingProps) {
  // Default benchmark data
  const defaultData: BenchmarkData[] = [
    {
      metric: 'FWI Score',
      yourCompany: 62,
      industryAverage: 55,
      industryLeader: 78,
      percentile: 72,
    },
    {
      metric: 'Tasa Retención',
      yourCompany: 88,
      industryAverage: 82,
      industryLeader: 94,
      percentile: 68,
    },
    {
      metric: 'Engagement Score',
      yourCompany: 71,
      industryAverage: 65,
      industryLeader: 85,
      percentile: 75,
    },
    {
      metric: 'ROI Intervenciones',
      yourCompany: 245,
      industryAverage: 180,
      industryLeader: 320,
      percentile: 78,
    },
    {
      metric: 'Participación EWA',
      yourCompany: 68,
      industryAverage: 55,
      industryLeader: 92,
      percentile: 82,
    },
    {
      metric: 'Satisfacción Empleados',
      yourCompany: 7.8,
      industryAverage: 7.2,
      industryLeader: 8.9,
      percentile: 71,
    },
  ];

  const displayData = data || defaultData;

  // Calculate position vs industry
  const avgPercentile = displayData.reduce((sum, d) => sum + d.percentile, 0) / displayData.length;
  const metricsAboveAverage = displayData.filter(d => d.yourCompany > d.industryAverage).length;
  const metricsAboveLeader = displayData.filter(d => d.yourCompany > d.industryLeader).length;

  // Prepare data for radar chart (normalized to 0-100)
  const radarData = displayData.map(d => ({
    metric: d.metric.substring(0, 10),
    yourCompany: (d.yourCompany / d.industryLeader) * 100,
    industryAverage: (d.industryAverage / d.industryLeader) * 100,
  }));

  // Prepare data for bar chart
  const barData = displayData.map(d => ({
    metric: d.metric,
    'Tu Empresa': d.yourCompany,
    'Promedio Industria': d.industryAverage,
    'Líder Industria': d.industryLeader,
  }));

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">Cargando benchmarks...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Position */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-400 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Posición General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{avgPercentile.toFixed(0)}%</div>
            <p className="text-xs text-gray-400 mt-1">Percentil vs Industria</p>
            <p className="text-xs text-gray-500 mt-2">
              Mejor que {Math.round(avgPercentile)}% de empresas similares
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Fortalezas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{metricsAboveAverage}</div>
            <p className="text-xs text-gray-400 mt-1">Métricas sobre promedio</p>
            <p className="text-xs text-gray-500 mt-2">
              De {displayData.length} métricas principales
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-400 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Oportunidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{displayData.length - metricsAboveAverage}</div>
            <p className="text-xs text-gray-400 mt-1">Áreas de mejora</p>
            <p className="text-xs text-gray-500 mt-2">
              Bajo promedio industria
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Chart */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Comparación de Métricas</CardTitle>
          <CardDescription className="text-gray-400">Tu empresa vs promedio e líder de industria</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="metric" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="Tu Empresa" fill="#3b82f6" />
              <Bar dataKey="Promedio Industria" fill="#6b7280" />
              <Bar dataKey="Líder Industria" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Perfil de Desempeño</CardTitle>
          <CardDescription className="text-gray-400">Visualización normalizada de fortalezas y debilidades</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="metric" stroke="rgba(255,255,255,0.5)" />
              <PolarRadiusAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
              <Radar name="Tu Empresa" dataKey="yourCompany" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
              <Radar name="Promedio" dataKey="industryAverage" stroke="#6b7280" fill="#6b7280" fillOpacity={0.3} />
              <Legend />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Análisis Detallado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayData.map((metric, idx) => {
            const isAboveAverage = metric.yourCompany > metric.industryAverage;
            const isAboveLeader = metric.yourCompany > metric.industryLeader;
            const gap = metric.yourCompany - metric.industryAverage;
            const gapToLeader = metric.industryLeader - metric.yourCompany;

            return (
              <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{metric.metric}</h4>
                  <div className="flex gap-2">
                    <Badge className={`${isAboveAverage ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} border-transparent text-xs`}>
                      {isAboveAverage ? '↑' : '↓'} {Math.abs(gap).toFixed(1)}
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-transparent text-xs">
                      P{metric.percentile}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Tu Empresa</p>
                    <p className="font-semibold text-blue-400">{metric.yourCompany}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Promedio</p>
                    <p className="font-semibold text-gray-300">{metric.industryAverage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Líder</p>
                    <p className="font-semibold text-green-400">{metric.industryLeader}</p>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-400">
                  {isAboveLeader ? (
                    <p className="text-green-400">✓ Superando al líder de industria</p>
                  ) : (
                    <p>
                      Brecha con líder: <span className="text-amber-400">{gapToLeader.toFixed(1)} puntos</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Recomendaciones Estratégicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
            <p className="font-semibold text-green-400 mb-1">💪 Fortalezas a Mantener</p>
            <p className="text-sm text-gray-300">
              Tu empresa destaca en FWI Score y ROI de Intervenciones. Continúa con las estrategias actuales y considera compartir mejores prácticas con la industria.
            </p>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded">
            <p className="font-semibold text-amber-400 mb-1">📈 Oportunidades de Crecimiento</p>
            <p className="text-sm text-gray-300">
              Enfócate en mejorar Tasa de Retención y Satisfacción de Empleados. Implementar programas de bienestar adicionales podría cerrar la brecha con el promedio.
            </p>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="font-semibold text-blue-400 mb-1">🎯 Meta de Corto Plazo</p>
            <p className="text-sm text-gray-300">
              Alcanzar el percentil 80 en los próximos 6 meses. Esto requeriría mejorar 3-4 puntos en FWI Score y aumentar participación en EWA al 75%.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
