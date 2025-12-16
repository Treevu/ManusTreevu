import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  DollarSign, CheckCircle2, XCircle, Clock, TrendingUp, TrendingDown,
  Search, Filter, Download, AlertCircle, Loader2
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { TableHeaderTooltip } from '@/components/TableHeaderTooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EWARequest {
  id?: string | number;
  userId?: string | number;
  amount: number;
  fee: number;
  fwiScoreAtRequest: number;
  daysWorked: number;
  monthlyIncome: number;
  createdAt: Date | string;
  status?: string | 'pending_approval' | 'processing_transfer' | 'disbursed' | 'rejected';
  [key: string]: any;
}

interface PendingEWATableProps {
  requests?: EWARequest[];
  isLoading?: boolean;
  onApprove?: (requestId: number | string) => void;
  onReject?: (requestId: number | string, reason: string) => void;
}

export function PendingEWATable({ requests = [], isLoading = false, onApprove, onReject }: PendingEWATableProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedRequest, setSelectedRequest] = useState<EWARequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mutaciones tRPC
  const approveMutation = trpc.ewa.approve.useMutation();
  const rejectMutation = trpc.ewa.reject.useMutation();

  // Calculate statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending_approval' || !r.status || r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'processing_transfer' || r.status === 'disbursed').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    totalAmount: requests.reduce((sum, r) => sum + r.amount, 0),
    totalFees: requests.reduce((sum, r) => sum + r.fee, 0),
  };

  // Filter requests
  const filteredRequests = requests
    .filter(r => {
      const matchesSearch = String(r.userId || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || String(r.status || 'pending_approval') === statusFilter;
      const matchesAmount = 
        (!minAmount || r.amount >= parseInt(minAmount) * 100) &&
        (!maxAmount || r.amount <= parseInt(maxAmount) * 100);
      return matchesSearch && matchesStatus && matchesAmount;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'fwi-desc':
          return b.fwiScoreAtRequest - a.fwiScoreAtRequest;
        case 'fwi-asc':
          return a.fwiScoreAtRequest - b.fwiScoreAtRequest;
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getStatusBadge = (status?: string) => {
    const s = status || 'pending_approval';
    switch (s) {
      case 'disbursed':
      case 'processing_transfer':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Aprobado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="h-3 w-3 mr-1" />Rechazado</Badge>;
      case 'pending_approval':
      case 'pending':
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
    }
  };

  const getFWIColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskIndicator = (fwiScore: number) => {
    if (fwiScore >= 70) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (fwiScore >= 50) return <TrendingDown className="h-4 w-4 text-yellow-400" />;
    return <AlertCircle className="h-4 w-4 text-red-400" />;
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    try {
      await approveMutation.mutateAsync({
        requestId: Number(selectedRequest.id),
      });
      toast.success(`Solicitud #${selectedRequest.id} aprobada correctamente`);
      setShowApproveModal(false);
      setSelectedRequest(null);
      onApprove?.(selectedRequest.id!);
    } catch (error) {
      toast.error('Error al aprobar la solicitud');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectReason.trim()) {
      toast.error('Debes ingresar una razón para rechazar');
      return;
    }
    setIsProcessing(true);
    try {
      await rejectMutation.mutateAsync({
        requestId: Number(selectedRequest.id),
        reason: rejectReason,
      });
      toast.success(`Solicitud #${selectedRequest.id} rechazada`);
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectReason('');
      onReject?.(selectedRequest.id!, rejectReason);
    } catch (error) {
      toast.error('Error al rechazar la solicitud');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Total Solicitudes</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <DollarSign className="h-6 w-6 text-brand-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Aprobadas</p>
                <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
              </div>
              <CheckCircle2 className="h-6 w-6 text-green-400" />
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
                <p className="text-xs text-gray-400">Comisiones</p>
                <p className="text-2xl font-bold text-orange-400">S/ {(stats.totalFees / 100).toLocaleString('es-PE', { maximumFractionDigits: 0 })}</p>
              </div>
              <Filter className="h-6 w-6 text-orange-400" />
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <label className="text-sm text-gray-400 mb-2 block">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-treevu-surface border-white/10">
                  <SelectItem value="all" className="text-white">Todos</SelectItem>
                  <SelectItem value="pending_approval" className="text-white">Pendientes</SelectItem>
                  <SelectItem value="processing_transfer" className="text-white">Aprobadas</SelectItem>
                  <SelectItem value="rejected" className="text-white">Rechazadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Monto Mín (S/)</label>
              <Input
                type="number"
                placeholder="0"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Monto Máx (S/)</label>
              <Input
                type="number"
                placeholder="10000"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Ordenar por</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-treevu-surface border-white/10">
                  <SelectItem value="date" className="text-white">Más Reciente</SelectItem>
                  <SelectItem value="amount-desc" className="text-white">Monto (Mayor)</SelectItem>
                  <SelectItem value="amount-asc" className="text-white">Monto (Menor)</SelectItem>
                  <SelectItem value="fwi-desc" className="text-white">FWI (Mayor)</SelectItem>
                  <SelectItem value="fwi-asc" className="text-white">FWI (Menor)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center text-white">
                <DollarSign className="h-5 w-5 mr-2 text-brand-primary" />
                Solicitudes de EWA
              </CardTitle>
              <CardDescription className="text-gray-400">
                {filteredRequests.length} solicitud{filteredRequests.length !== 1 ? 'es' : ''} encontrada{filteredRequests.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-white/20 text-gray-400 hover:text-white">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                      <TableHeaderTooltip header="Empleado" tooltip="ID del empleado que solicita el adelanto" />
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">
                      <TableHeaderTooltip header="Monto" tooltip="Monto solicitado en soles" />
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">
                      <TableHeaderTooltip header="FWI Score" tooltip="Puntuación de bienestar financiero al momento de solicitar" />
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">
                      <TableHeaderTooltip header="Ingreso Mensual" tooltip="Ingreso mensual del empleado" />
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">
                      <TableHeaderTooltip header="Comisión" tooltip="Comisión cobrada por el adelanto" />
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">
                      <TableHeaderTooltip header="Estado" tooltip="Estado actual de la solicitud: Pendiente, Aprobada o Rechazada" />
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                      <TableHeaderTooltip header="Fecha" tooltip="Fecha en que se realizó la solicitud" />
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request, idx) => (
                    <tr key={request.id || idx} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-medium text-white">
                        Empleado #{String(request.userId)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-brand-primary">
                        S/ {(request.amount / 100).toLocaleString('es-PE', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getRiskIndicator(request.fwiScoreAtRequest)}
                          <span className={`font-semibold ${getFWIColor(request.fwiScoreAtRequest)}`}>
                            {request.fwiScoreAtRequest}/100
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-300">
                        S/ {(request.monthlyIncome / 100).toLocaleString('es-PE', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center text-orange-400 font-semibold">
                        S/ {(request.fee / 100).toLocaleString('es-PE', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400">
                        {new Date(request.createdAt).toLocaleDateString('es-PE')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {(!request.status || request.status === 'pending_approval' || request.status === 'pending') && (
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                              variant="outline"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowApproveModal(true);
                              }}
                            >
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                              variant="outline"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowRejectModal(true);
                              }}
                            >
                              Rechazar
                            </Button>
                          </div>
                        )}
                        {(request.status === 'processing_transfer' || request.status === 'disbursed') && (
                          <span className="text-xs text-green-400 font-semibold">Procesada</span>
                        )}
                        {request.status === 'rejected' && (
                          <span className="text-xs text-red-400 font-semibold">Denegada</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto mb-2 text-gray-600" />
              <p className="text-gray-400">No hay solicitudes que coincidan con los filtros</p>
              <p className="text-sm text-gray-500 mt-1">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent className="bg-treevu-surface border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmar Aprobación</DialogTitle>
            <DialogDescription className="text-gray-400">
              ¿Estás seguro de que deseas aprobar esta solicitud de EWA?
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-400">Empleado</p>
                  <p className="text-lg font-semibold text-white">#{selectedRequest.userId}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-400">Monto</p>
                  <p className="text-lg font-semibold text-brand-primary">S/ {(selectedRequest.amount / 100).toFixed(2)}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-400">Comisión</p>
                  <p className="text-lg font-semibold text-orange-400">S/ {(selectedRequest.fee / 100).toFixed(2)}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-400">FWI Score</p>
                  <p className="text-lg font-semibold text-yellow-400">{selectedRequest.fwiScoreAtRequest}/100</p>
                </div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-sm text-green-400">
                  ✓ El empleado recibirá S/ {((selectedRequest.amount - selectedRequest.fee) / 100).toFixed(2)} después de comisiones
                </p>
              </div>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowApproveModal(false)}
              className="border-white/20 text-gray-400 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={handleApprove}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Aprobar
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="bg-treevu-surface border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Rechazar Solicitud</DialogTitle>
            <DialogDescription className="text-gray-400">
              Ingresa la razón del rechazo. El empleado recibirá una notificación.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400">Solicitud de Empleado #{selectedRequest.userId}</p>
                <p className="text-lg font-semibold text-brand-primary">S/ {(selectedRequest.amount / 100).toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Razón del Rechazo</label>
                <Textarea
                  placeholder="Ej: FWI Score insuficiente, límite mensual alcanzado..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-24"
                />
              </div>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason('');
              }}
              className="border-white/20 text-gray-400 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={handleReject}
              disabled={isProcessing || !rejectReason.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Rechazar
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
