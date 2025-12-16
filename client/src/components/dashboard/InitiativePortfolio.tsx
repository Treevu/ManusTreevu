import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InitiativePortfolioProps {
  isLoading?: boolean;
}

export default function InitiativePortfolio({ isLoading = false }: InitiativePortfolioProps) {
  const initiativeData = [
    { name: 'Educación Financiera', impact: 35, cost: 50, status: 'En Progreso', employees: 250 },
    { name: 'Programa de Ahorros', impact: 28, cost: 40, status: 'Activo', employees: 180 },
    { name: 'Asesoría Personalizada', impact: 42, cost: 80, status: 'Piloto', employees: 50 },
    { name: 'Subsidio de Salud', impact: 25, cost: 60, status: 'Activo', employees: 300 },
    { name: 'Coaching Financiero', impact: 38, cost: 70, status: 'En Progreso', employees: 80 },
  ];

  const statusColors = {
    'Activo': '#10b981',
    'En Progreso': '#f59e0b',
    'Piloto': '#3b82f6',
    'Pausado': '#ef4444',
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Portafolio de Iniciativas</CardTitle>
          <CardDescription>Impacto vs Costo de inversión</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" dataKey="cost" name="Costo (k USD)" stroke="#999" />
              <YAxis type="number" dataKey="impact" name="Impacto %" stroke="#999" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Scatter name="Iniciativas" data={initiativeData} fill="#10b981" />
            </ScatterChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded">
            <p className="text-sm text-blue-300">
              <strong>Recomendación:</strong> Priorizar "Asesoría Personalizada" (mayor impacto) y "Educación Financiera" (mejor relación impacto/costo).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Iniciativas */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Detalle de Iniciativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {initiativeData.map((initiative, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{initiative.name}</p>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: statusColors[initiative.status as keyof typeof statusColors], color: '#000' }}>
                      {initiative.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Impacto</p>
                    <p className="font-bold text-green-400">{initiative.impact}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Costo</p>
                    <p className="font-bold text-gray-300">${initiative.cost}k</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Empleados</p>
                    <p className="font-bold text-gray-300">{initiative.employees}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
