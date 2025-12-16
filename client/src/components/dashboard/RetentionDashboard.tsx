import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, AlertTriangle, Target } from 'lucide-react';

interface RetentionDashboardProps {
  isLoading?: boolean;
}

export default function RetentionDashboard({ isLoading = false }: RetentionDashboardProps) {
  const retentionTrend = [
    { month: 'Ene', retention: 92, target: 95, voluntary: 8, involuntary: 0 },
    { month: 'Feb', retention: 91, target: 95, voluntary: 9, involuntary: 0 },
    { month: 'Mar', retention: 90, target: 95, voluntary: 10, involuntary: 0 },
    { month: 'Abr', retention: 88, target: 95, voluntary: 12, involuntary: 0 },
    { month: 'May', retention: 87, target: 95, voluntary: 13, involuntary: 0 },
    { month: 'Jun', retention: 85, target: 95, voluntary: 15, involuntary: 0 },
  ];

  const departmentRetention = [
    { dept: 'IT', retention: 94, churn: 6, debtAvg: 35000, costOfTurnover: 450000 },
    { dept: 'Ventas', retention: 78, churn: 22, debtAvg: 52000, costOfTurnover: 660000 },
    { dept: 'RRHH', retention: 96, churn: 4, debtAvg: 28000, costOfTurnover: 280000 },
    { dept: 'Finanzas', retention: 88, churn: 12, debtAvg: 42000, costOfTurnover: 504000 },
    { dept: 'Operaciones', retention: 82, churn: 18, debtAvg: 48000, costOfTurnover: 600000 },
  ];

  const costOfTurnover = [
    { cost: 'Reemplazo', amount: 75000, pct: 40 },
    { cost: 'Entrenamiento', amount: 45000, pct: 24 },
    { cost: 'Productividad', amount: 50000, pct: 27 },
    { cost: 'Otros', amount: 15000, pct: 9 },
  ];

  const totalCostOfTurnover = costOfTurnover.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-4">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Retención Actual</p>
                <p className="text-3xl font-bold text-white">85%</p>
                <p className="text-xs text-red-400 mt-1">-10% vs meta</p>
              </div>
              <Users className="h-10 w-10 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Rotación Anual</p>
                <p className="text-3xl font-bold text-white">15%</p>
                <p className="text-xs text-yellow-400 mt-1">150 empleados</p>
              </div>
              <TrendingUp className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Costo de Rotación</p>
                <p className="text-3xl font-bold text-white">$11.25M</p>
                <p className="text-xs text-red-400 mt-1">anual</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Potencial Ahorro</p>
                <p className="text-3xl font-bold text-green-400">$7.95M</p>
                <p className="text-xs text-green-400 mt-1">si retención = 92%</p>
              </div>
              <Target className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendencia de Retención */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Tendencia de Retención</CardTitle>
          <CardDescription>Retención actual vs meta (95%)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={retentionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Line type="monotone" dataKey="retention" stroke="#10b981" strokeWidth={2} name="Retención %" />
              <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Meta" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Retención por Departamento */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Retención por Departamento</CardTitle>
          <CardDescription>Análisis de rotación y costo de reemplazo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentRetention}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="dept" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Bar dataKey="retention" fill="#10b981" name="Retención %" />
              <Bar dataKey="churn" fill="#ef4444" name="Rotación %" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300">Departamento</th>
                  <th className="text-center py-3 px-4 text-gray-300">Retención</th>
                  <th className="text-center py-3 px-4 text-gray-300">Rotación</th>
                  <th className="text-center py-3 px-4 text-gray-300">Deuda Promedio</th>
                  <th className="text-center py-3 px-4 text-gray-300">Costo Rotación</th>
                </tr>
              </thead>
              <tbody>
                {departmentRetention.map((dept, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">{dept.dept}</td>
                    <td className={`text-center py-3 px-4 ${dept.retention > 90 ? 'text-green-400' : dept.retention > 85 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {dept.retention}%
                    </td>
                    <td className={`text-center py-3 px-4 ${dept.churn < 10 ? 'text-green-400' : dept.churn < 15 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {dept.churn}%
                    </td>
                    <td className="text-center py-3 px-4 text-gray-300">${(dept.debtAvg / 1000).toFixed(0)}k</td>
                    <td className="text-center py-3 px-4 text-red-400">${(dept.costOfTurnover / 1000000).toFixed(2)}M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Desglose de Costo de Rotación */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Costo de Rotación por Empleado</CardTitle>
          <CardDescription>Desglose de ${totalCostOfTurnover.toLocaleString()} por reemplazo</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costOfTurnover}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ cost, pct }) => `${cost}: ${pct}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {costOfTurnover.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#ef4444', '#f97316', '#eab308', '#84cc16'][index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {costOfTurnover.map((item, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{item.cost}</p>
                  <span className="text-sm font-bold text-gray-300">{item.pct}%</span>
                </div>
                <p className="text-lg font-bold text-white">${item.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights y Recomendaciones */}
      <Card className="border-0 shadow-lg bg-blue-500/10 border border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400">Insights Críticos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-300">
          <p>• Retención está 10% por debajo de meta - cada 1% de mejora = $750k ahorrados</p>
          <p>• Ventas tiene rotación 22% (vs 6% en IT) - investigar causas</p>
          <p>• Deuda promedio de 48k está correlacionada con rotación alta</p>
          <p>• Costo de productividad (27%) es el 2do mayor - mejorar onboarding</p>
          <p>• RRHH tiene mejor retención (96%) - estudiar mejores prácticas</p>
        </CardContent>
      </Card>
    </div>
  );
}
