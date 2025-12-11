import { Link, useParams } from 'wouter';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Trophy,
  Loader2,
  Settings,
  Bell,
  Coins,
  Activity,
  UserCheck,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner';

export default function DepartmentDetail() {
  const params = useParams();
  const departmentId = parseInt(params.id || '0');
  const { user, loading: authLoading } = useAuth();
  const [showAlertSettings, setShowAlertSettings] = useState(false);
  const [fwiThreshold, setFwiThreshold] = useState(50);
  const [highRiskThreshold, setHighRiskThreshold] = useState(3);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  
  const { data: detail, isLoading, refetch } = trpc.analytics.getDepartmentDetail.useQuery(
    { departmentId },
    { enabled: !!user && (user.role === 'admin' || user.role === 'b2b_admin') && departmentId > 0 }
  );
  
  const setThresholdMutation = trpc.analytics.setAlertThreshold.useMutation({
    onSuccess: () => {
      toast.success('Configuración de alertas guardada');
      refetch();
    },
    onError: () => {
      toast.error('Error al guardar configuración');
    }
  });

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

  const saveAlertSettings = () => {
    setThresholdMutation.mutate({
      departmentId,
      fwiThreshold,
      highRiskThreshold,
      isEnabled: alertsEnabled,
      notifyAdmins: true,
      notifyB2BAdmin: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/departments">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isLoading ? 'Cargando...' : detail?.department?.name || 'Departamento'}
                </h1>
                <p className="text-sm text-gray-500">Tendencias históricas y métricas detalladas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAlertSettings(!showAlertSettings)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurar Alertas
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-3 text-gray-500">Cargando datos del departamento...</span>
          </div>
        ) : !detail ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Departamento no encontrado</h3>
              <p className="text-gray-500">No se encontró el departamento solicitado.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Alert Settings Panel */}
            {showAlertSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Bell className="w-5 h-5 text-yellow-600" />
                      Configuración de Alertas
                    </CardTitle>
                    <CardDescription>
                      Define los umbrales para recibir alertas automáticas sobre este departamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fwiThreshold">Umbral FWI Mínimo</Label>
                        <Input
                          id="fwiThreshold"
                          type="number"
                          min={0}
                          max={100}
                          value={fwiThreshold}
                          onChange={(e) => setFwiThreshold(parseInt(e.target.value) || 0)}
                        />
                        <p className="text-xs text-gray-500">Alerta cuando el FWI promedio baje de este valor</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="highRiskThreshold">Máximo Empleados en Riesgo</Label>
                        <Input
                          id="highRiskThreshold"
                          type="number"
                          min={0}
                          value={highRiskThreshold}
                          onChange={(e) => setHighRiskThreshold(parseInt(e.target.value) || 0)}
                        />
                        <p className="text-xs text-gray-500">Alerta cuando supere este número de empleados en riesgo</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Alertas Activas</Label>
                        <div className="flex items-center gap-2 pt-2">
                          <Switch
                            checked={alertsEnabled}
                            onCheckedChange={setAlertsEnabled}
                          />
                          <span className="text-sm">{alertsEnabled ? 'Activadas' : 'Desactivadas'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={saveAlertSettings} disabled={setThresholdMutation.isPending}>
                        {setThresholdMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Guardar Configuración
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">FWI Promedio</p>
                        <p className={`text-2xl font-bold ${
                          detail.stats.avgFwi >= 70 ? 'text-green-600' : 
                          detail.stats.avgFwi >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {detail.stats.avgFwi}
                        </p>
                      </div>
                      {detail.stats.avgFwi >= 50 ? (
                        <TrendingUp className="w-8 h-8 text-green-500" />
                      ) : (
                        <TrendingDown className="w-8 h-8 text-red-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Empleados</p>
                        <p className="text-2xl font-bold text-blue-600">{detail.stats.totalEmployees}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Alto Riesgo</p>
                        <p className={`text-2xl font-bold ${
                          detail.stats.highRiskCount === 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {detail.stats.highRiskCount}
                        </p>
                      </div>
                      <AlertTriangle className={`w-8 h-8 ${
                        detail.stats.highRiskCount === 0 ? 'text-green-500' : 'text-red-500'
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">TreePoints</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {detail.stats.totalTreePoints.toLocaleString()}
                        </p>
                      </div>
                      <Coins className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Activos Hoy</p>
                        <p className="text-2xl font-bold text-cyan-600">{detail.stats.activeToday}</p>
                      </div>
                      <UserCheck className="w-8 h-8 text-cyan-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* FWI History Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-500" />
                      Evolución del FWI
                    </CardTitle>
                    <CardDescription>Promedio mensual del índice de bienestar financiero</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {detail.fwiHistory.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={detail.fwiHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="avgFwi" 
                              name="FWI Promedio"
                              stroke="#10b981" 
                              strokeWidth={2}
                              dot={{ fill: '#10b981' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No hay datos históricos disponibles</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* TreePoints History Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-purple-500" />
                      TreePoints Mensuales
                    </CardTitle>
                    <CardDescription>Puntos ganados vs canjeados por mes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {detail.tpHistory.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={detail.tpHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="earned" 
                              name="Ganados"
                              stroke="#10b981" 
                              fill="#10b98133"
                              stackId="1"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="redeemed" 
                              name="Canjeados"
                              stroke="#8b5cf6" 
                              fill="#8b5cf633"
                              stackId="2"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No hay datos de TreePoints disponibles</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Employees Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Empleados del Departamento
                  </CardTitle>
                  <CardDescription>Lista de empleados ordenados por FWI Score</CardDescription>
                </CardHeader>
                <CardContent>
                  {detail.employees.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Empleado</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-600">FWI</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-600">Nivel</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-600">TreePoints</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-600">Racha</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-600">Última Actividad</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-600">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.employees.map((emp) => (
                            <tr key={emp.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium">{emp.name || 'Sin nombre'}</p>
                                  <p className="text-xs text-gray-500">{emp.email || 'Sin email'}</p>
                                </div>
                              </td>
                              <td className="text-center py-3 px-4">
                                <span className={`font-bold ${
                                  (emp.fwiScore || 50) >= 70 ? 'text-green-600' : 
                                  (emp.fwiScore || 50) >= 50 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {emp.fwiScore || 50}
                                </span>
                              </td>
                              <td className="text-center py-3 px-4">
                                <span className="flex items-center justify-center gap-1">
                                  <Trophy className="w-4 h-4 text-yellow-500" />
                                  {emp.level || 1}
                                </span>
                              </td>
                              <td className="text-center py-3 px-4 font-medium text-purple-600">
                                {(emp.treePoints || 0).toLocaleString()}
                              </td>
                              <td className="text-center py-3 px-4">
                                {emp.streakDays || 0} días
                              </td>
                              <td className="text-center py-3 px-4 text-sm text-gray-500">
                                {emp.lastSignedIn 
                                  ? new Date(emp.lastSignedIn).toLocaleDateString('es-ES')
                                  : 'Nunca'}
                              </td>
                              <td className="text-center py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  (emp.fwiScore || 50) >= 70 
                                    ? 'bg-green-100 text-green-800' 
                                    : (emp.fwiScore || 50) >= 40 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : 'bg-red-100 text-red-800'
                                }`}>
                                  {(emp.fwiScore || 50) >= 70 
                                    ? 'Saludable' 
                                    : (emp.fwiScore || 50) >= 40 
                                      ? 'Atención' 
                                      : 'Riesgo'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No hay empleados en este departamento</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
