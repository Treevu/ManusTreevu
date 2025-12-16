import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface DebtAvoidanceCalculatorProps {
  isLoading?: boolean;
}

export default function DebtAvoidanceCalculator({ isLoading = false }: DebtAvoidanceCalculatorProps) {
  const [amount, setAmount] = useState(500);
  const [months, setMonths] = useState(12);
  const [selectedOption, setSelectedOption] = useState<'dispersion' | 'debt' | 'credit'>('dispersion');

  // Cálculos
  const debtAPR = 0.15; // 15% APR
  const creditAPR = 0.25; // 25% APR

  const dispersalCost = 0;
  const dispersalFWI = 5;
  const dispersalDebt = 0;

  const debtCost = amount * debtAPR * (months / 12);
  const debtFWI = -10;
  const debtDebtImpact = amount;

  const creditCost = amount * creditAPR * (months / 12);
  const creditFWI = -15;
  const creditDebtImpact = amount;

  const savings = debtCost + creditCost; // Comparado con ambas opciones malas

  const options = [
    {
      id: 'dispersion',
      name: 'Dispersión de Salario',
      cost: dispersalCost,
      fwiImpact: dispersalFWI,
      debtImpact: dispersalDebt,
      color: 'green',
      icon: '✓',
    },
    {
      id: 'debt',
      name: 'Deuda Personal (15% APR)',
      cost: debtCost,
      fwiImpact: debtFWI,
      debtImpact: debtDebtImpact,
      color: 'yellow',
      icon: '⚠',
    },
    {
      id: 'credit',
      name: 'Tarjeta de Crédito (25% APR)',
      cost: creditCost,
      fwiImpact: creditFWI,
      debtImpact: creditDebtImpact,
      color: 'red',
      icon: '✗',
    },
  ];

  const selectedOptionData = options.find(o => o.id === selectedOption);

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Calculadora de Ahorro por Evitar Deuda</CardTitle>
          <CardDescription>Compara cuánto ahorras usando dispersión en lugar de deuda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cantidad */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Cantidad Necesaria: <strong className="text-white">${amount}</strong>
            </label>
            <Slider
              value={[amount]}
              onValueChange={(value) => setAmount(value[0])}
              min={100}
              max={5000}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>$100</span>
              <span>$5,000</span>
            </div>
          </div>

          {/* Período */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Período: <strong className="text-white">{months} meses</strong>
            </label>
            <Slider
              value={[months]}
              onValueChange={(value) => setMonths(value[0])}
              min={1}
              max={60}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1 mes</span>
              <span>5 años</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opciones de Comparación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option) => {
          const isSelected = selectedOption === option.id;
          const colorClass = {
            green: 'bg-green-500/10 border-green-500/30 hover:border-green-500/50',
            yellow: 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50',
            red: 'bg-red-500/10 border-red-500/30 hover:border-red-500/50',
          }[option.color];

          const textColorClass = {
            green: 'text-green-400',
            yellow: 'text-yellow-400',
            red: 'text-red-400',
          }[option.color];

          return (
            <Card
              key={option.id}
              className={`border-0 shadow-lg cursor-pointer transition-all ${colorClass} border ${isSelected ? 'ring-2 ring-offset-2 ring-white/30' : ''}`}
              onClick={() => setSelectedOption(option.id as any)}
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className={`font-bold ${textColorClass}`}>{option.name}</p>
                    <span className="text-2xl">{option.icon}</span>
                  </div>

                  <div className="space-y-3 border-t border-white/10 pt-4">
                    <div>
                      <p className="text-xs text-gray-400">Costo Total</p>
                      <p className={`text-2xl font-bold ${textColorClass}`}>
                        ${option.cost.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Impacto FWI Score</p>
                      <p className={`text-lg font-bold ${option.fwiImpact > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {option.fwiImpact > 0 ? '+' : ''}{option.fwiImpact} puntos
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Deuda Generada</p>
                      <p className={`text-lg font-bold ${option.debtImpact > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        ${option.debtImpact}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="pt-4 border-t border-white/10">
                      <Button className="w-full bg-white/20 hover:bg-white/30 text-white">
                        Seleccionado
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Análisis de Ahorro */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Análisis Detallado</CardTitle>
          <CardDescription>Comparativa de impacto financiero</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Opción Seleccionada */}
            <div className="p-4 bg-white/5 border border-white/10 rounded">
              <p className="text-sm text-gray-400 mb-3">Tu Opción Seleccionada</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Costo</p>
                  <p className="text-2xl font-bold text-white">${selectedOptionData?.cost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">FWI Impact</p>
                  <p className={`text-2xl font-bold ${(selectedOptionData?.fwiImpact ?? 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(selectedOptionData?.fwiImpact ?? 0) > 0 ? '+' : ''}{selectedOptionData?.fwiImpact}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Deuda</p>
                  <p className={`text-2xl font-bold ${(selectedOptionData?.debtImpact ?? 0) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    ${selectedOptionData?.debtImpact}
                  </p>
                </div>
              </div>
            </div>

            {/* Comparativa vs Peor Opción */}
            {selectedOption === 'dispersion' && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-green-400 mb-2">¡Excelente Decisión!</p>
                    <p className="text-sm text-green-300 mb-3">
                      Comparado con deuda personal, ahorras <strong>${debtCost.toFixed(2)}</strong> en intereses.
                    </p>
                    <p className="text-sm text-green-300">
                      Comparado con tarjeta de crédito, ahorras <strong>${creditCost.toFixed(2)}</strong> en intereses.
                    </p>
                    <p className="text-sm text-green-300 mt-3">
                      <strong>Total ahorrado: ${(debtCost + creditCost).toFixed(2)}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedOption === 'debt' && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-yellow-400 mb-2">Considera Alternativas</p>
                    <p className="text-sm text-yellow-300 mb-3">
                      Usando deuda personal, pagarás <strong>${debtCost.toFixed(2)}</strong> en intereses.
                    </p>
                    <p className="text-sm text-yellow-300">
                      Si usaras dispersión en lugar de esto, ahorrarías <strong>${debtCost.toFixed(2)}</strong>.
                    </p>
                    <p className="text-sm text-yellow-300 mt-3">
                      Recomendación: Usa dispersión de salario para evitar estos costos.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedOption === 'credit' && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-400 mb-2">⚠ Evita Esta Opción</p>
                    <p className="text-sm text-red-300 mb-3">
                      Usando tarjeta de crédito, pagarás <strong>${creditCost.toFixed(2)}</strong> en intereses.
                    </p>
                    <p className="text-sm text-red-300">
                      Si usaras dispersión en lugar de esto, ahorrarías <strong>${creditCost.toFixed(2)}</strong>.
                    </p>
                    <p className="text-sm text-red-300 mt-3">
                      Recomendación: Usa dispersión de salario - es mucho más barato.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Proyección a Largo Plazo */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded">
              <p className="text-sm text-blue-300 mb-3">
                <strong>Proyección a Largo Plazo:</strong> Si necesitas ${amount} cada mes durante {months} meses:
              </p>
              <div className="space-y-2 text-sm text-blue-300">
                <p>• Dispersión: Costo total <strong>$0</strong>, FWI +{5 * months} puntos</p>
                <p>• Deuda: Costo total <strong>${(debtCost * months).toFixed(2)}</strong>, FWI {-10 * months} puntos</p>
                <p>• Tarjeta: Costo total <strong>${(creditCost * months).toFixed(2)}</strong>, FWI {-15 * months} puntos</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendación Final */}
      <Card className="border-0 shadow-lg bg-green-500/10 border border-green-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-green-400 mb-2">Recomendación: Usa Dispersión de Salario</p>
              <p className="text-sm text-green-300">
                Es la opción más inteligente. Ahorras dinero, mejoras tu FWI Score, y evitas deuda. ¡Gana TreePoints cada vez que elijas dispersión!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
