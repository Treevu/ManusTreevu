import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, ArrowLeft, Users, AlertTriangle, TrendingDown, 
  Building2, Gift, BarChart3, DollarSign, Settings, Bell, SlidersHorizontal, ClipboardList
} from "lucide-react";
import NotificationCenter from "@/components/NotificationCenter";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import ThemeToggle from "@/components/ThemeToggle";
import { FWITrendWidget } from "@/components/FWITrendWidget";
import { ActiveAlertsWidget } from "@/components/ActiveAlertsWidget";
import { RiskHeatMap } from "@/components/dashboard/RiskHeatMap";
import { FundsFlowVisualizer } from "@/components/dashboard/FundsFlowVisualizer";
import { ProgressiveDisclosure, B2B_EDUCATION_STEPS } from "@/components/dashboard/ProgressiveDisclosure";
import { EducationGamification } from "@/components/EducationGamification";
import { allTutorials } from "@/lib/educationalContent";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useOffline } from "@/hooks/useOffline";
import { OfflineDataBadge } from "@/components/ui/offline-data-badge";
import { cacheSet, cacheGet } from "@/lib/offlineCache";
import { LastSyncIndicator } from "@/components/LastSyncIndicator";
import MonthlyTrendsChart from '@/components/dashboard/MonthlyTrendsChart';
import AreaFilter from '@/components/dashboard/AreaFilter';
import RiskMatrix from '@/components/dashboard/RiskMatrix';
import InterventionROI from '@/components/dashboard/InterventionROI';
import ChurnPrediction from '@/components/dashboard/ChurnPrediction';
import CorrelationAnalysis from '@/components/dashboard/CorrelationAnalysis';
import CompetitiveAnalysis from '@/components/dashboard/CompetitiveAnalysis';
import InitiativeImpact from '@/components/dashboard/InitiativeImpact';
import AdvancedTrendAnalysis from '@/components/dashboard/AdvancedTrendAnalysis';
import RiskSegmentationAnalysis from '@/components/dashboard/RiskSegmentationAnalysis';
import RiskMatrixAdvanced from '@/components/dashboard/RiskMatrixAdvanced';
import InterventionOptimization from '@/components/dashboard/InterventionOptimization';
import ChurnFactorAnalysis from '@/components/dashboard/ChurnFactorAnalysis';
import CorrelationAdvanced from '@/components/dashboard/CorrelationAdvanced';
import CompetitiveIntelligence from '@/components/dashboard/CompetitiveIntelligence';
import InitiativePortfolio from '@/components/dashboard/InitiativePortfolio';
import DepartmentAnalytics from '@/components/dashboard/DepartmentAnalytics';
import ScenarioPlanner from '@/components/dashboard/ScenarioPlanner';
import RetentionDashboard from '@/components/dashboard/RetentionDashboard';
import DebtImpactAnalysis from '@/components/dashboard/DebtImpactAnalysis';
import TalentRetentionROI from '@/components/dashboard/TalentRetentionROI';
import SalaryDispersionImpact from '@/components/dashboard/SalaryDispersionImpact';
import BehaviorChangeMetrics from '@/components/dashboard/BehaviorChangeMetrics';
import { PendingEWATable } from '@/components/dashboard/PendingEWATable';
import { ApprovedEWAHistory } from '@/components/dashboard/ApprovedEWAHistory';

