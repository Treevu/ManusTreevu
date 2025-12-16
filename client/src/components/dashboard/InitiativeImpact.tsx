import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, Users } from "lucide-react";

export default function InitiativeImpact({ isLoading = false }: { isLoading?: boolean }) {
  const initiatives = [
    { name: "Programa Wellness", fwiImpact: 8, costPerEmployee: 50, roi: 3.2, adoption: 78 },
    { name: "Mentoría Financiera", fwiImpact: 12, costPerEmployee: 75, roi: 4.5, adoption: 65 },
    { name: "TreePoints Rewards", fwiImpact: 6, costPerEmployee: 30, roi: 2.8, adoption: 92 },
    { name: "Educación Financiera", fwiImpact: 15, costPerEmployee: 100, roi: 5.2, adoption: 58 },
  ];

  const timelineData = [
    { month: "Ago", fwiGain: 0, cost: 0, roi: 0 },
    { month: "Sep", fwiGain: 8, cost: 5000, roi: 1.2 },
    { month: "Oct", fwiGain: 18, cost: 12000, roi: 2.8 },
    { month: "Nov", fwiGain: 28, cost: 18000, roi: 4.1 },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Target className="h-4 w-4 mr-2 text-emerald-500" />
              Impacto Promedio FWI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+10.25</div>
            <p className="text-xs text-gray-500 mt-1">Puntos por iniciativa</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
              ROI Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">3.93x</div>
            <p className="text-xs text-gray-500 mt-1">Retorno de inversión</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Users className="h-4 w-4 mr-2 text-purple-500" />
              Adopción Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">73.25%</div>
            <p className="text-xs text-gray-500 mt-1">De participación</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Impact */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Impacto Acumulativo</CardTitle>
          <CardDescription>Ganancia de FWI y ROI a lo largo del tiempo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Legend />
              <Line type="monotone" dataKey="fwiGain" stroke="#3b82f6" strokeWidth={2} name="FWI Ganancia" />
              <Line type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={2} name="ROI" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Initiatives Comparison */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Comparativa de Iniciativas</CardTitle>
          <CardDescription>Impacto FWI vs Costo vs ROI</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={initiatives}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Legend />
              <Bar dataKey="fwiImpact" fill="#3b82f6" name="FWI Impact" />
              <Bar dataKey="roi" fill="#10b981" name="ROI" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Initiatives List */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Detalle de Iniciativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {initiatives.map((init, idx) => (
              <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">{init.name}</h4>
                  <span className="text-sm font-medium text-emerald-500">ROI {init.roi}x</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Impacto FWI</p>
                    <p className="text-white font-medium">+{init.fwiImpact}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Costo/Empleado</p>
                    <p className="text-white font-medium">${init.costPerEmployee}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Adopción</p>
                    <p className="text-white font-medium">{init.adoption}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
