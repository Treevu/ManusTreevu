import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Target } from "lucide-react";

export default function ProfitabilityAnalysis({ isLoading = false }: { isLoading?: boolean }) {
  const profitByCategory = [
    { name: "Electrónica", value: 35, margin: 22 },
    { name: "Ropa", value: 28, margin: 35 },
    { name: "Alimentos", value: 22, margin: 15 },
    { name: "Servicios", value: 15, margin: 45 },
  ];

  const monthlyProfitability = [
    { month: "Ago", revenue: 15000, costs: 9000, profit: 6000, margin: 40 },
    { month: "Sep", revenue: 18000, costs: 10200, profit: 7800, margin: 43 },
    { month: "Oct", revenue: 22000, costs: 12100, profit: 9900, margin: 45 },
    { month: "Nov", revenue: 25000, costs: 13750, profit: 11250, margin: 45 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-emerald-500" />
              Margen Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">29.3%</div>
            <p className="text-xs text-gray-500 mt-1">De ganancia bruta</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
              Ganancia Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">$11,250</div>
            <p className="text-xs text-gray-500 mt-1">Noviembre 2024</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Target className="h-4 w-4 mr-2 text-purple-500" />
              Crecimiento YoY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+87%</div>
            <p className="text-xs text-gray-500 mt-1">vs año anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Profit by Category */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Distribución de Ganancias</CardTitle>
          <CardDescription>Contribución de cada categoría</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={profitByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {profitByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Profitability Trend */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Tendencia de Rentabilidad</CardTitle>
          <CardDescription>Ingresos, costos y ganancia mensual</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyProfitability}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Ingresos" />
              <Bar dataKey="costs" fill="#ef4444" name="Costos" />
              <Bar dataKey="profit" fill="#10b981" name="Ganancia" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Desempeño por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profitByCategory.map((cat, idx) => (
              <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">{cat.name}</h4>
                  <span className="text-sm font-medium text-emerald-500">{cat.margin}% margen</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${cat.margin}%` }} />
                  </div>
                  <span className="text-xs text-gray-400">{cat.value}% de ganancias</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
