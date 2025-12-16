import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { AlertTriangle } from 'lucide-react';

interface DebtImpactAnalysisProps {
  isLoading?: boolean;
}

export default function DebtImpactAnalysis({ isLoading = false }: DebtImpactAnalysisProps) {
  const debtChurnCorrelation = [
    { debtLevel: 10000, churnRisk: 4, employees: 120 },
    { debtLevel: 25000, churnRisk: 8, employees: 180 },
    { debtLevel: 40000, churnRisk: 15, employees: 250 },
    { debtLevel: 55000, churnRisk: 25, employees: 200 },
    { debtLevel: 70000, churnRisk: 38, employees: 150 },
    { debtLevel: 85000, churnRisk: 52, employees: 100 },
  ];

  const debtSegmentation = [
    { segment: 'Sin Deuda', employees: 150, avgChurn: 3, retention: 97, satisfaction: 92 },
    { segment: 'Deuda Baja (<25k)', employees: 280, avgChurn: 8, retention: 92, satisfaction: 85 },
    { segment: 'Deuda Moderada (25-50k)', employees: 320, avgChurn: 18, retention: 82, satisfaction: 72 },
    { segment: 'Deuda Alta (50-75k)', employees: 180, avgChurn: 32, retention: 68, satisfaction: 55 },
    { segment: 'Deuda Crítica (>75k)', employees: 70, avgChurn: 55, retention: 45, satisfaction: 35 },
  ];

  const debtReductionBenefits = [
    { reduction: 'Reducir 10k', retentionGain: 3, costSavings: 225000, paybackMonths: 4 },
    { reduction: 'Reducir 20k', retentionGain: 6, costSavings: 450000, paybackMonths: 3 },
    { reduction: 'Reducir 30k', retentionGain: 9, costSavings: 675000, paybackMonths: 2 },
    { reduction: 'Reducir 40k', retentionGain: 12, costSavings: 900000, paybackMonths: 1 },
  ];

  return (
    <div className="space-y-4">
      {/* Correlación Deuda-Rotación */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Correlación: Deuda vs Riesgo de Rotación</CardTitle>
          <CardDescription>Empleados con mayor deuda tienen 13x más riesgo de rotación</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" dataKey="debtLevel" name="Nivel de Deuda" stroke="#999" />
              <YAxis type="number" dataKey="churnRisk" name="Riesgo de Rotación %" stroke="#999" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Scatter name="Empleados" data={debtChurnCorrelation} fill="#ef4444" />
            </ScatterChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded">
            <p className="text-sm text-red-300">
              <strong>Hallazgo Crítico:</strong> Correlación de 0.92 entre deuda y rotación. Cada $10k adicional de deuda aumenta riesgo de rotación en ~9%.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Segmentación por Deuda */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Segmentación por Nivel de Deuda</CardTitle>
          <CardDescription>Análisis de retención y satisfacción por deuda</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={debtSegmentation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="segment" stroke="#999" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Bar dataKey="retention" fill="#10b981" name="Retención %" />
              <Bar dataKey="avgChurn" fill="#ef4444" name="Rotación %" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-2">
            {debtSegmentation.map((segment, idx) => (
              <div key={idx} className={`p-4 rounded border ${
                segment.avgChurn > 30 ? 'bg-red-500/10 border-red-500/30' :
                segment.avgChurn > 15 ? 'bg-yellow-500/10 border-yellow-500/30' :
                'bg-green-500/10 border-green-500/30'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{segment.segment}</p>
                  <span className="text-sm text-gray-300">{segment.employees} empleados</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Retención</p>
                    <p className={`font-bold ${segment.retention > 90 ? 'text-green-400' : segment.retention > 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {segment.retention}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Rotación</p>
                    <p className={`font-bold ${segment.avgChurn < 10 ? 'text-green-400' : segment.avgChurn < 25 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {segment.avgChurn}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Satisfacción</p>
                    <p className="font-bold text-blue-400">{segment.satisfaction}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ROI de Reducción de Deuda */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">ROI de Programas de Reducción de Deuda</CardTitle>
          <CardDescription>Beneficio de inversión en subsidio/asistencia de deuda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {debtReductionBenefits.map((benefit, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-white">{benefit.reduction}</p>
                  <span className="text-sm px-3 py-1 bg-green-500/20 text-green-400 rounded">
                    Payback: {benefit.paybackMonths} meses
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Mejora Retención</p>
                    <p className="font-bold text-green-400">+{benefit.retentionGain}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Ahorro Anual</p>
                    <p className="font-bold text-green-400">${(benefit.costSavings / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Empleados Retenidos</p>
                    <p className="font-bold text-white">{Math.round(benefit.retentionGain * 10)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas de Deuda Crítica */}
      <Card className="border-0 shadow-lg bg-red-500/10 border border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Empleados en Riesgo Crítico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-red-300">
          <p>• 70 empleados con deuda {'>'}$75k (riesgo rotación 55%)</p>
          <p>• Potencial pérdida: 38 empleados = $2.85M en costos</p>
          <p>• Programa de subsidio de deuda podría retener 30+ empleados</p>
          <p>• Inversión: $300k → Ahorro: $2.25M (ROI 650%)</p>
          <p>• Recomendación: Implementar programa de asistencia de deuda inmediatamente</p>
        </CardContent>
      </Card>
    </div>
  );
}
