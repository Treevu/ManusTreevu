import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, ArrowLeft, TrendingUp, Users, Wallet, 
  BarChart3, LineChart, PieChart, Calendar, Download,
  ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { EwaIcon } from "@/components/ui/ewa-icon";

// Simple chart components using CSS
function BarChartSimple({ data, maxValue }: { data: { label: string; value: number; color?: string }[]; maxValue: number }) {
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">{item.label}</span>
            <span className="text-white font-medium">{item.value}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || '#10B981'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function LineChartSimple({ data, height = 200 }: { data: { label: string; value: number }[]; height?: number }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative" style={{ height }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        
        {/* Gradient fill */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area under line */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#lineGradient)"
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((d.value - minValue) / range) * 80 - 10;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="#10B981"
              className="hover:r-3 transition-all"
            />
          );
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {data.map((d, i) => {
            const percentage = d.value / total;
            const angle = percentage * 360;
            const startAngle = currentAngle;
            currentAngle += angle;
            
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = ((startAngle + angle) * Math.PI) / 180;
            
            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);
            
            const largeArc = angle > 180 ? 1 : 0;
            
            return (
              <path
                key={i}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={d.color}
                className="hover:opacity-80 transition-opacity"
              />
            );
          })}
          {/* Inner circle for donut effect */}
          <circle cx="50" cy="50" r="25" fill="#0B0B0C" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{total}</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-sm text-gray-400">{d.label}</span>
            <span className="text-sm text-white font-medium ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  change, 
  changeType,
  icon: Icon,
  iconColor = 'text-brand-primary'
}: { 
  title: string; 
  value: string | number; 
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  iconColor?: string;
}) {
  const ChangeIcon = changeType === 'positive' ? ArrowUpRight : changeType === 'negative' ? ArrowDownRight : Minus;
  const changeColor = changeType === 'positive' ? 'text-green-500' : changeType === 'negative' ? 'text-red-500' : 'text-gray-500';

  return (
    <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${changeColor}`}>
                <ChangeIcon className="h-4 w-4" />
                <span>{Math.abs(change)}% vs mes anterior</span>
              </div>
            )}
          </div>
          <Icon className={`h-10 w-10 ${iconColor}`} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsAdmin() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('30d');
  const [department, setDepartment] = useState('all');

  // Queries
  const { data: metrics, isLoading: metricsLoading } = trpc.b2b.getMetrics.useQuery();
  const { data: departments } = trpc.b2b.getDepartments.useQuery();
  const { data: riskAnalysis } = trpc.b2b.getRiskAnalysis.useQuery({ departmentId: undefined });
  // EWA requests count from metrics

  // Mock data for charts (in production, this would come from analytics API)
  const fwiTrendData = useMemo(() => [
    { label: 'Ene', value: 58 },
    { label: 'Feb', value: 60 },
    { label: 'Mar', value: 62 },
    { label: 'Abr', value: 59 },
    { label: 'May', value: 65 },
    { label: 'Jun', value: 68 },
    { label: 'Jul', value: 72 },
  ], []);

  const ewaUsageData = useMemo(() => [
    { label: 'Ene', value: 45 },
    { label: 'Feb', value: 52 },
    { label: 'Mar', value: 48 },
    { label: 'Abr', value: 61 },
    { label: 'May', value: 55 },
    { label: 'Jun', value: 67 },
    { label: 'Jul', value: 73 },
  ], []);

  const departmentFWI = useMemo(() => {
    if (!departments) return [];
    return departments.slice(0, 5).map((dept, i) => ({
      label: dept.name,
      value: 50 + Math.floor(Math.random() * 30),
      color: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'][i % 5]
    }));
  }, [departments]);

  const engagementData = useMemo(() => [
    { label: 'Activos diarios', value: 156, color: '#10B981' },
    { label: 'Activos semanales', value: 342, color: '#3B82F6' },
    { label: 'Inactivos', value: 89, color: '#6B7280' },
  ], []);

  const riskDistribution = useMemo(() => [
    { label: 'Bajo', value: 245, color: '#10B981' },
    { label: 'Medio', value: 123, color: '#F59E0B' },
    { label: 'Alto', value: 45, color: '#EF4444' },
  ], []);

  // Check admin access
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-treevu-bg flex items-center justify-center">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10 max-w-md">
          <CardContent className="pt-6 text-center">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-xl font-bold text-white mb-2">Acceso Restringido</h2>
            <p className="text-gray-400 mb-4">
              Esta sección es solo para administradores.
            </p>
            <Link href="/dashboard/employee">
              <Button className="bg-brand-primary hover:bg-brand-primary/90">
                Ir a Mi Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (metricsLoading) {
    return (
      <div className="min-h-screen bg-treevu-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-treevu-bg">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-segment-empresa/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-treevu-surface/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/admin">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-xl font-display font-bold text-white">Analytics Dashboard</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 días</SelectItem>
                <SelectItem value="30d">30 días</SelectItem>
                <SelectItem value="90d">90 días</SelectItem>
                <SelectItem value="1y">1 año</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/10">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="FWI Promedio"
            value={metrics?.avgFwiScore || 0}
            change={5.2}
            changeType="positive"
            icon={TrendingUp}
          />
          <MetricCard
            title="Empleados Activos"
            value={metrics?.totalEmployees || 0}
            change={2.1}
            changeType="positive"
            icon={Users}
            iconColor="text-segment-empresa"
          />
          <MetricCard
            title="EWA Solicitados"
            value={73}
            change={-3.4}
            changeType="negative"
            icon={() => <EwaIcon className="h-10 w-10 text-segment-empleado" />}
          />
          <MetricCard
            title="Alto Riesgo"
            value={metrics?.highRiskCount || 0}
            change={0}
            changeType="neutral"
            icon={BarChart3}
            iconColor="text-red-500"
          />
        </div>

        {/* Charts */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg bg-treevu-surface/50 border border-white/10">
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
            <TabsTrigger value="ewa">EWA</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="risk">Riesgo</TabsTrigger>
          </TabsList>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-white">
                    <LineChart className="h-5 w-5 mr-2 text-brand-primary" />
                    Evolución FWI Promedio
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Tendencia del bienestar financiero de los empleados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChartSimple data={fwiTrendData} height={200} />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-white">
                    <BarChart3 className="h-5 w-5 mr-2 text-segment-empresa" />
                    FWI por Departamento
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Comparativa entre departamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChartSimple data={departmentFWI} maxValue={100} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* EWA Tab */}
          <TabsContent value="ewa" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-white">
                    <LineChart className="h-5 w-5 mr-2 text-segment-empleado" />
                    Solicitudes EWA por Mes
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Volumen de adelantos de salario solicitados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChartSimple data={ewaUsageData} height={200} />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-white">
                    <Wallet className="h-5 w-5 mr-2 text-brand-primary" />
                    Métricas EWA
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Resumen de uso del programa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Monto promedio</span>
                    <span className="text-white font-bold">$850</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Tasa de aprobación</span>
                    <span className="text-green-500 font-bold">94%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Tiempo promedio</span>
                    <span className="text-white font-bold">2.3 hrs</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Usuarios únicos</span>
                    <span className="text-white font-bold">234</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-white">
                    <PieChart className="h-5 w-5 mr-2 text-brand-primary" />
                    Distribución de Usuarios
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Nivel de actividad de los empleados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DonutChart data={engagementData} />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-white">
                    <Users className="h-5 w-5 mr-2 text-segment-empresa" />
                    Métricas de Engagement
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Interacción con la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Gastos registrados/día</span>
                    <span className="text-white font-bold">1,234</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Metas activas</span>
                    <span className="text-white font-bold">456</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Ofertas canjeadas</span>
                    <span className="text-white font-bold">89</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Racha promedio</span>
                    <span className="text-white font-bold">12 días</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risk Tab */}
          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-white">
                    <PieChart className="h-5 w-5 mr-2 text-red-500" />
                    Distribución de Riesgo
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Clasificación de empleados por nivel de riesgo de rotación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DonutChart data={riskDistribution} />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-white">
                    <BarChart3 className="h-5 w-5 mr-2 text-yellow-500" />
                    Factores de Riesgo
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Principales indicadores de riesgo detectados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChartSimple 
                    data={[
                      { label: 'FWI bajo (<40)', value: 45, color: '#EF4444' },
                      { label: 'EWA frecuente (>3/mes)', value: 32, color: '#F59E0B' },
                      { label: 'Sin actividad (>14 días)', value: 28, color: '#6B7280' },
                      { label: 'Gastos irregulares', value: 18, color: '#8B5CF6' },
                    ]} 
                    maxValue={50} 
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
