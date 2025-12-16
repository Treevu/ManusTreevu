import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, CheckCircle2, XCircle, DollarSign
} from 'lucide-react';

interface EWADepartmentData {
  departmentId: number;
  departmentName: string;
  totalRequests: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  totalAmount: number;
  approvedAmount: number;
  avgAmount: number;
  approvalRate: number;
  avgProcessingTime: number;
}

interface EWADepartmentReportsProps {
  departments?: EWADepartmentData[];
  isLoading?: boolean;
}

export function EWADepartmentReports({ departments = [], isLoading = false }: EWADepartmentReportsProps) {
  // Calcular estadísticas generales
  const stats = useMemo(() => {
    const total = departments.reduce((sum, d) => sum + d.totalRequests, 0);
    const approved = departments.reduce((sum, d) => sum + d.approvedCount, 0);
    const rejected = departments.reduce((sum, d) => sum + d.rejectedCount, 0);
    const totalAmount = departments.reduce((sum, d) => sum + d.totalAmount, 0);
    const approvedAmount = departments.reduce((sum, d) => sum + d.approvedAmount, 0);
    const avgApprovalRate = departments.length > 0 
      ? Math.round(departments.reduce((sum, d) => sum + d.approvalRate, 0) / departments.length)
      : 0;

    return {
      total,
      approved,
      rejected,
      totalAmount,
      approvedAmount,
      avgApprovalRate,
      departmentCount: departments.length,
    };
  }, [departments]);

  // Datos para gráfico de aprobación por departamento
  const approvalChartData = departments.map(d => ({
    name: d.departmentName.substring(0, 10),
    'Aprobadas': d.approvedCount,
    'Rechazadas': d.rejectedCount,
    'Pendientes': d.pendingCount,
  }));

  // Datos para gráfico de montos por departamento
  const amountChartData = departments.map(d => ({
    name: d.departmentName.substring(0, 10),
    'Monto Total': d.totalAmount / 100,
    'Monto Aprobado': d.approvedAmount / 100,
  }));

  // Datos para gráfico de tasa de aprobación
  const approvalRateData = departments
    .sort((a, b) => b.approvalRate - a.approvalRate)
    .slice(0, 8)
    .map(d => ({
      name: d.departmentName.substring(0, 12),
      rate: d.approvalRate,
    }));

  // Datos para pie chart de distribución
  const distributionData = departments
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 6)
    .map(d => ({
      name: d.departmentName,
      value: d.totalAmount / 100,
    }));

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Total Solicitudes</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Users className="h-6 w-6 text-brand-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Tasa Aprobación</p>
                <p className="text-2xl font-bold text-green-400">{stats.avgApprovalRate}%</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Monto Total</p>
                <p className="text-2xl font-bold text-white">S/ {(stats.totalAmount / 100).toLocaleString('es-PE', { maximumFractionDigits: 0 })}</p>
              </div>
              <DollarSign className="h-6 w-6 text-brand-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Departamentos</p>
                <p className="text-2xl font-bold text-blue-400">{stats.departmentCount}</p>
              </div>
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solicitudes por Departamento */}
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Solicitudes por Departamento</CardTitle>
            <CardDescription className="text-gray-400">Distribución de aprobaciones, rechazos y pendientes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={approvalChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #ffffff20' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="Aprobadas" fill="#10b981" />
                <Bar dataKey="Rechazadas" fill="#ef4444" />
                <Bar dataKey="Pendientes" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Montos por Departamento */}
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Montos Solicitados vs Aprobados</CardTitle>
            <CardDescription className="text-gray-400">Comparativa de montos por departamento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={amountChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #ffffff20' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => `S/ ${value.toLocaleString('es-PE', { maximumFractionDigits: 0 })}`}
                />
                <Legend />
                <Line type="monotone" dataKey="Monto Total" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="Monto Aprobado" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tasa de Aprobación */}
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Tasa de Aprobación por Departamento</CardTitle>
            <CardDescription className="text-gray-400">Top 8 departamentos con mayor tasa de aprobación</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={approvalRateData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #ffffff20' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="rate" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución de Montos */}
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Distribución de Montos</CardTitle>
            <CardDescription className="text-gray-400">Top 6 departamentos por monto total</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name.substring(0, 8)}: S/ ${(value / 1000).toFixed(1)}k`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #ffffff20' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => `S/ ${(value / 100).toLocaleString('es-PE', { maximumFractionDigits: 0 })}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Departamentos */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white">Detalles por Departamento</CardTitle>
          <CardDescription className="text-gray-400">Análisis completo de solicitudes EWA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400">Departamento</th>
                  <th className="text-center py-3 px-4 text-gray-400">Total</th>
                  <th className="text-center py-3 px-4 text-gray-400">Aprobadas</th>
                  <th className="text-center py-3 px-4 text-gray-400">Rechazadas</th>
                  <th className="text-center py-3 px-4 text-gray-400">Pendientes</th>
                  <th className="text-center py-3 px-4 text-gray-400">Tasa Aprob.</th>
                  <th className="text-right py-3 px-4 text-gray-400">Monto Total</th>
                  <th className="text-right py-3 px-4 text-gray-400">Promedio</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.departmentId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">{dept.departmentName}</td>
                    <td className="py-3 px-4 text-center text-white">{dept.totalRequests}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {dept.approvedCount}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        <XCircle className="h-3 w-3 mr-1" />
                        {dept.rejectedCount}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center text-yellow-400 font-semibold">{dept.pendingCount}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {dept.approvalRate >= 70 ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : dept.approvalRate >= 50 ? (
                          <TrendingDown className="h-4 w-4 text-yellow-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                        <span className="font-semibold text-white">{dept.approvalRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-brand-primary">
                      S/ {(dept.totalAmount / 100).toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      S/ {(dept.avgAmount / 100).toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
