import { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, AreaChart
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, BarChart3, Users, AlertTriangle, Zap } from 'lucide-react';

interface MonthlyTrendsChartProps {
  data?: any[];
}

// Mock data for 12 months
const generateMockData = () => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return months.map((month, idx) => ({
    month,
    fwiScore: 65 + Math.random() * 20 - (idx % 3) * 2,
    riskEmployees: Math.floor(15 + Math.random() * 20 + (idx % 4) * 2),
    churnRate: 5 + Math.random() * 8 - (idx % 5) * 0.5,
    ewaRequests: 50 + Math.random() * 100 + (idx % 3) * 10,
    avgEngagement: 60 + Math.random() * 25 - (idx % 4) * 3,
  }));
};

export default function MonthlyTrendsChart({ data }: MonthlyTrendsChartProps) {
  const chartData = useMemo(() => {
    return data || generateMockData();
  }, [data]);

  return (
    <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10 col-span-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center text-white">
          <BarChart3 className="h-5 w-5 mr-2 text-brand-primary" />
          Tendencias Mensuales
        </CardTitle>
        <CardDescription className="text-gray-400">
          Análisis de métricas clave durante los últimos 12 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fwi" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full bg-treevu-surface/50 border border-white/10">
            <TabsTrigger value="fwi" className="text-xs">FWI Score</TabsTrigger>
            <TabsTrigger value="risk" className="text-xs">Riesgo</TabsTrigger>
            <TabsTrigger value="churn" className="text-xs">Rotación</TabsTrigger>
            <TabsTrigger value="ewa" className="text-xs">EWA</TabsTrigger>
            <TabsTrigger value="engagement" className="text-xs">Engagement</TabsTrigger>
          </TabsList>

          {/* FWI Score Trend */}
          <TabsContent value="fwi" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Promedio Actual</p>
                    <p className="text-2xl font-bold text-white">{chartData[chartData.length - 1]?.fwiScore.toFixed(1) || 0}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Máximo</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.max(...chartData.map(d => d.fwiScore)).toFixed(1)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Mínimo</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.min(...chartData.map(d => d.fwiScore)).toFixed(1)}
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFwi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="fwiScore"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorFwi)"
                  name="FWI Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          {/* Risk Employees Trend */}
          <TabsContent value="risk" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Actual</p>
                    <p className="text-2xl font-bold text-white">{chartData[chartData.length - 1]?.riskEmployees || 0}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Promedio</p>
                    <p className="text-2xl font-bold text-white">
                      {(chartData.reduce((sum, d) => sum + d.riskEmployees, 0) / chartData.length).toFixed(0)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Tendencia</p>
                    <p className="text-2xl font-bold text-white">
                      {chartData[chartData.length - 1]?.riskEmployees > chartData[0]?.riskEmployees ? '↑' : '↓'}
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
                <Bar dataKey="riskEmployees" fill="#ef4444" name="Empleados en Riesgo" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          {/* Churn Rate Trend */}
          <TabsContent value="churn" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Tasa Actual</p>
                    <p className="text-2xl font-bold text-white">{chartData[chartData.length - 1]?.churnRate.toFixed(1) || 0}%</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Máxima</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.max(...chartData.map(d => d.churnRate)).toFixed(1)}%
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Meta</p>
                    <p className="text-2xl font-bold text-white">5.0%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="churnRate" stroke="#f59e0b" name="Tasa de Rotación %" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          {/* EWA Requests Trend */}
          <TabsContent value="ewa" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Solicitudes Actuales</p>
                    <p className="text-2xl font-bold text-white">{chartData[chartData.length - 1]?.ewaRequests.toFixed(0) || 0}</p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Anual</p>
                    <p className="text-2xl font-bold text-white">
                      {chartData.reduce((sum, d) => sum + d.ewaRequests, 0).toFixed(0)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Promedio Mensual</p>
                    <p className="text-2xl font-bold text-white">
                      {(chartData.reduce((sum, d) => sum + d.ewaRequests, 0) / chartData.length).toFixed(0)}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
                <Legend />
                <Bar dataKey="ewaRequests" fill="#a855f7" name="Solicitudes EWA" />
                <Line type="monotone" dataKey="ewaRequests" stroke="#a855f7" name="Tendencia" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </TabsContent>

          {/* Engagement Trend */}
          <TabsContent value="engagement" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Engagement Actual</p>
                    <p className="text-2xl font-bold text-white">{chartData[chartData.length - 1]?.avgEngagement.toFixed(1) || 0}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Promedio Anual</p>
                    <p className="text-2xl font-bold text-white">
                      {(chartData.reduce((sum, d) => sum + d.avgEngagement, 0) / chartData.length).toFixed(1)}%
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Meta</p>
                    <p className="text-2xl font-bold text-white">85%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgEngagement"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorEngagement)"
                  name="Engagement %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
