import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { 
  Users, TrendingUp, TrendingDown, Building2, DollarSign, AlertTriangle,
  TreePine, BarChart3, PieChart, ArrowUpRight, ArrowDownRight,
  UserMinus, Clock, Shield, Target, Zap, ChevronRight, Calendar,
  Download, FileText, Sparkles, Mail, Phone, Video
} from 'lucide-react';
import { Link } from 'wouter';

// Datos de demostración B2B
const DEMO_DATA = {
  company: {
    name: 'TechCorp México',
    industry: 'Tecnología',
    employees: 523,
    logo: '🏢'
  },
  metrics: {
    fwiAverage: 72,
    fwiTrend: '+4',
    ewaMonthly: 485000,
    ewaTrend: '-12%',
    rotationReduction: 35,
    absenteeismReduction: 28,
    nps: 78
  },
  riskDistribution: {
    healthy: 312,
    moderate: 156,
    atRisk: 55
  },
  departments: [
    { name: 'Ingeniería', employees: 180, fwi: 76, risk: 8, ewaUsage: 42 },
    { name: 'Ventas', employees: 95, fwi: 68, risk: 15, ewaUsage: 58 },
    { name: 'Marketing', employees: 45, fwi: 74, risk: 5, ewaUsage: 35 },
    { name: 'Operaciones', employees: 120, fwi: 65, risk: 22, ewaUsage: 65 },
    { name: 'RRHH', employees: 35, fwi: 80, risk: 2, ewaUsage: 25 },
    { name: 'Finanzas', employees: 48, fwi: 82, risk: 3, ewaUsage: 20 }
  ],
  monthlyTrends: [
    { month: 'Jul', fwi: 65, ewa: 520000, risk: 72 },
    { month: 'Ago', fwi: 67, ewa: 510000, risk: 68 },
    { month: 'Sep', fwi: 69, ewa: 495000, risk: 62 },
    { month: 'Oct', fwi: 70, ewa: 490000, risk: 58 },
    { month: 'Nov', fwi: 71, ewa: 488000, risk: 56 },
    { month: 'Dic', fwi: 72, ewa: 485000, risk: 55 }
  ],
  roi: {
    investmentMonthly: 15000,
    savingsRotation: 125000,
    savingsAbsenteeism: 45000,
    savingsProductivity: 35000,
    totalROI: 1267
  },
  alerts: [
    { id: 1, type: 'warning', message: 'Departamento Operaciones: 22 empleados en riesgo', time: 'Hace 2h' },
    { id: 2, type: 'info', message: 'FWI promedio subió 4 puntos este mes', time: 'Hace 1d' },
    { id: 3, type: 'success', message: 'Rotación reducida 35% vs año anterior', time: 'Hace 3d' }
  ],
  topEmployees: [
    { name: 'María García', dept: 'Ingeniería', fwi: 92, trend: '+8' },
    { name: 'Carlos López', dept: 'Finanzas', fwi: 89, trend: '+5' },
    { name: 'Ana Martínez', dept: 'RRHH', fwi: 87, trend: '+3' }
  ]
};

