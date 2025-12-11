import { Link } from 'wouter';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Building2,
  Users,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Loader2,
  BarChart3,
  Medal,
  Download,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

type MetricType = 'fwi' | 'employees' | 'risk' | 'all';

export default function DepartmentComparison() {
  const { user, loading: authLoading } = useAuth();
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('all');
  
  const { data: departmentStats, isLoading } = trpc.analytics.getDepartmentStats.useQuery(
    undefined,
    { enabled: !!user && (user.role === 'admin' || user.role === 'b2b_admin') }
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'b2b_admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Acceso Restringido</h2>
            <p className="text-gray-600 mb-4">Solo administradores pueden ver esta página.</p>
            <Link href="/">
              <Button>Volver al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare data for charts
  const departments = departmentStats || [];
  
  // Sort by FWI for ranking
  const sortedByFwi = [...departments].sort((a, b) => b.avgFwi - a.avgFwi);
  const sortedByEmployees = [...departments].sort((a, b) => (b.employees || 0) - (a.employees || 0));
  const sortedByRisk = [...departments].sort((a, b) => a.highRisk - b.highRisk); // Lower risk is better

  // Radar chart data
  const radarData = departments.map(dept => ({
    department: dept.name,
    fwi: dept.avgFwi,
    employees: Math.min((dept.employees || 0) * 10, 100), // Scale for visualization
    safetyScore: 100 - (dept.highRisk * 20), // Convert risk to safety score
  }));

  // Bar chart data for FWI comparison
  const fwiChartData = sortedByFwi.map((dept, index) => ({
    name: dept.name,
    fwi: dept.avgFwi,
    fill: COLORS[index % COLORS.length]
  }));

  // Risk chart data
  const riskChartData = departments.map((dept, index) => ({
    name: dept.name,
    highRisk: dept.highRisk,
    lowRisk: Math.max(0, (dept.employees || 0) - dept.highRisk),
    fill: COLORS[index % COLORS.length]
  }));

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Treevü', 14, 20);
    doc.setFontSize(12);
    doc.text('Comparativa de Departamentos', 14, 28);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-ES', { dateStyle: 'full' })}`, pageWidth - 14, 28, { align: 'right' });
    
    let yPos = 45;
    doc.setTextColor(0, 0, 0);
    
    // Summary section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen General', 14, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total de departamentos: ${departments.length}`, 14, yPos);
    yPos += 6;
    const totalEmployees = departments.reduce((sum, d) => sum + (d.employees || 0), 0);
    doc.text(`Total de empleados: ${totalEmployees}`, 14, yPos);
    yPos += 6;
    const avgFwi = departments.length > 0 ? Math.round(departments.reduce((sum, d) => sum + d.avgFwi, 0) / departments.length) : 0;
    doc.text(`FWI Promedio: ${avgFwi}`, 14, yPos);
    yPos += 6;
    const totalHighRisk = departments.reduce((sum, d) => sum + d.highRisk, 0);
    doc.text(`Empleados en alto riesgo: ${totalHighRisk}`, 14, yPos);
    yPos += 15;
    
    // Ranking FWI
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Ranking por FWI Score', 14, yPos);
    yPos += 8;
    
    (doc as any).autoTable({
      startY: yPos,
      head: [['#', 'Departamento', 'FWI Score', 'Estado']],
      body: sortedByFwi.map((dept, idx) => [
        idx + 1,
        dept.name,
        dept.avgFwi,
        dept.avgFwi >= 70 ? 'Excelente' : dept.avgFwi >= 50 ? 'Bueno' : 'Atención'
      ]),
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      margin: { left: 14, right: 14 },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
    
    // Detailed table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Tabla Comparativa Detallada', 14, yPos);
    yPos += 8;
    
    (doc as any).autoTable({
      startY: yPos,
      head: [['Departamento', 'Empleados', 'FWI Prom.', 'Alto Riesgo', 'Bajo Riesgo']],
      body: departments.map(dept => [
        dept.name,
        dept.employees || 0,
        dept.avgFwi,
        dept.highRisk,
        Math.max(0, (dept.employees || 0) - dept.highRisk)
      ]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14, right: 14 },
    });
    
    // Footer
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Página ${i} de ${pageCount} - Treevü Bienestar Financiero`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    doc.save('treevu-comparativa-departamentos.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/analytics">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Comparativa de Departamentos</h1>
                <p className="text-sm text-gray-500">Análisis y ranking entre departamentos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="default" 
                size="sm" 
                onClick={exportToPDF}
                disabled={isLoading || departments.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Select value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
                <SelectTrigger className="w-[180px]">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Seleccionar métrica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las métricas</SelectItem>
                  <SelectItem value="fwi">FWI Score</SelectItem>
                  <SelectItem value="employees">Empleados</SelectItem>
                  <SelectItem value="risk">Análisis de Riesgo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-3 text-gray-500">Cargando datos de departamentos...</span>
          </div>
        ) : departments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin departamentos</h3>
              <p className="text-gray-500">No hay departamentos registrados en el sistema.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Ranking Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* FWI Ranking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Ranking FWI Score
                    </CardTitle>
                    <CardDescription>Departamentos por bienestar financiero</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sortedByFwi.slice(0, 5).map((dept, index) => (
                        <div key={dept.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="font-medium">{dept.name}</span>
                          </div>
                          <span className="font-bold text-green-600">{dept.avgFwi}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Employees Ranking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="w-5 h-5 text-blue-500" />
                      Por Tamaño
                    </CardTitle>
                    <CardDescription>Departamentos por número de empleados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sortedByEmployees.slice(0, 5).map((dept, index) => (
                        <div key={dept.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'bg-blue-500' : 
                              index === 1 ? 'bg-blue-400' : 
                              index === 2 ? 'bg-blue-300' : 'bg-gray-300'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="font-medium">{dept.name}</span>
                          </div>
                          <span className="font-bold text-blue-600">{dept.employees}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Risk Ranking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Medal className="w-5 h-5 text-green-500" />
                      Menor Riesgo
                    </CardTitle>
                    <CardDescription>Departamentos más estables</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sortedByRisk.slice(0, 5).map((dept, index) => (
                        <div key={dept.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'bg-green-500' : 
                              index === 1 ? 'bg-green-400' : 
                              index === 2 ? 'bg-green-300' : 'bg-gray-300'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="font-medium">{dept.name}</span>
                          </div>
                          <span className={`font-bold ${dept.highRisk === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {dept.highRisk} riesgo
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts Section */}
            {(selectedMetric === 'all' || selectedMetric === 'fwi') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      FWI Score por Departamento
                    </CardTitle>
                    <CardDescription>Comparativa del índice de bienestar financiero</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={fwiChartData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" width={120} />
                          <Tooltip 
                            formatter={(value: number) => [`${value} puntos`, 'FWI Score']}
                            contentStyle={{ borderRadius: '8px' }}
                          />
                          <Bar dataKey="fwi" radius={[0, 4, 4, 0]} fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {(selectedMetric === 'all' || selectedMetric === 'risk') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      Análisis de Riesgo por Departamento
                    </CardTitle>
                    <CardDescription>Empleados en riesgo vs estables</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={riskChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip contentStyle={{ borderRadius: '8px' }} />
                          <Legend />
                          <Bar dataKey="lowRisk" name="Bajo Riesgo" fill="#10b981" stackId="a" />
                          <Bar dataKey="highRisk" name="Alto Riesgo" fill="#ef4444" stackId="a" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {(selectedMetric === 'all') && departments.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      Análisis Multidimensional
                    </CardTitle>
                    <CardDescription>Comparativa de métricas clave por departamento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="department" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar name="FWI Score" dataKey="fwi" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                          <Radar name="Tamaño (escalado)" dataKey="employees" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                          <Radar name="Seguridad" dataKey="safetyScore" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                          <Legend />
                          <Tooltip contentStyle={{ borderRadius: '8px' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Detailed Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    Tabla Comparativa Detallada
                  </CardTitle>
                  <CardDescription>Todas las métricas por departamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Departamento</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-600">Empleados</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-600">FWI Promedio</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-600">Alto Riesgo</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-600">Estado</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-600">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departments.map((dept, index) => (
                          <tr key={dept.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="font-medium">{dept.name}</span>
                              </div>
                            </td>
                            <td className="text-center py-3 px-4">{dept.employees}</td>
                            <td className="text-center py-3 px-4">
                              <span className={`font-bold ${
                                dept.avgFwi >= 70 ? 'text-green-600' : 
                                dept.avgFwi >= 50 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {dept.avgFwi}
                              </span>
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className={`font-bold ${
                                dept.highRisk === 0 ? 'text-green-600' : 
                                dept.highRisk <= 2 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {dept.highRisk}
                              </span>
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                dept.avgFwi >= 70 && dept.highRisk === 0 
                                  ? 'bg-green-100 text-green-800' 
                                  : dept.avgFwi >= 50 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {dept.avgFwi >= 70 && dept.highRisk === 0 
                                  ? 'Excelente' 
                                  : dept.avgFwi >= 50 
                                    ? 'Bueno' 
                                    : 'Atención'}
                              </span>
                            </td>
                            <td className="text-center py-3 px-4">
                              <Link href={`/departments/${dept.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Ver
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
