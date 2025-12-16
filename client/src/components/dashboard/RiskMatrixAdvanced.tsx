import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RiskMatrixAdvancedProps {
  isLoading?: boolean;
}

export default function RiskMatrixAdvanced({ isLoading = false }: RiskMatrixAdvancedProps) {
  const clusterData = [
    { x: 25, y: 2, cluster: 'A', size: 45 },
    { x: 40, y: 5, cluster: 'B', size: 120 },
    { x: 60, y: 8, cluster: 'C', size: 280 },
    { x: 77, y: 12, cluster: 'D', size: 320 },
    { x: 90, y: 15, cluster: 'E', size: 235 },
  ];

  const quadrantStats = [
    { name: 'Crítico', fwi: '<30', tenure: '<2', employees: 45, avgSalary: 45000, color: '#ef4444' },
    { name: 'Alto Riesgo', fwi: '30-50', tenure: '2-5', employees: 120, avgSalary: 55000, color: '#f97316' },
    { name: 'Moderado', fwi: '50-70', tenure: '5-10', employees: 280, avgSalary: 65000, color: '#eab308' },
    { name: 'Bajo Riesgo', fwi: '70-85', tenure: '>10', employees: 320, avgSalary: 75000, color: '#84cc16' },
  ];

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Matriz de Riesgo Avanzada</CardTitle>
          <CardDescription>Clustering automático y análisis de densidad</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" dataKey="x" name="FWI Score" stroke="#999" />
              <YAxis type="number" dataKey="y" name="Rotación %" stroke="#999" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Scatter name="Clusters" data={clusterData} fill="#10b981" />
            </ScatterChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded border border-white/10">
              <p className="text-sm font-medium text-white mb-2">Análisis de Cuadrantes</p>
              <div className="space-y-1 text-xs text-gray-400">
                <p>• Cuadrante 1 (Crítico): 45 empleados</p>
                <p>• Cuadrante 2 (Alto): 120 empleados</p>
                <p>• Cuadrante 3 (Moderado): 280 empleados</p>
                <p>• Cuadrante 4 (Bajo): 320 empleados</p>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded border border-white/10">
              <p className="text-sm font-medium text-white mb-2">Densidad de Riesgo</p>
              <div className="space-y-1 text-xs text-gray-400">
                <p>• Máxima concentración: Cuadrante 4</p>
                <p>• Mínima concentración: Cuadrante 1</p>
                <p>• Tendencia: Hacia riesgo bajo</p>
                <p>• Volatilidad: Moderada</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Cuadrantes */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Estadísticas por Cuadrante</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300">Cuadrante</th>
                  <th className="text-center py-3 px-4 text-gray-300">FWI</th>
                  <th className="text-center py-3 px-4 text-gray-300">Antigüedad</th>
                  <th className="text-center py-3 px-4 text-gray-300">Empleados</th>
                  <th className="text-center py-3 px-4 text-gray-300">Salario Promedio</th>
                </tr>
              </thead>
              <tbody>
                {quadrantStats.map((quad, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: quad.color }} />
                        <span className="text-white">{quad.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 text-gray-300">{quad.fwi}</td>
                    <td className="text-center py-3 px-4 text-gray-300">{quad.tenure}</td>
                    <td className="text-center py-3 px-4 text-gray-300">{quad.employees}</td>
                    <td className="text-center py-3 px-4 text-gray-300">${quad.avgSalary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
