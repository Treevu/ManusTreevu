import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScenarioPlannerProps {
  isLoading?: boolean;
}

export default function ScenarioPlanner({ isLoading = false }: ScenarioPlannerProps) {
  const [scenario, setScenario] = useState<'baseline' | 'optimistic' | 'pessimistic'>('baseline');

  const scenarioData = {
    baseline: [
      { month: 'Ene', fwi: 54, churn: 12, satisfaction: 72, cost: 100 },
      { month: 'Feb', fwi: 53, churn: 13, satisfaction: 71, cost: 100 },
      { month: 'Mar', fwi: 52, churn: 14, satisfaction: 70, cost: 100 },
      { month: 'Abr', fwi: 51, churn: 15, satisfaction: 69, cost: 100 },
      { month: 'May', fwi: 50, churn: 16, satisfaction: 68, cost: 100 },
      { month: 'Jun', fwi: 49, churn: 17, satisfaction: 67, cost: 100 },
    ],
    optimistic: [
      { month: 'Ene', fwi: 54, churn: 12, satisfaction: 72, cost: 150 },
      { month: 'Feb', fwi: 58, churn: 10, satisfaction: 76, cost: 150 },
      { month: 'Mar', fwi: 62, churn: 8, satisfaction: 80, cost: 150 },
      { month: 'Abr', fwi: 66, churn: 6, satisfaction: 84, cost: 150 },
      { month: 'May', fwi: 70, churn: 4, satisfaction: 88, cost: 150 },
      { month: 'Jun', fwi: 74, churn: 2, satisfaction: 92, cost: 150 },
    ],
    pessimistic: [
      { month: 'Ene', fwi: 54, churn: 12, satisfaction: 72, cost: 50 },
      { month: 'Feb', fwi: 50, churn: 16, satisfaction: 68, cost: 50 },
      { month: 'Mar', fwi: 46, churn: 20, satisfaction: 64, cost: 50 },
      { month: 'Abr', fwi: 42, churn: 24, satisfaction: 60, cost: 50 },
      { month: 'May', fwi: 38, churn: 28, satisfaction: 56, cost: 50 },
      { month: 'Jun', fwi: 34, churn: 32, satisfaction: 52, cost: 50 },
    ],
  };

  const data = scenarioData[scenario];

  const getScenarioColor = () => {
    switch (scenario) {
      case 'optimistic': return '#10b981';
      case 'pessimistic': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const getScenarioDescription = () => {
    switch (scenario) {
      case 'optimistic':
        return 'Inversión adicional en programas de educación financiera y asesoría personalizada';
      case 'pessimistic':
        return 'Reducción de presupuesto y recursos para iniciativas de bienestar financiero';
      default:
        return 'Continuación con el presupuesto actual sin cambios significativos';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Planificador de Escenarios</CardTitle>
          <CardDescription>Análisis "What-If" para toma de decisiones estratégicas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            {(['baseline', 'optimistic', 'pessimistic'] as const).map(s => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  scenario === s
                    ? 'bg-brand-primary text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {s === 'baseline' ? 'Base' : s === 'optimistic' ? 'Optimista' : 'Pesimista'}
              </button>
            ))}
          </div>

          <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded">
            <p className="text-sm text-gray-300">{getScenarioDescription()}</p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="fwi"
                stroke={getScenarioColor()}
                strokeWidth={2}
                name="FWI Score"
                dot={{ fill: getScenarioColor(), r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white/5 p-4 rounded border border-white/10">
              <p className="text-xs text-gray-400">FWI Final</p>
              <p className="text-2xl font-bold" style={{ color: getScenarioColor() }}>
                {data[data.length - 1].fwi}
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded border border-white/10">
              <p className="text-xs text-gray-400">Rotación Final</p>
              <p className="text-2xl font-bold text-red-400">
                {data[data.length - 1].churn}%
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded border border-white/10">
              <p className="text-xs text-gray-400">Costo Mensual</p>
              <p className="text-2xl font-bold text-gray-300">
                ${data[0].cost}k
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparación de Escenarios */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Comparación de Escenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Base', fwi: 49, churn: 17, cost: 100, color: '#3b82f6' },
              { label: 'Optimista', fwi: 74, churn: 2, cost: 150, color: '#10b981' },
              { label: 'Pesimista', fwi: 34, churn: 32, cost: 50, color: '#ef4444' },
            ].map((s, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-white flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.label}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">FWI</p>
                    <p className="font-bold text-white">{s.fwi}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Rotación</p>
                    <p className="font-bold text-white">{s.churn}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Costo</p>
                    <p className="font-bold text-white">${s.cost}k</p>
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
