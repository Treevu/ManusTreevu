import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { AlertTriangle, TrendingDown, Users } from 'lucide-react';

export interface ChurnRiskEmployee {
  id: string;
  name: string;
  department: string;
  fwiScore: number;
  tenure: number;
  churnProbability: number;
  riskFactors: string[];
  interventionSuggested: string;
}

interface ChurnPredictionProps {
  employees?: ChurnRiskEmployee[];
  isLoading?: boolean;
}

export default function ChurnPrediction({
  employees,
  isLoading = false,
}: ChurnPredictionProps) {
  // Default data if none provided
  const defaultEmployees: ChurnRiskEmployee[] = [
    {
      id: '1',
      name: 'Juan García',
      department: 'Ventas',
      fwiScore: 35,
      tenure: 2,
      churnProbability: 0.92,
      riskFactors: ['FWI muy bajo', 'Ausencias frecuentes', 'Bajo engagement'],
      interventionSuggested: 'Asesoría Financiera Urgente',
    },
    {
      id: '2',
      name: 'María López',
      department: 'IT',
      fwiScore: 45,
      tenure: 1,
      churnProbability: 0.78,
      riskFactors: ['FWI bajo', 'Empleada nueva', 'Estrés detectado'],
      interventionSuggested: 'Coaching Personal',
    },
    {
      id: '3',
      name: 'Carlos Ruiz',
      department: 'Ventas',
      fwiScore: 55,
      tenure: 3,
      churnProbability: 0.45,
      riskFactors: ['FWI medio', 'Ausencias moderadas'],
      interventionSuggested: 'Programa EWA',
    },
    {
      id: '4',
      name: 'Ana Martínez',
      department: 'HR',
      fwiScore: 65,
      tenure: 5,
      churnProbability: 0.12,
      riskFactors: [],
      interventionSuggested: 'Mantener engagement',
    },
    {
      id: '5',
      name: 'Pedro Sánchez',
      department: 'IT',
      fwiScore: 40,
      tenure: 0.5,
      churnProbability: 0.85,
      riskFactors: ['FWI muy bajo', 'Empleado muy nuevo', 'Alto estrés'],
      interventionSuggested: 'Apoyo Psicosocial + Asesoría',
    },
    {
      id: '6',
      name: 'Laura Fernández',
      department: 'Finance',
      fwiScore: 75,
      tenure: 7,
      churnProbability: 0.05,
      riskFactors: [],
      interventionSuggested: 'Retener talento',
    },
    {
      id: '7',
      name: 'Diego Morales',
      department: 'Ventas',
      fwiScore: 50,
      tenure: 2,
      churnProbability: 0.62,
      riskFactors: ['FWI bajo', 'Ausencias frecuentes'],
      interventionSuggested: 'Educación Financiera',
    },
    {
      id: '8',
      name: 'Sofía Jiménez',
      department: 'HR',
      fwiScore: 38,
      tenure: 1.5,
      churnProbability: 0.88,
      riskFactors: ['FWI muy bajo', 'Estrés alto', 'Baja participación'],
      interventionSuggested: 'Intervención Inmediata',
    },
  ];

  const displayEmployees = employees || defaultEmployees;

  // Calculate statistics
  const criticalRisk = displayEmployees.filter(e => e.churnProbability >= 0.75).length;
  const highRisk = displayEmployees.filter(e => e.churnProbability >= 0.5 && e.churnProbability < 0.75).length;
  const mediumRisk = displayEmployees.filter(e => e.churnProbability >= 0.25 && e.churnProbability < 0.5).length;
  const lowRisk = displayEmployees.filter(e => e.churnProbability < 0.25).length;

  const avgChurnProbability = displayEmployees.reduce((sum, e) => sum + e.churnProbability, 0) / displayEmployees.length;

  // Data for risk distribution
  const riskDistribution = [
    { name: 'Crítico', value: criticalRisk, color: '#ef4444' },
    { name: 'Alto', value: highRisk, color: '#f97316' },
    { name: 'Medio', value: mediumRisk, color: '#eab308' },
    { name: 'Bajo', value: lowRisk, color: '#22c55e' },
  ];

  // Data for scatter chart
  const scatterData = displayEmployees.map(e => ({
    ...e,
    churnPercentage: e.churnProbability * 100,
  }));

  const getRiskColor = (probability: number) => {
    if (probability >= 0.75) return '#ef4444';
    if (probability >= 0.5) return '#f97316';
    if (probability >= 0.25) return '#eab308';
    return '#22c55e';
  };

  const getRiskLabel = (probability: number) => {
    if (probability >= 0.75) return 'Crítico';
    if (probability >= 0.5) return 'Alto';
    if (probability >= 0.25) return 'Medio';
    return 'Bajo';
  };

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
      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{criticalRisk}</div>
            <p className="text-xs text-gray-400 mt-1">Rotación probable: 75-100%</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-orange-400">Alto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">{highRisk}</div>
            <p className="text-xs text-gray-400 mt-1">Rotación probable: 50-75%</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-yellow-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-yellow-400">Medio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">{mediumRisk}</div>
            <p className="text-xs text-gray-400 mt-1">Rotación probable: 25-50%</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-400">Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{lowRisk}</div>
            <p className="text-xs text-gray-400 mt-1">Rotación probable: 0-25%</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk vs Tenure Chart */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Probabilidad de Rotación vs Antigüedad</CardTitle>
          <CardDescription className="text-gray-400">Visualización de riesgo por empleado</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="tenure"
                name="Antigüedad (años)"
                type="number"
                stroke="rgba(255,255,255,0.5)"
                label={{ value: 'Antigüedad (años)', position: 'insideBottomRight', offset: -10 }}
              />
              <YAxis
                dataKey="churnPercentage"
                name="Probabilidad de Rotación (%)"
                type="number"
                domain={[0, 100]}
                stroke="rgba(255,255,255,0.5)"
                label={{ value: 'Rotación (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-black/80 border border-white/20 rounded text-sm">
                        <p className="font-semibold text-white">{data.name}</p>
                        <p className="text-gray-300">Antigüedad: {data.tenure} años</p>
                        <p className="text-gray-300">Rotación: {data.churnPercentage.toFixed(0)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Empleados" data={scatterData} fill="#8884d8">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRiskColor(entry.churnProbability)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Employees at Risk Table */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Empleados en Riesgo</CardTitle>
          <CardDescription className="text-gray-400">Ordenados por probabilidad de rotación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 text-gray-400 font-semibold">Empleado</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">Depto</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">FWI</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">Antigüedad</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">Riesgo</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-semibold">Intervención</th>
                </tr>
              </thead>
              <tbody>
                {displayEmployees
                  .sort((a, b) => b.churnProbability - a.churnProbability)
                  .map((employee, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2 text-white font-medium">{employee.name}</td>
                      <td className="py-3 px-2 text-center text-gray-300">{employee.department}</td>
                      <td className="py-3 px-2 text-center text-gray-300">{employee.fwiScore}</td>
                      <td className="py-3 px-2 text-center text-gray-300">{employee.tenure}a</td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={`${
                          employee.churnProbability >= 0.75 ? 'bg-red-500/20 text-red-400' :
                          employee.churnProbability >= 0.5 ? 'bg-orange-500/20 text-orange-400' :
                          employee.churnProbability >= 0.25 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        } border-transparent`}>
                          {getRiskLabel(employee.churnProbability)} ({(employee.churnProbability * 100).toFixed(0)}%)
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-gray-300 text-xs">{employee.interventionSuggested}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Risk Factors */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Factores de Riesgo Principales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
            <p className="font-semibold text-red-400 mb-1">🚨 Crítico</p>
            <p className="text-sm text-gray-300">
              {criticalRisk} empleados con riesgo crítico (75-100% probabilidad). Requieren intervención inmediata.
            </p>
          </div>

          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded">
            <p className="font-semibold text-orange-400 mb-1">⚠️ Alto Riesgo</p>
            <p className="text-sm text-gray-300">
              {highRisk} empleados con alto riesgo (50-75% probabilidad). Implementar intervenciones en próximas 2 semanas.
            </p>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="font-semibold text-blue-400 mb-1">📊 Impacto Estimado</p>
            <p className="text-sm text-gray-300">
              Probabilidad promedio de rotación: {(avgChurnProbability * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Si no se interviene, se espera pérdida de {Math.round(displayEmployees.length * avgChurnProbability)} empleados en los próximos 6 meses.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
