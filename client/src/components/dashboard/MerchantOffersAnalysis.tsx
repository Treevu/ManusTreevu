import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Eye, MousePointerClick, DollarSign, Users, Target, Zap } from 'lucide-react';

interface MerchantOffersAnalysisProps {
  offers?: any[];
}

// Mock data
const mockOffers = [
  {
    id: 1,
    title: '20% Descuento en Compra',
    category: 'discount',
    pointsCost: 500,
    views: 1250,
    clicks: 340,
    conversions: 85,
    revenue: 4250,
    targetSegment: 'all',
    status: 'active',
  },
  {
    id: 2,
    title: 'Envío Gratis',
    category: 'service',
    pointsCost: 300,
    views: 890,
    clicks: 210,
    conversions: 52,
    revenue: 2100,
    targetSegment: 'high',
    status: 'active',
  },
  {
    id: 3,
    title: 'Cashback $10',
    category: 'gift',
    pointsCost: 400,
    views: 2100,
    clicks: 620,
    conversions: 156,
    revenue: 6240,
    targetSegment: 'mid',
    status: 'active',
  },
  {
    id: 4,
    title: 'Acceso VIP',
    category: 'experience',
    pointsCost: 800,
    views: 450,
    clicks: 95,
    conversions: 18,
    revenue: 1440,
    targetSegment: 'high',
    status: 'paused',
  },
];

const performanceData = [
  { name: 'Semana 1', views: 2400, clicks: 600, conversions: 150 },
  { name: 'Semana 2', views: 2800, clicks: 720, conversions: 180 },
  { name: 'Semana 3', views: 2200, clicks: 550, conversions: 140 },
  { name: 'Semana 4', views: 3100, clicks: 850, conversions: 210 },
];

export default function MerchantOffersAnalysis({ offers }: MerchantOffersAnalysisProps) {
  const data = offers || mockOffers;

  const totalViews = data.reduce((sum, o) => sum + o.views, 0);
  const totalClicks = data.reduce((sum, o) => sum + o.clicks, 0);
  const totalConversions = data.reduce((sum, o) => sum + o.conversions, 0);
  const totalRevenue = data.reduce((sum, o) => sum + o.revenue, 0);

  const avgClickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;
  const avgConversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : 0;

  const pieData = data.map(o => ({
    name: o.title,
    value: o.revenue,
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Vistas</p>
                <p className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Clics</p>
                <p className="text-2xl font-bold text-white">{totalClicks.toLocaleString()}</p>
              </div>
              <MousePointerClick className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Conversiones</p>
                <p className="text-2xl font-bold text-white">{totalConversions.toLocaleString()}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ingresos</p>
                <p className="text-2xl font-bold text-white">${(totalRevenue / 100).toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Tasa de Clics Promedio</p>
              <p className="text-3xl font-bold text-white">{avgClickRate}%</p>
              <p className="text-xs text-gray-500 mt-2">CTR (Click-Through Rate)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Tasa de Conversión</p>
              <p className="text-3xl font-bold text-white">{avgConversionRate}%</p>
              <p className="text-xs text-gray-500 mt-2">Conversión de Clics</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Ingresos Promedio</p>
              <p className="text-3xl font-bold text-white">${((totalRevenue / data.length) / 100).toFixed(0)}</p>
              <p className="text-xs text-gray-500 mt-2">Por Oferta</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trend */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-white">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Rendimiento Semanal
          </CardTitle>
          <CardDescription className="text-gray-400">
            Tendencia de vistas, clics y conversiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
              />
              <Legend />
              <Bar dataKey="views" fill="#3b82f6" name="Vistas" />
              <Bar dataKey="clicks" fill="#a855f7" name="Clics" />
              <Bar dataKey="conversions" fill="#10b981" name="Conversiones" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Distribución de Ingresos</CardTitle>
            <CardDescription className="text-gray-400">
              Ingresos por oferta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${(value / 100).toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                  formatter={(value: any) => `$${(Number(value) / 100).toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Offers */}
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Ofertas Principales</CardTitle>
            <CardDescription className="text-gray-400">
              Mejores ofertas por rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 4)
                .map((offer) => (
                  <div key={offer.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-white">{offer.title}</p>
                        <p className="text-xs text-gray-500">{offer.pointsCost} puntos</p>
                      </div>
                      <Badge
                        className={
                          offer.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {offer.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500">Clics</p>
                        <p className="font-semibold text-white">{offer.clicks}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Conv.</p>
                        <p className="font-semibold text-white">{offer.conversions}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Ingresos</p>
                        <p className="font-semibold text-white">${(offer.revenue / 100).toFixed(0)}</p>
                      </div>
                    </div>
                    <Progress
                      value={
                        offer.clicks > 0
                          ? Math.min(100, (offer.conversions / offer.clicks) * 100)
                          : 0
                      }
                      className="mt-2 h-1"
                    />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Offers Table */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white">Todas las Ofertas</CardTitle>
          <CardDescription className="text-gray-400">
            Análisis detallado de cada oferta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400">Oferta</th>
                  <th className="text-center py-3 px-4 text-gray-400">Vistas</th>
                  <th className="text-center py-3 px-4 text-gray-400">Clics</th>
                  <th className="text-center py-3 px-4 text-gray-400">CTR</th>
                  <th className="text-center py-3 px-4 text-gray-400">Conv.</th>
                  <th className="text-center py-3 px-4 text-gray-400">Ingresos</th>
                  <th className="text-center py-3 px-4 text-gray-400">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.map((offer) => {
                  const ctr = offer.views > 0 ? ((offer.clicks / offer.views) * 100).toFixed(1) : 0;
                  return (
                    <tr key={offer.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-white">{offer.title}</td>
                      <td className="text-center py-3 px-4 text-gray-400">{offer.views}</td>
                      <td className="text-center py-3 px-4 text-gray-400">{offer.clicks}</td>
                      <td className="text-center py-3 px-4 text-gray-400">{ctr}%</td>
                      <td className="text-center py-3 px-4 text-gray-400">{offer.conversions}</td>
                      <td className="text-center py-3 px-4 text-green-400 font-semibold">
                        ${(offer.revenue / 100).toFixed(0)}
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge
                          className={
                            offer.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {offer.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
