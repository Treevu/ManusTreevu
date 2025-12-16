import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CorrelationAdvancedProps {
  isLoading?: boolean;
}

export default function CorrelationAdvanced({ isLoading = false }: CorrelationAdvancedProps) {
  const correlationData = [
    { fwi: 25, performance: 35, employees: 45 },
    { fwi: 40, performance: 48, employees: 120 },
    { fwi: 60, performance: 68, employees: 280 },
    { fwi: 77, performance: 82, employees: 320 },
    { fwi: 90, performance: 95, employees: 235 },
  ];

  const correlationMatrix = [
    { var1: 'FWI Score', var2: 'Desempeño', correlation: 0.89, pValue: '<0.001', interpretation: 'Muy Fuerte' },
    { var1: 'FWI Score', var2: 'Rotación', correlation: -0.76, pValue: '<0.001', interpretation: 'Fuerte Negativa' },
    { var1: 'Deuda', var2: 'Estrés', correlation: 0.82, pValue: '<0.001', interpretation: 'Fuerte' },
    { var1: 'Ahorros', var2: 'Confianza', correlation: 0.71, pValue: '<0.01', interpretation: 'Moderada' },
    { var1: 'Ingresos', var2: 'Gastos', correlation: 0.45, pValue: '<0.05', interpretation: 'Débil' },
  ];

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Análisis de Correlación Avanzado</CardTitle>
          <CardDescription>Relación entre FWI Score y desempeño laboral</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" dataKey="fwi" name="FWI Score" stroke="#999" />
              <YAxis type="number" dataKey="performance" name="Desempeño %" stroke="#999" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Scatter name="Empleados" data={correlationData} fill="#10b981" />
            </ScatterChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded">
            <p className="text-sm text-blue-300">
              <strong>Interpretación:</strong> Existe una correlación muy fuerte (r=0.89) entre FWI Score y desempeño laboral. Por cada 10 puntos de aumento en FWI, el desempeño mejora aproximadamente 11%.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Matriz de Correlaciones */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Matriz de Correlaciones</CardTitle>
          <CardDescription>Análisis de relaciones entre variables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300">Variable 1</th>
                  <th className="text-left py-3 px-4 text-gray-300">Variable 2</th>
                  <th className="text-center py-3 px-4 text-gray-300">Correlación</th>
                  <th className="text-center py-3 px-4 text-gray-300">P-Value</th>
                  <th className="text-center py-3 px-4 text-gray-300">Interpretación</th>
                </tr>
              </thead>
              <tbody>
                {correlationMatrix.map((item, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white">{item.var1}</td>
                    <td className="py-3 px-4 text-white">{item.var2}</td>
                    <td className={`text-center py-3 px-4 font-medium ${item.correlation > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.correlation.toFixed(2)}
                    </td>
                    <td className="text-center py-3 px-4 text-gray-300">{item.pValue}</td>
                    <td className="text-center py-3 px-4 text-blue-400">{item.interpretation}</td>
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
