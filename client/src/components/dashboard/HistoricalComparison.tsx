import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";

export default function HistoricalComparison({ isLoading = false }: { isLoading?: boolean }) {
  const [period, setPeriod] = useState("year");

  const yearData = [
    { month: "Ene", current: 55, previous: 48, target: 60 },
    { month: "Feb", current: 58, previous: 50, target: 62 },
    { month: "Mar", current: 62, previous: 52, target: 64 },
    { month: "Abr", current: 65, previous: 54, target: 66 },
    { month: "May", current: 68, previous: 56, target: 68 },
    { month: "Jun", current: 70, previous: 58, target: 70 },
    { month: "Jul", current: 72, previous: 60, target: 72 },
    { month: "Ago", current: 75, previous: 62, target: 74 },
    { month: "Sep", current: 78, previous: 64, target: 76 },
    { month: "Oct", current: 80, previous: 66, target: 78 },
    { month: "Nov", current: 82, previous: 68, target: 80 },
    { month: "Dic", current: 85, previous: 70, target: 82 },
  ];

  const quarterData = [
    { quarter: "Q1", current: 58, previous: 50, target: 62 },
    { quarter: "Q2", current: 68, previous: 56, target: 68 },
    { quarter: "Q3", current: 75, previous: 62, target: 74 },
    { quarter: "Q4", current: 82, previous: 68, target: 80 },
  ];

  const data = period === "year" ? yearData : quarterData;
  const xAxisKey = period === "year" ? "month" : "quarter";

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
              Mejora vs Año Anterior
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+21.4%</div>
            <p className="text-xs text-gray-500 mt-1">Crecimiento acumulado</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              Cumplimiento de Meta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">103.7%</div>
            <p className="text-xs text-gray-500 mt-1">De objetivo anual</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
              Tendencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">↑ +3.7%</div>
            <p className="text-xs text-gray-500 mt-1">Mes a mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Period Selector */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">Comparativa Histórica</CardTitle>
              <CardDescription>Desempeño actual vs período anterior</CardDescription>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-treevu-surface border-white/20">
                <SelectItem value="year">Por Mes</SelectItem>
                <SelectItem value="quarter">Por Trimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey={xAxisKey} stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Legend />
              <Line type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={2} name="Período Actual" />
              <Line type="monotone" dataKey="previous" stroke="#6b7280" strokeWidth={2} name="Período Anterior" />
              <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Meta" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Insights Históricos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
              <div>
                <p className="text-sm font-medium text-white">Crecimiento Consistente</p>
                <p className="text-xs text-gray-400">Mejora sostenida mes a mes sin caídas</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <div>
                <p className="text-sm font-medium text-white">Superó Objetivos</p>
                <p className="text-xs text-gray-400">Alcanzó 103.7% de la meta anual</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
              <div>
                <p className="text-sm font-medium text-white">Aceleración Reciente</p>
                <p className="text-xs text-gray-400">Últimos 3 meses muestran mayor velocidad de crecimiento</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
