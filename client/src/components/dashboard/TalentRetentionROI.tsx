import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TalentRetentionROIProps {
  isLoading?: boolean;
}

export default function TalentRetentionROI({ isLoading = false }: TalentRetentionROIProps) {
  const interventionROI = [
    { intervention: 'Educación Financiera', cost: 50, benefit: 225, payback: 2.7, employees: 250 },
    { intervention: 'Asesoría Personalizada', cost: 80, benefit: 380, payback: 2.5, employees: 50 },
    { intervention: 'Subsidio de Deuda', cost: 300, benefit: 2250, payback: 1.6, employees: 70 },
    { intervention: 'Programa de Ahorros', cost: 40, benefit: 180, payback: 2.7, employees: 180 },
    { intervention: 'Coaching Financiero', cost: 70, benefit: 315, payback: 2.7, employees: 80 },
  ];

  const retentionValue = [
    { role: 'Especialista IT', costTurnover: 180000, retentionValue: 450000, roi: 150 },
    { role: 'Gerente Ventas', costTurnover: 150000, retentionValue: 375000, roi: 150 },
    { role: 'Analista Senior', costTurnover: 120000, retentionValue: 300000, roi: 150 },
    { role: 'Desarrollador', costTurnover: 100000, retentionValue: 250000, roi: 150 },
    { role: 'Coordinador', costTurnover: 75000, retentionValue: 187500, roi: 150 },
  ];

  const totalBenefit = interventionROI.reduce((sum, item) => sum + item.benefit, 0);
  const totalCost = interventionROI.reduce((sum, item) => sum + item.cost, 0);
  const totalROI = ((totalBenefit - totalCost) / totalCost * 100).toFixed(0);

  return (
    <div className="space-y-4">
      {/* KPI Principal */}
      <Card className="border-0 shadow-lg bg-green-500/10 border border-green-500/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-400">ROI Total de Retención</p>
              <p className="text-4xl font-bold text-green-400">{totalROI}%</p>
              <p className="text-sm text-green-300 mt-2">
                Inversión: ${totalCost}k → Beneficio: ${totalBenefit}k → Ganancia Neta: ${totalBenefit - totalCost}k
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-400" />
          </div>
        </CardContent>
      </Card>

      {/* ROI por Intervención */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">ROI por Intervención de Retención</CardTitle>
          <CardDescription>Costo vs Beneficio anual por programa</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={interventionROI}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="intervention" stroke="#999" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Bar dataKey="cost" fill="#ef4444" name="Costo (k)" />
              <Bar dataKey="benefit" fill="#10b981" name="Beneficio (k)" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-3">
            {interventionROI.map((item, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{item.intervention}</p>
                  <span className="text-sm px-3 py-1 bg-green-500/20 text-green-400 rounded">
                    ROI: {((item.benefit / item.cost - 1) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Costo Anual</p>
                    <p className="font-bold text-gray-300">${item.cost}k</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Beneficio Anual</p>
                    <p className="font-bold text-green-400">${item.benefit}k</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Payback</p>
                    <p className="font-bold text-blue-400">{item.payback} meses</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Empleados</p>
                    <p className="font-bold text-white">{item.employees}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Valor de Retención por Rol */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Valor de Retención por Rol</CardTitle>
          <CardDescription>Costo de perder vs valor de retener</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {retentionValue.map((item, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-white">{item.role}</p>
                  <span className="text-sm px-3 py-1 bg-green-500/20 text-green-400 rounded font-bold">
                    +${(item.retentionValue / 1000).toFixed(0)}k valor
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <p className="text-xs text-gray-400 mb-1">Costo de Perder</p>
                    <p className="text-lg font-bold text-red-400">${(item.costTurnover / 1000).toFixed(0)}k</p>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                    <p className="text-xs text-gray-400 mb-1">Valor de Retener</p>
                    <p className="text-lg font-bold text-blue-400">${(item.retentionValue / 1000).toFixed(0)}k</p>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded">
                    <p className="text-xs text-gray-400 mb-1">Diferencia</p>
                    <p className="text-lg font-bold text-green-400">${((item.retentionValue - item.costTurnover) / 1000).toFixed(0)}k</p>
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
          <p>✓ Prioridad 1: Implementar subsidio de deuda (ROI 650%, payback 1.6 meses)</p>
          <p>✓ Prioridad 2: Expandir asesoría personalizada (ROI 375%, payback 2.5 meses)</p>
          <p>✓ Prioridad 3: Educación financiera para todos (ROI 350%, payback 2.7 meses)</p>
          <p>✓ Invertir en roles críticos (IT, Gerentes) - mayor valor de retención</p>
          <p>✓ Presupuesto recomendado: $300k/año → Retorno: $2.25M/año (650% ROI)</p>
        </CardContent>
      </Card>
    </div>
  );
}
