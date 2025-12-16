import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

interface CorrelationData {
  variable1: string;
  variable2: string;
  correlation: number;
  strength: 'strong' | 'moderate' | 'weak';
  interpretation: string;
}

interface CorrelationAnalysisProps {
  data?: CorrelationData[];
  isLoading?: boolean;
}

export default function CorrelationAnalysis({
  data,
  isLoading = false,
}: CorrelationAnalysisProps) {
  // Default correlation data
  const defaultData: CorrelationData[] = [
    {
      variable1: 'FWI Score',
      variable2: 'Productividad',
      correlation: 0.78,
      strength: 'strong',
      interpretation: 'Empleados con mejor bienestar financiero son más productivos',
    },
    {
      variable1: 'Participación EWA',
      variable2: 'Retención',
      correlation: 0.82,
      strength: 'strong',
      interpretation: 'Mayor participación en programas de bienestar reduce rotación',
    },
    {
      variable1: 'FWI Score',
      variable2: 'Ausentismo',
      correlation: -0.71,
      strength: 'strong',
      interpretation: 'Mejor bienestar financiero correlaciona con menor ausentismo',
    },
    {
      variable1: 'Intervenciones',
      variable2: 'FWI Mejora',
      correlation: 0.85,
      strength: 'strong',
      interpretation: 'Las intervenciones son efectivas para mejorar FWI',
    },
    {
      variable1: 'Antigüedad',
      variable2: 'FWI Score',
      correlation: 0.45,
      strength: 'moderate',
      interpretation: 'Empleados más antiguos tienden a tener mejor FWI',
    },
    {
      variable1: 'Edad',
      variable2: 'Riesgo Rotación',
      correlation: -0.52,
      strength: 'moderate',
      interpretation: 'Empleados más jóvenes tienen mayor riesgo de rotación',
    },
  ];

  const displayData = data || defaultData;

  // Prepare data for scatter plot
  const scatterData = displayData.map((d, idx) => ({
    x: idx,
    y: Math.abs(d.correlation),
    correlation: d.correlation,
    variables: `${d.variable1} vs ${d.variable2}`,
  }));

  // Calculate statistics
  const strongCorrelations = displayData.filter(d => d.strength === 'strong').length;
  const positiveCorrelations = displayData.filter(d => d.correlation > 0).length;
  const avgCorrelation = displayData.reduce((sum, d) => sum + Math.abs(d.correlation), 0) / displayData.length;

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">Cargando análisis...</div>
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
            <CardTitle className="text-sm font-semibold text-blue-400">Correlaciones Fuertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{strongCorrelations}</div>
            <p className="text-xs text-gray-400 mt-1">De {displayData.length} relaciones</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-400">Correlación Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{(avgCorrelation * 100).toFixed(0)}%</div>
            <p className="text-xs text-gray-400 mt-1">Fuerza promedio de relaciones</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-400">Positivas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{positiveCorrelations}</div>
            <p className="text-xs text-gray-400 mt-1">Relaciones beneficiosas</p>
          </CardContent>
        </Card>
      </div>

      {/* Correlation Strength Chart */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Fuerza de Correlaciones</CardTitle>
          <CardDescription className="text-gray-400">Magnitud de las relaciones identificadas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" dataKey="x" stroke="rgba(255,255,255,0.5)" />
              <YAxis type="number" dataKey="y" stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Scatter
                name="Correlaciones"
                data={scatterData}
                fill="#3b82f6"
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Correlations */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Análisis Detallado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayData.map((corr, idx) => {
            const isPositive = corr.correlation > 0;
            const strengthColor =
              corr.strength === 'strong'
                ? 'bg-red-500/20 text-red-400'
                : corr.strength === 'moderate'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-blue-500/20 text-blue-400';

            return (
              <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{corr.variable1}</h4>
                    <p className="text-xs text-gray-400">vs {corr.variable2}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={strengthColor}>
                      {corr.strength === 'strong' ? 'Fuerte' : corr.strength === 'moderate' ? 'Moderada' : 'Débil'}
                    </Badge>
                    <Badge className={isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {isPositive ? '+' : ''}{(corr.correlation * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>

                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                  />
                </div>

                <p className="text-sm text-gray-300">{corr.interpretation}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Insights Clave
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
            <p className="font-semibold text-green-400 mb-1">✓ Relaciones Positivas Fuertes</p>
            <p className="text-sm text-gray-300">
              La participación en EWA (0.82) y las intervenciones (0.85) tienen fuerte impacto positivo en retención y mejora de FWI.
            </p>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded">
            <p className="font-semibold text-amber-400 mb-1">⚠ Relaciones Negativas Importantes</p>
            <p className="text-sm text-gray-300">
              Mejor FWI correlaciona con menor ausentismo (-0.71), validando la importancia del bienestar financiero.
            </p>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="font-semibold text-blue-400 mb-1">💡 Recomendación Estratégica</p>
            <p className="text-sm text-gray-300">
              Enfócate en aumentar participación en EWA y diseñar intervenciones efectivas. Estos tienen el mayor impacto en retención y productividad.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap Legend */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Interpretación de Correlaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded" />
            <div>
              <p className="font-semibold text-white">Correlación Fuerte (0.7+)</p>
              <p className="text-xs text-gray-400">Relación muy significativa entre variables</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded" />
            <div>
              <p className="font-semibold text-white">Correlación Moderada (0.4-0.7)</p>
              <p className="text-xs text-gray-400">Relación notable pero no determinante</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded" />
            <div>
              <p className="font-semibold text-white">Correlación Débil (&lt;0.4)</p>
              <p className="text-xs text-gray-400">Relación mínima entre variables</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
