import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Users, 
  Mail, 
  Building2, 
  Phone, 
  Calendar,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Star
} from 'lucide-react';

const statusConfig = {
  new: { label: 'Nuevo', color: 'bg-blue-500', icon: Star },
  contacted: { label: 'Contactado', color: 'bg-yellow-500', icon: MessageSquare },
  qualified: { label: 'Calificado', color: 'bg-purple-500', icon: CheckCircle },
  converted: { label: 'Convertido', color: 'bg-green-500', icon: CheckCircle },
  lost: { label: 'Perdido', color: 'bg-red-500', icon: XCircle },
};

export default function AdminLeads() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: leads, isLoading, refetch } = trpc.leads.getAll.useQuery(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );
  
  const updateStatus = trpc.leads.updateStatus.useMutation({
    onSuccess: () => {
      toast.success('Estado actualizado');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar estado');
    },
  });

  if (!user || (user.role !== 'admin' && user.role !== 'b2b_admin')) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>
        </div>
      </DashboardLayout>
    );
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Leads</h1>
            <p className="text-muted-foreground">
              Administra los contactos recibidos desde el landing page
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = leads?.filter(l => l.status === key).length || 0;
            const Icon = config.icon;
            return (
              <Card key={key} className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter(key)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs text-muted-foreground">{config.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros
              </CardTitle>
              {statusFilter !== 'all' && (
                <Button variant="ghost" size="sm" onClick={() => setStatusFilter('all')}>
                  Limpiar filtro
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leads ({leads?.length || 0})</CardTitle>
            <CardDescription>
              Lista de contactos recibidos desde el formulario del landing
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : !leads || leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Users className="w-8 h-8 mb-2" />
                <p>No hay leads {statusFilter !== 'all' ? `con estado "${statusConfig[statusFilter as keyof typeof statusConfig]?.label}"` : ''}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Fecha</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Empresa</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Contacto</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Empleados</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Fuente</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Estado</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            {formatDate(lead.createdAt)}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1 font-medium">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            {lead.companyName}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            {lead.contactName}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-primary hover:underline">
                            <Mail className="w-4 h-4" />
                            {lead.email}
                          </a>
                        </td>
                        <td className="py-3 px-2 text-sm text-muted-foreground">
                          {lead.employeeCount || '-'}
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className="text-xs">
                            {lead.source?.replace('founders_form_', '') || 'web'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          {getStatusBadge(lead.status)}
                        </td>
                        <td className="py-3 px-2">
                          <Select 
                            value={lead.status} 
                            onValueChange={(value) => updateStatus.mutate({ id: lead.id, status: value as any })}
                          >
                            <SelectTrigger className="w-[130px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusConfig).map(([key, config]) => (
                                <SelectItem key={key} value={key}>{config.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
