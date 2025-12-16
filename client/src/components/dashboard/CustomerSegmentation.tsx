import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, DollarSign } from 'lucide-react';

export interface SegmentData {
  name: string;
  customers: number;
  revenue: number;
  avgOrderValue: number;
  frequency: number;
  retention: number;
  growth: number;
}

interface CustomerSegmentationProps {
  data?: SegmentData[];
  isLoading?: boolean;
}

export default function CustomerSegmentation({
  data,
  isLoading = false,
}: CustomerSegmentationProps) {
  // Default data if none provided
  const defaultData: SegmentData[] = [
    {
      name: 'VIP Premium',
      customers: 150,
      revenue: 450000,
      avgOrderValue: 3000,
      frequency: 8,
      retention: 0.95,
      growth: 0.15,
    },
    {
      name: 'Clientes Frecuentes',
      customers: 500,
      revenue: 600000,
      avgOrderValue: 1200,
      frequency: 4,
      retention: 0.85,
      growth: 0.08,
    },
    {
      name: 'Clientes Ocasionales',
      customers: 1200,
      revenue: 400000,
      avgOrderValue: 333,
      frequency: 1,
      retention: 0.60,
      growth: 0.05,
    },
    {
      name: 'Nuevos Clientes',
      customers: 800,
      revenue: 200000,
      avgOrderValue: 250,
      frequency: 0.5,
      retention: 0.40,
      growth: 0.20,
    },
    {
      name: 'En Riesgo',
      customers: 300,
      revenue: 50000,
      avgOrderValue: 167,
      frequency: 0.2,
      retention: 0.20,
      growth: -0.15,
    },
  ];

  const displayData = data || defaultData;

  // Calculate totals
  const totals = {
    customers: displayData.reduce((sum, d) => sum + d.customers, 0),
    revenue: displayData.reduce((sum, d) => sum + d.revenue, 0),
    avgOrderValue: displayData.reduce((sum, d) => sum + d.avgOrderValue * d.customers, 0) / displayData.reduce((sum, d) => sum + d.customers, 0),
  };

  // Colors for segments
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  // Prepare data for pie chart
  const pieData = displayData.map(segment => ({
    name: segment.name,
    value: segment.customers,
  }));

  // Prepare data for revenue chart
  const revenueData = displayData.map(segment => ({
    name: segment.name,
    revenue: segment.revenue,
    customers: segment.customers,
  }));

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">Cargando segmentación...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Total Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totals.customers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">${(totals.revenue / 1000).toFixed(0)}K</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Ticket Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${totals.avgOrderValue.toFixed(0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution by Segment */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Distribución de Clientes</CardTitle>
          <CardDescription className="text-gray-400">Cantidad de clientes por segmento</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Segment */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Ingresos por Segmento</CardTitle>
          <CardDescription className="text-gray-400">Contribución de cada segmento al ingreso total</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
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
              <Bar dataKey="revenue" fill="#22c55e" name="Ingresos ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Segment Analysis */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Análisis Detallado por Segmento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayData.map((segment, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{segment.name}</h3>
                    <p className="text-sm text-gray-400">{segment.customers} clientes</p>
                  </div>
                  <Badge className={`${
                    segment.growth > 0.1 ? 'bg-green-500/20 text-green-400' :
                    segment.growth > 0 ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  } border-transparent`}>
                    {segment.growth > 0 ? '+' : ''}{(segment.growth * 100).toFixed(0)}%
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400">Ingresos</p>
                    <p className="font-semibold text-white">${(segment.revenue / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Ticket Promedio</p>
                    <p className="font-semibold text-white">${segment.avgOrderValue.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Frecuencia</p>
                    <p className="font-semibold text-white">{segment.frequency.toFixed(1)}x/año</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Retención</p>
                    <p className="font-semibold text-white">{(segment.retention * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Recommendations */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Recomendaciones Estratégicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-sm text-green-300">
            ✅ <strong>VIP Premium:</strong> {((displayData[0].revenue / totals.revenue) * 100).toFixed(1)}% de ingresos. Implementar programa de fidelización exclusivo.
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-sm text-blue-300">
            📈 <strong>Nuevos Clientes:</strong> Crecimiento de {(displayData[3].growth * 100).toFixed(0)}%. Aumentar inversión en adquisición.
          </div>
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-300">
            ⚠️ <strong>En Riesgo:</strong> Retención de {(displayData[4].retention * 100).toFixed(0)}%. Implementar programa de recuperación urgente.
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-sm text-amber-300">
            💡 <strong>Clientes Ocasionales:</strong> Potencial de upsell. Crear campaña de reengagement personalizada.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
