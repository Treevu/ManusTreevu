import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartHelpButton } from '@/components/ChartExplanationModal';
import { employeeDashboardExplanations } from '@/lib/chartExplanations';
import { MiniChartTooltip, miniChartData } from '@/components/MiniChartTooltip';
import { TableHeaderTooltip, tableHeaderTooltips } from '@/components/TableHeaderTooltip';

interface ExpenseData {
  month: string;
  amount: number;
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

interface ExpensePatternAnalysisProps {
  monthlyData?: ExpenseData[];
  categoryData?: CategoryData[];
  averageMonthly?: number;
  currentMonthly?: number;
  budgetLimit?: number;
  isLoading?: boolean;
}

export default function ExpensePatternAnalysis({
  monthlyData,
  categoryData,
  averageMonthly = 2500,
  currentMonthly = 2800,
  budgetLimit = 3000,
  isLoading = false,
}: ExpensePatternAnalysisProps) {
  // Default data if none provided
  const defaultMonthlyData = [
    { month: 'Ene', amount: 2400 },
    { month: 'Feb', amount: 2210 },
    { month: 'Mar', amount: 2290 },
    { month: 'Abr', amount: 2000 },
    { month: 'May', amount: 2181 },
    { month: 'Jun', amount: 2500 },
    { month: 'Jul', amount: 2100 },
    { month: 'Ago', amount: 2800 },
    { month: 'Sep', amount: 2600 },
    { month: 'Oct', amount: 2900 },
    { month: 'Nov', amount: 3100 },
    { month: 'Dic', amount: 2800 },
  ];

  const defaultCategoryData = [
    { category: 'Alimentación', amount: 800, percentage: 28.6, trend: 'up' as const },
    { category: 'Transporte', amount: 600, percentage: 21.4, trend: 'stable' as const },
    { category: 'Vivienda', amount: 900, percentage: 32.1, trend: 'stable' as const },
    { category: 'Entretenimiento', amount: 300, percentage: 10.7, trend: 'down' as const },
    { category: 'Otros', amount: 200, percentage: 7.1, trend: 'up' as const },
  ];

  const displayMonthlyData = monthlyData || defaultMonthlyData;
  const displayCategoryData = categoryData || defaultCategoryData;

  const percentageVsAverage = ((currentMonthly - averageMonthly) / averageMonthly) * 100;
  const percentageVsBudget = (currentMonthly / budgetLimit) * 100;
  const exceedsBudget = currentMonthly > budgetLimit;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-400" />;
      default:
        return <TrendingDown className="w-4 h-4 text-gray-400" />;
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Month */}
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white">Gasto Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">${currentMonthly.toLocaleString()}</span>
                <span className="text-xs text-gray-400">este mes</span>
              </div>
              <div className={`text-sm font-semibold ${percentageVsAverage > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {percentageVsAverage > 0 ? '+' : ''}{percentageVsAverage.toFixed(1)}% vs promedio
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average */}
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white">Promedio Histórico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">${averageMonthly.toLocaleString()}</span>
                <span className="text-xs text-gray-400">últimos 12 meses</span>
              </div>
              <div className="text-sm text-gray-400">
                Diferencia: ${Math.abs(currentMonthly - averageMonthly).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card className={`border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border ${exceedsBudget ? 'border-red-500/30' : 'border-white/10'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              {exceedsBudget && <AlertCircle className="w-4 h-4 text-red-400" />}
              Presupuesto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">${budgetLimit.toLocaleString()}</span>
                <span className="text-xs text-gray-400">límite</span>
              </div>
              <div className={`text-sm font-semibold ${exceedsBudget ? 'text-red-400' : 'text-green-400'}`}>
                {percentageVsBudget.toFixed(1)}% utilizado
              </div>
              {exceedsBudget && (
                <div className="text-xs text-red-400">
                  ⚠️ Excede presupuesto por ${(currentMonthly - budgetLimit).toLocaleString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Chart */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <MiniChartTooltip
                label="Tendencia de Gastos (12 meses)"
                tooltip="Visualiza cómo han evolucionado tus gastos mensuales. Identifica patrones estacionales y tendencias de gasto."
                chartType="line"
                data={miniChartData.expenseTrend}
              />
              <CardDescription className="text-gray-400">Evolución mensual de gastos</CardDescription>
            </div>
            <ChartHelpButton explanation={employeeDashboardExplanations.expensePatternAnalysis} />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={displayMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
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
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Gasto Mensual"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Gastos por Categoría</CardTitle>
          <CardDescription className="text-gray-400">Desglose del gasto actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayCategoryData.map((category, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TableHeaderTooltip header={category.category} tooltip={tableHeaderTooltips.categoryName} />
                    {getTrendIcon(category.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <TableHeaderTooltip header="Monto" tooltip={tableHeaderTooltips.categoryTotal} />
                      <span className="text-sm font-mono text-white">${category.amount.toLocaleString()}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <TableHeaderTooltip header="%" tooltip={tableHeaderTooltips.categoryPercentage} />
                      {category.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <Progress value={category.percentage} className="h-2 bg-white/10" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentMonthly > averageMonthly && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-sm text-amber-300">
                💡 Tu gasto este mes es {percentageVsAverage.toFixed(1)}% superior al promedio. Considera revisar categorías con mayor incremento.
              </div>
            )}
            {exceedsBudget && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-300">
                🚨 Has excedido tu presupuesto en ${(currentMonthly - budgetLimit).toLocaleString()}. Ajusta tus gastos para los próximos meses.
              </div>
            )}
            {displayCategoryData.some(c => c.trend === 'up') && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-sm text-blue-300">
                📊 Algunas categorías muestran tendencia al alza. Monitorea {displayCategoryData.filter(c => c.trend === 'up').map(c => c.category).join(', ')}.
              </div>
            )}
            {currentMonthly <= averageMonthly && !exceedsBudget && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-sm text-green-300">
                ✅ ¡Excelente! Tu gasto está bajo control y dentro del presupuesto.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
