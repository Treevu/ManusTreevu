import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, Users, Target } from "lucide-react";

export default function CompetitiveAnalysis({ isLoading = false }: { isLoading?: boolean }) {
  const competitorData = [
    { company: "Tu Empresa", fwi: 68, retention: 92, engagement: 78 },
    { company: "Competidor A", fwi: 62, retention: 88, engagement: 72 },
    { company: "Competidor B", fwi: 65, retention: 90, engagement: 75 },
    { company: "Promedio Industria", fwi: 58, retention: 82, engagement: 68 },
  ];

  const positioningData = [
    { x: 58, y: 82, name: "Promedio Industria", size: 100 },
    { x: 62, y: 88, name: "Competidor A", size: 120 },
    { x: 65, y: 90, name: "Competidor B", size: 130 },
    { x: 68, y: 92, name: "Tu Empresa", size: 150 },
  ];

  return (
    <div className="space-y-6">
      {/* Positioning Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
              Posición Competitiva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">#1</div>
            <p className="text-xs text-gray-500 mt-1">En FWI Score</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Ventaja de Retención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+10%</div>
            <p className="text-xs text-gray-500 mt-1">vs competidores</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Target className="h-4 w-4 mr-2 text-purple-500" />
              Engagement Relativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+14%</div>
            <p className="text-xs text-gray-500 mt-1">Sobre promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Chart */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Comparativa de Métricas</CardTitle>
          <CardDescription>Desempeño vs competidores e industria</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={competitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="company" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Legend />
              <Bar dataKey="fwi" fill="#3b82f6" name="FWI Score" />
              <Bar dataKey="retention" fill="#10b981" name="Retención %" />
              <Bar dataKey="engagement" fill="#f59e0b" name="Engagement %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Positioning Chart */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Posicionamiento Estratégico</CardTitle>
          <CardDescription>FWI Score vs Retención de Empleados</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" dataKey="x" name="FWI Score" stroke="#888" />
              <YAxis type="number" dataKey="y" name="Retención %" stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Empresas" data={positioningData} fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Insights Competitivos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
              <div>
                <p className="text-sm font-medium text-white">Liderazgo en Bienestar</p>
                <p className="text-xs text-gray-400">Tu FWI Score es 10 puntos superior al promedio</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <div>
                <p className="text-sm font-medium text-white">Retención Diferenciada</p>
                <p className="text-xs text-gray-400">Mantiene 92% de empleados vs 88% de competidores</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
              <div>
                <p className="text-sm font-medium text-white">Oportunidad de Engagement</p>
                <p className="text-xs text-gray-400">Incrementa actividad en app para mayor diferenciación</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
