import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Plus, Trash2, Copy, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export interface Scenario {
  id: string;
  name: string;
  interventionBudget: number;
  educationHours: number;
  coachingSessions: number;
  expectedFWIImprovement: number;
  expectedRetentionRate: number;
  estimatedROI: number;
}

interface ScenarioAnalysisProps {
  initialScenarios?: Scenario[];
  isLoading?: boolean;
}

export default function ScenarioAnalysis({
  initialScenarios,
  isLoading = false,
}: ScenarioAnalysisProps) {
  // Default scenarios
  const defaultScenarios: Scenario[] = [
    {
      id: '1',
      name: 'Escenario Actual',
      interventionBudget: 10000,
      educationHours: 20,
      coachingSessions: 5,
      expectedFWIImprovement: 8,
      expectedRetentionRate: 0.85,
      estimatedROI: 150,
    },
    {
      id: '2',
      name: 'Inversión Moderada',
      interventionBudget: 20000,
      educationHours: 40,
      coachingSessions: 15,
      expectedFWIImprovement: 15,
      expectedRetentionRate: 0.90,
      estimatedROI: 280,
    },
    {
      id: '3',
      name: 'Inversión Agresiva',
      interventionBudget: 35000,
      educationHours: 60,
      coachingSessions: 30,
      expectedFWIImprovement: 22,
      expectedRetentionRate: 0.94,
      estimatedROI: 420,
    },
  ];

  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios || defaultScenarios);
  const [newScenarioName, setNewScenarioName] = useState('');

  const addScenario = () => {
    if (!newScenarioName.trim()) return;

    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: newScenarioName,
      interventionBudget: 15000,
      educationHours: 30,
      coachingSessions: 10,
      expectedFWIImprovement: 12,
      expectedRetentionRate: 0.88,
      estimatedROI: 200,
    };

    setScenarios([...scenarios, newScenario]);
    setNewScenarioName('');
  };

  const deleteScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  const duplicateScenario = (scenario: Scenario) => {
    const newScenario: Scenario = {
      ...scenario,
      id: Date.now().toString(),
      name: `${scenario.name} (Copia)`,
    };
    setScenarios([...scenarios, newScenario]);
  };

  const updateScenario = (id: string, updates: Partial<Scenario>) => {
    setScenarios(scenarios.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // Prepare data for comparison chart
  const comparisonData = scenarios.map(s => ({
    name: s.name,
    'FWI Mejora': s.expectedFWIImprovement,
    'Retención': s.expectedRetentionRate * 100,
    'ROI': s.estimatedROI / 10, // Scale down for visualization
  }));

  // Prepare data for budget vs ROI
  const budgetVsROI = scenarios.map(s => ({
    name: s.name,
    budget: s.interventionBudget,
    roi: s.estimatedROI,
  }));

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">Cargando análisis...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Scenario Comparison Chart */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Comparación de Escenarios</CardTitle>
          <CardDescription className="text-gray-400">Impacto de cada escenario en KPIs principales</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={80} />
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
              <Bar dataKey="FWI Mejora" fill="#3b82f6" />
              <Bar dataKey="Retención" fill="#22c55e" />
              <Bar dataKey="ROI" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget vs ROI */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Presupuesto vs ROI</CardTitle>
          <CardDescription className="text-gray-400">Retorno sobre inversión por escenario</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={budgetVsROI}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" />
              <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="budget" stroke="#3b82f6" strokeWidth={2} name="Presupuesto ($)" />
              <Line yAxisId="right" type="monotone" dataKey="roi" stroke="#22c55e" strokeWidth={2} name="ROI (%)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Scenario Details */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Detalles de Escenarios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scenarios.map((scenario, idx) => (
            <div key={scenario.id} className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">{scenario.name}</h3>
                  <p className="text-xs text-gray-400">Escenario {idx + 1}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => duplicateScenario(scenario)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {scenarios.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteScenario(scenario.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <label className="text-xs text-gray-400">Presupuesto</label>
                  <Input
                    type="number"
                    value={scenario.interventionBudget}
                    onChange={(e) => updateScenario(scenario.id, { interventionBudget: Number(e.target.value) })}
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Horas Educación</label>
                  <Input
                    type="number"
                    value={scenario.educationHours}
                    onChange={(e) => updateScenario(scenario.id, { educationHours: Number(e.target.value) })}
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Sesiones Coaching</label>
                  <Input
                    type="number"
                    value={scenario.coachingSessions}
                    onChange={(e) => updateScenario(scenario.id, { coachingSessions: Number(e.target.value) })}
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                <div>
                  <p className="text-xs text-gray-400">Mejora FWI</p>
                  <p className="text-lg font-semibold text-blue-400">+{scenario.expectedFWIImprovement}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Retención</p>
                  <p className="text-lg font-semibold text-green-400">{(scenario.expectedRetentionRate * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">ROI</p>
                  <Badge className="bg-amber-500/20 text-amber-400 border-transparent">
                    {scenario.estimatedROI}%
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add New Scenario */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Crear Nuevo Escenario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre del escenario"
              value={newScenarioName}
              onChange={(e) => setNewScenarioName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addScenario()}
              className="bg-white/5 border-white/10 text-white"
            />
            <Button
              onClick={addScenario}
              disabled={!newScenarioName.trim()}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Recomendación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-300">
            Basado en el análisis de escenarios, recomendamos:
          </p>
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
            <p className="font-semibold text-green-400 mb-1">💡 Escenario Óptimo</p>
            <p className="text-sm text-gray-300">
              <strong>Inversión Moderada</strong> ofrece el mejor balance entre costo y beneficio.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              • Presupuesto: $20,000 (2x del actual)
              • Mejora esperada: +15 puntos FWI
              • Retención: 90% (vs 85% actual)
              • ROI: 280% (vs 150% actual)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
