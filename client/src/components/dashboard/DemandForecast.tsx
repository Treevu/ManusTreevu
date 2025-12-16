import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface ForecastData {
  week: string;
  actualDemand: number;
  forecastedDemand: number;
  confidence: number;
  factors: string[];
}

interface DemandForecastProps {
  data?: ForecastData[];
  isLoading?: boolean;
}

export default function DemandForecast({
  data,
  isLoading = false,
}: DemandForecastProps) {
  // Default forecast data
  const defaultData: ForecastData[] = [
    {
      week: 'Semana 1',
      actualDemand: 450,
      forecastedDemand: 420,
      confidence: 92,
      factors: ['Promoción activa', 'Clima favorable'],
    },
    {
      week: 'Semana 2',
      actualDemand: 520,
      forecastedDemand: 480,
      confidence: 88,
      factors: ['Fin de mes', 'Evento especial'],
    },
    {
      week: 'Semana 3',
      actualDemand: 380,
      forecastedDemand: 390,
      confidence: 85,
      factors: ['Competencia activa', 'Baja actividad'],
    },
    {
      week: 'Semana 4',
      actualDemand: 610,
      forecastedDemand: 600,
      confidence: 90,
      factors: ['Promoción fin de mes', 'Pago de nómina'],
    },
    {
      week: 'Semana 5 (Pronóstico)',
      actualDemand: 0,
      forecastedDemand: 520,
      confidence: 82,
      factors: ['Tendencia histórica', 'Eventos programados'],
    },
    {
      week: 'Semana 6 (Pronóstico)',
      actualDemand: 0,
      forecastedDemand: 480,
      confidence: 78,
      factors: ['Estacionalidad', 'Competencia'],
    },
  ];

  const displayData = data || defaultData;

  // Calculate statistics
  const avgActualDemand = displayData
    .filter(d => d.actualDemand > 0)
    .reduce((sum, d) => sum + d.actualDemand, 0) / displayData.filter(d => d.actualDemand > 0).length;

  const avgForecastedDemand = displayData.reduce((sum, d) => sum + d.forecastedDemand, 0) / displayData.length;

  const avgConfidence = displayData.reduce((sum, d) => sum + d.confidence, 0) / displayData.length;

  const peakWeek = displayData.reduce((max, d) => (d.forecastedDemand > max.forecastedDemand ? d : max));

  // Prepare data for charts
  const chartData = displayData.map(d => ({
    week: d.week,
    actual: d.actualDemand,
    forecast: d.forecastedDemand,
  }));

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">Cargando pronóstico...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-400">Demanda Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{avgActualDemand.toFixed(0)}</div>
            <p className="text-xs text-gray-400 mt-1">Histórico (últimas 4 semanas)</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-400">Pronóstico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{avgForecastedDemand.toFixed(0)}</div>
            <p className="text-xs text-gray-400 mt-1">Promedio próximas 6 semanas</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-400">Confianza</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{avgConfidence.toFixed(0)}%</div>
            <p className="text-xs text-gray-400 mt-1">Promedio de precisión</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-amber-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-amber-400">Pico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-400">{peakWeek.forecastedDemand.toFixed(0)}</div>
            <p className="text-xs text-gray-400 mt-1">{peakWeek.week}</p>
          </CardContent>
        </Card>
      </div>

      {/* Demand Forecast Chart */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Demanda Histórica vs Pronóstico</CardTitle>
          <CardDescription className="text-gray-400">Últimas 4 semanas + pronóstico 2 semanas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={80} />
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
              <Area type="monotone" dataKey="actual" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActual)" name="Demanda Real" />
              <Area type="monotone" dataKey="forecast" stroke="#22c55e" fillOpacity={1} fill="url(#colorForecast)" name="Pronóstico" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Confidence Levels */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Nivel de Confianza del Pronóstico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {displayData.map((forecast, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{forecast.week}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${forecast.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-300 w-12 text-right">{forecast.confidence}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Factors Analysis */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Factores que Influyen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayData.slice(0, 4).map((forecast, idx) => (
            <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <h4 className="font-semibold text-white mb-2">{forecast.week}</h4>
              <div className="flex flex-wrap gap-2">
                {forecast.factors.map((factor, fidx) => (
                  <Badge key={fidx} className="bg-blue-500/20 text-blue-400 border-transparent text-xs">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Recomendaciones de Inventario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
            <p className="font-semibold text-green-400 mb-1">📦 Stock Recomendado</p>
            <p className="text-sm text-gray-300">
              Mantén inventario de {(avgForecastedDemand * 1.2).toFixed(0)} unidades para cubrir picos sin exceso de stock.
            </p>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded">
            <p className="font-semibold text-amber-400 mb-1">⚠ Semana de Pico</p>
            <p className="text-sm text-gray-300">
              La {peakWeek.week} tendrá demanda de {peakWeek.forecastedDemand.toFixed(0)} unidades. Prepara personal y stock adicional.
            </p>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="font-semibold text-blue-400 mb-1">💡 Estrategia</p>
            <p className="text-sm text-gray-300">
              Aprovecha semanas de baja demanda para promociones y limpiar inventario antiguo. Mantén ofertas atractivas para mantener demanda.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
