import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export interface RiskMatrixData {
  id: string;
  name: string;
  fwiScore: number;
  tenure: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  department?: string;
}

interface RiskMatrixProps {
  data?: RiskMatrixData[];
  selectedDepartment?: string | null;
  onEmployeeClick?: (employee: RiskMatrixData) => void;
  isLoading?: boolean;
}

export default function RiskMatrix({
  data,
  selectedDepartment,
  onEmployeeClick,
  isLoading = false,
}: RiskMatrixProps) {
  // Default data if none provided
  const defaultData: RiskMatrixData[] = [
    { id: '1', name: 'Juan García', fwiScore: 35, tenure: 2, riskLevel: 'critical', department: 'Ventas' },
    { id: '2', name: 'María López', fwiScore: 45, tenure: 1, riskLevel: 'high', department: 'IT' },
    { id: '3', name: 'Carlos Ruiz', fwiScore: 55, tenure: 3, riskLevel: 'medium', department: 'Ventas' },
    { id: '4', name: 'Ana Martínez', fwiScore: 65, tenure: 5, riskLevel: 'low', department: 'HR' },
    { id: '5', name: 'Pedro Sánchez', fwiScore: 40, tenure: 0.5, riskLevel: 'critical', department: 'IT' },
    { id: '6', name: 'Laura Fernández', fwiScore: 75, tenure: 7, riskLevel: 'low', department: 'Finance' },
    { id: '7', name: 'Diego Morales', fwiScore: 50, tenure: 2, riskLevel: 'medium', department: 'Ventas' },
    { id: '8', name: 'Sofía Jiménez', fwiScore: 38, tenure: 1.5, riskLevel: 'high', department: 'HR' },
    { id: '9', name: 'Roberto Díaz', fwiScore: 70, tenure: 4, riskLevel: 'low', department: 'IT' },
    { id: '10', name: 'Claudia Rodríguez', fwiScore: 42, tenure: 0.8, riskLevel: 'high', department: 'Finance' },
  ];

  const displayData = data || defaultData;

  // Filter by department if selected
  const filteredData = selectedDepartment
    ? displayData.filter(emp => emp.department === selectedDepartment)
    : displayData;

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return '#ef4444'; // red-500
      case 'high':
        return '#f97316'; // orange-500
      case 'medium':
        return '#eab308'; // yellow-500
      case 'low':
        return '#22c55e'; // green-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  const getRiskLabel = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'Crítico';
      case 'high':
        return 'Alto';
      case 'medium':
        return 'Medio';
      case 'low':
        return 'Bajo';
      default:
        return 'Desconocido';
    }
  };

  const riskCounts = {
    critical: filteredData.filter(d => d.riskLevel === 'critical').length,
    high: filteredData.filter(d => d.riskLevel === 'high').length,
    medium: filteredData.filter(d => d.riskLevel === 'medium').length,
    low: filteredData.filter(d => d.riskLevel === 'low').length,
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">Cargando matriz de riesgo...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-lg text-white">Matriz de Riesgo Interactiva</CardTitle>
        <CardDescription className="text-gray-400">
          Visualización de empleados por FWI Score y Antigüedad
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm font-semibold text-red-400">Crítico</span>
            </div>
            <div className="text-2xl font-bold text-white">{riskCounts.critical}</div>
          </div>

          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm font-semibold text-orange-400">Alto</span>
            </div>
            <div className="text-2xl font-bold text-white">{riskCounts.high}</div>
          </div>

          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm font-semibold text-yellow-400">Medio</span>
            </div>
            <div className="text-2xl font-bold text-white">{riskCounts.medium}</div>
          </div>

          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-400">Bajo</span>
            </div>
            <div className="text-2xl font-bold text-white">{riskCounts.low}</div>
          </div>
        </div>

        {/* Scatter Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="fwiScore"
              name="FWI Score"
              type="number"
              domain={[0, 100]}
              stroke="rgba(255,255,255,0.5)"
              label={{ value: 'FWI Score', position: 'insideBottomRight', offset: -10, fill: 'rgba(255,255,255,0.7)' }}
            />
            <YAxis
              dataKey="tenure"
              name="Antigüedad (años)"
              type="number"
              domain={[0, 10]}
              stroke="rgba(255,255,255,0.5)"
              label={{ value: 'Antigüedad (años)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload as RiskMatrixData;
                  return (
                    <div className="p-3 bg-black/80 border border-white/20 rounded text-sm">
                      <p className="font-semibold text-white">{data.name}</p>
                      <p className="text-gray-300">FWI: {data.fwiScore}</p>
                      <p className="text-gray-300">Antigüedad: {data.tenure} años</p>
                      <p className="text-gray-300">Riesgo: {getRiskLabel(data.riskLevel)}</p>
                      {data.department && <p className="text-gray-300">Depto: {data.department}</p>}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              name="Empleados"
              data={filteredData}
              fill="#8884d8"
              onClick={(data: any) => onEmployeeClick?.(data)}
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRiskColor(entry.riskLevel)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant Interpretation */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white/5 border border-white/10 rounded">
            <p className="font-semibold text-white mb-1">⬆️ Alto Riesgo, Nuevo</p>
            <p className="text-gray-400">Empleados nuevos con bajo FWI. Requiere atención inmediata.</p>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded">
            <p className="font-semibold text-white mb-1">⬆️ Alto Riesgo, Antiguo</p>
            <p className="text-gray-400">Empleados con antigüedad pero bajo FWI. Posible rotación.</p>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded">
            <p className="font-semibold text-white mb-1">⬇️ Bajo Riesgo, Nuevo</p>
            <p className="text-gray-400">Empleados nuevos con buen FWI. Mantener engagement.</p>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded">
            <p className="font-semibold text-white mb-1">⬇️ Bajo Riesgo, Antiguo</p>
            <p className="text-gray-400">Empleados estables con buen FWI. Retener talento.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
