import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Zap, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Scenario {
  id: string;
  name: string;
  description: string;
  monthlyIncome: number;
  monthlyExpense: number;
  savingsGoal: number;
  investmentAmount: number;
  debtPayment: number;
  projectedFWI: number;
  timeToGoal: number;
}

interface FinancialSimulatorProps {
  currentFWI?: number;
  isLoading?: boolean;
}

export default function FinancialSimulator({
  currentFWI = 62,
  isLoading = false,
}: FinancialSimulatorProps) {
  // Default scenarios
  const defaultScenarios: Scenario[] = [
    {
      id: '1',
      name: 'Escenario Actual',
      description: 'Tu situación financiera actual',
      monthlyIncome: 4500,
      monthlyExpense: 3200,
      savingsGoal: 1000,
      investmentAmount: 300,
      debtPayment: 500,
      projectedFWI: 62,
      timeToGoal: 24,
    },
    {
      id: '2',
      name: 'Optimista',
      description: 'Reducción de gastos + aumento de ingresos',
      monthlyIncome: 5000,
      monthlyExpense: 2800,
      savingsGoal: 1500,
      investmentAmount: 500,
      debtPayment: 700,
      projectedFWI: 78,
      timeToGoal: 12,
    },
    {
      id: '3',
      name: 'Conservador',
      description: 'Pequeños cambios sin riesgo',
      monthlyIncome: 4500,
      monthlyExpense: 3000,
      savingsGoal: 1200,
      investmentAmount: 200,
      debtPayment: 600,
      projectedFWI: 70,
      timeToGoal: 18,
    },
  ];

  const [scenarios, setScenarios] = useState<Scenario[]>(defaultScenarios);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(defaultScenarios[0]);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [formData, setFormData] = useState({
    monthlyIncome: selectedScenario?.monthlyIncome || 4500,
    monthlyExpense: selectedScenario?.monthlyExpense || 3200,
    savingsGoal: selectedScenario?.savingsGoal || 1000,
    investmentAmount: selectedScenario?.investmentAmount || 300,
    debtPayment: selectedScenario?.debtPayment || 500,
  });

  // Calculate projected FWI based on inputs
  const calculateFWI = (income: number, expense: number, savings: number, investment: number, debt: number) => {
    const surplus = income - expense;
    const savingsRate = (savings / income) * 100;
    const investmentRate = (investment / income) * 100;
    const debtRatio = (debt / income) * 100;

    let fwi = currentFWI;
    fwi += savingsRate * 0.3; // Savings impact
    fwi += investmentRate * 0.2; // Investment impact
    fwi -= (expense / income) * 100 * 0.1; // Expense ratio impact
    fwi += debtRatio * 0.15; // Debt payment impact

    return Math.min(100, Math.max(0, fwi));
  };

  const calculateTimeToGoal = (income: number, expense: number, savingsGoal: number) => {
    const surplus = income - expense;
    if (surplus <= 0) return 999;
    return Math.ceil((savingsGoal * 12) / surplus);
  };

  const projectedFWI = calculateFWI(
    formData.monthlyIncome,
    formData.monthlyExpense,
    formData.savingsGoal,
    formData.investmentAmount,
    formData.debtPayment
  );

  const timeToGoal = calculateTimeToGoal(
    formData.monthlyIncome,
    formData.monthlyExpense,
    formData.savingsGoal
  );

  // Generate projection data
  const projectionData = Array.from({ length: 12 }, (_, i) => ({
    month: `Mes ${i + 1}`,
    fwiProjection: currentFWI + ((projectedFWI - currentFWI) / 12) * (i + 1),
    savingsAccumulated: (formData.savingsGoal * (i + 1)),
  }));

  const handleSaveScenario = () => {
    if (!newScenarioName) return;

    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: newScenarioName,
      description: 'Escenario personalizado',
      monthlyIncome: formData.monthlyIncome,
      monthlyExpense: formData.monthlyExpense,
      savingsGoal: formData.savingsGoal,
      investmentAmount: formData.investmentAmount,
      debtPayment: formData.debtPayment,
      projectedFWI,
      timeToGoal,
    };

    setScenarios([...scenarios, newScenario]);
    setNewScenarioName('');
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
    if (selectedScenario?.id === id) {
      setSelectedScenario(scenarios[0]);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">Cargando simulador...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Simulator Controls */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Simulador de Decisiones Financieras
          </CardTitle>
          <CardDescription className="text-gray-400">Ajusta tus variables y ve el impacto en tu FWI Score</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Ingreso Mensual</Label>
              <Input
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: parseFloat(e.target.value) })}
                className="mt-1 bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Gasto Mensual</Label>
              <Input
                type="number"
                value={formData.monthlyExpense}
                onChange={(e) => setFormData({ ...formData, monthlyExpense: parseFloat(e.target.value) })}
                className="mt-1 bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Meta de Ahorro Mensual</Label>
              <Input
                type="number"
                value={formData.savingsGoal}
                onChange={(e) => setFormData({ ...formData, savingsGoal: parseFloat(e.target.value) })}
                className="mt-1 bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Inversión Mensual</Label>
              <Input
                type="number"
                value={formData.investmentAmount}
                onChange={(e) => setFormData({ ...formData, investmentAmount: parseFloat(e.target.value) })}
                className="mt-1 bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Pago de Deuda Mensual</Label>
              <Input
                type="number"
                value={formData.debtPayment}
                onChange={(e) => setFormData({ ...formData, debtPayment: parseFloat(e.target.value) })}
                className="mt-1 bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          {/* Save Scenario */}
          <div className="flex gap-2">
            <Input
              placeholder="Nombre del escenario"
              value={newScenarioName}
              onChange={(e) => setNewScenarioName(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
            <Button onClick={handleSaveScenario} className="bg-brand-primary hover:bg-brand-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-400">FWI Proyectado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{projectedFWI.toFixed(1)}</div>
            <p className="text-xs text-gray-400 mt-1">
              {projectedFWI > currentFWI ? '+' : ''}{(projectedFWI - currentFWI).toFixed(1)} vs actual
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-400">Ahorro Anual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">${(formData.savingsGoal * 12).toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-1">Basado en meta mensual</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-400">Tiempo a Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{timeToGoal}</div>
            <p className="text-xs text-gray-400 mt-1">Meses para alcanzar meta</p>
          </CardContent>
        </Card>
      </div>

      {/* Projection Chart */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Proyección a 12 Meses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="fwiProjection" stroke="#3b82f6" name="FWI Proyectado" />
              <Line type="monotone" dataKey="savingsAccumulated" stroke="#10b981" name="Ahorro Acumulado" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Saved Scenarios */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Escenarios Guardados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedScenario?.id === scenario.id
                  ? 'bg-blue-500/20 border-blue-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => setSelectedScenario(scenario)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{scenario.name}</h4>
                  <p className="text-xs text-gray-400">{scenario.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-blue-500/20 text-blue-400 border-transparent text-xs">
                      FWI: {scenario.projectedFWI.toFixed(1)}
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-400 border-transparent text-xs">
                      {scenario.timeToGoal} meses
                    </Badge>
                  </div>
                </div>
                {scenario.id !== '1' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteScenario(scenario.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
            <p className="font-semibold text-green-400 mb-1">💡 Oportunidad Identificada</p>
            <p className="text-sm text-gray-300">
              Reduciendo gastos en ${(formData.monthlyExpense * 0.1).toFixed(0)}/mes podrías alcanzar tu meta 3 meses antes.
            </p>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="font-semibold text-blue-400 mb-1">📈 Impacto Potencial</p>
            <p className="text-sm text-gray-300">
              Tu FWI Score podría mejorar de {currentFWI.toFixed(1)} a {projectedFWI.toFixed(1)} en 12 meses con estos cambios.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
