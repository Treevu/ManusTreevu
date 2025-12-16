import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface TrendData {
  month: string;
  fwiScore: number;
  risk: number;
  rotation: number;
  ewa: number;
  engagement: number;
  fwiVolatility?: number;
  fwiProjection?: number;
  fwiConfidenceUpper?: number;
  fwiConfidenceLower?: number;
}

interface AdvancedTrendAnalysisProps {
  isLoading?: boolean;
}

export default function AdvancedTrendAnalysis({ isLoading = false }: AdvancedTrendAnalysisProps) {
  const [selectedMetric, setSelectedMetric] = useState<'fwi' | 'risk' | 'rotation' | 'ewa' | 'engagement'>('fwi');
  
  // Map fwi to fwiScore for data access
  const getDataKey = (metric: string) => metric === 'fwi' ? 'fwiScore' : metric;

  // Mock data with advanced analytics
  const trendData: TrendData[] = [
    { month: 'Ene', fwiScore: 62, risk: 45, rotation: 12, ewa: 68, engagement: 72, fwiVolatility: 3.2, fwiProjection: 62 },
    { month: 'Feb', fwiScore: 61, risk: 48, rotation: 14, ewa: 70, engagement: 74, fwiVolatility: 3.5, fwiProjection: 61.2 },
    { month: 'Mar', fwiScore: 59, risk: 52, rotation: 16, ewa: 65, engagement: 70, fwiVolatility: 4.1, fwiProjection: 60.1 },
    { month: 'Abr', fwiScore: 58, risk: 55, rotation: 18, ewa: 62, engagement: 68, fwiVolatility: 4.8, fwiProjection: 58.9 },
    { month: 'May', fwiScore: 56, risk: 58, rotation: 20, ewa: 60, engagement: 65, fwiVolatility: 5.2, fwiProjection: 57.5 },
    { month: 'Jun', fwiScore: 54, risk: 62, rotation: 22, ewa: 58, engagement: 62, fwiVolatility: 5.5, fwiProjection: 55.8 },
    { month: 'Jul', fwiScore: 52, risk: 65, rotation: 24, ewa: 55, engagement: 60, fwiVolatility: 5.8, fwiProjection: 53.9 },
    { month: 'Ago', fwiScore: 50, risk: 68, rotation: 26, ewa: 52, engagement: 58, fwiVolatility: 6.1, fwiProjection: 51.7 },
    { month: 'Sep', fwiScore: 48, risk: 70, rotation: 28, ewa: 50, engagement: 56, fwiVolatility: 6.3, fwiProjection: 49.2 },
    { month: 'Oct', fwiScore: 46, risk: 72, rotation: 30, ewa: 48, engagement: 54, fwiVolatility: 6.5, fwiProjection: 46.4 },
    { month: 'Nov', fwiScore: 44, risk: 74, rotation: 32, ewa: 46, engagement: 52, fwiVolatility: 6.7, fwiProjection: 43.3 },
    { month: 'Dic', fwiScore: 42, risk: 76, rotation: 34, ewa: 44, engagement: 50, fwiVolatility: 6.9, fwiProjection: 40.0 },
  ];

  // Calcular estadísticas
  const calculateStats = (data: TrendData[], metric: keyof Omit<TrendData, 'month' | 'fwiVolatility' | 'fwiProjection' | 'fwiConfidenceUpper' | 'fwiConfidenceLower'>) => {
    const values = data.map(d => d[metric] as number);
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2)) / values.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / mean) * 100; // Coeficiente de variación
    const trend = values[values.length - 1] - values[0];
    const trendPercent = (trend / values[0]) * 100;

    return { mean: mean.toFixed(2), stdDev: stdDev.toFixed(2), cv: cv.toFixed(1), trend: trend.toFixed(2), trendPercent: trendPercent.toFixed(1) };
  };

  const stats = calculateStats(trendData, getDataKey(selectedMetric) as any);

  // Detectar anomalías (Z-score > 2)
  const detectAnomalies = (data: TrendData[], metric: keyof Omit<TrendData, 'month' | 'fwiVolatility' | 'fwiProjection' | 'fwiConfidenceUpper' | 'fwiConfidenceLower'>) => {
    const values = data.map(d => d[metric] as number);
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2)) / values.length;
    const stdDev = Math.sqrt(variance);

    return data.map((d, i) => {
      const zScore = Math.abs((values[i] - mean) / stdDev);
      return { month: d.month, isAnomaly: zScore > 2, zScore: zScore.toFixed(2) };
    }).filter(a => a.isAnomaly);
  };

  const anomalies = detectAnomalies(trendData, getDataKey(selectedMetric) as any);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="volatility">Volatilidad</TabsTrigger>
          <TabsTrigger value="projection">Proyección</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalías</TabsTrigger>
        </TabsList>

        {/* Tendencias Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Análisis de Tendencias</CardTitle>
              <CardDescription>Evolución de métricas con estadísticas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                {(['fwi', 'risk', 'rotation', 'ewa', 'engagement'] as const).map(metric => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      selectedMetric === metric
                        ? 'bg-brand-primary text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {metric.toUpperCase()}
                  </button>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                  <Line
                    type="monotone"
                    dataKey={getDataKey(selectedMetric)}
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-5 gap-4 mt-6">
                <div className="bg-white/5 p-3 rounded border border-white/10">
                  <p className="text-xs text-gray-400">Promedio</p>
                  <p className="text-lg font-bold text-white">{stats.mean}</p>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/10">
                  <p className="text-xs text-gray-400">Desv. Estándar</p>
                  <p className="text-lg font-bold text-white">{stats.stdDev}</p>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/10">
                  <p className="text-xs text-gray-400">Coef. Variación</p>
                  <p className="text-lg font-bold text-white">{stats.cv}%</p>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/10">
                  <p className="text-xs text-gray-400">Cambio Total</p>
                  <p className={`text-lg font-bold ${parseFloat(stats.trend) < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {stats.trend}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/10">
                  <p className="text-xs text-gray-400">% Cambio</p>
                  <p className={`text-lg font-bold ${parseFloat(stats.trendPercent) < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {stats.trendPercent}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volatilidad Tab */}
        <TabsContent value="volatility" className="space-y-4">
          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Análisis de Volatilidad</CardTitle>
              <CardDescription>Desviación estándar móvil (3 meses)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                  <Area
                    type="monotone"
                    dataKey="fwiVolatility"
                    fill="#f59e0b"
                    stroke="#f59e0b"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded">
                <p className="text-sm text-yellow-400">
                  <strong>Interpretación:</strong> La volatilidad está aumentando, indicando mayor variabilidad en FWI Score. Esto sugiere inconsistencia en el bienestar financiero de los empleados.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Proyección Tab */}
        <TabsContent value="projection" className="space-y-4">
          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Proyección Futura (6 meses)</CardTitle>
              <CardDescription>Regresión lineal con intervalo de confianza 95%</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="fwiScore"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="FWI Actual"
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="fwiProjection"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Proyección"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded">
                <p className="text-sm text-blue-400">
                  <strong>Proyección:</strong> Si la tendencia continúa, FWI Score alcanzará 35-40 en 6 meses. Se recomienda implementar intervenciones inmediatamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anomalías Tab */}
        <TabsContent value="anomalies" className="space-y-4">
          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Detección de Anomalías</CardTitle>
              <CardDescription>Z-score mayor a 2 (desviaciones significativas)</CardDescription>
            </CardHeader>
            <CardContent>
              {anomalies.length > 0 ? (
                <div className="space-y-2">
                  {anomalies.map((anomaly, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{anomaly.month}</p>
                        <p className="text-xs text-gray-400">Z-score: {anomaly.zScore}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No se detectaron anomalías significativas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
