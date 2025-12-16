import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Calendar, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GoalRecord {
  id: number;
  name: string;
  targetAmount: number;
  achievedAmount: number;
  completedDate: string;
  fwiImpact: number;
  category: string;
}

export default function GoalsHistory({ isLoading = false }: { isLoading?: boolean }) {
  const goalsData: GoalRecord[] = [
    { id: 1, name: "Fondo de Emergencia", targetAmount: 5000, achievedAmount: 5000, completedDate: "2024-11-15", fwiImpact: 12, category: "Seguridad" },
    { id: 2, name: "Reducir Deudas", targetAmount: 3000, achievedAmount: 3000, completedDate: "2024-10-20", fwiImpact: 15, category: "Deuda" },
    { id: 3, name: "Ahorrar para Vacaciones", targetAmount: 2000, achievedAmount: 2000, completedDate: "2024-09-10", fwiImpact: 8, category: "Lifestyle" },
  ];

  const timelineData = [
    { month: "Ago", completed: 0, fwiGain: 0 },
    { month: "Sep", completed: 1, fwiGain: 8 },
    { month: "Oct", completed: 2, fwiGain: 23 },
    { month: "Nov", completed: 3, fwiGain: 35 },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
              Metas Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{goalsData.length}</div>
            <p className="text-xs text-gray-500 mt-1">En los últimos 3 meses</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
              Impacto en FWI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+35</div>
            <p className="text-xs text-gray-500 mt-1">Puntos de mejora</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Target className="h-4 w-4 mr-2 text-purple-500" />
              Tasa de Cumplimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">100%</div>
            <p className="text-xs text-gray-500 mt-1">De metas iniciadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Progreso Histórico</CardTitle>
          <CardDescription>Metas completadas y impacto en FWI Score</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Line type="monotone" dataKey="fwiGain" stroke="#3b82f6" strokeWidth={2} name="Ganancia FWI" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Goals List */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Historial de Metas</CardTitle>
          <CardDescription>Todas tus metas completadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goalsData.map((goal) => (
              <div key={goal.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{goal.name}</h4>
                    <p className="text-sm text-gray-400">{goal.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-emerald-500">+{goal.fwiImpact} FWI</p>
                    <p className="text-xs text-gray-500">{new Date(goal.completedDate).toLocaleDateString('es-MX')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "100%" }} />
                  </div>
                  <span className="text-xs text-gray-400">${goal.achievedAmount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
