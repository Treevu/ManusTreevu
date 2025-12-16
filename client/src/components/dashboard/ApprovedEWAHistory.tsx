import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DollarSign, CheckCircle2, Clock, TrendingUp, Download, Search,
  ArrowRight, Calendar, Zap, CreditCard
} from 'lucide-react';
import { TableHeaderTooltip } from '@/components/TableHeaderTooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ApprovedEWARequest {
  id?: string | number;
  userId?: string | number;
  amount: number;
  fee: number;
  fwiScoreAtRequest: number;
  createdAt: Date | string;
  approvedAt?: Date | string;
  disbursedAt?: Date | string | null;
  status?: string;
  [key: string]: any;
}

interface ApprovedEWAHistoryProps {
  requests?: ApprovedEWARequest[];
  isLoading?: boolean;
}

export function ApprovedEWAHistory({ requests = [], isLoading = false }: ApprovedEWAHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Filter and sort
  const filteredRequests = requests
    .filter(r => {
      const matchesSearch = String(r.userId || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'recent':
        default:
          return new Date(b.approvedAt || b.createdAt).getTime() - new Date(a.approvedAt || a.createdAt).getTime();
      }
    });

  // Calculate statistics
  const stats = {
    totalApproved: requests.length,
    totalAmount: requests.reduce((sum, r) => sum + r.amount, 0),
    totalDisbursed: requests.filter(r => r.status === 'disbursed').length,
    totalProcessing: requests.filter(r => r.status === 'processing_transfer').length,
    avgAmount: requests.length > 0 ? Math.floor(requests.reduce((sum, r) => sum + r.amount, 0) / requests.length) : 0,
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'disbursed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Desembolsado</Badge>;
      case 'processing_transfer':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Clock className="h-3 w-3 mr-1" />En Proceso</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Pendiente</Badge>;
    }
  };

  const getTimelineStatus = (status?: string, disbursedAt?: Date | string | null) => {
    if (status === 'disbursed') {
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-green-400" />,
        label: 'Desembolsado',
        color: 'bg-green-500/20 border-green-500/30',
        date: disbursedAt,
      };
    }
    return {
      icon: <Clock className="h-5 w-5 text-blue-400" />,
      label: 'En Proceso',
      color: 'bg-blue-500/20 border-blue-500/30',
      date: null,
    };
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Total Aprobadas</p>
                <p className="text-2xl font-bold text-white">{stats.totalApproved}</p>
              </div>
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Desembolsadas</p>
                <p className="text-2xl font-bold text-green-400">{stats.totalDisbursed}</p>
              </div>
              <CreditCard className="h-6 w-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">En Proceso</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalProcessing}</p>
              </div>
              <Zap className="h-6 w-6 text-blue-400" />
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
              <TrendingUp className="h-6 w-6 text-brand-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Promedio</p>
                <p className="text-2xl font-bold text-orange-400">S/ {(stats.avgAmount / 100).toLocaleString('es-PE', { maximumFractionDigits: 0 })}</p>
              </div>
              <DollarSign className="h-6 w-6 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Buscar por Empleado</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="ID o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Ordenar por</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-treevu-surface border-white/10">
                  <SelectItem value="recent" className="text-white">Más Reciente</SelectItem>
                  <SelectItem value="amount-desc" className="text-white">Monto (Mayor)</SelectItem>
                  <SelectItem value="amount-asc" className="text-white">Monto (Menor)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full border-white/20 text-gray-400 hover:text-white">
                <Download className="h-4 w-4 mr-2" />
                Exportar Historial
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request, idx) => {
            const timeline = getTimelineStatus(request.status, request.disbursedAt);
            const requestDate = new Date(request.approvedAt || request.createdAt);
            const disbursedDate = request.disbursedAt && request.disbursedAt !== null ? new Date(request.disbursedAt) : null;
            const daysDiff = disbursedDate ? Math.floor((disbursedDate.getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24)) : null;

            return (
              <Card key={request.id || idx} className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Left: Employee & Amount */}
                    <div className="md:col-span-1">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-400">Empleado</p>
                          <p className="text-lg font-semibold text-white">#{String(request.userId)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Monto</p>
                          <p className="text-2xl font-bold text-brand-primary">S/ {(request.amount / 100).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Comisión</p>
                          <p className="text-sm text-orange-400">S/ {(request.fee / 100).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="md:col-span-3">
                      <div className="space-y-4">
                        {/* Step 1: Aprobado */}
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                              <CheckCircle2 className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="w-0.5 h-12 bg-gradient-to-b from-green-500/30 to-blue-500/30 my-2"></div>
                          </div>
                          <div className="pt-1">
                            <p className="font-semibold text-white">Solicitud Aprobada</p>
                            <p className="text-sm text-gray-400">
                              {requestDate.toLocaleDateString('es-PE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        {/* Step 2: En Proceso */}
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${timeline.color}`}>
                              {timeline.icon}
                            </div>
                            {request.status === 'disbursed' && (
                              <div className="w-0.5 h-12 bg-gradient-to-b from-blue-500/30 to-green-500/30 my-2"></div>
                            )}
                          </div>
                          <div className="pt-1">
                            <p className="font-semibold text-white">{timeline.label}</p>
                            <p className="text-sm text-gray-400">
                              Tiempo estimado: ~2 horas
                            </p>
                          </div>
                        </div>

                        {/* Step 3: Desembolsado */}
                        {request.status === 'disbursed' && disbursedDate && request.disbursedAt && (
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-green-400" />
                              </div>
                            </div>
                            <div className="pt-1">
                              <p className="font-semibold text-white">Dinero Desembolsado</p>
                              <p className="text-sm text-gray-400">
                                {disbursedDate.toLocaleDateString('es-PE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                              {daysDiff !== null && (
                                <p className="text-xs text-green-400 mt-1">
                                  ✓ Completado en {daysDiff} día{daysDiff !== 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Status & Actions */}
                    <div className="md:col-span-1 flex flex-col items-end justify-between">
                      <div className="text-right">
                        {getStatusBadge(request.status)}
                        <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-gray-400">A Recibir</p>
                          <p className="text-lg font-bold text-green-400">
                            S/ {((request.amount - request.fee) / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-gray-400 hover:text-white"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-12 pb-12 text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-gray-600" />
              <p className="text-gray-400">No hay solicitudes aprobadas</p>
              <p className="text-sm text-gray-500 mt-1">Las solicitudes aprobadas aparecerán aquí con su timeline de desembolso</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
