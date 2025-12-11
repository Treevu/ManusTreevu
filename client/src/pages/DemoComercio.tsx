import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Store, TrendingUp, Users, DollarSign, Gift, Star,
  TreePine, BarChart3, Target, Zap, ShoppingBag, Percent,
  ArrowUpRight, Eye, MousePointer, CreditCard, Calendar, Clock,
  Sparkles, PieChart, Award, Filter, Play, Pause
} from 'lucide-react';
import { Link } from 'wouter';

// Datos de demostración Comercio
const DEMO_DATA = {
  merchant: {
    name: 'Cinépolis',
    category: 'Entretenimiento',
    logo: '🎬',
    rating: 4.8,
    reviews: 1250
  },
  metrics: {
    totalSales: 285000,
    salesTrend: '+18%',
    redemptions: 3420,
    redemptionsTrend: '+25%',
    avgTicket: 185,
    ticketTrend: '+8%',
    conversionRate: 12.5,
    roi: 340
  },
  campaigns: [
    { 
      id: 1, 
      name: '2x1 en Entradas', 
      status: 'active',
      impressions: 45000,
      clicks: 5400,
      conversions: 680,
      spent: 15000,
      revenue: 62000,
      startDate: '1 Dic',
      endDate: '31 Dic'
    },
    { 
      id: 2, 
      name: 'Combo Familiar -30%', 
      status: 'active',
      impressions: 32000,
      clicks: 3800,
      conversions: 420,
      spent: 8000,
      revenue: 38000,
      startDate: '15 Nov',
      endDate: '15 Ene'
    },
    { 
      id: 3, 
      name: 'Palomitas Gratis', 
      status: 'completed',
      impressions: 28000,
      clicks: 4200,
      conversions: 890,
      spent: 12000,
      revenue: 45000,
      startDate: '1 Nov',
      endDate: '30 Nov'
    }
  ],
  topOffers: [
    { name: '2x1 Entradas', redemptions: 680, points: 200, conversion: 12.6 },
    { name: 'Combo -30%', redemptions: 420, points: 150, conversion: 11.1 },
    { name: 'Palomitas Gratis', redemptions: 890, points: 100, conversion: 21.2 }
  ],
  demographics: {
    age: [
      { range: '18-24', percent: 28 },
      { range: '25-34', percent: 35 },
      { range: '35-44', percent: 22 },
      { range: '45+', percent: 15 }
    ],
    gender: { male: 48, female: 52 },
    topDepartments: ['Ingeniería', 'Ventas', 'Marketing']
  },
  monthlyData: [
    { month: 'Jul', sales: 180000, redemptions: 2100 },
    { month: 'Ago', sales: 195000, redemptions: 2400 },
    { month: 'Sep', sales: 210000, redemptions: 2650 },
    { month: 'Oct', sales: 235000, redemptions: 2900 },
    { month: 'Nov', sales: 260000, redemptions: 3150 },
    { month: 'Dic', sales: 285000, redemptions: 3420 }
  ],
  recentRedemptions: [
    { id: 1, user: 'María G.', offer: '2x1 Entradas', points: 200, time: 'Hace 5 min' },
    { id: 2, user: 'Carlos L.', offer: 'Combo -30%', points: 150, time: 'Hace 12 min' },
    { id: 3, user: 'Ana M.', offer: '2x1 Entradas', points: 200, time: 'Hace 18 min' },
    { id: 4, user: 'Pedro R.', offer: 'Palomitas Gratis', points: 100, time: 'Hace 25 min' },
    { id: 5, user: 'Laura S.', offer: '2x1 Entradas', points: 200, time: 'Hace 32 min' }
  ]
};

