import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

interface SalaryDispersionImpactProps {
  isLoading?: boolean;
}

export default function SalaryDispersionImpact({ isLoading = false }: SalaryDispersionImpactProps) {
  const monthlySavings = [
    { month: 'Ene', dispersed: 500, debtAvoided: 500, interestSaved: 75, fwiGain: 5 },
    { month: 'Feb', dispersed: 800, debtAvoided: 800, interestSaved: 120, fwiGain: 5 },
    { month: 'Mar', dispersed: 300, debtAvoided: 300, interestSaved: 45, fwiGain: 5 },
    { month: 'Abr', dispersed: 600, debtAvoided: 600, interestSaved: 90, fwiGain: 5 },
    { month: 'May', dispersed: 400, debtAvoided: 400, interestSaved: 60, fwiGain: 5 },
    { month: 'Jun', dispersed: 700, debtAvoided: 700, interestSaved: 105, fwiGain: 5 },
  ];

  const comparisonData = [
    { option: 'Dispersión', cost: 0, impact: 'FWI +5', debtImpact: 0 },
    { option: 'Deuda (15%)', cost: 75, impact: 'FWI -10', debtImpact: 500 },
    { option: 'Tarjeta (25%)', cost: 125, impact: 'FWI -15', debtImpact: 500 },
  ];

  const behaviorChange = [
    { month: 'Ene', usedDispersion: 45, usedDebt: 55 },
    { month: 'Feb', usedDispersion: 52, usedDebt: 48 },
    { month: 'Mar', usedDispersion: 60, usedDebt: 40 },
    { month: 'Abr', usedDispersion: 68, usedDebt: 32 },
    { month: 'May', usedDispersion: 75, usedDebt: 25 },
    { month: 'Jun', usedDispersion: 82, usedDebt: 18 },
  ];

  const totalInterestSaved = monthlySavings.reduce((sum, m) => sum + m.interestSaved, 0);
  const totalDebtAvoided = monthlySavings.reduce((sum, m) => sum + m.debtAvoided, 0);
  const totalFwiGain = monthlySavings.reduce((sum, m) => sum + m.fwiGain, 0);

  return (
    <div className="space-y-4">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-green-500/10 border border-green-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Intereses Ahorrados</p>
                <p className="text-3xl font-bold text-green-400">${totalInterestSaved}</p>
                <p className="text-xs text-green-300 mt-1">últimos 6 meses</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-blue-500/10 border border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Deuda Evitada</p>
                <p className="text-3xl font-bold text-blue-400">${totalDebtAvoided}</p>
                <p className="text-xs text-blue-300 mt-1">usando dispersión</p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-purple-500/10 border border-purple-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Mejora FWI Score</p>
                <p className="text-3xl font-bold text-purple-400">+{totalFwiGain}</p>
                <p className="text-xs text-purple-300 mt-1">puntos ganados</p>
              </div>
              <AlertCircle className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-orange-500/10 border border-orange-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Proyección Anual</p>
                <p className="text-3xl font-bold text-orange-400">${(totalInterestSaved * 2).toLocaleString()}</p>
                <p className="text-xs text-orange-300 mt-1">ahorros estimados</p>
              </div>
              <TrendingUp className="h-10 w-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendencia de Ahorros */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Ahorros Acumulados por Usar Dispersión</CardTitle>
          <CardDescription>Dinero ahorrado en intereses cada mes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySavings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Bar dataKey="interestSaved" fill="#10b981" name="Intereses Ahorrados ($)" />
              <Bar dataKey="fwiGain" fill="#3b82f6" name="Ganancia FWI (puntos)" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded">
            <p className="text-sm text-green-300">
              <strong>Impacto:</strong> Al usar dispersión en lugar de deuda, has ahorrado <strong>${totalInterestSaved}</strong> en intereses y ganado <strong>{totalFwiGain} puntos</strong> en FWI Score en los últimos 6 meses.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cambio de Comportamiento */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Cambio de Comportamiento</CardTitle>
          <CardDescription>Porcentaje de veces que elegiste dispersión vs deuda</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={behaviorChange}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Line type="monotone" dataKey="usedDispersion" stroke="#10b981" strokeWidth={2} name="Usé Dispersión %" />
              <Line type="monotone" dataKey="usedDebt" stroke="#ef4444" strokeWidth={2} name="Usé Deuda %" />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded">
            <p className="text-sm text-blue-300">
              <strong>Progreso:</strong> Mejoraste tu comportamiento: de usar dispersión 45% del tiempo a 82%. ¡Excelente cambio de hábitos!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Comparación de Opciones */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Comparación: Dispersión vs Deuda</CardTitle>
          <CardDescription>Impacto de cada opción para una necesidad de $500</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Dispersión */}
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded">
                <p className="font-bold text-green-400 mb-3">Dispersión de Salario</p>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-400">Costo</p>
                    <p className="text-2xl font-bold text-green-400">$0</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Impacto FWI</p>
                    <p className="text-lg font-bold text-green-400">+5 puntos</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Deuda Generada</p>
                    <p className="text-lg font-bold text-green-400">$0</p>
                  </div>
                  <div className="pt-2 border-t border-green-500/30">
                    <p className="text-gray-300">✓ Mejor opción</p>
                  </div>
                </div>
              </div>

              {/* Deuda Personal */}
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded">
                <p className="font-bold text-yellow-400 mb-3">Deuda Personal (15% APR)</p>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-400">Costo</p>
                    <p className="text-2xl font-bold text-yellow-400">$75</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Impacto FWI</p>
                    <p className="text-lg font-bold text-red-400">-10 puntos</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Deuda Generada</p>
                    <p className="text-lg font-bold text-red-400">$500</p>
                  </div>
                  <div className="pt-2 border-t border-yellow-500/30">
                    <p className="text-gray-300">⚠ Pierdes $75</p>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Crédito */}
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded">
                <p className="font-bold text-red-400 mb-3">Tarjeta de Crédito (25% APR)</p>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-400">Costo</p>
                    <p className="text-2xl font-bold text-red-400">$125</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Impacto FWI</p>
                    <p className="text-lg font-bold text-red-400">-15 puntos</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Deuda Generada</p>
                    <p className="text-lg font-bold text-red-400">$500</p>
                  </div>
                  <div className="pt-2 border-t border-red-500/30">
                    <p className="text-gray-300">✗ Pierdes $125</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded mt-4">
              <p className="text-sm text-green-300">
                <strong>Resumen:</strong> Usando dispersión en lugar de deuda personal, ahorras <strong>$75</strong>. Si hubieras usado tarjeta de crédito, habrías perdido <strong>$125</strong>. <strong>Diferencia total: $200</strong> en una sola transacción.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendaciones */}
      <Card className="border-0 shadow-lg bg-blue-500/10 border border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400">Recomendaciones para Maximizar Ahorros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-300">
          <p>✓ Continúa usando dispersión - has ahorrado ${totalInterestSaved} en 6 meses</p>
          <p>✓ Proyección: Si mantienes este ritmo, ahorrarás ${(totalInterestSaved * 2).toLocaleString()} este año</p>
          <p>✓ Tu FWI Score ha mejorado {totalFwiGain} puntos - sigue así</p>
          <p>✓ Próximo objetivo: Llegar a 90% de uso de dispersión (actualmente 82%)</p>
          <p>✓ Bonus: Gana TreePoints cada vez que evites deuda - canjéalos por premios</p>
        </CardContent>
      </Card>
    </div>
  );
}
