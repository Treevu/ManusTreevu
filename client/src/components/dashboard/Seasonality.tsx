import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react';

export interface SeasonalityData {
  month: string;
  demand: number;
  historicalAverage: number;
  forecast: number;
  confidence: number;
}

interface SeasonalityProps {
  data?: SeasonalityData[];
  isLoading?: boolean;
}

export default function Seasonality({
  data,
  isLoading = false,
}: SeasonalityProps) {
  // Default seasonality data
  const defaultData: SeasonalityData[] = [
    { month: 'Ene', demand: 65, historicalAverage: 68, forecast: 70, confidence: 92 },
    { month: 'Feb', demand: 72, historicalAverage: 70, forecast: 75, confidence: 90 },
    { month: 'Mar', demand: 78, historicalAverage: 75, forecast: 82, confidence: 88 },
    { month: 'Abr', demand: 85, historicalAverage: 82, forecast: 88, confidence: 87 },
    { month: 'May', demand: 92, historicalAverage: 90, forecast: 95, confidence: 85 },
    { month: 'Jun', demand: 98, historicalAverage: 95, forecast: 100, confidence: 83 },
    { month: 'Jul', demand: 105, historicalAverage: 102, forecast: 108, confidence: 82 },
    { month: 'Ago', demand: 102, historicalAverage: 100, forecast: 105, confidence: 81 },
    { month: 'Sep', demand: 95, historicalAverage: 92, forecast: 98, confidence: 84 },
    { month: 'Oct', demand: 88, historicalAverage: 85, forecast: 90, confidence: 86 },
    { month: 'Nov', demand: 110, historicalAverage: 108, forecast: 115, confidence: 88 },
    { month: 'Dic', demand: 125, historicalAverage: 120, forecast: 130, confidence: 85 },
  ];

  const displayData = data || defaultData;

  // Calculate statistics
  const peakMonth = displayData.reduce((max, d) => d.demand > max.demand ? d : max);
  const lowMonth = displayData.reduce((min, d) => d.demand < min.demand ? d : min);
  const avgDemand = displayData.reduce((sum, d) => sum + d.demand, 0) / displayData.length;
  const volatility = Math.sqrt(
    displayData.reduce((sum, d) => sum + Math.pow(d.demand - avgDemand, 2), 0) / displayData.length
  );

  // Identify seasonal patterns
  const q1Avg = (displayData[0].demand + displayData[1].demand + displayData[2].demand) / 3;
  const q2Avg = (displayData[3].demand + displayData[4].demand + displayData[5].demand) / 3;
  const q3Avg = (displayData[6].demand + displayData[7].demand + displayData[8].demand) / 3;
  const q4Avg = (displayData[9].demand + displayData[10].demand + displayData[11].demand) / 3;

  const quarters = [
    { name: 'Q1', value: q1Avg, season: 'Bajo' },
    { name: 'Q2', value: q2Avg, season: 'Medio' },
    { name: 'Q3', value: q3Avg, season: 'Alto' },
    { name: 'Q4', value: q4Avg, season: 'Muy Alto' },
  ];

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
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-400">Demanda Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{avgDemand.toFixed(0)}</div>
            <p className="text-xs text-gray-400 mt-1">Demanda anual promedio</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Pico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{peakMonth.demand}</div>
            <p className="text-xs text-gray-400 mt-1">{peakMonth.month} - Demanda máxima</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-orange-400">Mínimo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">{lowMonth.demand}</div>
            <p className="text-xs text-gray-400 mt-1">{lowMonth.month} - Demanda mínima</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-400">Volatilidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{volatility.toFixed(1)}</div>
            <p className="text-xs text-gray-400 mt-1">Desviación estándar</p>
          </CardContent>
        </Card>
      </div>

      {/* Demand Forecast */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Demanda Histórica vs Pronóstico</CardTitle>
          <CardDescription className="text-gray-400">Tendencia anual con proyección para próximo año</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={displayData}>
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
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
              <Area type="monotone" dataKey="demand" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDemand)" name="Demanda Real" />
              <Area type="monotone" dataKey="forecast" stroke="#22c55e" fillOpacity={1} fill="url(#colorForecast)" name="Pronóstico" />
              <Line type="monotone" dataKey="historicalAverage" stroke="#6b7280" strokeDasharray="5 5" name="Promedio Histórico" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quarterly Analysis */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Análisis Trimestral</CardTitle>
          <CardDescription className="text-gray-400">Demanda promedio por trimestre</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quarters}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Confidence Levels */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Confianza del Pronóstico</CardTitle>
          <CardDescription className="text-gray-400">Nivel de confianza por mes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {displayData.map((month, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{month.month}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${month.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-300 w-12 text-right">{month.confidence}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-400" />
            Recomendaciones por Temporada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="font-semibold text-blue-400 mb-1">❄️ Temporada Baja (Q1-Q2)</p>
            <p className="text-sm text-gray-300">
              Aprovecha para entrenamientos, mantenimiento y preparación. Demanda baja permite mayor flexibilidad en recursos.
            </p>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded">
            <p className="font-semibold text-amber-400 mb-1">☀️ Temporada Alta (Q3-Q4)</p>
            <p className="text-sm text-gray-300">
              Incrementa personal, asegura inventario y prepara estrategias de retención. Noviembre y Diciembre son críticos.
            </p>
          </div>

          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
            <p className="font-semibold text-green-400 mb-1">📊 Estrategia Anual</p>
            <p className="text-sm text-gray-300">
              Planifica presupuesto considerando volatilidad de {volatility.toFixed(1)} puntos. Mantén buffer de 15-20% para picos inesperados.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
