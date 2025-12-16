import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, Building2 } from "lucide-react";
import { useState } from "react";

export default function ComparisonDashboard({ isLoading = false }: { isLoading?: boolean }) {
  const [comparison, setComparison] = useState("departments");

  const departmentData = [
    { name: "Ventas", fwi: 72, retention: 95, engagement: 88 },
    { name: "Operaciones", fwi: 68, retention: 92, engagement: 82 },
    { name: "Finanzas", fwi: 75, retention: 96, engagement: 85 },
    { name: "RRHH", fwi: 70, retention: 93, engagement: 80 },
    { name: "Tecnología", fwi: 65, retention: 88, engagement: 78 },
  ];

  const regionData = [
    { name: "CDMX", fwi: 70, revenue: 450000, employees: 250 },
    { name: "Monterrey", fwi: 68, revenue: 320000, employees: 180 },
    { name: "Guadalajara", fwi: 72, revenue: 280000, employees: 150 },
    { name: "Cancún", fwi: 66, revenue: 200000, employees: 100 },
  ];

  const timelineData = [
    { month: "Ago", dept1: 65, dept2: 62, dept3: 68 },
    { month: "Sep", dept1: 68, dept2: 65, dept3: 71 },
    { month: "Oct", dept1: 70, dept2: 68, dept3: 73 },
    { month: "Nov", dept1: 72, dept2: 70, dept3: 75 },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-emerald-500" />
              Mejor Desempeño
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">Finanzas</div>
            <p className="text-xs text-gray-500 mt-1">FWI: 75 puntos</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Promedio Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">70</div>
            <p className="text-xs text-gray-500 mt-1">FWI Score</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
              Variación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">±10</div>
            <p className="text-xs text-gray-500 mt-1">Puntos entre áreas</p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Type Selector */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">Comparativa de Desempeño</CardTitle>
              <CardDescription>Análisis detallado por departamento o región</CardDescription>
            </div>
            <Select value={comparison} onValueChange={setComparison}>
              <SelectTrigger className="w-40 bg-white/10 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-treevu-surface border-white/20">
                <SelectItem value="departments">Por Departamento</SelectItem>
                <SelectItem value="regions">Por Región</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparison === "departments" ? departmentData : regionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Legend />
              {comparison === "departments" ? (
                <>
                  <Bar dataKey="fwi" fill="#3b82f6" name="FWI Score" />
                  <Bar dataKey="retention" fill="#10b981" name="Retención %" />
                  <Bar dataKey="engagement" fill="#f59e0b" name="Engagement %" />
                </>
              ) : (
                <>
                  <Bar dataKey="fwi" fill="#3b82f6" name="FWI Score" />
                  <Bar dataKey="revenue" fill="#10b981" name="Ingresos ($K)" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Trend Comparison */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Evolución Comparativa</CardTitle>
          <CardDescription>Tendencia de FWI Score por departamento</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Legend />
              <Line type="monotone" dataKey="dept1" stroke="#3b82f6" strokeWidth={2} name="Ventas" />
              <Line type="monotone" dataKey="dept2" stroke="#f59e0b" strokeWidth={2} name="Operaciones" />
              <Line type="monotone" dataKey="dept3" stroke="#10b981" strokeWidth={2} name="Finanzas" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Comparison */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Detalles por {comparison === "departments" ? "Departamento" : "Región"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(comparison === "departments" ? departmentData : regionData).map((item, idx) => (
              <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-white">{item.name}</h4>
                  <span className="text-sm font-medium text-emerald-500">FWI: {item.fwi}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {comparison === "departments" ? (
                    <>
                      <div>
                        <p className="text-gray-400">Retención</p>
                        <p className="text-white font-medium">{(item as any).retention}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Engagement</p>
                        <p className="text-white font-medium">{(item as any).engagement}%</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-gray-400">Ingresos</p>
                        <p className="text-white font-medium">${((item as any).revenue / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Empleados</p>
                        <p className="text-white font-medium">{(item as any).employees}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
