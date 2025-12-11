import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Target,
  Coins,
  CreditCard,
  Loader2,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Monthly Comparison Section Component
function MonthlyComparisonSection({ userId }: { userId: number }) {
  const { data: comparison, isLoading } = trpc.reports.getMonthlyComparison.useQuery(
    undefined,
    { enabled: !!userId }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!comparison || comparison.months.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin Datos Históricos</h3>
          <p className="text-gray-500">Aún no hay suficientes datos para mostrar la comparativa mensual</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = comparison.months.map(m => ({
    name: m.monthName,
    fwiScore: m.fwiScore,
    gastos: m.totalExpenses / 100,
    ingresos: m.totalIncome / 100,
    treePoints: m.treePointsEarned,
  }));

  return (
    <div className="space-y-6">
      {/* Variation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {comparison.variations.fwiScore >= 0 ? '+' : ''}{comparison.variations.fwiScore.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">FWI Score</div>
              <div className={`text-xs mt-1 ${comparison.variations.fwiScore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {comparison.variations.fwiScore >= 0 ? '↑ Mejorando' : '↓ Bajando'}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {comparison.variations.expenses >= 0 ? '+' : ''}{comparison.variations.expenses.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">Gastos</div>
              <div className={`text-xs mt-1 ${comparison.variations.expenses <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {comparison.variations.expenses <= 0 ? '↓ Reduciendo' : '↑ Aumentando'}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {comparison.variations.treePoints >= 0 ? '+' : ''}{comparison.variations.treePoints.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">TreePoints</div>
              <div className={`text-xs mt-1 ${comparison.variations.treePoints >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {comparison.variations.treePoints >= 0 ? '↑ Ganando más' : '↓ Ganando menos'}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">
                {chartData.length}
              </div>
              <div className="text-sm text-gray-500">Meses</div>
              <div className="text-xs mt-1 text-gray-500">
                de datos históricos
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FWI Score Evolution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución del FWI Score</CardTitle>
          <CardDescription>Últimos 6 meses de tu bienestar financiero</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`${value} puntos`, 'FWI Score']}
              />
              <Line 
                type="monotone" 
                dataKey="fwiScore" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#16a34a' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Expenses vs Income Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gastos Mensuales</CardTitle>
            <CardDescription>Comparativa de gastos mes a mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(0)}`, 'Gastos']}
                />
                <Bar dataKey="gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TreePoints Ganados</CardTitle>
            <CardDescription>Puntos acumulados por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTreePoints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value} puntos`, 'TreePoints']}
                />
                <Area 
                  type="monotone" 
                  dataKey="treePoints" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorTreePoints)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const CATEGORY_COLORS: Record<string, string> = {
  food: '#22c55e',
  transport: '#3b82f6',
  entertainment: '#f59e0b',
  utilities: '#ef4444',
  shopping: '#8b5cf6',
  health: '#ec4899',
  education: '#06b6d4',
  other: '#84cc16',
};

export default function Reports() {
  const { user, loading: authLoading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  
  // Get available months
  const { data: availableMonths, isLoading: monthsLoading } = trpc.reports.getAvailableMonths.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Parse selected period
  const [selectedMonth, selectedYear] = selectedPeriod 
    ? selectedPeriod.split('-').map(Number) 
    : [new Date().getMonth(), new Date().getFullYear()];

  // Get report data
  const { data: report, isLoading: reportLoading, error } = trpc.reports.getMonthlyReport.useQuery(
    { month: selectedMonth, year: selectedYear },
    { enabled: !!user && !!selectedPeriod }
  );

  // Get HTML for download
  const { refetch: fetchHTML } = trpc.reports.getReportHTML.useQuery(
    { month: selectedMonth, year: selectedYear },
    { enabled: false }
  );

  const handleDownloadPDF = async () => {
    try {
      toast.info('Generando PDF...');
      const result = await fetchHTML();
      
      if (result.data?.html) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(result.data.html);
          printWindow.document.close();
          printWindow.onload = () => {
            printWindow.print();
          };
          toast.success('PDF listo para descargar');
        }
      }
    } catch (err) {
      toast.error('Error al generar el PDF');
    }
  };

  const handlePreview = async () => {
    try {
      const result = await fetchHTML();
      if (result.data?.html) {
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
          previewWindow.document.write(result.data.html);
          previewWindow.document.close();
        }
      }
    } catch (err) {
      toast.error('Error al cargar la vista previa');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acceso Requerido</CardTitle>
            <CardDescription>Inicia sesión para ver tus reportes</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/app">
              <Button className="w-full">Ir al Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare chart data
  const categoryChartData = report?.transactions.byCategory.map((cat) => ({
    name: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
    amount: cat.amount / 100,
    percentage: cat.percentage,
    fill: CATEGORY_COLORS[cat.category] || '#84cc16',
  })) || [];

  // Mock FWI trend data (in real app, this would come from the API)
  const fwiTrendData = [
    { day: 'Sem 1', score: Math.max(0, (report?.fwiAnalysis.currentScore || 70) - 8) },
    { day: 'Sem 2', score: Math.max(0, (report?.fwiAnalysis.currentScore || 70) - 5) },
    { day: 'Sem 3', score: Math.max(0, (report?.fwiAnalysis.currentScore || 70) - 2) },
    { day: 'Sem 4', score: report?.fwiAnalysis.currentScore || 70 },
  ];

  // TreePoints trend data
  const treePointsTrendData = report?.treePoints.transactions.slice(0, 10).reverse().map((tx, i) => ({
    day: `Día ${i + 1}`,
    earned: tx.amount > 0 ? tx.amount : 0,
    redeemed: tx.amount < 0 ? Math.abs(tx.amount) : 0,
    balance: report.treePoints.balance + (report.treePoints.transactions.slice(0, i + 1).reduce((sum, t) => sum - t.amount, 0)),
  })) || [];

  // Goals progress data for pie chart
  const goalsChartData = report?.goals.topGoals.map((goal) => ({
    name: goal.name,
    value: goal.progress,
    current: goal.current / 100,
    target: goal.target / 100,
  })) || [];

  const TrendIcon = report?.fwiAnalysis.trend === 'up' 
    ? TrendingUp 
    : report?.fwiAnalysis.trend === 'down' 
      ? TrendingDown 
      : Minus;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
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
                <h1 className="text-xl font-bold text-gray-900">Reportes Mensuales</h1>
                <p className="text-sm text-gray-500">Resumen de tu bienestar financiero</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecciona un mes" />
                </SelectTrigger>
                <SelectContent>
                  {monthsLoading ? (
                    <div className="p-2 text-center text-gray-500">Cargando...</div>
                  ) : availableMonths?.length === 0 ? (
                    <div className="p-2 text-center text-gray-500">Sin datos disponibles</div>
                  ) : (
                    availableMonths?.map((m) => (
                      <SelectItem key={`${m.month}-${m.year}`} value={`${m.month}-${m.year}`}>
                        {m.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              
              {report && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePreview}>
                    <Eye className="w-4 h-4 mr-2" />
                    Vista Previa
                  </Button>
                  <Button onClick={handleDownloadPDF} className="bg-green-600 hover:bg-green-700">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar PDF
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!selectedPeriod ? (
          <Card className="max-w-lg mx-auto">
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Selecciona un Período</h2>
              <p className="text-gray-500">
                Elige un mes del selector para ver tu reporte de bienestar financiero
              </p>
            </CardContent>
          </Card>
        ) : reportLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : error ? (
          <Card className="max-w-lg mx-auto">
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Sin Datos</h2>
              <p className="text-gray-500">
                No hay suficientes datos para generar el reporte de este período
              </p>
            </CardContent>
          </Card>
        ) : report ? (
          <div className="space-y-6">
            {/* Period Header */}
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">
                {report.period.month} {report.period.year} • {report.period.startDate} - {report.period.endDate}
              </span>
            </div>

            {/* FWI Score Card with Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-6 bg-green-500 rounded-full" />
                  Tu FWI Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Score Circle */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-36 h-36 mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="64"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="12"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="64"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="12"
                          strokeDasharray={`${(report.fwiAnalysis.currentScore / 100) * 402} 402`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-gray-900">{report.fwiAnalysis.currentScore}</span>
                        <span className="text-sm text-gray-500">{report.fwiAnalysis.category}</span>
                      </div>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      report.fwiAnalysis.trend === 'up' ? 'bg-green-100 text-green-700' :
                      report.fwiAnalysis.trend === 'down' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      <TrendIcon className="w-4 h-4" />
                      {Math.abs(report.fwiAnalysis.change)} puntos vs mes anterior
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4 w-full">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{report.user.level}</div>
                        <div className="text-xs text-gray-500">Nivel</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{report.user.treePoints.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">TreePoints</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{report.user.streakDays}</div>
                        <div className="text-xs text-gray-500">Racha</div>
                      </div>
                    </div>
                  </div>

                  {/* FWI Trend Chart */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-4">Tendencia del FWI Score</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={fwiTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value: number) => [`${value} puntos`, 'FWI Score']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#22c55e" 
                          strokeWidth={3}
                          dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#16a34a' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="transactions" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="transactions" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="hidden sm:inline">Gastos</span>
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">Metas</span>
                </TabsTrigger>
                <TabsTrigger value="treepoints" className="flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  <span className="hidden sm:inline">TreePoints</span>
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Comparativa</span>
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Tips</span>
                </TabsTrigger>
              </TabsList>

              {/* Transactions Tab with Charts */}
              <TabsContent value="transactions">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Summary Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumen de Gastos</CardTitle>
                      <CardDescription>Análisis de tus transacciones del mes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-green-600">
                            {formatCurrency(report.transactions.total)}
                          </div>
                          <div className="text-xs text-gray-500">Total del mes</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-green-600">
                            {formatCurrency(report.transactions.avgDaily)}
                          </div>
                          <div className="text-xs text-gray-500">Promedio diario</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-green-600">
                            {report.transactions.byCategory.reduce((sum, c) => sum + c.count, 0)}
                          </div>
                          <div className="text-xs text-gray-500">Transacciones</div>
                        </div>
                      </div>

                      {/* Top Merchants */}
                      {report.transactions.topMerchants.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700">Principales Comercios</h4>
                          <div className="space-y-2">
                            {report.transactions.topMerchants.slice(0, 5).map((m, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm">{m.merchant}</span>
                                <div className="text-right">
                                  <div className="text-sm font-medium">{formatCurrency(m.amount)}</div>
                                  <div className="text-xs text-gray-500">{m.count} transacciones</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Category Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Gastos por Categoría</CardTitle>
                      <CardDescription>Distribución de tus gastos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {categoryChartData.length > 0 ? (
                        <>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={categoryChartData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} stroke="#9ca3af" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'white', 
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px'
                                }}
                                formatter={(value: number) => [`$${value.toFixed(0)}`, 'Monto']}
                              />
                              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                                {categoryChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>

                          {/* Category Legend */}
                          <div className="flex flex-wrap gap-3 mt-4 justify-center">
                            {categoryChartData.map((cat, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.fill }} />
                                <span>{cat.name}: {cat.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No hay datos de categorías disponibles
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Goals Tab with Pie Chart */}
              <TabsContent value="goals">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Metas de Ahorro</CardTitle>
                      <CardDescription>Progreso de tus objetivos financieros</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{report.goals.active}</div>
                          <div className="text-xs text-gray-500">Activas</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{report.goals.completed}</div>
                          <div className="text-xs text-gray-500">Completadas</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(report.goals.totalSaved)}
                          </div>
                          <div className="text-xs text-gray-500">Total Ahorrado</div>
                        </div>
                      </div>

                      {/* Goals List */}
                      <div className="space-y-4">
                        {report.goals.topGoals.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            No tienes metas de ahorro activas
                          </div>
                        ) : (
                          report.goals.topGoals.map((goal, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex justify-between mb-2">
                                <span className="font-medium">{goal.name}</span>
                                <span className="text-green-600 font-medium">{goal.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min(goal.progress, 100)}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-sm text-gray-500">
                                <span>{formatCurrency(goal.current)} ahorrado</span>
                                <span>Meta: {formatCurrency(goal.target)}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Goals Pie Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Progreso Visual</CardTitle>
                      <CardDescription>Comparativa de avance en metas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {goalsChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={goalsChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}%`}
                            >
                              {goalsChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                              }}
                              formatter={(value: number, name: string) => [`${value}%`, name]}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Crea metas de ahorro para ver el progreso visual
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* TreePoints Tab with Area Chart */}
              <TabsContent value="treepoints">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>TreePoints & EWA</CardTitle>
                      <CardDescription>Puntos ganados y adelantos solicitados</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">+{report.treePoints.earned}</div>
                          <div className="text-xs text-gray-500">Ganados</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">-{report.treePoints.redeemed}</div>
                          <div className="text-xs text-gray-500">Canjeados</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-700">{report.treePoints.balance}</div>
                          <div className="text-xs text-gray-500">Balance Actual</div>
                        </div>
                      </div>

                      {/* EWA Summary */}
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-3">Adelantos de Salario (EWA)</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-xl font-bold text-blue-600">{report.ewa.requested}</div>
                            <div className="text-xs text-blue-700">Solicitados</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-blue-600">{report.ewa.approved}</div>
                            <div className="text-xs text-blue-700">Aprobados</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-blue-600">
                              {formatCurrency(report.ewa.totalAmount)}
                            </div>
                            <div className="text-xs text-blue-700">Monto Total</div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Transactions */}
                      {report.treePoints.transactions.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700">Movimientos Recientes</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {report.treePoints.transactions.slice(0, 5).map((tx, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <div className="text-sm font-medium">{tx.reason || tx.type}</div>
                                  <div className="text-xs text-gray-500">{tx.date}</div>
                                </div>
                                <div className={`font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {tx.amount > 0 ? '+' : ''}{tx.amount}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* TreePoints Trend Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tendencia de TreePoints</CardTitle>
                      <CardDescription>Evolución de tus puntos en el tiempo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {treePointsTrendData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={treePointsTrendData}>
                            <defs>
                              <linearGradient id="colorEarned" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                              </linearGradient>
                              <linearGradient id="colorRedeemed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                              }}
                            />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="earned" 
                              name="Ganados"
                              stroke="#22c55e" 
                              fillOpacity={1} 
                              fill="url(#colorEarned)" 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="redeemed" 
                              name="Canjeados"
                              stroke="#ef4444" 
                              fillOpacity={1} 
                              fill="url(#colorRedeemed)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No hay datos de TreePoints para mostrar
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Monthly Comparison Tab */}
              <TabsContent value="comparison">
                <MonthlyComparisonSection userId={user.id} />
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle>Recomendaciones</CardTitle>
                    <CardDescription>Tips personalizados para mejorar tu bienestar financiero</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {report.recommendations.map((rec, i) => (
                        <div 
                          key={i} 
                          className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg"
                        >
                          <p className="text-sm text-amber-900">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </main>
    </div>
  );
}
