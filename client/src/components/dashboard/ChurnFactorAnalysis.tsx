import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChurnFactorAnalysisProps {
  isLoading?: boolean;
}

export default function ChurnFactorAnalysis({ isLoading = false }: ChurnFactorAnalysisProps) {
  const factorData = [
    { factor: 'Deuda Alta', impact: 35, employees: 120, correlation: 0.87 },
    { factor: 'Bajo Salario', impact: 28, employees: 95, correlation: 0.76 },
    { factor: 'Falta Ahorros', impact: 22, employees: 75, correlation: 0.68 },
    { factor: 'Estrés Financiero', impact: 18, employees: 60, correlation: 0.62 },
    { factor: 'Mala Planificación', impact: 12, employees: 40, correlation: 0.45 },
  ];

  const temporalData = [
    { month: 'Ene', churnRate: 2.1, avgFWI: 62, interventions: 15 },
    { month: 'Feb', churnRate: 2.3, avgFWI: 61, interventions: 18 },
    { month: 'Mar', churnRate: 2.8, avgFWI: 59, interventions: 22 },
    { month: 'Abr', churnRate: 3.2, avgFWI: 58, interventions: 25 },
    { month: 'May', churnRate: 3.5, avgFWI: 56, interventions: 28 },
    { month: 'Jun', churnRate: 3.8, avgFWI: 54, interventions: 32 },
  ];

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Análisis de Factores de Rotación</CardTitle>
          <CardDescription>Impacto de variables en probabilidad de churn</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={factorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="factor" stroke="#999" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Bar dataKey="impact" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white/5 p-4 rounded border border-white/10">
              <p className="text-xs text-gray-400">Factor Principal</p>
              <p className="text-lg font-bold text-white">Deuda Alta</p>
              <p className="text-xs text-red-400 mt-1">35% impacto</p>
            </div>
            <div className="bg-white/5 p-4 rounded border border-white/10">
              <p className="text-xs text-gray-400">Empleados Afectados</p>
              <p className="text-lg font-bold text-white">390</p>
              <p className="text-xs text-gray-400 mt-1">39% del total</p>
            </div>
            <div className="bg-white/5 p-4 rounded border border-white/10">
              <p className="text-xs text-gray-400">Correlación Promedio</p>
              <p className="text-lg font-bold text-white">0.68</p>
              <p className="text-xs text-blue-400 mt-1">Fuerte</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análisis Temporal */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Evolución Temporal</CardTitle>
          <CardDescription>Tasa de churn vs FWI Score</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={temporalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Bar dataKey="churnRate" fill="#ef4444" name="Tasa Churn %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
