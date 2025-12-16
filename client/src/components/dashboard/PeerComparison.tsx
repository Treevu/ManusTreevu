import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Users, TrendingUp, Award } from 'lucide-react';

interface PeerData {
  category: string;
  yourValue: number;
  departmentAvg: number;
  companyAvg: number;
  percentile: number;
}

interface PeerComparisonProps {
  data?: PeerData[];
  isLoading?: boolean;
}

export default function PeerComparison({
  data,
  isLoading = false,
}: PeerComparisonProps) {
  // Default peer comparison data
  const defaultData: PeerData[] = [
    {
      category: 'FWI Score',
      yourValue: 68,
      departmentAvg: 62,
      companyAvg: 58,
      percentile: 78,
    },
    {
      category: 'Ahorro Mensual',
      yourValue: 450,
      departmentAvg: 380,
      companyAvg: 320,
      percentile: 82,
    },
    {
      category: 'Participación EWA',
      yourValue: 85,
      departmentAvg: 72,
      companyAvg: 65,
      percentile: 88,
    },
    {
      category: 'Metas Completadas',
      yourValue: 12,
      departmentAvg: 8,
      companyAvg: 6,
      percentile: 85,
    },
    {
      category: 'Puntos TreePoints',
      yourValue: 2450,
      departmentAvg: 1800,
      companyAvg: 1500,
      percentile: 80,
    },
  ];

  const displayData = data || defaultData;

  // Calculate statistics
  const avgPercentile = displayData.reduce((sum, d) => sum + d.percentile, 0) / displayData.length;
  const metricsAboveAvg = displayData.filter(d => d.yourValue > d.departmentAvg).length;
  const metricsAboveCompanyAvg = displayData.filter(d => d.yourValue > d.companyAvg).length;

  // Prepare data for bar chart
  const barData = displayData.map(d => ({
    category: d.category,
    'Tu Valor': d.yourValue,
    'Promedio Depto': d.departmentAvg,
    'Promedio Empresa': d.companyAvg,
  }));

  // Prepare data for scatter plot (percentile distribution)
  const scatterData = displayData.map((d, idx) => ({
    x: idx,
    y: d.percentile,
    category: d.category,
  }));

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">Cargando comparativa...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-400 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Tu Percentil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{avgPercentile.toFixed(0)}%</div>
            <p className="text-xs text-gray-400 mt-1">Mejor que {Math.round(avgPercentile)}% de colegas</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Sobre Depto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{metricsAboveAvg}</div>
            <p className="text-xs text-gray-400 mt-1">De {displayData.length} métricas</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Sobre Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{metricsAboveCompanyAvg}</div>
            <p className="text-xs text-gray-400 mt-1">De {displayData.length} métricas</p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Chart */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Comparativa Anónima</CardTitle>
          <CardDescription className="text-gray-400">Tu desempeño vs promedio de departamento y empresa</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="category" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={80} />
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
              <Bar dataKey="Tu Valor" fill="#3b82f6" />
              <Bar dataKey="Promedio Depto" fill="#6b7280" />
              <Bar dataKey="Promedio Empresa" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Percentile Distribution */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Distribución de Percentiles</CardTitle>
          <CardDescription className="text-gray-400">Tu posición en cada métrica</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayData.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-300 w-32">{metric.category}</span>
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-48 bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${metric.percentile}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-300 w-12 text-right">P{metric.percentile}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Análisis Detallado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayData.map((metric, idx) => {
            const isAboveDepto = metric.yourValue > metric.departmentAvg;
            const isAboveCompany = metric.yourValue > metric.companyAvg;
            const deptoGap = metric.yourValue - metric.departmentAvg;
            const companyGap = metric.yourValue - metric.companyAvg;

            return (
              <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{metric.category}</h4>
                  <Badge className="bg-blue-500/20 text-blue-400 border-transparent text-xs">
                    P{metric.percentile}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm mb-2">
                  <div>
                    <p className="text-xs text-gray-400">Tu Valor</p>
                    <p className="font-semibold text-blue-400">{metric.yourValue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Depto Promedio</p>
                    <p className="font-semibold text-gray-300">{metric.departmentAvg}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Empresa Promedio</p>
                    <p className="font-semibold text-gray-300">{metric.companyAvg}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-400 space-y-1">
                  <p className={isAboveDepto ? 'text-green-400' : 'text-amber-400'}>
                    {isAboveDepto ? '✓' : '↓'} vs Depto: {isAboveDepto ? '+' : ''}{deptoGap.toFixed(0)}
                  </p>
                  <p className={isAboveCompany ? 'text-green-400' : 'text-amber-400'}>
                    {isAboveCompany ? '✓' : '↓'} vs Empresa: {isAboveCompany ? '+' : ''}{companyGap.toFixed(0)}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Insights Personalizados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
            <p className="font-semibold text-green-400 mb-1">✨ Tus Fortalezas</p>
            <p className="text-sm text-gray-300">
              Destacas en Participación EWA (P88) y Ahorro Mensual (P82). Mantén estos hábitos y considera compartir tus estrategias con colegas.
            </p>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded">
            <p className="font-semibold text-amber-400 mb-1">📈 Áreas de Mejora</p>
            <p className="text-sm text-gray-300">
              Aunque estás sobre el promedio, puedes mejorar en Metas Completadas. Establece metas más ambiciosas para el próximo trimestre.
            </p>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="font-semibold text-blue-400 mb-1">🎯 Recomendación</p>
            <p className="text-sm text-gray-300">
              Estás en el percentil {avgPercentile.toFixed(0)}, lo que te coloca entre los mejores de tu departamento. Continúa con tu desempeño actual.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