export default function B2BDashboard() {
  const { user } = useAuth();
  const { isOnline } = useOffline();
  const [cachedMetrics, setCachedMetrics] = useState<{
    avgFwiScore?: number;
    totalEmployees?: number;
    highRiskCount?: number;
    totalDepartments?: number;
  }>({});
  const [usingCache, setUsingCache] = useState(false);
  const [showB2BEducation, setShowB2BEducation] = useState(false);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);

  // Queries
  const { data: metrics, isLoading: metricsLoading } = trpc.b2b.getMetrics.useQuery();
  const { data: departments } = trpc.b2b.getDepartments.useQuery();
  const { data: riskAnalysis } = trpc.b2b.getRiskAnalysis.useQuery({});
  const { data: pendingEwa } = trpc.ewa.listPending.useQuery();
  const { data: unresolvedAlerts } = trpc.alerts.getUnresolvedSummary.useQuery();

  // Cache metrics when online
  useEffect(() => {
    if (isOnline && metrics) {
      cacheSet('b2b:metrics', {
        avgFwiScore: metrics.avgFwiScore,
        totalEmployees: metrics.totalEmployees,
        highRiskCount: metrics.highRiskCount,
        totalDepartments: metrics.totalDepartments,
      }, 30);
    }
  }, [isOnline, metrics]);

  // Load cached data when offline
  useEffect(() => {
    if (!isOnline && !metrics) {
      cacheGet<typeof cachedMetrics>('b2b:metrics').then(data => {
        if (data) {
          setCachedMetrics(data);
          setUsingCache(true);
        }
      });
    } else if (isOnline) {
      setUsingCache(false);
    }
  }, [isOnline, metrics]);

  // Display values with fallback to cache
  const displayMetrics = {
    avgFwiScore: metrics?.avgFwiScore ?? cachedMetrics.avgFwiScore ?? 0,
    totalEmployees: metrics?.totalEmployees ?? cachedMetrics.totalEmployees ?? 0,
    highRiskCount: metrics?.highRiskCount ?? cachedMetrics.highRiskCount ?? 0,
    totalDepartments: metrics?.totalDepartments ?? cachedMetrics.totalDepartments ?? 0,
  };

  if (metricsLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-segment-empresa" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white relative">
      {/* Background Effects - Same as Landing */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-segment-empresa/10 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] opacity-60" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      
      {/* Header */}
      <header className="bg-treevu-surface/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-xl font-display font-bold text-white">Dashboard B2B</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-segment-empresa" />
              <span className="font-semibold text-segment-empresa">HR Admin</span>
            </div>
            
            {/* Alert Badge */}
            <Link href="/dashboard/alerts">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full relative hover:bg-amber-500/10"
                title="Ver alertas"
              >
                <Bell className="h-5 w-5 text-amber-400" />
                {unresolvedAlerts && unresolvedAlerts.total > 0 && (
                  <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full px-1 ${
                    unresolvedAlerts.critical > 0 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : unresolvedAlerts.warning > 0 
                        ? 'bg-amber-500 text-black' 
                        : 'bg-blue-500 text-white'
                  }`}>
                    {unresolvedAlerts.total > 99 ? '99+' : unresolvedAlerts.total}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Alert Thresholds Config */}
            <Link href="/dashboard/alert-thresholds">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full hover:bg-purple-500/10"
                title="Configurar umbrales de alertas"
              >
                <SlidersHorizontal className="h-5 w-5 text-purple-400" />
              </Button>
            </Link>
            
            {/* Survey Results */}
            <Link href="/dashboard/survey-results">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full hover:bg-teal-500/10"
                title="Resultados de encuestas"
              >
                <ClipboardList className="h-5 w-5 text-teal-400" />
              </Button>
            </Link>
            
            <ThemeToggle />
            <NotificationCenter />
            <Link href="/settings/notifications">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Settings className="h-5 w-5 text-gray-400" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative">
        {/* Area Filter */}
        {departments && departments.length > 0 && (
          <div className="mb-6 p-4 bg-treevu-surface/50 border border-white/10 rounded-lg">
            <AreaFilter
              departments={departments}
              selectedArea={selectedArea}
              onAreaChange={setSelectedArea}
              isLoading={metricsLoading}
            />
          </div>
        )}
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    Total Empleados
                    {usingCache && <OfflineDataBadge size="sm" />}
                  </p>
                  <p className="text-3xl font-bold text-white">{displayMetrics.totalEmployees}</p>
                </div>
                <Users className="h-8 w-8 text-segment-empresa" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    FWI Promedio
                    <EducationGamification
                      tutorialType="b2b"
                      steps={allTutorials.b2b.torreControl.basic.steps}
                      onComplete={() => toast.success('¡Felicidades! Has ganado 100 TreePoints por completar el tutorial de Torre de Control')}
                    />
                    {usingCache && <OfflineDataBadge size="sm" />}
                  </p>
                  <p className="text-3xl font-bold text-white">{displayMetrics.avgFwiScore}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    Alto Riesgo
                    {usingCache && <OfflineDataBadge size="sm" />}
                  </p>
                  <p className="text-3xl font-bold text-red-400">{displayMetrics.highRiskCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    Departamentos
                    {usingCache && <OfflineDataBadge size="sm" />}
                  </p>
                  <p className="text-3xl font-bold text-white">{displayMetrics.totalDepartments}</p>
                </div>
                <Building2 className="h-8 w-8 text-segment-empresa" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Torre de Control de Riesgo - Componentes Premium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <RiskHeatMap />
          <FundsFlowVisualizer />
          <ActiveAlertsWidget className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10" limit={3} />
        </div>

        {/* FWI Trend Widget */}
        <div className="mb-8">
          <FWITrendWidget className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10" />
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid grid-cols-7 w-full bg-treevu-surface/50 border border-white/10">
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
            <TabsTrigger value="risk">Riesgo</TabsTrigger>
            <TabsTrigger value="matrix">Matriz</TabsTrigger>
            <TabsTrigger value="intervention">Intervenciones</TabsTrigger>
            <TabsTrigger value="churn">Rotación</TabsTrigger>
            <TabsTrigger value="correlation">Correlación</TabsTrigger>
            <TabsTrigger value="competitive">Competencia</TabsTrigger>
            <TabsTrigger value="initiatives">Iniciativas</TabsTrigger>
            <TabsTrigger value="ewa">EWA Pendientes</TabsTrigger>
            <TabsTrigger value="ewa-history">EWA Historial</TabsTrigger>
            <TabsTrigger value="retention">Retención</TabsTrigger>
            <TabsTrigger value="debt">Deuda & Impacto</TabsTrigger>
            <TabsTrigger value="roi">ROI Retención</TabsTrigger>
            <TabsTrigger value="dispersion">Dispersión & Ahorro</TabsTrigger>
          </TabsList>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <MonthlyTrendsChart />
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk" className="space-y-4">
            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-white">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                  Análisis de Riesgo de Rotación (IPR)
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Empleados con mayor propensión de rotación basado en indicadores financieros
                </CardDescription>
              </CardHeader>
              <CardContent>
                {riskAnalysis && riskAnalysis.length > 0 ? (
                  <div className="space-y-4">
                    {riskAnalysis
                      .filter(emp => !selectedArea || emp.departmentId === selectedArea)
                      .slice(0, 10)
                      .map((employee) => (
                      <div key={employee.id} className="p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-white">Empleado #{employee.userId}</p>
                            <p className="text-sm text-gray-400">
                              Antigüedad: {employee.tenure} meses
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              employee.absenteeismRisk === 'critical' ? 'bg-red-100 text-red-700' :
                              employee.absenteeismRisk === 'high' ? 'bg-orange-100 text-orange-700' :
                              employee.absenteeismRisk === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {employee.absenteeismRisk}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-400">IPR</p>
                            <div className="flex items-center space-x-2">
                              <Progress 
                                value={employee.turnoverPropensity || 0} 
                                className={`h-2 ${
                                  (employee.turnoverPropensity || 0) >= 70 ? '[&>div]:bg-red-500' :
                                  (employee.turnoverPropensity || 0) >= 50 ? '[&>div]:bg-orange-500' :
                                  '[&>div]:bg-green-500'
                                }`}
                              />
                              <span className="text-sm font-semibold">{employee.turnoverPropensity}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">FWI Score</p>
                            <p className="font-semibold text-white">{employee.lastFwiScore}/100</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">EWA Frecuencia</p>
                            <p className="font-semibold text-white">{employee.ewaFrequency} solicitudes</p>
                          </div>
                        </div>
                        {(employee.projectedLoss || 0) > 0 && (
                          <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded flex items-center justify-between">
                            <span className="text-sm text-red-700">Pérdida proyectada:</span>
                            <span className="font-semibold text-red-700">
                              ${((employee.projectedLoss || 0) / 100).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingDown className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                    <p className="text-gray-400">¡Excelente! No hay empleados en riesgo</p>
                    <p className="text-sm text-gray-500 mt-1">Tu equipo tiene un bienestar financiero saludable</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Risk Summary by Department */}
            {metrics?.riskSummary && metrics.riskSummary.length > 0 && (
              <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Resumen por Departamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 text-sm font-medium text-gray-400">Depto.</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-400">Empleados</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-400">IPR Prom.</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-400">Alto Riesgo</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-400">Pérdida Proy.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.riskSummary
                          .filter(dept => !selectedArea || dept.departmentId === selectedArea)
                          .map((dept, i) => (
                          <tr key={i} className="border-b border-white/5 last:border-0">
                            <td className="py-3 font-medium text-white">Depto #{dept.departmentId}</td>
                            <td className="py-3 text-center text-gray-300">{dept.employeeCount}</td>
                            <td className="py-3 text-center">
                              <span className={`px-2 py-1 rounded text-sm ${
                                (dept.avgTurnoverPropensity || 0) >= 60 ? 'bg-red-100 text-red-700' :
                                (dept.avgTurnoverPropensity || 0) >= 40 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {Math.round(dept.avgTurnoverPropensity || 0)}%
                              </span>
                            </td>
                            <td className="py-3 text-center text-red-400 font-semibold">
                              {dept.highRiskCount}
                            </td>
                            <td className="py-3 text-right font-semibold text-white">
                              ${((dept.totalProjectedLoss || 0) / 100).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-4">
            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-white">
                  <Building2 className="h-5 w-5 mr-2 text-segment-empresa" />
                  Departamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {departments && departments.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-white">{dept.name}</h3>
                          <span className="text-sm text-gray-400">{dept.employeeCount} empleados</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-400">FWI Promedio</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={dept.avgFwiScore || 50} className="h-2" />
                              <span className="text-sm font-semibold text-white">{dept.avgFwiScore}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">TreePoints</p>
                            <p className="font-semibold text-brand-primary">
                              {((dept.treePointsUsed || 0) / (dept.treePointsBudget || 1) * 100).toFixed(0)}% usado
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                    <p className="text-gray-400">Organiza tu equipo por departamentos</p>
                    <p className="text-sm text-gray-500 mt-1">Obtén métricas detalladas de bienestar por área</p>
                    <Button variant="outline" className="mt-4 border-segment-empresa text-segment-empresa hover:bg-segment-empresa/10">
                      Crear Departamento
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* EWA Pending Tab */}
          <TabsContent value="ewa" className="space-y-4">
            <PendingEWATable requests={pendingEwa || []} isLoading={metricsLoading} />
          </TabsContent>

          {/* EWA History Tab */}
          <TabsContent value="ewa-history" className="space-y-4">
            <ApprovedEWAHistory requests={pendingEwa?.filter((r: any) => r.status === 'processing_transfer' || r.status === 'disbursed') || []} isLoading={metricsLoading} />
          </TabsContent>

          {/* Risk Matrix Tab */}
          <TabsContent value="matrix" className="space-y-4">
            <RiskMatrix selectedDepartment={selectedArea ? departments?.find((d: any) => d.id === selectedArea)?.name : undefined} isLoading={metricsLoading} />
          </TabsContent>

          {/* Intervention ROI Tab */}
          <TabsContent value="intervention" className="space-y-4">
            <InterventionROI isLoading={metricsLoading} />
          </TabsContent>

          {/* Churn Prediction Tab */}
          <TabsContent value="churn" className="space-y-4">
            <ChurnPrediction isLoading={metricsLoading} />
          </TabsContent>

          {/* Correlation Analysis Tab */}
          <TabsContent value="correlation" className="space-y-4">
            <CorrelationAnalysis isLoading={metricsLoading} />
          </TabsContent>

          {/* Competitive Analysis Tab */}
          <TabsContent value="competitive" className="space-y-4">
            <CompetitiveAnalysis isLoading={metricsLoading} />
          </TabsContent>

          {/* Initiative Impact Tab */}
          <TabsContent value="initiatives" className="space-y-4">
            <InitiativeImpact isLoading={metricsLoading} />
          </TabsContent>

          {/* TreePoints Tab */}
          <TabsContent value="points" className="space-y-4">
            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-white">
                  <Gift className="h-5 w-5 mr-2 text-brand-primary" />
                  Gestión de TreePoints
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Emite puntos a empleados y departamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
                    <h3 className="font-semibold text-white mb-2">Emisión Individual</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Recompensa a empleados específicos por logros o comportamientos positivos.
                    </p>
                    <Button className="w-full bg-brand-primary hover:bg-brand-primary/90">
                      Emitir a Empleado
                    </Button>
                  </div>
                  <div className="p-4 bg-segment-empresa/10 rounded-lg border border-segment-empresa/20">
                    <h3 className="font-semibold text-white mb-2">Emisión por Departamento</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Distribuye puntos a todo un departamento por metas cumplidas.
                    </p>
                    <Button className="w-full bg-segment-empresa hover:bg-segment-empresa/90">
                      Emitir a Departamento
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retention Tab */}
          <TabsContent value="retention" className="space-y-4">
            <RetentionDashboard />
          </TabsContent>

          {/* Debt Impact Tab */}
          <TabsContent value="debt" className="space-y-4">
            <DebtImpactAnalysis />
          </TabsContent>

          {/* Retention ROI Tab */}
          <TabsContent value="roi" className="space-y-4">
            <TalentRetentionROI />
          </TabsContent>

          {/* Salary Dispersion Impact Tab */}
          <TabsContent value="dispersion" className="space-y-4">
            <SalaryDispersionImpact isLoading={false} />
            <BehaviorChangeMetrics isLoading={false} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer with Sync Status */}
      <footer className="fixed bottom-0 left-0 right-0 bg-treevu-surface/80 backdrop-blur-md border-t border-white/10 py-2 px-4 z-40">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-xs text-gray-500">Treevü B2B © 2024</p>
          <LastSyncIndicator />
        </div>
      </footer>

      {/* B2B Education Modal */}
      <ProgressiveDisclosure
        isOpen={showB2BEducation}
        onClose={() => setShowB2BEducation(false)}
        title="Torre de Control Financiero"
        description="Aprende a usar el dashboard B2B de Treevü"
        steps={B2B_EDUCATION_STEPS}
        onComplete={() => toast.success('¡Excelente! Ya conoces todas las funcionalidades del dashboard B2B')}
      />
    </div>
  );
}
