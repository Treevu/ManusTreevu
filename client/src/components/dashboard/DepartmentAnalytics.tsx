import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DepartmentAnalyticsProps {
  isLoading?: boolean;
}

export default function DepartmentAnalytics({ isLoading = false }: DepartmentAnalyticsProps) {
  const departmentData = [
    { dept: 'IT', employees: 150, avgFWI: 68, churn: 8, satisfaction: 82, performance: 88 },
    { dept: 'Ventas', employees: 200, avgFWI: 52, churn: 15, satisfaction: 65, performance: 75 },
    { dept: 'RRHH', employees: 80, avgFWI: 72, churn: 5, satisfaction: 88, performance: 92 },
    { dept: 'Finanzas', employees: 120, avgFWI: 58, churn: 12, satisfaction: 70, performance: 85 },
    { dept: 'Operaciones', employees: 250, avgFWI: 55, churn: 14, satisfaction: 68, performance: 78 },
  ];

  const variabilityData = [
    { dept: 'IT', stdDev: 12, cv: 17.6, disparity: 'Baja' },
    { dept: 'Ventas', stdDev: 18, cv: 34.6, disparity: 'Alta' },
    { dept: 'RRHH', stdDev: 10, cv: 13.9, disparity: 'Muy Baja' },
    { dept: 'Finanzas', stdDev: 15, cv: 25.9, disparity: 'Moderada' },
    { dept: 'Operaciones', stdDev: 16, cv: 29.1, disparity: 'Alta' },
  ];

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Análisis por Departamento</CardTitle>
          <CardDescription>Comparación de métricas clave</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="dept" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Bar dataKey="avgFWI" fill="#10b981" name="FWI Promedio" />
              <Bar dataKey="churn" fill="#ef4444" name="Rotación %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabla de Departamentos */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Métricas Detalladas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300">Departamento</th>
                  <th className="text-center py-3 px-4 text-gray-300">Empleados</th>
                  <th className="text-center py-3 px-4 text-gray-300">FWI</th>
                  <th className="text-center py-3 px-4 text-gray-300">Rotación</th>
                  <th className="text-center py-3 px-4 text-gray-300">Satisfacción</th>
                  <th className="text-center py-3 px-4 text-gray-300">Desempeño</th>
                </tr>
              </thead>
              <tbody>
                {departmentData.map((dept, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">{dept.dept}</td>
                    <td className="text-center py-3 px-4 text-gray-300">{dept.employees}</td>
                    <td className="text-center py-3 px-4 text-green-400">{dept.avgFWI}</td>
                    <td className={`text-center py-3 px-4 ${dept.churn > 12 ? 'text-red-400' : 'text-yellow-400'}`}>{dept.churn}%</td>
                    <td className="text-center py-3 px-4 text-blue-400">{dept.satisfaction}%</td>
                    <td className="text-center py-3 px-4 text-purple-400">{dept.performance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Análisis de Variabilidad */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Análisis de Variabilidad</CardTitle>
          <CardDescription>Disparidad interna por departamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {variabilityData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded">
                <div>
                  <p className="font-medium text-white">{item.dept}</p>
                  <p className="text-xs text-gray-400">Coef. Variación: {item.cv}%</p>
                </div>
                <span className={`text-sm font-bold px-3 py-1 rounded ${
                  item.disparity === 'Muy Baja' ? 'bg-green-500/20 text-green-400' :
                  item.disparity === 'Baja' ? 'bg-blue-500/20 text-blue-400' :
                  item.disparity === 'Moderada' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {item.disparity}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