function MetricCard({ 
  title, value, subtitle, trend, icon: Icon, color = 'pink' 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  trend?: string; 
  icon: React.ElementType;
  color?: 'pink' | 'emerald' | 'blue' | 'purple' | 'amber';
}) {
  const colors = {
    pink: 'from-pink-900/50 to-pink-800/30 border-pink-700/50 text-pink-400',
    emerald: 'from-emerald-900/50 to-emerald-800/30 border-emerald-700/50 text-emerald-400',
    blue: 'from-blue-900/50 to-blue-800/30 border-blue-700/50 text-blue-400',
    purple: 'from-purple-900/50 to-purple-800/30 border-purple-700/50 text-purple-400',
    amber: 'from-amber-900/50 to-amber-800/30 border-amber-700/50 text-amber-400'
  };

  return (
    <Card className={`bg-gradient-to-br ${colors[color]} border`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
          </div>
          <div className={`w-12 h-12 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${colors[color].split(' ').pop()}`} />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-3 text-sm text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            {trend} vs mes anterior
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type Campaign = typeof DEMO_DATA.campaigns[0];
type Redemption = typeof DEMO_DATA.recentRedemptions[0];

export default function DemoComercio() {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'analytics' | 'audience'>('overview');
  
  // Estados para modales
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedRedemption, setSelectedRedemption] = useState<Redemption | null>(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', discount: '', budget: '' });
  
  // Nuevos modales
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showSegmentationModal, setShowSegmentationModal] = useState(false);
  const [showCompetitorAnalysisModal, setShowCompetitorAnalysisModal] = useState(false);
  const [showScheduleCampaignModal, setShowScheduleCampaignModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0a0a]/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <a className="flex items-center gap-2 text-white font-bold text-xl">
                <TreePine className="w-6 h-6 text-emerald-400" />
                Treevü
              </a>
            </Link>
            <Badge variant="outline" className="border-pink-500/50 text-pink-400">
              Demo Comercio
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-purple-400"
              onClick={() => setShowSegmentationModal(true)}
            >
              <Filter className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Segmentar</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-emerald-400"
              onClick={() => setShowCompetitorAnalysisModal(true)}
            >
              <Award className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">vs Competencia</span>
            </Button>
            <div className="text-right hidden sm:block ml-2">
              <p className="text-white font-medium">{DEMO_DATA.merchant.name}</p>
              <div className="flex items-center gap-1 justify-end">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-amber-400 text-sm">{DEMO_DATA.merchant.rating}</span>
                <span className="text-gray-400 text-sm">({DEMO_DATA.merchant.reviews})</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-xl">
              {DEMO_DATA.merchant.logo}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Resumen', icon: Store },
              { id: 'campaigns', label: 'Campañas', icon: Target },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'audience', label: 'Audiencia', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-pink-400 text-pink-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Ventas Totales"
                value={`$${(DEMO_DATA.metrics.totalSales / 1000).toFixed(0)}K`}
                trend={DEMO_DATA.metrics.salesTrend}
                icon={DollarSign}
                color="emerald"
              />
              <MetricCard
                title="Canjes TreePoints"
                value={DEMO_DATA.metrics.redemptions.toLocaleString()}
                trend={DEMO_DATA.metrics.redemptionsTrend}
                icon={Gift}
                color="pink"
              />
              <MetricCard
                title="Ticket Promedio"
                value={`$${DEMO_DATA.metrics.avgTicket}`}
                trend={DEMO_DATA.metrics.ticketTrend}
                icon={ShoppingBag}
                color="blue"
              />
              <MetricCard
                title="ROI Campañas"
                value={`${DEMO_DATA.metrics.roi}%`}
                subtitle="Retorno de inversión"
                icon={TrendingUp}
                color="purple"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Campaigns */}
              <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-pink-400" />
                      Campañas Activas
                    </span>
                    <Button variant="outline" size="sm" className="border-pink-500/50 text-pink-400" onClick={() => setShowNewCampaignModal(true)}>
                      Nueva Campaña
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {DEMO_DATA.campaigns.filter(c => c.status === 'active').map((campaign) => (
                      <div key={campaign.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-white font-medium">{campaign.name}</h4>
                            <p className="text-gray-400 text-sm">{campaign.startDate} - {campaign.endDate}</p>
                          </div>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                            Activa
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <p className="text-gray-400 text-xs">Impresiones</p>
                            <p className="text-white font-bold">{(campaign.impressions / 1000).toFixed(1)}K</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Clicks</p>
                            <p className="text-white font-bold">{(campaign.clicks / 1000).toFixed(1)}K</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Conversiones</p>
                            <p className="text-emerald-400 font-bold">{campaign.conversions}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">ROI</p>
                            <p className="text-pink-400 font-bold">{Math.round((campaign.revenue / campaign.spent - 1) * 100)}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Redemptions */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-400" />
                    Canjes Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {DEMO_DATA.recentRedemptions.map((redemption) => (
                      <div key={redemption.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800" onClick={() => setSelectedRedemption(redemption)}>
                        <div>
                          <p className="text-white text-sm font-medium">{redemption.user}</p>
                          <p className="text-gray-400 text-xs">{redemption.offer}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-amber-400 text-sm font-medium">{redemption.points} pts</p>
                          <p className="text-gray-500 text-xs">{redemption.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Offers Performance */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Rendimiento de Ofertas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DEMO_DATA.topOffers.map((offer, i) => (
                    <div key={i} className="p-4 rounded-lg bg-gradient-to-br from-gray-800 to-gray-800/50 border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-medium">{offer.name}</h4>
                        <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                          {offer.points} pts
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Canjes</span>
                          <span className="text-white font-bold">{offer.redemptions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Conversión</span>
                          <span className="text-emerald-400 font-bold">{offer.conversion}%</span>
                        </div>
                        <Progress value={offer.conversion * 4} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Todas las Campañas</h2>
              <Button className="bg-pink-500 hover:bg-pink-600" onClick={() => setShowNewCampaignModal(true)}>
                <Target className="w-4 h-4 mr-2" />
                Nueva Campaña
              </Button>
            </div>
            
            <div className="grid gap-4">
              {DEMO_DATA.campaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-gray-900 border-gray-800 cursor-pointer hover:border-gray-700 transition-colors" onClick={() => setSelectedCampaign(campaign)}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          campaign.status === 'active' ? 'bg-emerald-500/20' : 'bg-gray-700'
                        }`}>
                          <Target className={`w-6 h-6 ${
                            campaign.status === 'active' ? 'text-emerald-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-white font-medium text-lg">{campaign.name}</h3>
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            {campaign.startDate} - {campaign.endDate}
                          </div>
                        </div>
                      </div>
                      <Badge className={campaign.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                        : 'bg-gray-700 text-gray-400 border-gray-600'
                      }>
                        {campaign.status === 'active' ? 'Activa' : 'Completada'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
                      <div className="text-center p-3 rounded-lg bg-gray-800/50">
                        <Eye className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <p className="text-white font-bold">{(campaign.impressions / 1000).toFixed(1)}K</p>
                        <p className="text-gray-400 text-xs">Impresiones</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gray-800/50">
                        <MousePointer className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-white font-bold">{(campaign.clicks / 1000).toFixed(1)}K</p>
                        <p className="text-gray-400 text-xs">Clicks</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gray-800/50">
                        <Percent className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <p className="text-white font-bold">{((campaign.clicks / campaign.impressions) * 100).toFixed(1)}%</p>
                        <p className="text-gray-400 text-xs">CTR</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gray-800/50">
                        <CreditCard className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                        <p className="text-white font-bold">{campaign.conversions}</p>
                        <p className="text-gray-400 text-xs">Conversiones</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gray-800/50">
                        <DollarSign className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                        <p className="text-white font-bold">${(campaign.revenue / 1000).toFixed(0)}K</p>
                        <p className="text-gray-400 text-xs">Revenue</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-pink-500/10 border border-pink-500/30">
                        <TrendingUp className="w-5 h-5 text-pink-400 mx-auto mb-1" />
                        <p className="text-pink-400 font-bold">{Math.round((campaign.revenue / campaign.spent - 1) * 100)}%</p>
                        <p className="text-gray-400 text-xs">ROI</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Ventas Mensuales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {DEMO_DATA.monthlyData.map((month) => (
                      <div key={month.month} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all"
                          style={{ height: `${(month.sales / 300000) * 200}px` }}
                        />
                        <span className="text-white font-bold text-sm mt-2">${(month.sales / 1000).toFixed(0)}K</span>
                        <span className="text-gray-400 text-xs">{month.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Canjes por Mes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {DEMO_DATA.monthlyData.map((month) => (
                      <div key={month.month} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-pink-500 to-pink-400 rounded-t-lg transition-all"
                          style={{ height: `${(month.redemptions / 4000) * 200}px` }}
                        />
                        <span className="text-white font-bold text-sm mt-2">{month.redemptions}</span>
                        <span className="text-gray-400 text-xs">{month.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Funnel de Conversión</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Impresiones</span>
                      <span className="text-white font-bold">105,000</span>
                    </div>
                    <div className="h-8 bg-blue-500/30 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-blue-500" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Clicks</span>
                      <span className="text-white font-bold">13,400 (12.8%)</span>
                    </div>
                    <div className="h-8 bg-purple-500/30 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-purple-500" style={{ width: '12.8%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Conversiones</span>
                      <span className="text-emerald-400 font-bold">1,990 (14.9%)</span>
                    </div>
                    <div className="h-8 bg-emerald-500/30 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-emerald-500" style={{ width: '14.9%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'audience' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Distribución por Edad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DEMO_DATA.demographics.age.map((age) => (
                    <div key={age.range} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{age.range} años</span>
                        <span className="text-white font-bold">{age.percent}%</span>
                      </div>
                      <Progress value={age.percent} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Género</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-blue-500/20 border-4 border-blue-500 flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-400 font-bold text-2xl">{DEMO_DATA.demographics.gender.male}%</span>
                    </div>
                    <p className="text-gray-400">Masculino</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-pink-500/20 border-4 border-pink-500 flex items-center justify-center mx-auto mb-2">
                      <span className="text-pink-400 font-bold text-2xl">{DEMO_DATA.demographics.gender.female}%</span>
                    </div>
                    <p className="text-gray-400">Femenino</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">Top Departamentos que Canjean</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DEMO_DATA.demographics.topDepartments.map((dept, i) => (
                    <div key={dept} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                      <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                        i === 0 ? 'bg-amber-500/20 text-amber-400' :
                        i === 1 ? 'bg-gray-400/20 text-gray-300' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        <span className="font-bold text-lg">#{i + 1}</span>
                      </div>
                      <p className="text-white font-medium">{dept}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* CTA Footer */}
      <div className="border-t border-gray-800 bg-gradient-to-r from-pink-900/20 to-purple-900/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">¿Quieres llegar a miles de empleados con poder adquisitivo?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#founders-form">
              <Button size="lg" className="bg-pink-500 hover:bg-pink-600">
                Convertirme en Partner
              </Button>
            </Link>
            <Link href="/demo/empresa">
              <Button size="lg" variant="outline" className="border-pink-500/50 text-pink-400">
                Ver Demo Empresa
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal: Detalle de Campaña */}
      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-400" />
              {selectedCampaign?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedCampaign?.startDate} - {selectedCampaign?.endDate}
            </DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <Eye className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{selectedCampaign.impressions.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">Impresiones</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <MousePointer className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{selectedCampaign.clicks.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">Clicks</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <CreditCard className="w-5 h-5 text-pink-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{selectedCampaign.conversions}</p>
                  <p className="text-gray-400 text-xs">Conversiones</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">CTR</span>
                  <span className="text-white font-medium">{((selectedCampaign.clicks / selectedCampaign.impressions) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tasa de conversión</span>
                  <span className="text-white font-medium">{((selectedCampaign.conversions / selectedCampaign.clicks) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gasto</span>
                  <span className="text-red-400 font-medium">${selectedCampaign.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ingresos</span>
                  <span className="text-emerald-400 font-medium">${selectedCampaign.revenue.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between">
                  <span className="text-gray-300 font-medium">ROI</span>
                  <span className="text-pink-400 font-bold text-lg">{Math.round(((selectedCampaign.revenue - selectedCampaign.spent) / selectedCampaign.spent) * 100)}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={selectedCampaign.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}>
                  {selectedCampaign.status === 'active' ? 'Activa' : 'Finalizada'}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedCampaign(null)} className="border-gray-600">
              Cerrar
            </Button>
            <Button className="bg-pink-500 hover:bg-pink-600" onClick={() => {
              toast.success('Campaña duplicada exitosamente');
              setSelectedCampaign(null);
            }}>
              Duplicar Campaña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Detalle de Canje */}
      <Dialog open={!!selectedRedemption} onOpenChange={() => setSelectedRedemption(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              Detalle del Canje
            </DialogTitle>
          </DialogHeader>
          {selectedRedemption && (
            <div className="space-y-4 py-4">
              <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 text-center">
                <p className="text-3xl font-bold text-amber-400">{selectedRedemption.offer}</p>
                <p className="text-gray-400 mt-2">{selectedRedemption.user}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">TreePoints canjeados</span>
                  <span className="text-amber-400 font-medium">{selectedRedemption.points} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fecha y hora</span>
                  <span className="text-white">{selectedRedemption.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estado</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Completado</Badge>
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-sm">
                <p className="text-emerald-400 font-medium">Ingreso generado</p>
                <p className="text-emerald-200/80 mt-1">Este canje generó aproximadamente $185 MXN en ventas adicionales.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRedemption(null)} className="border-gray-600 w-full">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Nueva Campaña */}
      <Dialog open={showNewCampaignModal} onOpenChange={setShowNewCampaignModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-pink-400" />
              Crear Nueva Campaña
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Configura tu nueva oferta para empleados de Treevü
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Nombre de la campaña</Label>
              <Input 
                placeholder="Ej: 2x1 en Entradas" 
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Descuento u oferta</Label>
              <Input 
                placeholder="Ej: 30% de descuento" 
                value={newCampaign.discount}
                onChange={(e) => setNewCampaign({...newCampaign, discount: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Presupuesto (MXN)</Label>
              <Input 
                type="number"
                placeholder="15000" 
                value={newCampaign.budget}
                onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-3 text-sm">
              <p className="text-pink-400 font-medium">Alcance estimado</p>
              <p className="text-pink-200/80 mt-1">Con este presupuesto podrás alcanzar aproximadamente 25,000 empleados.</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowNewCampaignModal(false)} className="border-gray-600">
              Cancelar
            </Button>
            <Button className="bg-pink-500 hover:bg-pink-600" onClick={() => {
              if (newCampaign.name && newCampaign.discount) {
                toast.success(`Campaña "${newCampaign.name}" creada exitosamente`);
                setNewCampaign({ name: '', discount: '', budget: '' });
                setShowNewCampaignModal(false);
              } else {
                toast.error('Por favor completa todos los campos');
              }
            }}>
              Crear Campaña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Bienvenida Comercio */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-amber-900/30 border-amber-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Store className="w-6 h-6 text-amber-400" />
              </div>
              ¡Bienvenido a tu Dashboard de Comercio!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-gray-300">Este es el centro de control de <strong className="text-white">{DEMO_DATA.merchant.name}</strong> en el ecosistema Treevü. Aquí puedes:</p>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3">
                <Gift className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Crear Ofertas Exclusivas</p>
                  <p className="text-sm text-gray-400">Descuentos canjeables con TreePoints</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3">
                <Target className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Segmentar Audiencia</p>
                  <p className="text-sm text-gray-400">Llega a usuarios por FWI, edad, ubicación</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3">
                <BarChart3 className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Medir Conversiones</p>
                  <p className="text-sm text-gray-400">ROI, impresiones, clicks y canjes en tiempo real</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3">
                <Users className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Conocer tu Audiencia</p>
                  <p className="text-sm text-gray-400">Demografía y comportamiento de clientes</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm">
              <p className="text-amber-300"><strong>Alcance potencial:</strong> 45,000 usuarios activos en tu zona listos para descubrir tus ofertas.</p>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black" onClick={() => setShowWelcomeModal(false)}>
              Explorar Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Segmentación de Audiencia */}
      <Dialog open={showSegmentationModal} onOpenChange={setShowSegmentationModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-400" />
              Segmentación de Audiencia
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Define tu público objetivo para campañas más efectivas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label className="text-gray-300">Rango de FWI</Label>
              <div className="grid grid-cols-3 gap-2">
                {['Bajo (0-50)', 'Medio (51-75)', 'Alto (76-100)'].map((range, i) => (
                  <Button key={i} variant="outline" size="sm" className="border-gray-600" onClick={() => toast.info(`Segmento ${range} seleccionado`)}>
                    {range}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-gray-300">Rango de Edad</Label>
              <div className="grid grid-cols-4 gap-2">
                {['18-25', '26-35', '36-45', '46+'].map((age, i) => (
                  <Button key={i} variant="outline" size="sm" className="border-gray-600">
                    {age}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-gray-300">Departamento</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Ingeniería', 'Ventas', 'Marketing', 'Operaciones'].map((dept, i) => (
                  <Button key={i} variant="outline" size="sm" className="border-gray-600">
                    {dept}
                  </Button>
                ))}
              </div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Audiencia estimada</span>
                <span className="text-purple-400 font-bold">~12,500 usuarios</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSegmentationModal(false)} className="border-gray-600">
              Cancelar
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600" onClick={() => {
              toast.success('Segmento guardado');
              setShowSegmentationModal(false);
            }}>
              Aplicar Segmento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Análisis de Competencia */}
      <Dialog open={showCompetitorAnalysisModal} onOpenChange={setShowCompetitorAnalysisModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Análisis de Competencia
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Cómo se comparan tus ofertas vs otros comercios en {DEMO_DATA.merchant.category}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {[
              { metric: 'Descuento Promedio', yours: '25%', industry: '20%', better: true },
              { metric: 'Tasa de Conversión', yours: '12.5%', industry: '8.2%', better: true },
              { metric: 'Rating Promedio', yours: '4.8', industry: '4.2', better: true },
              { metric: 'Tiempo de Canje', yours: '2.3 días', industry: '4.1 días', better: true },
              { metric: 'Repetición de Clientes', yours: '34%', industry: '22%', better: true }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                <span className="text-gray-300">{item.metric}</span>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-amber-400 font-bold">{item.yours}</p>
                    <p className="text-gray-500 text-xs">Tú</p>
                  </div>
                  <div className="text-gray-600">vs</div>
                  <div className="text-right">
                    <p className="text-gray-400">{item.industry}</p>
                    <p className="text-gray-500 text-xs">Promedio</p>
                  </div>
                  {item.better && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                </div>
              </div>
            ))}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-sm">
              <p className="text-emerald-300">
                <strong>¡Excelente!</strong> {DEMO_DATA.merchant.name} supera al promedio de la categoría en todas las métricas.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompetitorAnalysisModal(false)} className="border-gray-600">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Programar Campaña */}
      <Dialog open={showScheduleCampaignModal} onOpenChange={setShowScheduleCampaignModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Programar Campaña
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Configura cuándo iniciar y pausar tu campaña
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Fecha de Inicio</Label>
              <Input type="date" className="bg-gray-800 border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Fecha de Fin</Label>
              <Input type="date" className="bg-gray-800 border-gray-700 text-white" />
            </div>
            <div className="space-y-3">
              <Label className="text-gray-300">Horario de Activación</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-500">Desde</Label>
                  <Input type="time" defaultValue="09:00" className="bg-gray-800 border-gray-700 text-white" />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Hasta</Label>
                  <Input type="time" defaultValue="21:00" className="bg-gray-800 border-gray-700 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-gray-300">Días Activos</Label>
              <div className="flex gap-1">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                  <Button key={i} variant="outline" size="sm" className={`w-8 h-8 p-0 ${i < 5 ? 'border-blue-500 text-blue-400' : 'border-gray-600'}`}>
                    {day}
                  </Button>
                ))}
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm">
              <p className="text-blue-300">La campaña se activará automáticamente según la programación configurada.</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowScheduleCampaignModal(false)} className="border-gray-600">
              Cancelar
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => {
              toast.success('Campaña programada exitosamente');
              setShowScheduleCampaignModal(false);
            }}>
              <Play className="w-4 h-4 mr-2" />
              Programar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
