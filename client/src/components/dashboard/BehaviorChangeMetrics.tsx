import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

interface BehaviorChangeMetricsProps {
  isLoading?: boolean;
}

export default function BehaviorChangeMetrics({ isLoading = false }: BehaviorChangeMetricsProps) {
  const behaviorTrend = [
    { month: 'Ene', usedDispersion: 35, usedDebt: 65, avgSavings: 0 },
    { month: 'Feb', usedDispersion: 42, usedDebt: 58, avgSavings: 450 },
    { month: 'Mar', usedDispersion: 50, usedDebt: 50, avgSavings: 750 },
    { month: 'Abr', usedDispersion: 58, usedDebt: 42, avgSavings: 1200 },
    { month: 'May', usedDispersion: 65, usedDebt: 35, avgSavings: 1650 },
    { month: 'Jun', usedDispersion: 72, usedDebt: 28, avgSavings: 2100 },
  ];

  const employeeSegments = [
    { name: 'Adopters (Dispersión)', value: 720, color: '#10b981' },
    { name: 'Transitioning', value: 180, color: '#3b82f6' },
    { name: 'Still Using Debt', value: 100, color: '#ef4444' },
  ];

  const savingsImpact = [
    { role: 'Especialista IT', employees: 150, avgSavings: 2500, totalSavings: 375000 },
    { role: 'Gerente Ventas', employees: 80, avgSavings: 2200, totalSavings: 176000 },
    { role: 'Analista Senior', employees: 120, avgSavings: 2100, totalSavings: 252000 },
    { role: 'Desarrollador', employees: 250, avgSavings: 1800, totalSavings: 450000 },
    { role: 'Coordinador', employees: 200, avgSavings: 1500, totalSavings: 300000 },
  ];

  const totalEmployees = 1000;
  const adoptionRate = 72;
  const totalSavings = savingsImpact.reduce((sum, item) => sum + item.totalSavings, 0);
  const avgSavingsPerEmployee = totalSavings / totalEmployees;

  return (
    <div className="space-y-4">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-green-500/10 border border-green-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Tasa de Adopción</p>
                <p className="text-3xl font-bold text-green-400">{adoptionRate}%</p>
                <p className="text-xs text-green-300 mt-1">usando dispersión</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-blue-500/10 border border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ahorros Totales</p>
                <p className="text-3xl font-bold text-blue-400">${(totalSavings / 1000).toFixed(0)}k</p>
                <p className="text-xs text-blue-300 mt-1">en intereses evitados</p>
              </div>
              <DollarSign className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-purple-500/10 border border-purple-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Promedio por Empleado</p>
                <p className="text-3xl font-bold text-purple-400">${avgSavingsPerEmployee.toFixed(0)}</p>
                <p className="text-xs text-purple-300 mt-1">ahorrado este semestre</p>
              </div>
              <Users className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-orange-500/10 border border-orange-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Empleados Beneficiados</p>
                <p className="text-3xl font-bold text-orange-400">{(totalEmployees * adoptionRate / 100).toFixed(0)}</p>
                <p className="text-xs text-orange-300 mt-1">de {totalEmployees}</p>
              </div>
              <Users className="h-10 w-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendencia de Cambio de Comportamiento */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Cambio de Comportamiento: Dispersión vs Deuda</CardTitle>
          <CardDescription>Porcentaje de empleados usando dispersión vs deuda cada mes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={behaviorTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Line type="monotone" dataKey="usedDispersion" stroke="#10b981" strokeWidth={2} name="Usando Dispersión %" />
              <Line type="monotone" dataKey="usedDebt" stroke="#ef4444" strokeWidth={2} name="Usando Deuda %" />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded">
            <p className="text-sm text-green-300">
              <strong>Impacto:</strong> En 6 meses, mejoraste el comportamiento de 35% a 72% usando dispersión. ¡Excelente progreso!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Segmentación de Empleados */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Segmentación de Empleados</CardTitle>
          <CardDescription>Clasificación por comportamiento de dispersión vs deuda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={employeeSegments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {employeeSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {employeeSegments.map((segment, idx) => (
                <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                      <p className="font-medium text-white">{segment.name}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-300">{segment.value}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {((segment.value / 1000) * 100).toFixed(0)}% de la fuerza laboral
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ahorros por Rol */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Ahorros Generados por Rol</CardTitle>
          <CardDescription>Impacto total de dispersión en cada categoría de empleados</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={savingsImpact}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="role" stroke="#999" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Bar dataKey="totalSavings" fill="#10b981" name="Ahorros Totales ($)" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-3">
            {savingsImpact.map((item, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{item.role}</p>
                  <span className="text-sm px-3 py-1 bg-green-500/20 text-green-400 rounded font-bold">
                    ${(item.totalSavings / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Empleados</p>
                    <p className="font-bold text-gray-300">{item.employees}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Promedio</p>
                    <p className="font-bold text-green-400">${item.avgSavings}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="font-bold text-green-400">${(item.totalSavings / 1000).toFixed(0)}k</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendaciones Estratégicas */}
      <Card className="border-0 shadow-lg bg-blue-500/10 border border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400">Recomendaciones Estratégicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-300">
          <p>✓ Mantén el momentum: 72% de adopción es excelente, objetivo: 85%</p>
          <p>✓ Enfócate en los 100 empleados que aún usan deuda - ofrece educación personalizada</p>
          <p>✓ Reconoce a los Adopters: han generado ${(totalSavings / 1000).toFixed(0)}k en ahorros</p>
          <p>✓ Proyección anual: Si mantienes 72% adopción, ahorrarás ${(totalSavings * 2 / 1000).toFixed(0)}k</p>
          <p>✓ Impacto en retención: Empleados que usan dispersión tienen 40% menos rotación</p>
        </CardContent>
      </Card>
    </div>
  );
}