function MetricCard({ 
  title, value, subtitle, trend, trendUp, icon: Icon, color = 'emerald' 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  trend?: string; 
  trendUp?: boolean;
  icon: React.ElementType;
  color?: 'emerald' | 'blue' | 'purple' | 'amber' | 'red';
}) {
  const colors = {
    emerald: 'from-emerald-900/50 to-emerald-800/30 border-emerald-700/50 text-emerald-400',
    blue: 'from-blue-900/50 to-blue-800/30 border-blue-700/50 text-blue-400',
    purple: 'from-purple-900/50 to-purple-800/30 border-purple-700/50 text-purple-400',
    amber: 'from-amber-900/50 to-amber-800/30 border-amber-700/50 text-amber-400',
    red: 'from-red-900/50 to-red-800/30 border-red-700/50 text-red-400'
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
          <div className={`flex items-center gap-1 mt-3 text-sm ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type Department = typeof DEMO_DATA.departments[0];
type Employee = typeof DEMO_DATA.topEmployees[0];
type Alert = typeof DEMO_DATA.alerts[0];

export default function DemoEmpresa() {
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'analytics' | 'roi'>('overview');
  
  // Estados para modales
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [fwiThreshold, setFwiThreshold] = useState([65]);
  
  // Nuevos modales
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showIndustryCompareModal, setShowIndustryCompareModal] = useState(false);
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] = useState(false);
  const [meetingEmployee, setMeetingEmployee] = useState<Employee | null>(null);

  const riskTotal = DEMO_DATA.riskDistribution.healthy + DEMO_DATA.riskDistribution.moderate + DEMO_DATA.riskDistribution.atRisk;

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
            <Badge variant="outline" className="border-blue-500/50 text-blue-400">
              Demo Empresa
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-blue-400"
              onClick={() => setShowExportModal(true)}
            >
              <Download className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-emerald-400"
              onClick={() => setShowIndustryCompareModal(true)}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">vs Industria</span>
            </Button>
            <div className="text-right hidden sm:block ml-2">
              <p className="text-white font-medium">{DEMO_DATA.company.name}</p>
              <p className="text-gray-400 text-sm">{DEMO_DATA.company.employees} empleados</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xl">
              {DEMO_DATA.company.logo}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Resumen', icon: Building2 },
              { id: 'departments', label: 'Departamentos', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'roi', label: 'ROI', icon: DollarSign }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-blue-400'
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
                title="FWI Promedio"
                value={DEMO_DATA.metrics.fwiAverage}
                trend={`${DEMO_DATA.metrics.fwiTrend} este mes`}
                trendUp={true}
                icon={TrendingUp}
                color="emerald"
              />
              <MetricCard
                title="Empleados"
                value={DEMO_DATA.company.employees}
                subtitle={`${DEMO_DATA.riskDistribution.atRisk} en riesgo`}
                icon={Users}
                color="blue"
              />
              <MetricCard
                title="EWA Mensual"
                value={`$${(DEMO_DATA.metrics.ewaMonthly / 1000).toFixed(0)}K`}
                trend={DEMO_DATA.metrics.ewaTrend}
                trendUp={false}
                icon={DollarSign}
                color="purple"
              />
              <MetricCard
                title="Reducción Rotación"
                value={`${DEMO_DATA.metrics.rotationReduction}%`}
                subtitle="vs año anterior"
                icon={UserMinus}
                color="amber"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Risk Distribution */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-gray-400" />
                    Distribución de Riesgo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center mx-auto mb-2">
                        <span className="text-emerald-400 font-bold">{Math.round((DEMO_DATA.riskDistribution.healthy / riskTotal) * 100)}%</span>
                      </div>
                      <p className="text-emerald-400 text-sm font-medium">Saludable</p>
                      <p className="text-gray-400 text-xs">{DEMO_DATA.riskDistribution.healthy}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-yellow-500/20 border-4 border-yellow-500 flex items-center justify-center mx-auto mb-2">
                        <span className="text-yellow-400 font-bold">{Math.round((DEMO_DATA.riskDistribution.moderate / riskTotal) * 100)}%</span>
                      </div>
                      <p className="text-yellow-400 text-sm font-medium">Moderado</p>
                      <p className="text-gray-400 text-xs">{DEMO_DATA.riskDistribution.moderate}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center mx-auto mb-2">
                        <span className="text-red-400 font-bold">{Math.round((DEMO_DATA.riskDistribution.atRisk / riskTotal) * 100)}%</span>
                      </div>
                      <p className="text-red-400 text-sm font-medium">En Riesgo</p>
                      <p className="text-gray-400 text-xs">{DEMO_DATA.riskDistribution.atRisk}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    Alertas Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {DEMO_DATA.alerts.map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity ${
                        alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                        alert.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' :
                        'bg-blue-500/10 border-blue-500/30'
                      }`} onClick={() => setSelectedAlert(alert)}>
                        <p className="text-white text-sm">{alert.message}</p>
                        <p className="text-gray-400 text-xs mt-1">{alert.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {DEMO_DATA.topEmployees.map((emp, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800" onClick={() => setSelectedEmployee(emp)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{emp.name}</p>
                            <p className="text-gray-400 text-xs">{emp.dept}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{emp.fwi}</p>
                          <p className="text-emerald-400 text-xs">{emp.trend}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends Chart */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Tendencias Mensuales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-4 px-4">
                  {DEMO_DATA.monthlyTrends.map((month) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gray-800 rounded-t-lg relative" style={{ height: `${month.fwi * 2.5}px` }}>
                        <div 
                          className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                          style={{ height: `${month.fwi * 2.5}px` }}
                        />
                      </div>
                      <span className="text-white font-bold text-sm">{month.fwi}</span>
                      <span className="text-gray-400 text-xs">{month.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'departments' && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Análisis por Departamento</CardTitle>
              <CardDescription>Métricas de bienestar financiero por área</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Departamento</th>
                      <th className="text-center py-3 px-4 text-gray-400 font-medium">Empleados</th>
                      <th className="text-center py-3 px-4 text-gray-400 font-medium">FWI Promedio</th>
                      <th className="text-center py-3 px-4 text-gray-400 font-medium">En Riesgo</th>
                      <th className="text-center py-3 px-4 text-gray-400 font-medium">Uso EWA</th>
                      <th className="text-center py-3 px-4 text-gray-400 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_DATA.departments.map((dept) => (
                      <tr key={dept.name} className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer" onClick={() => setSelectedDepartment(dept)}>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-white font-medium">{dept.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-white">{dept.employees}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`font-bold ${
                            dept.fwi >= 75 ? 'text-emerald-400' :
                            dept.fwi >= 60 ? 'text-yellow-400' : 'text-red-400'
                          }`}>{dept.fwi}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant={dept.risk > 15 ? 'destructive' : dept.risk > 8 ? 'secondary' : 'outline'}>
                            {dept.risk}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Progress value={dept.ewaUsage} className="w-20 h-2" />
                            <span className="text-gray-400 text-sm">{dept.ewaUsage}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge className={
                            dept.fwi >= 75 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' :
                            dept.fwi >= 60 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                            'bg-red-500/20 text-red-400 border-red-500/50'
                          }>
                            {dept.fwi >= 75 ? 'Saludable' : dept.fwi >= 60 ? 'Moderado' : 'Atención'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Evolución del FWI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {DEMO_DATA.monthlyTrends.map((month, i) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all"
                        style={{ height: `${(month.fwi / 100) * 200}px` }}
                      />
                      <span className="text-gray-400 text-xs mt-2">{month.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Uso de EWA Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {DEMO_DATA.monthlyTrends.map((month) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all"
                        style={{ height: `${(month.ewa / 600000) * 200}px` }}
                      />
                      <span className="text-gray-400 text-xs mt-2">{month.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">Reducción de Empleados en Riesgo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between gap-4">
                  {DEMO_DATA.monthlyTrends.map((month) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-red-500/50 to-amber-400 rounded-t-lg transition-all"
                        style={{ height: `${(month.risk / 100) * 150}px` }}
                      />
                      <span className="text-white font-bold text-sm mt-2">{month.risk}</span>
                      <span className="text-gray-400 text-xs">{month.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'roi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border-emerald-700/50">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">ROI Total</p>
                  <p className="text-5xl font-bold text-emerald-400">{DEMO_DATA.roi.totalROI}%</p>
                  <p className="text-gray-400 text-sm mt-2">Retorno de inversión</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">Inversión Mensual</p>
                  <p className="text-3xl font-bold text-white">${DEMO_DATA.roi.investmentMonthly.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm mt-2">Costo del programa</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">Ahorro Total</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    ${(DEMO_DATA.roi.savingsRotation + DEMO_DATA.roi.savingsAbsenteeism + DEMO_DATA.roi.savingsProductivity).toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">Mensual estimado</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">Payback</p>
                  <p className="text-3xl font-bold text-blue-400">0.7</p>
                  <p className="text-gray-400 text-sm mt-2">Meses</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Desglose de Ahorros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Reducción de Rotación (35%)</span>
                      <span className="text-emerald-400 font-bold">${DEMO_DATA.roi.savingsRotation.toLocaleString()}/mes</span>
                    </div>
                    <Progress value={60} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Reducción de Ausentismo (28%)</span>
                      <span className="text-emerald-400 font-bold">${DEMO_DATA.roi.savingsAbsenteeism.toLocaleString()}/mes</span>
                    </div>
                    <Progress value={22} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mejora de Productividad</span>
                      <span className="text-emerald-400 font-bold">${DEMO_DATA.roi.savingsProductivity.toLocaleString()}/mes</span>
                    </div>
                    <Progress value={18} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50">
              <CardContent className="p-8 text-center">
                <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Por cada $1 invertido, recuperas ${(DEMO_DATA.roi.totalROI / 100 + 1).toFixed(2)}
                </h3>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  El programa Treevü genera un retorno de {DEMO_DATA.roi.totalROI}% principalmente a través de la reducción de rotación 
                  y ausentismo, además de mejoras medibles en productividad y engagement.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* CTA Footer */}
      <div className="border-t border-gray-800 bg-gradient-to-r from-blue-900/20 to-purple-900/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">¿Listo para transformar el bienestar financiero de tu equipo?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#founders-form">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                Solicitar Demo Personalizada
              </Button>
            </Link>
            <Link href="/demo/empleado">
              <Button size="lg" variant="outline" className="border-blue-500/50 text-blue-400">
                Ver Demo Empleado
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal: Detalle de Departamento */}
      <Dialog open={!!selectedDepartment} onOpenChange={() => setSelectedDepartment(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              {selectedDepartment?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Análisis detallado del departamento
            </DialogDescription>
          </DialogHeader>
          {selectedDepartment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-white">{selectedDepartment.employees}</p>
                  <p className="text-gray-400 text-sm">Empleados</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-400">{selectedDepartment.fwi}</p>
                  <p className="text-gray-400 text-sm">FWI Promedio</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Empleados en riesgo</span>
                  <span className="text-red-400 font-medium">{selectedDepartment.risk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Uso de EWA</span>
                  <span className="text-emerald-400 font-medium">{selectedDepartment.ewaUsage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estado</span>
                  <Badge className={selectedDepartment.fwi >= 70 ? 'bg-emerald-500/20 text-emerald-400' : selectedDepartment.fwi >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}>
                    {selectedDepartment.fwi >= 70 ? 'Saludable' : selectedDepartment.fwi >= 60 ? 'Moderado' : 'Atención'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Distribución de FWI</p>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 h-full" style={{ width: '60%' }} />
                  <div className="bg-yellow-500 h-full" style={{ width: '25%' }} />
                  <div className="bg-red-500 h-full" style={{ width: '15%' }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Saludable 60%</span>
                  <span>Moderado 25%</span>
                  <span>Riesgo 15%</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedDepartment(null)} className="border-gray-600">
              Cerrar
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => {
              toast.success(`Reporte de ${selectedDepartment?.name} descargado`);
              setSelectedDepartment(null);
            }}>
              Descargar Reporte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Detalle de Empleado */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Perfil del Empleado
            </DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl font-bold text-white">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{selectedEmployee.name}</p>
                  <p className="text-gray-400">{selectedEmployee.dept}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-400">{selectedEmployee.fwi}</p>
                  <p className="text-gray-400 text-sm">FWI Score</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-amber-400">{selectedEmployee.trend}</p>
                  <p className="text-gray-400 text-sm">Mejora (30d)</p>
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                <p className="text-emerald-400 font-medium">Top Performer</p>
                <p className="text-emerald-200/80 text-sm mt-1">Este empleado está en el top 10% de bienestar financiero de la empresa.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEmployee(null)} className="border-gray-600">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Detalle de Alerta */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className={`w-5 h-5 ${selectedAlert?.type === 'critical' ? 'text-red-400' : 'text-yellow-400'}`} />
              Alerta del Sistema
            </DialogTitle>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4 py-4">
              <div className={`p-4 rounded-lg ${selectedAlert.type === 'critical' ? 'bg-red-500/10 border border-red-500/30' : 'bg-yellow-500/10 border border-yellow-500/30'}`}>
                <p className={`font-medium ${selectedAlert.type === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {selectedAlert.message}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {selectedAlert.time}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-400 font-medium">Acciones recomendadas:</p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Revisar situación del departamento afectado</li>
                  <li>• Contactar a empleados en riesgo</li>
                  <li>• Programar sesión de bienestar financiero</li>
                </ul>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedAlert(null)} className="border-gray-600">
              Ignorar
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => {
              toast.success('Alerta marcada como atendida');
              setSelectedAlert(null);
            }}>
              Marcar como Atendida
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Configuración de Alertas */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Configurar Alertas
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Define los umbrales para recibir alertas automáticas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-gray-300">Umbral de FWI mínimo</Label>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Alertar cuando FWI sea menor a:</span>
                <span className="text-blue-400 font-bold">{fwiThreshold[0]}</span>
              </div>
              <Slider
                value={fwiThreshold}
                onValueChange={setFwiThreshold}
                max={80}
                min={40}
                step={5}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>40 (Crítico)</span>
                <span>60 (Moderado)</span>
                <span>80 (Preventivo)</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Notificaciones</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" defaultChecked className="rounded border-gray-600" />
                  Email a RRHH
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" defaultChecked className="rounded border-gray-600" />
                  Notificación push
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" className="rounded border-gray-600" />
                  SMS a gerentes
                </label>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfigModal(false)} className="border-gray-600">
              Cancelar
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => {
              toast.success(`Configuración guardada. Umbral FWI: ${fwiThreshold[0]}`);
              setShowConfigModal(false);
            }}>
              Guardar Configuración
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Bienvenida B2B */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-blue-900/30 border-blue-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              ¡Bienvenido al Dashboard B2B!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-gray-300">Este es el centro de control de bienestar financiero de <strong className="text-white">{DEMO_DATA.company.name}</strong>. Aquí puedes:</p>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3">
                <Users className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Monitorear {DEMO_DATA.company.employees} empleados</p>
                  <p className="text-sm text-gray-400">FWI promedio, distribución de riesgo y tendencias</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3">
                <BarChart3 className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Analizar por Departamento</p>
                  <p className="text-sm text-gray-400">Identifica áreas de oportunidad y mejora</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3">
                <DollarSign className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Medir ROI de Treevü</p>
                  <p className="text-sm text-gray-400">Ahorro en rotación, ausentismo y productividad</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Alertas Proactivas</p>
                  <p className="text-sm text-gray-400">Notificaciones cuando empleados necesitan atención</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm">
              <p className="text-blue-300"><strong>ROI actual:</strong> Por cada $1 invertido en Treevü, tu empresa ahorra ${((DEMO_DATA.roi.savingsRotation + DEMO_DATA.roi.savingsAbsenteeism + DEMO_DATA.roi.savingsProductivity) / DEMO_DATA.roi.investmentMonthly).toFixed(0)} en costos.</p>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={() => setShowWelcomeModal(false)}>
              Explorar Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Exportar Reporte */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-400" />
              Exportar Reporte
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Genera un reporte ejecutivo de bienestar financiero
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              {[
                { name: 'Resumen Ejecutivo', desc: 'KPIs principales y tendencias', icon: FileText },
                { name: 'Análisis por Departamento', desc: 'Desglose detallado por área', icon: Building2 },
                { name: 'Reporte de ROI', desc: 'Ahorro y retorno de inversión', icon: DollarSign },
                { name: 'Empleados en Riesgo', desc: 'Lista de atención prioritaria', icon: AlertTriangle }
              ].map((report, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 cursor-pointer transition-colors" onClick={() => {
                  toast.success(`Generando ${report.name}...`);
                  setTimeout(() => toast.success(`${report.name} descargado`), 1500);
                }}>
                  <div className="flex items-center gap-3">
                    <report.icon className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">{report.name}</p>
                      <p className="text-gray-400 text-sm">{report.desc}</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-4">
              <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={() => {
                toast.success('Generando reporte completo...');
                setTimeout(() => {
                  toast.success('Reporte completo descargado');
                  setShowExportModal(false);
                }, 2000);
              }}>
                <Download className="w-4 h-4 mr-2" />
                Descargar Todo (PDF)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Comparativa con Industria */}
      <Dialog open={showIndustryCompareModal} onOpenChange={setShowIndustryCompareModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Comparativa con Industria
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Cómo se compara {DEMO_DATA.company.name} vs el sector {DEMO_DATA.company.industry}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {[
              { metric: 'FWI Promedio', yours: DEMO_DATA.metrics.fwiAverage, industry: 65, better: true },
              { metric: 'Uso de EWA', yours: 45, industry: 52, better: true },
              { metric: 'Empleados en Riesgo', yours: Math.round((DEMO_DATA.riskDistribution.atRisk / DEMO_DATA.company.employees) * 100), industry: 18, better: true },
              { metric: 'Rotación Anual', yours: 12, industry: 22, better: true },
              { metric: 'NPS Empleados', yours: DEMO_DATA.metrics.nps, industry: 62, better: true }
            ].map((item, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">{item.metric}</span>
                  <Badge className={item.better ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                    {item.better ? 'Mejor' : 'Mejorable'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-400">Tu empresa</span>
                      <span className="text-white font-bold">{item.yours}%</span>
                    </div>
                    <Progress value={item.yours} className="h-2" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Industria</span>
                      <span className="text-gray-300">{item.industry}%</span>
                    </div>
                    <Progress value={item.industry} className="h-2 bg-gray-700" />
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-sm">
              <p className="text-emerald-300">
                <strong>¡Excelente!</strong> {DEMO_DATA.company.name} supera al promedio de la industria en 4 de 5 métricas clave.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIndustryCompareModal(false)} className="border-gray-600">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Programar Reunión con Empleado */}
      <Dialog open={showScheduleMeetingModal} onOpenChange={setShowScheduleMeetingModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Programar Reunión de Apoyo
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Agenda una sesión con {meetingEmployee?.name || 'el empleado'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {meetingEmployee && (
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-xl">
                    {meetingEmployee.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{meetingEmployee.name}</p>
                    <p className="text-gray-400 text-sm">{meetingEmployee.dept}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-blue-500/20 text-blue-400">FWI: {meetingEmployee.fwi}</Badge>
                  <Badge className="bg-amber-500/20 text-amber-400">Trend: {meetingEmployee.trend}</Badge>
                </div>
              </div>
            )}
            <div className="space-y-3">
              <Label className="text-gray-300">Tipo de reunión</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Video, label: 'Video' },
                  { icon: Phone, label: 'Llamada' },
                  { icon: Users, label: 'Presencial' }
                ].map((type, i) => (
                  <Button key={i} variant="outline" className="border-gray-600 flex-col h-16 gap-1" onClick={() => toast.info(`Reunión por ${type.label} seleccionada`)}>
                    <type.icon className="w-5 h-5" />
                    <span className="text-xs">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Mensaje (opcional)</Label>
              <Input placeholder="Quisiera hablar sobre tu bienestar financiero..." className="bg-gray-800 border-gray-700 text-white" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowScheduleMeetingModal(false)} className="border-gray-600">
              Cancelar
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600" onClick={() => {
              toast.success(`Invitación enviada a ${meetingEmployee?.name}`);
              setShowScheduleMeetingModal(false);
              setMeetingEmployee(null);
            }}>
              <Mail className="w-4 h-4 mr-2" />
              Enviar Invitación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
