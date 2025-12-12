import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from "recharts";
import { AlertTriangle, Users, TrendingDown, Info, ChevronRight } from "lucide-react";

interface DepartmentRisk {
  name: string;
  fwi: number;
  rotationRisk: number;
  employees: number;
  color: string;
}

interface RiskHeatMapProps {
  departments?: DepartmentRisk[];
}

const defaultDepartments: DepartmentRisk[] = [
  { name: "Ventas", fwi: 45, rotationRisk: 78, employees: 45, color: "#ef4444" },
  { name: "Operaciones", fwi: 52, rotationRisk: 65, employees: 120, color: "#f97316" },
  { name: "Marketing", fwi: 68, rotationRisk: 42, employees: 28, color: "#eab308" },
  { name: "TI", fwi: 72, rotationRisk: 35, employees: 35, color: "#22c55e" },
  { name: "RRHH", fwi: 78, rotationRisk: 25, employees: 15, color: "#10b981" },
  { name: "Finanzas", fwi: 82, rotationRisk: 18, employees: 22, color: "#14b8a6" },
  { name: "Legal", fwi: 75, rotationRisk: 30, employees: 12, color: "#22c55e" },
  { name: "Logística", fwi: 48, rotationRisk: 72, employees: 85, color: "#ef4444" },
];

const getRiskColor = (rotationRisk: number) => {
  if (rotationRisk >= 70) return "#ef4444";
  if (rotationRisk >= 50) return "#f97316";
  if (rotationRisk >= 30) return "#eab308";
  return "#22c55e";
};

export function RiskHeatMap({ departments = defaultDepartments }: RiskHeatMapProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<DepartmentRisk | null>(null);

  const highRiskDepts = departments.filter(d => d.rotationRisk >= 60);
  const totalAtRisk = highRiskDepts.reduce((sum, d) => sum + d.employees, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="font-semibold text-white">{data.name}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-gray-400">FWI Score: <span className="text-white font-medium">{data.fwi}</span></p>
            <p className="text-gray-400">Riesgo Rotación: <span className={`font-medium ${data.rotationRisk >= 60 ? 'text-red-400' : data.rotationRisk >= 40 ? 'text-amber-400' : 'text-emerald-400'}`}>{data.rotationRisk}%</span></p>
            <p className="text-gray-400">Empleados: <span className="text-white font-medium">{data.employees}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Card 
        className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/30 hover:border-red-400/50 transition-all cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-300 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Risk Intelligence
            <Info className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{highRiskDepts.length}</p>
                <p className="text-xs text-red-400">Departamentos en riesgo</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-400">{totalAtRisk}</p>
                <p className="text-xs text-gray-400">Empleados afectados</p>
              </div>
            </div>

            {/* Mini preview del scatter */}
            <div className="h-24 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <Scatter data={departments} dataKey="rotationRisk">
                    {departments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getRiskColor(entry.rotationRisk)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="flex gap-1 flex-wrap">
              {highRiskDepts.slice(0, 3).map((dept, i) => (
                <Badge key={i} variant="outline" className="border-red-500/50 text-red-400 text-[10px]">
                  {dept.name}
                </Badge>
              ))}
              {highRiskDepts.length > 3 && (
                <Badge variant="outline" className="border-gray-500/50 text-gray-400 text-[10px]">
                  +{highRiskDepts.length - 3} más
                </Badge>
              )}
            </div>
          </div>
          
          <div className="mt-3 flex items-center text-xs text-red-400 group-hover:text-red-300">
            <span>Ver mapa de calor completo</span>
            <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Mapa de Calor: FWI vs Riesgo de Rotación
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Correlación entre bienestar financiero y probabilidad de rotación por departamento
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* KPIs de impacto */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white">{highRiskDepts.length}</p>
                <p className="text-sm text-red-300">Dptos. Alto Riesgo</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white">{totalAtRisk}</p>
                <p className="text-sm text-amber-300">Empleados en Riesgo</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white">S/ 4.6M</p>
                <p className="text-sm text-emerald-300">ROI Proyectado</p>
              </div>
            </div>

            {/* Gráfico Scatter principal */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-4">
                Cuadrante de Riesgo (tamaño = cantidad de empleados)
              </h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      type="number" 
                      dataKey="fwi" 
                      name="FWI Score" 
                      domain={[30, 100]}
                      stroke="#9ca3af"
                      label={{ value: 'FWI Score →', position: 'bottom', fill: '#9ca3af' }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="rotationRisk" 
                      name="Riesgo Rotación" 
                      domain={[0, 100]}
                      stroke="#9ca3af"
                      label={{ value: '← Riesgo Rotación', angle: -90, position: 'left', fill: '#9ca3af' }}
                    />
                    <ZAxis type="number" dataKey="employees" range={[100, 1000]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter data={departments} fill="#8884d8">
                      {departments.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getRiskColor(entry.rotationRisk)}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedDept(entry)}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Leyenda */}
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-400">Alto riesgo (≥70%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs text-gray-400">Medio (50-69%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-xs text-gray-400">Moderado (30-49%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-400">Bajo (&lt;30%)</span>
                </div>
              </div>
            </div>

            {/* Lista de departamentos críticos */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Departamentos Críticos</h4>
              <div className="grid grid-cols-2 gap-3">
                {highRiskDepts.map((dept, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="text-sm font-medium text-white">{dept.name}</p>
                        <p className="text-xs text-gray-400">{dept.employees} empleados</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-400">{dept.rotationRisk}%</p>
                      <p className="text-xs text-gray-400">FWI: {dept.fwi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
