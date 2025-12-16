import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export interface ScenarioData {
  month: string;
  optimistic: number;
  realistic: number;
  pessimistic: number;
  current?: number;
}

interface FWIPredictionProps {
  scenarios?: ScenarioData[];
  currentFWI?: number;
  targetFWI?: number;
  isLoading?: boolean;
}

export default function FWIPrediction({
  scenarios,
  currentFWI = 55,
  targetFWI = 70,
  isLoading = false,
}: FWIPredictionProps) {
  // Default scenarios if none provided
  const defaultScenarios: ScenarioData[] = [
    { month: 'Ene', optimistic: 58, realistic: 56, pessimistic: 54, current: 55 },
    { month: 'Feb', optimistic: 62, realistic: 58, pessimistic: 53 },
    { month: 'Mar', optimistic: 66, realistic: 60, pessimistic: 52 },
    { month: 'Abr', optimistic: 70, realistic: 62, pessimistic: 51 },
    { month: 'May', optimistic: 74, realistic: 64, pessimistic: 50 },
    { month: 'Jun', optimistic: 78, realistic: 66, pessimistic: 50 },
    { month: 'Jul', optimistic: 82, realistic: 68, pessimistic: 51 },
    { month: 'Ago', optimistic: 85, realistic: 70, pessimistic: 52 },
    { month: 'Sep', optimistic: 87, realistic: 72, pessimistic: 53 },
    { month: 'Oct', optimistic: 89, realistic: 74, pessimistic: 54 },
    { month: 'Nov', optimistic: 90, realistic: 75, pessimistic: 55 },
    { month: 'Dic', optimistic: 92, realistic: 76, pessimistic: 56 },
  ];

  const displayScenarios = scenarios || defaultScenarios;

  // Calculate final values
  const finalOptimistic = displayScenarios[displayScenarios.length - 1].optimistic;
  const finalRealistic = displayScenarios[displayScenarios.length - 1].realistic;
  const finalPessimistic = displayScenarios[displayScenarios.length - 1].pessimistic;

  // Calculate probability of reaching target
  const probabilityOptimistic = finalOptimistic >= targetFWI ? 100 : 0;
  const probabilityRealistic = finalRealistic >= targetFWI ? 100 : 0;
  const probabilityPessimistic = finalPessimistic >= targetFWI ? 100 : 0;

  // Calculate improvements
  const improvementOptimistic = finalOptimistic - currentFWI;
  const improvementRealistic = finalRealistic - currentFWI;
  const improvementPessimistic = finalPessimistic - currentFWI;

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">Cargando predicciones...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Scenario Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Optimistic */}
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Escenario Optimista
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-gray-400">FWI Proyectado</p>
              <p className="text-2xl font-bold text-green-400">{finalOptimistic}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Mejora</p>
              <p className="text-lg font-semibold text-green-400">+{improvementOptimistic}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Alcanza Meta</p>
              <Badge className={`${probabilityOptimistic === 100 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} border-transparent`}>
                {probabilityOptimistic === 100 ? '✓ Sí' : '✗ No'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Realistic */}
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Escenario Realista
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-gray-400">FWI Proyectado</p>
              <p className="text-2xl font-bold text-blue-400">{finalRealistic}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Mejora</p>
              <p className="text-lg font-semibold text-blue-400">+{improvementRealistic}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Alcanza Meta</p>
              <Badge className={`${probabilityRealistic === 100 ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'} border-transparent`}>
                {probabilityRealistic === 100 ? '✓ Sí' : '✗ No'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pessimistic */}
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-red-400 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Escenario Pesimista
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-gray-400">FWI Proyectado</p>
              <p className="text-2xl font-bold text-red-400">{finalPessimistic}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Mejora</p>
              <p className="text-lg font-semibold text-red-400">+{improvementPessimistic}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Alcanza Meta</p>
              <Badge className="bg-red-500/20 text-red-400 border-transparent">
                ✗ No
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prediction Chart */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Proyección de FWI Score (12 meses)</CardTitle>
          <CardDescription className="text-gray-400">
            Tres escenarios: Optimista, Realista y Pesimista. Meta: {targetFWI}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={displayScenarios}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              
              {/* Target line */}
              <Line
                type="monotone"
                dataKey={() => targetFWI}
                stroke="#9333ea"
                strokeDasharray="5 5"
                dot={false}
                name="Meta"
                isAnimationActive={false}
              />
              
              {/* Current line */}
              {displayScenarios[0].current && (
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#6b7280"
                  strokeDasharray="5 5"
                  dot={false}
                  name="Actual"
                  isAnimationActive={false}
                />
              )}
              
              {/* Scenarios */}
              <Line
                type="monotone"
                dataKey="optimistic"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', r: 4 }}
                activeDot={{ r: 6 }}
                name="Optimista"
              />
              <Line
                type="monotone"
                dataKey="realistic"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Realista"
              />
              <Line
                type="monotone"
                dataKey="pessimistic"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
                name="Pesimista"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations by Scenario */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Recomendaciones por Escenario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
            <p className="font-semibold text-green-400 mb-1">📈 Escenario Optimista</p>
            <p className="text-sm text-gray-300">
              Si se implementan todas las intervenciones y el empleado participa activamente, podría alcanzar {finalOptimistic} puntos.
            </p>
            <p className="text-xs text-gray-400 mt-2">Acciones: Asesoría financiera intensiva + Coaching personal + Educación continua</p>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="font-semibold text-blue-400 mb-1">📊 Escenario Realista</p>
            <p className="text-sm text-gray-300">
              Con intervenciones estándar y participación moderada, se espera alcanzar {finalRealistic} puntos.
            </p>
            <p className="text-xs text-gray-400 mt-2">Acciones: Programa EWA + Educación financiera + Seguimiento mensual</p>
          </div>

          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
            <p className="font-semibold text-red-400 mb-1">⚠️ Escenario Pesimista</p>
            <p className="text-sm text-gray-300">
              Sin intervención o con baja participación, el FWI podría estancarse en {finalPessimistic} puntos.
            </p>
            <p className="text-xs text-gray-400 mt-2">Acciones: Intervención urgente + Apoyo psicosocial + Seguimiento intensivo</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-400" />
            Insights Clave
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-gray-300">
            • <strong>Brecha actual:</strong> El empleado está {targetFWI - currentFWI} puntos por debajo de la meta.
          </p>
          <p className="text-gray-300">
            • <strong>Escenario más probable:</strong> Realista ({finalRealistic} puntos, mejora de +{improvementRealistic})
          </p>
          <p className="text-gray-300">
            • <strong>Tiempo para alcanzar meta:</strong> {probabilityRealistic === 100 ? '6-8 meses' : '9-12 meses o más'}
          </p>
          <p className="text-gray-300">
            • <strong>Riesgo de estancamiento:</strong> {improvementPessimistic <= 0 ? 'Alto' : 'Bajo'} en escenario pesimista
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
