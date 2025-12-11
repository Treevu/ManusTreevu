import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Users, 
  Building2, 
  TrendingUp, 
  AlertTriangle,
  Bell,
  Send,
  Search,
  Shield,
  Loader2,
  MoreVertical,
  UserCog,
  Ban,
  CheckCircle,
  Clock,
  DollarSign,
  Coins,
  FileText,
  RefreshCw,
  Download,
  FileSpreadsheet,
  BarChart2
} from 'lucide-react';
import { toast } from 'sonner';
import NotificationCenter from '@/components/NotificationCenter';
import ThemeToggle from '@/components/ThemeToggle';

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('system_announcement');
  const [targetRole, setTargetRole] = useState('all');
  const [isSending, setIsSending] = useState(false);

  // Fetch admin data
  // Get users by role - we'll combine multiple queries
  const { data: employees } = trpc.users.listByRole.useQuery(
    { role: 'employee' },
    { enabled: !!user && (user.role === 'admin' || user.role === 'b2b_admin') }
  );
  const { data: merchants } = trpc.users.listByRole.useQuery(
    { role: 'merchant' },
    { enabled: !!user && (user.role === 'admin' || user.role === 'b2b_admin') }
  );
  const { data: b2bAdmins } = trpc.users.listByRole.useQuery(
    { role: 'b2b_admin' },
    { enabled: !!user && (user.role === 'admin' || user.role === 'b2b_admin') }
  );
  const allUsers = [...(employees || []), ...(merchants || []), ...(b2bAdmins || [])];
  const usersLoading = !employees && !merchants && !b2bAdmins;
  const refetchUsers = () => {};

  const { data: departments, isLoading: deptsLoading } = trpc.b2b.getDepartments.useQuery(
    undefined,
    { enabled: !!user && (user.role === 'admin' || user.role === 'b2b_admin') }
  );

  // Get pending EWA requests
  const { data: pendingEwa, isLoading: ewaLoading, refetch: refetchEwa } = trpc.ewa.getPendingRequests.useQuery(
    undefined,
    { enabled: !!user && (user.role === 'admin' || user.role === 'b2b_admin') }
  );

  const { data: riskAnalysis } = trpc.b2b.getRiskAnalysis.useQuery(
    {},
    { enabled: !!user && (user.role === 'admin' || user.role === 'b2b_admin') }
  );

  // Mutations
  const updateUserRole = trpc.users.updateRole.useMutation({
    onSuccess: () => {
      toast.success('Rol actualizado correctamente');
      refetchUsers();
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Note: updateStatus endpoint needs to be added to the users router
  const updateUserStatus = {
    mutate: ({ userId, status }: { userId: number; status: string }) => {
      toast.info('Funcionalidad de cambio de estado en desarrollo');
    },
    isPending: false,
  };

  const approveEwa = trpc.ewa.approve.useMutation({
    onSuccess: () => {
      toast.success('Adelanto aprobado');
      refetchEwa();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const rejectEwa = trpc.ewa.reject.useMutation({
    onSuccess: () => {
      toast.success('Adelanto rechazado');
      refetchEwa();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const sendMassNotification = trpc.notifications.sendMass.useMutation({
    onSuccess: (data: { count: number }) => {
      toast.success(`Notificación enviada a ${data.count} usuarios`);
      setNotificationTitle('');
      setNotificationMessage('');
      setIsSending(false);
    },
    onError: (err: any) => {
      toast.error(err.message);
      setIsSending(false);
    },
  });

  // Filter users
  const filteredUsers = allUsers?.filter((u: any) => {
    const matchesSearch = !searchQuery || 
      (u as any).name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u as any).email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  }) || [];

  // Calculate stats
  const stats = {
    totalUsers: allUsers?.length || 0,
    employees: allUsers?.filter((u: any) => u.role === 'employee').length || 0,
    merchants: allUsers?.filter((u: any) => u.role === 'merchant').length || 0,
    b2bAdmins: allUsers?.filter((u: any) => u.role === 'b2b_admin').length || 0,
    avgFwi: allUsers?.length 
      ? Math.round(allUsers.reduce((sum: number, u: any) => sum + (u.fwiScore || 0), 0) / allUsers.length) 
      : 0,
    pendingEwaCount: pendingEwa?.length || 0,
    pendingEwaAmount: pendingEwa?.reduce((sum: number, e: { amount: number }) => sum + e.amount, 0) || 0,
    highRiskEmployees: riskAnalysis?.filter((r: any) => r.absenteeismRisk === 'high' || r.absenteeismRisk === 'critical').length || 0,
  };

  const handleSendNotification = () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      toast.error('Completa todos los campos');
      return;
    }
    setIsSending(true);
    sendMassNotification.mutate({
      title: notificationTitle,
      message: notificationMessage,
      type: notificationType as any,
      targetRole: targetRole === 'all' ? undefined : targetRole as 'employee' | 'merchant' | 'b2b_admin',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'b2b_admin')) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <Card className="max-w-md bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-red-400" />
              Acceso Denegado
            </CardTitle>
            <CardDescription className="text-gray-400">No tienes permisos para acceder a esta sección</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/app">
              <Button className="w-full bg-brand-primary hover:bg-brand-primary/90">Volver al Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-segment-empresa/5 rounded-full blur-[120px] opacity-60" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      
      {/* Header */}
      <header className="bg-treevu-surface/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10 relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/app">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-display font-bold text-white">Panel de Administración</h1>
                <p className="text-sm text-gray-400">Gestión de usuarios, EWA y notificaciones</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-brand-primary/10 text-brand-primary border-brand-primary/30">
                {user.role === 'admin' ? 'Super Admin' : 'B2B Admin'}
              </Badge>
              <Link href="/dashboard/executive">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-purple-400 hover:bg-purple-400/10" title="Resumen Ejecutivo">
                  <BarChart2 className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard/alerts">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-amber-400 hover:bg-amber-400/10" title="Alertas">
                  <AlertTriangle className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-blue-400 hover:bg-blue-400/10" title="Analytics">
                  <TrendingUp className="h-5 w-5" />
                </Button>
              </Link>
              <ThemeToggle />
              <NotificationCenter />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative">
        {/* Export Buttons */}
        <Card className="mb-6 border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileSpreadsheet className="w-5 h-5 text-brand-primary" />
              Exportar Datos
            </CardTitle>
            <CardDescription className="text-gray-400">Descarga reportes en formato CSV</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  const csvContent = [
                    ['ID', 'Nombre', 'Email', 'Rol', 'FWI Score', 'Fecha Registro'].join(','),
                    ...filteredUsers.map((u: any) => [
                      u.id,
                      `"${u.name || ''}"`,
                      `"${u.email || ''}"`,
                      u.role,
                      u.fwiScore || 0,
                      u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : ''
                    ].join(','))
                  ].join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
                  link.click();
                  URL.revokeObjectURL(url);
                  toast.success('Usuarios exportados correctamente');
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Usuarios ({filteredUsers.length})
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  const csvContent = [
                    ['ID', 'Usuario', 'Monto', 'Estado', 'Fecha Solicitud'].join(','),
                    ...(pendingEwa || []).map((e: any) => [
                      e.id,
                      e.userId,
                      e.amount / 100,
                      e.status,
                      e.requestedAt ? new Date(e.requestedAt).toISOString().split('T')[0] : ''
                    ].join(','))
                  ].join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `ewa_pendientes_${new Date().toISOString().split('T')[0]}.csv`;
                  link.click();
                  URL.revokeObjectURL(url);
                  toast.success('Solicitudes EWA exportadas correctamente');
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                EWA Pendientes ({stats.pendingEwaCount})
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  const csvContent = [
                    ['ID', 'Nombre', 'Empleados', 'FWI Promedio', 'Riesgo'].join(','),
                    ...(departments || []).map((d: any) => [
                      d.id,
                      `"${d.name || ''}"`,
                      d.employeeCount || 0,
                      d.avgFwi || 0,
                      d.riskLevel || 'N/A'
                    ].join(','))
                  ].join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `departamentos_${new Date().toISOString().split('T')[0]}.csv`;
                  link.click();
                  URL.revokeObjectURL(url);
                  toast.success('Departamentos exportados correctamente');
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Departamentos ({departments?.length || 0})
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  const csvContent = [
                    ['Usuario ID', 'Nombre', 'Riesgo Ausentismo', 'Riesgo Rotación', 'FWI Score', 'Racha Días'].join(','),
                    ...(riskAnalysis || []).map((r: any) => [
                      r.userId,
                      `"${r.name || ''}"`,
                      r.absenteeismRisk || 'N/A',
                      r.turnoverRisk || 'N/A',
                      r.fwiScore || 0,
                      r.streakDays || 0
                    ].join(','))
                  ].join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `analisis_riesgo_${new Date().toISOString().split('T')[0]}.csv`;
                  link.click();
                  URL.revokeObjectURL(url);
                  toast.success('Análisis de riesgo exportado correctamente');
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Análisis de Riesgo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Usuarios</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-segment-empresa" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">FWI Promedio</p>
                  <p className="text-2xl font-bold text-brand-primary">{stats.avgFwi}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">EWA Pendientes</p>
                  <p className="text-2xl font-bold text-amber-400">{stats.pendingEwaCount}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Alto Riesgo</p>
                  <p className="text-2xl font-bold text-red-400">{stats.highRiskEmployees}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-treevu-surface/50 border border-white/10">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Usuarios</span>
            </TabsTrigger>
            <TabsTrigger value="ewa" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">EWA</span>
              {stats.pendingEwaCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {stats.pendingEwaCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Departamentos</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notificaciones</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-white">Gestión de Usuarios</CardTitle>
                    <CardDescription className="text-gray-400">Administra roles y estados de usuarios</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar usuarios..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-[200px]"
                      />
                    </div>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="employee">Empleados</SelectItem>
                        <SelectItem value="merchant">Merchants</SelectItem>
                        <SelectItem value="b2b_admin">B2B Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={() => refetchUsers()} className="border-white/20 text-white hover:bg-white/10">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No se encontraron usuarios
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 text-left">
                          <th className="pb-3 font-medium text-gray-400">Usuario</th>
                          <th className="pb-3 font-medium text-gray-400">Rol</th>
                          <th className="pb-3 font-medium text-gray-400">FWI</th>
                          <th className="pb-3 font-medium text-gray-400">TreePoints</th>
                          <th className="pb-3 font-medium text-gray-400">Estado</th>
                          <th className="pb-3 font-medium text-gray-400">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.slice(0, 20).map((u: any) => (
                          <tr key={u.id} className="border-b border-white/5 last:border-0">
                            <td className="py-3">
                              <div>
                                <div className="font-medium text-white">{u.name || 'Sin nombre'}</div>
                                <div className="text-sm text-gray-400">{u.email || 'Sin email'}</div>
                              </div>
                            </td>
                            <td className="py-3">
                              <Badge variant="outline" className={
                                u.role === 'admin' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/30' :
                                u.role === 'b2b_admin' ? 'bg-segment-empresa/10 text-segment-empresa border-segment-empresa/30' :
                                u.role === 'merchant' ? 'bg-segment-comercio/10 text-segment-comercio border-segment-comercio/30' :
                                'bg-white/10 text-gray-300 border-white/20'
                              }>
                                {u.role}
                              </Badge>
                            </td>
                            <td className="py-3">
                              <span className={`font-medium ${
                                (u.fwiScore || 0) >= 70 ? 'text-brand-primary' :
                                (u.fwiScore || 0) >= 40 ? 'text-amber-400' :
                                'text-red-400'
                              }`}>
                                {u.fwiScore || 0}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-1 text-white">
                                <Coins className="w-4 h-4 text-brand-primary" />
                                {(u.treePoints || 0).toLocaleString()}
                              </div>
                            </td>
                            <td className="py-3">
                              <Badge variant={u.status === 'active' ? 'default' : 'secondary'} className={
                                u.status === 'active' ? 'bg-brand-primary/10 text-brand-primary' :
                                u.status === 'suspended' ? 'bg-red-500/10 text-red-400' :
                                'bg-white/10 text-gray-400'
                              }>
                                {u.status}
                              </Badge>
                            </td>
                            <td className="py-3">
                              <div className="flex gap-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <UserCog className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Cambiar Rol</DialogTitle>
                                      <DialogDescription>
                                        Selecciona el nuevo rol para {u.name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <Select
                                        defaultValue={u.role}
                                        onValueChange={(newRole) => {
                                          updateUserRole.mutate({ userId: u.id, role: newRole as any });
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="employee">Empleado</SelectItem>
                                          <SelectItem value="merchant">Merchant</SelectItem>
                                          <SelectItem value="b2b_admin">B2B Admin</SelectItem>
                                          {user.role === 'admin' && (
                                            <SelectItem value="admin">Admin</SelectItem>
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    const newStatus = u.status === 'active' ? 'suspended' : 'active';
                                    updateUserStatus.mutate({ userId: u.id, status: newStatus });
                                  }}
                                >
                                  {u.status === 'active' ? (
                                    <Ban className="w-4 h-4 text-red-500" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredUsers.length > 20 && (
                      <div className="text-center py-4 text-gray-400 text-sm">
                        Mostrando 20 de {filteredUsers.length} usuarios
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* EWA Tab */}
          <TabsContent value="ewa">
            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Solicitudes de Adelanto (EWA)</CardTitle>
                    <CardDescription className="text-gray-400">
                      {stats.pendingEwaCount} pendientes • {formatCurrency(stats.pendingEwaAmount)} total
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => refetchEwa()} className="border-white/20 text-white hover:bg-white/10">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {ewaLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                  </div>
                ) : !pendingEwa || pendingEwa.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-brand-primary" />
                    <p className="text-gray-400">No hay solicitudes pendientes</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingEwa.map((ewa: any) => (
                      <div key={ewa.id} className="p-4 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-white">Usuario #{ewa.userId}</span>
                              <Badge variant="outline" className="bg-brand-primary/10 text-brand-primary border-brand-primary/30">FWI: {ewa.fwiScoreAtRequest}</Badge>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Monto:</span>
                                <span className="ml-1 font-medium text-white">{formatCurrency(ewa.amount)}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Fee:</span>
                                <span className="ml-1 text-white">{formatCurrency(ewa.fee)}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Días trabajados:</span>
                                <span className="ml-1 text-white">{ewa.daysWorked}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Ingreso mensual:</span>
                                <span className="ml-1 text-white">{formatCurrency(ewa.monthlyIncome)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="text-red-400 border-red-400/30 hover:bg-red-500/10"
                              onClick={() => rejectEwa.mutate({ 
                                requestId: ewa.id, 
                                reason: 'Rechazado por administrador' 
                              })}
                              disabled={rejectEwa.isPending}
                            >
                              Rechazar
                            </Button>
                            <Button
                              className="bg-brand-primary hover:bg-brand-primary/90"
                              onClick={() => approveEwa.mutate({ requestId: ewa.id })}
                              disabled={approveEwa.isPending}
                            >
                              Aprobar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments">
            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Métricas por Departamento</CardTitle>
                <CardDescription className="text-gray-400">Análisis de bienestar financiero por área</CardDescription>
              </CardHeader>
              <CardContent>
                {deptsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                  </div>
                ) : !departments || departments.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No hay departamentos registrados
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {departments.map((dept) => (
                      <div key={dept.id} className="p-4 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-white">{dept.name}</h4>
                          <Badge variant="outline" className="bg-segment-empresa/10 text-segment-empresa border-segment-empresa/30">{dept.employeeCount} empleados</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className={`text-xl font-bold ${
                              (dept.avgFwiScore || 0) >= 70 ? 'text-brand-primary' :
                              (dept.avgFwiScore || 0) >= 40 ? 'text-amber-400' :
                              'text-red-400'
                            }`}>
                              {dept.avgFwiScore || 0}
                            </div>
                            <div className="text-xs text-gray-400">FWI Prom.</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-brand-primary">
                              {((dept.treePointsUsed || 0) / (dept.treePointsBudget || 1) * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-gray-400">Budget TP</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-segment-empresa">
                              {dept.treePointsBudget?.toLocaleString() || 0}
                            </div>
                            <div className="text-xs text-gray-400">TP Total</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Enviar Notificación Masiva</CardTitle>
                <CardDescription className="text-gray-400">Envía notificaciones a todos los usuarios o a un grupo específico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Tipo de Notificación</Label>
                    <Select value={notificationType} onValueChange={setNotificationType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system_announcement">Anuncio del Sistema</SelectItem>
                        <SelectItem value="offer_available">Nueva Oferta</SelectItem>
                        <SelectItem value="security_alert">Alerta de Seguridad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Destinatarios</Label>
                    <Select value={targetRole} onValueChange={setTargetRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los usuarios</SelectItem>
                        <SelectItem value="employee">Solo empleados</SelectItem>
                        <SelectItem value="merchant">Solo merchants</SelectItem>
                        <SelectItem value="b2b_admin">Solo B2B admins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Título</Label>
                  <Input
                    placeholder="Título de la notificación"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Mensaje</Label>
                  <Textarea
                    placeholder="Escribe el mensaje de la notificación..."
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  className="w-full bg-brand-primary hover:bg-brand-primary/90"
                  onClick={handleSendNotification}
                  disabled={isSending || !notificationTitle.trim() || !notificationMessage.trim()}
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Enviar Notificación
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
