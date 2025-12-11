import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Loader2, ArrowLeft, TrendingUp, TrendingDown, Users, 
  AlertTriangle, DollarSign, Target, Activity, Shield,
  ArrowUpRight, ArrowDownRight, Minus, Download, FileText
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ImpactExplainerModal } from '@/components/ImpactExplainerModal';
import { Info } from 'lucide-react';

// Mock trend data - in production this would come from the API
const generateTrendData = (baseValue: number, variance: number, days: number) => {
  const data = [];
  let value = baseValue;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    value = Math.max(0, Math.min(100, value + (Math.random() - 0.5) * variance));
    data.push({
      date: date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
      value: Math.round(value)
    });
  }
  return data;
};

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon, 
  color = "emerald",
  infoType,
  numericValue
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: any;
  color?: 'emerald' | 'blue' | 'amber' | 'red';
  infoType?: 'fwi' | 'roi' | 'risk' | 'savings' | 'engagement';
  numericValue?: number;
}) {
  const colorClasses = {
    emerald: 'text-emerald-400 bg-emerald-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    red: 'text-red-400 bg-red-500/10'
  };
  
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';
  
  return (
    <Card className="border-0 bg-treevu-surface/60 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-400">{title}</p>
              {infoType && (
                <ImpactExplainerModal type={infoType} currentValue={numericValue}>
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <Info className="h-4 w-4" />
                  </button>
                </ImpactExplainerModal>
              )}
            </div>
            <p className="text-4xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            {trend && trendValue && (
              <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
                <TrendIcon className="h-4 w-4" />
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AlertSummaryCard({ 
  critical, 
  warning, 
  info 
}: { 
  critical: number; 
  warning: number; 
  info: number; 
}) {
  const total = critical + warning + info;
  
  return (
    <Card className="border-0 bg-treevu-surface/60 backdrop-blur-sm border border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          Alertas Activas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-white mb-4">{total}</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Críticas</span>
            <span className={`text-sm font-semibold ${critical > 0 ? 'text-red-400' : 'text-gray-500'}`}>
              {critical}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Advertencias</span>
            <span className={`text-sm font-semibold ${warning > 0 ? 'text-amber-400' : 'text-gray-500'}`}>
              {warning}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Informativas</span>
            <span className="text-sm font-semibold text-blue-400">{info}</span>
          </div>
        </div>
        {total > 0 && (
          <Link href="/dashboard/alerts">
            <Button variant="outline" size="sm" className="w-full mt-4 border-white/20 text-white hover:bg-white/10">
              Ver Todas las Alertas
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

export default function ExecutiveDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Fetch data
  const { data: metrics, isLoading: metricsLoading } = trpc.b2b.getMetrics.useQuery();
  const { data: unresolvedAlerts } = trpc.alerts.getUnresolvedSummary.useQuery();
  const { data: riskAnalysis } = trpc.b2b.getRiskAnalysis.useQuery({});
  
  // PDF generation mutation
  const generatePDFMutation = trpc.reports.generateExecutivePDF.useMutation({
    onSuccess: (data) => {
      // Convert base64 to blob and download
      const byteCharacters = atob(data.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Reporte PDF generado exitosamente');
      setIsGeneratingPDF(false);
    },
    onError: (error) => {
      toast.error('Error al generar el reporte: ' + error.message);
      setIsGeneratingPDF(false);
    }
  });
  
  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);
    generatePDFMutation.mutate({});
  };
  
  // Generate mock trend data (in production, this would come from API)
  const fwiTrendData = generateTrendData(metrics?.avgFwiScore || 65, 5, 30);
  const engagementTrendData = generateTrendData(75, 10, 30);
  
  // Calculate ROI (simplified calculation)
  const estimatedROI = metrics ? Math.round((metrics.avgFwiScore / 50) * 1200) : 0;
  const employeesAtRisk = riskAnalysis?.filter((r: any) => 
    r.absenteeismRisk === 'high' || r.absenteeismRisk === 'critical'
  ).length || 0;
  const riskPercentage = metrics?.totalEmployees 
    ? Math.round((employeesAtRisk / metrics.totalEmployees) * 100) 
    : 0;

  if (authLoading || metricsLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-brand-primary" />
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'b2b_admin')) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <Card className="max-w-md bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-red-400" />
              Acceso Restringido
            </CardTitle>
            <CardDescription className="text-gray-400">
              Este dashboard está reservado para ejecutivos y administradores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/app">
              <Button className="w-full bg-brand-primary hover:bg-brand-primary/90">
                Volver al Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>
      
      {/* Header */}
      <header className="bg-treevu-surface/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-10 relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/admin">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-display font-bold text-white">Resumen Ejecutivo</h1>
                <p className="text-sm text-gray-400">Vista de alto nivel para CEOs y directivos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                Última actualización: {new Date().toLocaleString('es-MX')}
              </div>
              <Button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-brand-primary hover:bg-brand-primary/90 text-black font-medium"
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Descargar PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="FWI Promedio"
            value={metrics?.avgFwiScore || 0}
            subtitle="Índice de Bienestar Financiero"
            trend={metrics?.avgFwiScore && metrics.avgFwiScore > 60 ? 'up' : 'down'}
            trendValue="+3.2% vs mes anterior"
            icon={Activity}
            color="emerald"
            infoType="fwi"
            numericValue={metrics?.avgFwiScore || 0}
          />
          <MetricCard
            title="Total Empleados"
            value={metrics?.totalEmployees || 0}
            subtitle="Usuarios activos en la plataforma"
            trend="up"
            trendValue="+12 este mes"
            icon={Users}
            color="blue"
            infoType="engagement"
            numericValue={metrics?.totalEmployees || 0}
          />
          <MetricCard
            title="ROI Estimado"
            value={`${estimatedROI}%`}
            subtitle="Retorno sobre inversión anual"
            trend="up"
            trendValue="Basado en reducción de ausentismo"
            icon={DollarSign}
            color="emerald"
            infoType="roi"
            numericValue={estimatedROI}
          />
          <MetricCard
            title="Empleados en Riesgo"
            value={`${riskPercentage}%`}
            subtitle={`${employeesAtRisk} de ${metrics?.totalEmployees || 0} empleados`}
            trend={riskPercentage > 20 ? 'down' : 'up'}
            trendValue={riskPercentage > 20 ? 'Requiere atención' : 'Nivel saludable'}
            icon={AlertTriangle}
            color={riskPercentage > 20 ? 'red' : 'amber'}
            infoType="risk"
            numericValue={riskPercentage}
          />
        </div>

        {/* Charts and Alerts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* FWI Trend Chart */}
          <Card className="lg:col-span-2 border-0 bg-treevu-surface/60 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-primary" />
                Tendencia FWI - Últimos 30 días
              </CardTitle>
              <CardDescription className="text-gray-400">
                Evolución del índice de bienestar financiero promedio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fwiTrendData}>
                    <defs>
                      <linearGradient id="fwiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#666" 
                      tick={{ fill: '#888', fontSize: 11 }}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#666" 
                      tick={{ fill: '#888', fontSize: 11 }}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: '#888' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      fill="url(#fwiGradient)" 
                      name="FWI Score"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Summary */}
          <AlertSummaryCard 
            critical={unresolvedAlerts?.critical || 0}
            warning={unresolvedAlerts?.warning || 0}
            info={unresolvedAlerts?.info || 0}
          />
        </div>

        {/* Bottom Row - Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 bg-treevu-surface/60 backdrop-blur-sm border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                Metas del Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">FWI &gt; 70</span>
                    <span className="text-white">{Math.round((metrics?.avgFwiScore || 0) / 70 * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-primary rounded-full transition-all"
                      style={{ width: `${Math.min(100, (metrics?.avgFwiScore || 0) / 70 * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Riesgo &lt; 15%</span>
                    <span className="text-white">{riskPercentage < 15 ? '100%' : Math.round((15 - riskPercentage + 15) / 15 * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${riskPercentage < 15 ? 'bg-brand-primary' : 'bg-amber-500'}`}
                      style={{ width: `${riskPercentage < 15 ? 100 : Math.max(0, (15 - riskPercentage + 15) / 15 * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Engagement &gt; 80%</span>
                    <span className="text-white">75%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: '75%' }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-treevu-surface/60 backdrop-blur-sm border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" />
                Impacto Financiero
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Ahorro en ausentismo</span>
                  <span className="text-lg font-semibold text-emerald-400">$45,200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Ahorro en rotación</span>
                  <span className="text-lg font-semibold text-emerald-400">$128,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Productividad ganada</span>
                  <span className="text-lg font-semibold text-emerald-400">$67,800</span>
                </div>
                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white">Total Estimado</span>
                    <span className="text-xl font-bold text-emerald-400">$241,500</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-treevu-surface/60 backdrop-blur-sm border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/dashboard/analytics">
                  <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Ver Analytics Detallado
                  </Button>
                </Link>
                <Link href="/departments">
                  <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                    <Users className="h-4 w-4 mr-2" />
                    Comparar Departamentos
                  </Button>
                </Link>
                <Link href="/dashboard/alerts">
                  <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Gestionar Alertas
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
