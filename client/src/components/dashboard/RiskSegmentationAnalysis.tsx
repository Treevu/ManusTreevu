import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { AlertTriangle, TrendingDown } from 'lucide-react';

interface RiskSegmentationAnalysisProps {
  isLoading?: boolean;
}

export default function RiskSegmentationAnalysis({ isLoading = false }: RiskSegmentationAnalysisProps) {
  const riskSegmentation = [
    { name: 'Crítico (FWI < 30)', value: 45, color: '#ef4444', employees: 45, avgFWI: 25, avgSalary: 45000 },
    { name: 'Alto (30-50)', value: 120, color: '#f97316', employees: 120, avgFWI: 40, avgSalary: 55000 },
    { name: 'Medio (50-70)', value: 280, color: '#eab308', employees: 280, avgFWI: 60, avgSalary: 65000 },
    { name: 'Bajo (70-85)', value: 320, color: '#84cc16', employees: 320, avgFWI: 77, avgSalary: 75000 },
    { name: 'Excelente (>85)', value: 235, color: '#10b981', employees: 235, avgFWI: 90, avgSalary: 85000 },
  ];

  const causesData = [
    { cause: 'Deuda Alta', impact: 35, employees: 120 },
    { cause: 'Gastos Excesivos', impact: 28, employees: 95 },
    { cause: 'Ingresos Bajos', impact: 22, employees: 75 },
    { cause: 'Falta Ahorros', impact: 15, employees: 50 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Distribución por Nivel de Riesgo */}
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Distribución por Nivel de Riesgo</CardTitle>
            <CardDescription>Segmentación de empleados</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskSegmentation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskSegmentation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Causas Principales de Riesgo */}
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Top 4 Causas de Riesgo</CardTitle>
            <CardDescription>Factores que más impactan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={causesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="cause" stroke="#999" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#999" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                <Bar dataKey="impact" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Segmentación Detallada */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Análisis Detallado por Segmento</CardTitle>
          <CardDescription>Métricas agregadas por nivel de riesgo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300">Segmento</th>
                  <th className="text-center py-3 px-4 text-gray-300">Empleados</th>
                  <th className="text-center py-3 px-4 text-gray-300">FWI Promedio</th>
                  <th className="text-center py-3 px-4 text-gray-300">Salario Promedio</th>
                  <th className="text-center py-3 px-4 text-gray-300">% del Total</th>
                </tr>
              </thead>
              <tbody>
                {riskSegmentation.map((segment, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                        <span className="text-white">{segment.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 text-gray-300">{segment.employees}</td>
                    <td className="text-center py-3 px-4 text-gray-300">{segment.avgFWI}</td>
                    <td className="text-center py-3 px-4 text-gray-300">${segment.avgSalary.toLocaleString()}</td>
                    <td className="text-center py-3 px-4 text-gray-300">{((segment.employees / 1000) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-0 shadow-lg bg-red-500/10 border border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Insights Críticos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-red-300">
          <p>• 165 empleados (16.5%) están en riesgo crítico o alto</p>
          <p>• La deuda alta es el factor más impactante (35% del riesgo)</p>
          <p>• Los empleados en riesgo crítico ganan 40% menos que el promedio</p>
          <p>• Se recomienda intervención inmediata en segmento crítico</p>
        </CardContent>
      </Card>
    </div>
  );
}
