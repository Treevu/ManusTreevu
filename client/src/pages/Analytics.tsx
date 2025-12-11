import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Users,
  TrendingUp,
  Coins,
  Target,
  Trophy,
  Activity,
  BarChart3,
  PieChart,
  Loader2,
  Calendar,
  DollarSign,
  UserPlus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

// Date range options
const DATE_RANGES = [
  { value: '7d', label: 'Últimos 7 días', days: 7 },
  { value: '30d', label: 'Últimos 30 días', days: 30 },
  { value: '3m', label: 'Últimos 3 meses', days: 90 },
  { value: '6m', label: 'Últimos 6 meses', days: 180 },
  { value: '1y', label: 'Último año', days: 365 },
  { value: 'all', label: 'Todo el tiempo', days: 0 },
];

export default function Analytics() {
  const { user, loading: authLoading } = useAuth();
  const [dateRange, setDateRange] = useState('6m');
  
  // Calculate date filter based on selection
  const getDateFilter = () => {
    const range = DATE_RANGES.find(r => r.value === dateRange);
    if (!range || range.days === 0) return undefined;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range.days);
    return startDate.toISOString();
  };
  
  const dateFilter = getDateFilter();
  
  // Fetch real data from API with date filter
  const { data: userStats, isLoading: loadingUsers, refetch: refetchUsers } = trpc.analytics.getUserStats.useQuery(
    { startDate: dateFilter },
    { enabled: !!user && (user.role === 'admin' || user.role === 'b2b_admin') }
  );
  
  const { data: ewaStats, isLoading: loadingEwa, refetch: refetchEwa } = trpc.analytics.getEwaStats.useQuery(
    { startDate: dateFilter },
    { enabled: !!user && (user.role === 'admin' || user.role === 'b2b_admin') }
  );
  
  const { data: engagementStats, isLoading: loadingEngagement, refetch: refetchEngagement } = trpc.analytics.getEngagementStats.useQuery(
    { startDate: dateFilter },
    { enabled: !!user && (user.role === 'admin' || user.role === 'b2b_admin') }
  );
  
  const { data: departmentStats, isLoading: loadingDepts, refetch: refetchDepts } = trpc.analytics.getDepartmentStats.useQuery(
    { startDate: dateFilter },
    { enabled: !!user && (user.role === 'admin' || user.role === 'b2b_admin') }
  );
  
  const { data: monthlyTrends, isLoading: loadingTrends, refetch: refetchTrends } = trpc.analytics.getMonthlyTrends.useQuery(
    { months: dateRange === '1y' ? 12 : dateRange === '3m' ? 3 : 6 },
    { enabled: !!user && (user.role === 'admin' || user.role === 'b2b_admin') }
  );

  const isLoading = loadingUsers || loadingEwa || loadingEngagement || loadingDepts || loadingTrends;

  const refetchAll = () => {
    refetchUsers();
    refetchEwa();
    refetchEngagement();
    refetchDepts();
    refetchTrends();
  };

  // Export analytics to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Header
    doc.setFillColor(16, 185, 129); // Green
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Treevü Analytics', 14, 20);
    doc.setFontSize(10);
    doc.text(`Reporte Ejecutivo - ${today}`, 14, 28);
    
    // Reset colors
    doc.setTextColor(0, 0, 0);
    let yPos = 50;
    
    // Summary Section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Ejecutivo', 14, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // User Stats
    const userSummary = [
      ['Métrica', 'Valor'],
      ['Total Usuarios', String(userStats?.total || 0)],
      ['Activos Hoy', String(userStats?.activeToday || 0)],
      ['Nuevos Esta Semana', String(userStats?.newThisWeek || 0)],
      ['Tasa de Actividad', `${userStats?.total ? Math.round((userStats.activeToday / userStats.total) * 100) : 0}%`]
    ];
    
    (doc as any).autoTable({
      startY: yPos,
      head: [userSummary[0]],
      body: userSummary.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      margin: { left: 14, right: 14 },
      tableWidth: 80
    });
    
    // EWA Stats (same row)
    const ewaSummary = [
      ['Métrica EWA', 'Valor'],
      ['Total Solicitudes', String(ewaStats?.total || 0)],
      ['Aprobadas', String(ewaStats?.approved || 0)],
      ['Pendientes', String(ewaStats?.pending || 0)],
      ['Monto Desembolsado', `$${((ewaStats?.approvedAmount || 0) / 100).toLocaleString()}`]
    ];
    
    (doc as any).autoTable({
      startY: yPos,
      head: [ewaSummary[0]],
      body: ewaSummary.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 110, right: 14 },
      tableWidth: 80
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
    
    // Engagement Section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Engagement de la Plataforma', 14, yPos);
    yPos += 10;
    
    const engagementSummary = [
      ['Indicador', 'Cantidad'],
      ['Logros Desbloqueados', String(engagementStats?.achievements || 0)],
      ['Metas Completadas', String(engagementStats?.goals || 0)],
      ['Transacciones Registradas', String(engagementStats?.transactions || 0)],
      ['Referidos Exitosos', String(engagementStats?.referrals || 0)],
      ['TreePoints Emitidos', String(engagementStats?.treePoints.emitted || 0)],
      ['TreePoints Canjeados', String(engagementStats?.treePoints.redeemed || 0)]
    ];
    
    (doc as any).autoTable({
      startY: yPos,
      head: [engagementSummary[0]],
      body: engagementSummary.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] },
      margin: { left: 14, right: 14 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
    
    // Monthly Trends Section
    if (monthlyTrends && monthlyTrends.length > 0) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Tendencias Mensuales', 14, yPos);
      yPos += 10;
      
      const trendsData = monthlyTrends.map(m => [
        m.month,
        String(m.users),
        String(m.active),
        String(m.ewaRequests),
        `$${(m.ewaAmount / 100).toFixed(0)}`,
        String(m.tpEmitted)
      ]);
      
      (doc as any).autoTable({
        startY: yPos,
        head: [['Mes', 'Usuarios', 'Activos', 'EWA Req.', 'EWA $', 'TreePoints']],
        body: trendsData,
        theme: 'striped',
        headStyles: { fillColor: [245, 158, 11] },
        margin: { left: 14, right: 14 }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Department Stats
    if (departmentStats && departmentStats.length > 0 && yPos < 250) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Estadísticas por Departamento', 14, yPos);
      yPos += 10;
      
      const deptData = departmentStats.map(d => [
        d.name,
        String(d.employees),
        String(d.avgFwi),
        String(d.highRisk)
      ]);
      
      (doc as any).autoTable({
        startY: yPos,
        head: [['Departamento', 'Empleados', 'FWI Prom.', 'Alto Riesgo']],
        body: deptData,
        theme: 'striped',
        headStyles: { fillColor: [239, 68, 68] },
        margin: { left: 14, right: 14 }
      });
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Treevü Proactive - Reporte generado automáticamente | Página ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Download
    doc.save(`treevu-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'b2b_admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Acceso restringido</h2>
            <p className="text-gray-500 mb-4">Solo administradores pueden ver esta página</p>
            <Link href="/app">
              <Button>Volver al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare engagement data for pie chart
  const engagementData = engagementStats ? [
    { name: 'Logros', value: engagementStats.achievements, color: '#10b981' },
    { name: 'Metas', value: engagementStats.goals, color: '#3b82f6' },
    { name: 'Transacciones', value: engagementStats.transactions, color: '#8b5cf6' },
    { name: 'Referidos', value: engagementStats.referrals, color: '#f59e0b' },
  ] : [];

  // Prepare monthly data for charts
  const userGrowthData = monthlyTrends?.map(m => ({
    month: m.month,
    users: m.users,
    active: m.active
  })) || [];

  const ewaChartData = monthlyTrends?.map(m => ({
    month: m.month,
    requests: m.ewaRequests,
    approved: m.ewaApproved,
    amount: m.ewaAmount
  })) || [];

  const treePointsData = monthlyTrends?.map(m => ({
    month: m.month,
    emitted: m.tpEmitted,
    redeemed: m.tpRedeemed
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/app">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-500">Métricas de uso de la plataforma (datos reales)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/departments">
                <Button variant="outline" size="sm">
                  <Building2 className="w-4 h-4 mr-2" />
                  Comparar Departamentos
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={refetchAll} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={exportToPDF} 
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  {DATE_RANGES.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-3 text-gray-500">Cargando métricas...</span>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Usuarios</p>
                        <p className="text-2xl font-bold">{userStats?.total || 0}</p>
                        <p className="text-xs text-green-600">+{userStats?.newThisWeek || 0} esta semana</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Activos Hoy</p>
                        <p className="text-2xl font-bold">{userStats?.activeToday || 0}</p>
                        <p className="text-xs text-gray-500">{userStats?.total ? Math.round((userStats.activeToday / userStats.total) * 100) : 0}% del total</p>
                      </div>
                      <Activity className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">EWA Desembolsado</p>
                        <p className="text-2xl font-bold">${((ewaStats?.approvedAmount || 0) / 100).toLocaleString()}</p>
                        <p className="text-xs text-yellow-600">{ewaStats?.pending || 0} pendientes</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">TreePoints</p>
                        <p className="text-2xl font-bold">{(engagementStats?.treePoints.emitted || 0).toLocaleString()}</p>
                        <p className="text-xs text-purple-600">{(engagementStats?.treePoints.redeemed || 0).toLocaleString()} canjeados</p>
                      </div>
                      <Coins className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">Usuarios</TabsTrigger>
                <TabsTrigger value="ewa">EWA</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="departments">Departamentos</TabsTrigger>
              </TabsList>

              {/* Users Tab */}
              <TabsContent value="users">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Crecimiento de Usuarios
                      </CardTitle>
                      <CardDescription>Total vs activos por mes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={userGrowthData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="users" name="Total" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                          <Area type="monotone" dataKey="active" name="Activos" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-500" />
                        Distribución por Rol
                      </CardTitle>
                      <CardDescription>Usuarios por tipo de cuenta</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userStats?.byRole && Object.entries(userStats.byRole).map(([role, count], idx) => (
                          <div key={role} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                              <span className="capitalize">{role === 'b2b_admin' ? 'Admin B2B' : role}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{count}</span>
                              <span className="text-sm text-gray-500">
                                ({userStats.total ? Math.round((count / userStats.total) * 100) : 0}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* EWA Tab */}
              <TabsContent value="ewa">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-yellow-500" />
                        Solicitudes EWA
                      </CardTitle>
                      <CardDescription>Solicitadas vs aprobadas por mes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={ewaChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="requests" name="Solicitadas" fill="#f59e0b" />
                          <Bar dataKey="approved" name="Aprobadas" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        Resumen EWA
                      </CardTitle>
                      <CardDescription>Estadísticas totales</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-3xl font-bold text-blue-600">{ewaStats?.total || 0}</p>
                            <p className="text-sm text-gray-500">Total solicitudes</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-3xl font-bold text-green-600">{ewaStats?.approved || 0}</p>
                            <p className="text-sm text-gray-500">Aprobadas</p>
                          </div>
                          <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <p className="text-3xl font-bold text-yellow-600">{ewaStats?.pending || 0}</p>
                            <p className="text-sm text-gray-500">Pendientes</p>
                          </div>
                          <div className="text-center p-4 bg-red-50 rounded-lg">
                            <p className="text-3xl font-bold text-red-600">{ewaStats?.rejected || 0}</p>
                            <p className="text-sm text-gray-500">Rechazadas</p>
                          </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <p className="text-3xl font-bold text-purple-600">${((ewaStats?.approvedAmount || 0) / 100).toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Total desembolsado</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Engagement Tab */}
              <TabsContent value="engagement">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-purple-500" />
                        Distribución de Actividad
                      </CardTitle>
                      <CardDescription>Por tipo de interacción</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPie>
                          <Pie
                            data={engagementData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {engagementData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-yellow-500" />
                        TreePoints
                      </CardTitle>
                      <CardDescription>Emitidos vs canjeados por mes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={treePointsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="emitted" name="Emitidos" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                          <Area type="monotone" dataKey="redeemed" name="Canjeados" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Departments Tab */}
              <TabsContent value="departments">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      Métricas por Departamento
                    </CardTitle>
                    <CardDescription>Resumen de cada área</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Departamento</th>
                            <th className="text-center py-3 px-4">Empleados</th>
                            <th className="text-center py-3 px-4">FWI Promedio</th>
                            <th className="text-center py-3 px-4">Alto Riesgo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {departmentStats?.map((dept, idx) => (
                            <tr key={dept.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{dept.name}</td>
                              <td className="text-center py-3 px-4">{dept.employees}</td>
                              <td className="text-center py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                  dept.avgFwi >= 70 ? 'bg-green-100 text-green-700' :
                                  dept.avgFwi >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {dept.avgFwi}
                                </span>
                              </td>
                              <td className="text-center py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                  dept.highRisk === 0 ? 'bg-green-100 text-green-700' :
                                  dept.highRisk <= 5 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {dept.highRisk}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}
