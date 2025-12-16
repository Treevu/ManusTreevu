import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InterventionOptimizationProps {
  isLoading?: boolean;
}

export default function InterventionOptimization({ isLoading = false }: InterventionOptimizationProps) {
  const effectivenessData = [
    { type: 'Asesoría', success: 78, cost: 500, roi: 320, employees: 150 },
    { type: 'Educación', success: 65, cost: 300, roi: 195, employees: 200 },
    { type: 'Subsidio', success: 82, cost: 1000, roi: 410, employees: 100 },
    { type: 'Coaching', success: 88, cost: 800, roi: 440, employees: 80 },
    { type: 'Beneficios', success: 72, cost: 600, roi: 216, employees: 120 },
  ];

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Optimización de Intervenciones</CardTitle>
          <CardDescription>Análisis de efectividad y ROI por tipo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={effectivenessData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="type" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Bar dataKey="success" fill="#10b981" name="Tasa Éxito %" />
              <Bar dataKey="roi" fill="#3b82f6" name="ROI %" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded border border-white/10">
              <p className="text-sm font-medium text-white mb-3">Mejor ROI</p>
              <p className="text-2xl font-bold text-green-400">Coaching</p>
              <p className="text-xs text-gray-400 mt-1">440% ROI, 88% éxito</p>
            </div>
            <div className="bg-white/5 p-4 rounded border border-white/10">
              <p className="text-sm font-medium text-white mb-3">Más Económico</p>
              <p className="text-2xl font-bold text-blue-400">Educación</p>
              <p className="text-xs text-gray-400 mt-1">$300 costo, 65% éxito</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Análisis Detallado */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Análisis Detallado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300">Tipo</th>
                  <th className="text-center py-3 px-4 text-gray-300">Éxito</th>
                  <th className="text-center py-3 px-4 text-gray-300">Costo</th>
                  <th className="text-center py-3 px-4 text-gray-300">ROI</th>
                  <th className="text-center py-3 px-4 text-gray-300">Empleados</th>
                </tr>
              </thead>
              <tbody>
                {effectivenessData.map((item, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white">{item.type}</td>
                    <td className="text-center py-3 px-4 text-green-400">{item.success}%</td>
                    <td className="text-center py-3 px-4 text-gray-300">${item.cost}</td>
                    <td className="text-center py-3 px-4 text-blue-400">{item.roi}%</td>
                    <td className="text-center py-3 px-4 text-gray-300">{item.employees}</td>
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
