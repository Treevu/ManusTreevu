import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';

export interface InterventionData {
  type: string;
  count: number;
  successful: number;
  cost: number;
  benefit: number;
  avgFwiImprovement: number;
  retentionRate: number;
}

interface InterventionROIProps {
  data?: InterventionData[];
  isLoading?: boolean;
}

export default function InterventionROI({
  data,
  isLoading = false,
}: InterventionROIProps) {
  // Default data if none provided
  const defaultData: InterventionData[] = [
    {
      type: 'Asesoría Financiera',
      count: 45,
      successful: 38,
      cost: 2500,
      benefit: 12000,
      avgFwiImprovement: 15,
      retentionRate: 0.92,
    },
    {
      type: 'Programa EWA',
      count: 120,
      successful: 95,
      cost: 1500,
      benefit: 8500,
      avgFwiImprovement: 12,
      retentionRate: 0.88,
    },
    {
      type: 'Coaching Personal',
      count: 30,
      successful: 27,
      cost: 4000,
      benefit: 15000,
      avgFwiImprovement: 20,
      retentionRate: 0.95,
    },
    {
      type: 'Educación Financiera',
      count: 200,
      successful: 150,
      cost: 800,
      benefit: 5000,
      avgFwiImprovement: 8,
      retentionRate: 0.85,
    },
    {
      type: 'Apoyo Psicosocial',
      count: 50,
      successful: 42,
      cost: 3000,
      benefit: 11000,
      avgFwiImprovement: 14,
      retentionRate: 0.90,
    },
  ];

  const displayData = data || defaultData;

  // Calculate ROI for each intervention
  const dataWithROI = displayData.map(intervention => ({
    ...intervention,
    roi: ((intervention.benefit - intervention.cost) / intervention.cost) * 100,
    successRate: (intervention.successful / intervention.count) * 100,
  }));

  // Calculate totals
  const totals = {
    interventions: displayData.reduce((sum, d) => sum + d.count, 0),
    successful: displayData.reduce((sum, d) => sum + d.successful, 0),
    totalCost: displayData.reduce((sum, d) => sum + d.cost, 0),
    totalBenefit: displayData.reduce((sum, d) => sum + d.benefit, 0),
  };

  const totalROI = ((totals.totalBenefit - totals.totalCost) / totals.totalCost) * 100;
  const overallSuccessRate = (totals.successful / totals.interventions) * 100;

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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white">ROI Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-400">{totalROI.toFixed(0)}%</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white">Tasa de Éxito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-400">{overallSuccessRate.toFixed(1)}%</span>
              <span className="text-xs text-gray-400">({totals.successful}/{totals.interventions})</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white">Inversión Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">${(totals.totalCost / 1000).toFixed(1)}K</span>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white">Beneficio Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-400">${(totals.totalBenefit / 1000).toFixed(1)}K</span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Effectiveness by Type */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Efectividad por Tipo de Intervención</CardTitle>
          <CardDescription className="text-gray-400">ROI y tasa de éxito de cada intervención</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataWithROI}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="type" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={80} />
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
              <Bar dataKey="roi" fill="#22c55e" name="ROI (%)" />
              <Bar dataKey="successRate" fill="#3b82f6" name="Tasa de Éxito (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cost vs Benefit */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Costo vs Beneficio</CardTitle>
          <CardDescription className="text-gray-400">Análisis de inversión por intervención</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="cost"
                name="Costo ($)"
                type="number"
                stroke="rgba(255,255,255,0.5)"
                label={{ value: 'Costo ($)', position: 'insideBottomRight', offset: -10 }}
              />
              <YAxis
                dataKey="benefit"
                name="Beneficio ($)"
                type="number"
                stroke="rgba(255,255,255,0.5)"
                label={{ value: 'Beneficio ($)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Scatter name="Intervenciones" data={displayData} fill="#8884d8">
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${(index * 60) % 360}, 70%, 50%)`} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Detalles por Intervención</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 text-gray-400 font-semibold">Tipo</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">Cantidad</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">Exitosas</th>
                  <th className="text-right py-3 px-2 text-gray-400 font-semibold">Costo</th>
                  <th className="text-right py-3 px-2 text-gray-400 font-semibold">Beneficio</th>
                  <th className="text-right py-3 px-2 text-gray-400 font-semibold">ROI</th>
                  <th className="text-right py-3 px-2 text-gray-400 font-semibold">FWI Mejora</th>
                </tr>
              </thead>
              <tbody>
                {dataWithROI.map((intervention, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 text-white font-medium">{intervention.type}</td>
                    <td className="py-3 px-2 text-center text-gray-300">{intervention.count}</td>
                    <td className="py-3 px-2 text-center">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {intervention.successful}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right text-gray-300">${intervention.cost.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right text-emerald-400">${intervention.benefit.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right">
                      <Badge className={`${intervention.roi > 200 ? 'bg-green-500/20 text-green-400' : intervention.roi > 100 ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'} border-transparent`}>
                        {intervention.roi.toFixed(0)}%
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right text-blue-400">+{intervention.avgFwiImprovement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-sm text-green-300">
            ✅ <strong>Coaching Personal</strong> tiene el mejor ROI ({dataWithROI[2].roi.toFixed(0)}%). Considera aumentar inversión.
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-sm text-blue-300">
            📊 <strong>Educación Financiera</strong> tiene la mejor escala (200 intervenciones). Mantener como base.
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-sm text-amber-300">
            ⚠️ El ROI total es {totalROI.toFixed(0)}%. Continuar monitoreando y ajustando estrategias.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
