import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';

interface ProgramROIAnalysisProps {
  isLoading?: boolean;
}

export default function ProgramROIAnalysis({ isLoading = false }: ProgramROIAnalysisProps) {
  const [selectedProgram, setSelectedProgram] = useState<string>('dispersion');

  // ROI Data
  const programData = {
    dispersion: {
      name: 'Programa de Dispersión de Salario',
      investment: 300000,
      benefits: 1950000,
      roi: 550,
      paybackMonths: 1.8,
      employees: 720,
      adoptionRate: 72,
      retentionImpact: 40,
      productivityImpact: 15,
      savingsPerEmployee: 2708,
    },
    wellness: {
      name: 'Programa de Bienestar',
      investment: 250000,
      benefits: 750000,
      roi: 200,
      paybackMonths: 4,
      employees: 1000,
      adoptionRate: 45,
      retentionImpact: 20,
      productivityImpact: 8,
      savingsPerEmployee: 750,
    },
    training: {
      name: 'Programa de Capacitación Financiera',
      investment: 150000,
      benefits: 600000,
      roi: 300,
      paybackMonths: 3,
      employees: 800,
      adoptionRate: 60,
      retentionImpact: 25,
      productivityImpact: 10,
      savingsPerEmployee: 750,
    },
    mentoring: {
      name: 'Programa de Mentoría',
      investment: 200000,
      benefits: 500000,
      roi: 150,
      paybackMonths: 4.8,
      employees: 600,
      adoptionRate: 50,
      retentionImpact: 15,
      productivityImpact: 12,
      savingsPerEmployee: 833,
    },
  };

  const selected = programData[selectedProgram as keyof typeof programData];

  // ROI Trend
  const roiTrend = [
    { month: 'Mes 1', cumulative: -300, roi: -100 },
    { month: 'Mes 2', cumulative: 25000, roi: 8 },
    { month: 'Mes 3', cumulative: 150000, roi: 50 },
    { month: 'Mes 4', cumulative: 325000, roi: 108 },
    { month: 'Mes 5', cumulative: 550000, roi: 183 },
    { month: 'Mes 6', cumulative: 800000, roi: 267 },
    { month: 'Mes 7', cumulative: 1100000, roi: 367 },
    { month: 'Mes 8', cumulative: 1400000, roi: 467 },
    { month: 'Mes 9', cumulative: 1700000, roi: 567 },
    { month: 'Mes 10', cumulative: 1950000, roi: 550 },
  ];

  // Comparison
  const programComparison = [
    { program: 'Dispersión', roi: 550, payback: 1.8 },
    { program: 'Capacitación', roi: 300, payback: 3 },
    { program: 'Wellness', roi: 200, payback: 4 },
    { program: 'Mentoría', roi: 150, payback: 4.8 },
  ];

  // Impact breakdown
  const impactBreakdown = [
    { name: 'Retención', value: 780000, percentage: 40 },
    { name: 'Productividad', value: 292500, percentage: 15 },
    { name: 'Ahorros Empleados', value: 877500, percentage: 45 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  return (
    <div className="space-y-4">
      {/* Program Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.entries(programData).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setSelectedProgram(key)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              selectedProgram === key
                ? 'bg-blue-500/20 border-blue-500 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            <p className="text-xs font-bold">{data.name.split(' ')[0]}</p>
            <p className="text-sm font-bold text-green-400 mt-1">{data.roi}% ROI</p>
          </button>
        ))}
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-green-500/10 border border-green-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">ROI Total</p>
                <p className="text-3xl font-bold text-green-400">{selected.roi}%</p>
                <p className="text-xs text-green-300 mt-1">Retorno sobre inversión</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-blue-500/10 border border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Payback Period</p>
                <p className="text-3xl font-bold text-blue-400">{selected.paybackMonths}</p>
                <p className="text-xs text-blue-300 mt-1">meses</p>
              </div>
              <Target className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-purple-500/10 border border-purple-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Beneficio Total</p>
                <p className="text-3xl font-bold text-purple-400">${(selected.benefits / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-purple-300 mt-1">en 10 meses</p>
              </div>
              <DollarSign className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-orange-500/10 border border-orange-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Empleados Beneficiados</p>
                <p className="text-3xl font-bold text-orange-400">{selected.employees}</p>
                <p className="text-xs text-orange-300 mt-1">{selected.adoptionRate}% adopción</p>
              </div>
              <Users className="h-10 w-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROI Trend */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Tendencia de ROI a 10 Meses</CardTitle>
          <CardDescription>Crecimiento acumulativo del retorno sobre inversión</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={roiTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" yAxisId="left" />
              <YAxis stroke="#999" yAxisId="right" orientation="right" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="cumulative"
                stroke="#10b981"
                strokeWidth={2}
                name="Beneficio Acumulado ($)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="roi"
                stroke="#3b82f6"
                strokeWidth={2}
                name="ROI (%)"
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded">
            <p className="text-sm text-green-300">
              <strong>Payback alcanzado en mes {selected.paybackMonths}:</strong> La inversión inicial se recupera y comienza a generar ganancias netas.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Impact Breakdown */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Desglose de Beneficios</CardTitle>
          <CardDescription>Fuentes de valor del programa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={impactBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {impactBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {impactBreakdown.map((item, idx) => (
                <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                      <p className="font-bold text-white">{item.name}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-300">{item.percentage}%</span>
                  </div>
                  <p className="text-sm text-green-400">${(item.value / 1000).toFixed(0)}k</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Comparison */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Comparativa de Programas</CardTitle>
          <CardDescription>ROI y Payback Period de todos los programas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={programComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="program" stroke="#999" />
              <YAxis stroke="#999" yAxisId="left" />
              <YAxis stroke="#999" yAxisId="right" orientation="right" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Bar yAxisId="left" dataKey="roi" fill="#10b981" name="ROI (%)" />
              <Bar yAxisId="right" dataKey="payback" fill="#3b82f6" name="Payback (meses)" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded">
            <p className="text-sm text-blue-300">
              <strong>Recomendación:</strong> El Programa de Dispersión tiene el mejor ROI (550%) y payback más rápido (1.8 meses). Recomendamos aumentar presupuesto.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Resumen Financiero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded">
              <p className="text-xs text-gray-400">Inversión Inicial</p>
              <p className="text-2xl font-bold text-white">${(selected.investment / 1000).toFixed(0)}k</p>
            </div>
            <div className="p-4 bg-white/5 rounded">
              <p className="text-xs text-gray-400">Beneficio Total (10 meses)</p>
              <p className="text-2xl font-bold text-green-400">${(selected.benefits / 1000).toFixed(0)}k</p>
            </div>
            <div className="p-4 bg-white/5 rounded">
              <p className="text-xs text-gray-400">Ganancia Neta</p>
              <p className="text-2xl font-bold text-green-400">${((selected.benefits - selected.investment) / 1000).toFixed(0)}k</p>
            </div>
            <div className="p-4 bg-white/5 rounded">
              <p className="text-xs text-gray-400">Ahorro por Empleado</p>
              <p className="text-2xl font-bold text-green-400">${selected.savingsPerEmployee}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 shadow-lg bg-green-500/10 border border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Recomendaciones Ejecutivas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-green-300">
          <p>✓ Aumentar presupuesto de Dispersión de Salario de $300k a $500k para alcanzar 85% adopción</p>
          <p>✓ Proyección: ROI de 550% generaría $3.25M en beneficios anuales</p>
          <p>✓ Impacto en retención: Reducción de rotación de 15% a 8% = $7.95M ahorrados</p>
          <p>✓ Combinar con Capacitación Financiera para maximizar adopción y sostenibilidad</p>
        </CardContent>
      </Card>
    </div>
  );
}
