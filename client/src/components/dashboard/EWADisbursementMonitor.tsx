import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle, CheckCircle2, Clock, Zap, RefreshCw, AlertTriangle,
  TrendingUp, Activity, Pause
} from 'lucide-react';

interface DisbursementRecord {
  id: number;
  requestId: number;
  employeeId: number;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: Date;
}

interface EWADisbursementMonitorProps {
  disbursements?: DisbursementRecord[];
  isLoading?: boolean;
  onRetry?: (disbursementId: number) => Promise<void>;
  onRefresh?: () => Promise<void>;
}

export function EWADisbursementMonitor({
  disbursements = [],
  isLoading = false,
  onRetry,
  onRefresh,
}: EWADisbursementMonitorProps) {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 segundos

  // Auto-refresh cada X segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      onRefresh?.();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, onRefresh]);

  // Calcular estadísticas
  const stats = {
    total: disbursements.length,
    processing: disbursements.filter(d => d.status === 'processing').length,
    completed: disbursements.filter(d => d.status === 'completed').length,
    failed: disbursements.filter(d => d.status === 'failed').length,
    pending: disbursements.filter(d => d.status === 'pending').length,
    totalAmount: disbursements.reduce((sum, d) => sum + d.amount, 0),
    completedAmount: disbursements
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + d.amount, 0),
    avgProcessingTime: disbursements
      .filter(d => d.status === 'completed' && d.completedAt)
      .reduce((sum, d) => {
        const time = new Date(d.completedAt!).getTime() - new Date(d.startedAt).getTime();
        return sum + time;
      }, 0) / Math.max(disbursements.filter(d => d.status === 'completed').length, 1),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-400 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'pending':
        return <Pause className="h-5 w-5 text-yellow-400" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completado</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Procesando</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Fallido</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendiente</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Desconocido</Badge>;
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Monitoreo de Desembolsos</h2>
          <p className="text-gray-400 mt-1">Seguimiento en tiempo real de transferencias EWA</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRefresh?.()}
            disabled={isLoading}
            className="border-white/20 text-gray-400 hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-brand-primary hover:bg-brand-primary/90' : 'border-white/20'}
          >
            <Zap className="h-4 w-4 mr-2" />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Activity className="h-6 w-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Procesando</p>
                <p className="text-2xl font-bold text-blue-400">{stats.processing}</p>
              </div>
              <Clock className="h-6 w-6 text-blue-400 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Completados</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Fallidos</p>
                <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Tiempo Promedio</p>
                <p className="text-lg font-bold text-orange-400">{formatTime(stats.avgProcessingTime)}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {stats.failed > 0 && (
        <Alert className="bg-red-500/10 border-red-500/30">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">
            {stats.failed} desembolso{stats.failed !== 1 ? 's' : ''} fallido{stats.failed !== 1 ? 's' : ''}. Se recomienda revisar y reintentar.
          </AlertDescription>
        </Alert>
      )}

      {stats.processing > 0 && (
        <Alert className="bg-blue-500/10 border-blue-500/30">
          <AlertCircle className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-300">
            {stats.processing} desembolso{stats.processing !== 1 ? 's' : ''} en proceso. Tiempo promedio: {formatTime(stats.avgProcessingTime)}
          </AlertDescription>
        </Alert>
      )}

      {/* Tabla de Desembolsos */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white">Historial de Desembolsos</CardTitle>
          <CardDescription className="text-gray-400">
            Últimas transferencias procesadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {disbursements.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400">ID Solicitud</th>
                    <th className="text-left py-3 px-4 text-gray-400">Empleado</th>
                    <th className="text-right py-3 px-4 text-gray-400">Monto</th>
                    <th className="text-center py-3 px-4 text-gray-400">Estado</th>
                    <th className="text-center py-3 px-4 text-gray-400">Tiempo</th>
                    <th className="text-center py-3 px-4 text-gray-400">Reintentos</th>
                    <th className="text-center py-3 px-4 text-gray-400">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {disbursements.map((disburse) => {
                    const processingTime = disburse.completedAt
                      ? new Date(disburse.completedAt).getTime() - new Date(disburse.startedAt).getTime()
                      : new Date().getTime() - new Date(disburse.startedAt).getTime();

                    return (
                      <tr key={disburse.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-medium text-white">#{disburse.requestId}</td>
                        <td className="py-3 px-4 text-gray-300">Emp. #{disburse.employeeId}</td>
                        <td className="py-3 px-4 text-right font-semibold text-brand-primary">
                          S/ {(disburse.amount / 100).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {getStatusIcon(disburse.status)}
                            {getStatusBadge(disburse.status)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-300">
                          {formatTime(processingTime)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                            {disburse.retryCount}/{disburse.maxRetries}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {disburse.status === 'failed' && disburse.retryCount < disburse.maxRetries && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onRetry?.(disburse.id)}
                              className="border-yellow-500/30 text-yellow-400 hover:text-yellow-300"
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Reintentar
                            </Button>
                          )}
                          {disburse.status === 'completed' && (
                            <span className="text-green-400 text-xs">✓ Completado</span>
                          )}
                          {disburse.status === 'processing' && (
                            <span className="text-blue-400 text-xs animate-pulse">⏳ En proceso</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto mb-2 text-gray-600" />
              <p className="text-gray-400">No hay desembolsos registrados</p>
              <p className="text-sm text-gray-500 mt-1">Los desembolsos aparecerán aquí cuando se procesen</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalles de Error */}
      {disbursements.some(d => d.errorMessage) && (
        <Card className="border-0 shadow-lg bg-red-500/10 backdrop-blur-sm border border-red-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-red-400">Errores Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {disbursements
                .filter(d => d.errorMessage)
                .map(d => (
                  <div key={d.id} className="p-3 bg-red-500/5 rounded border border-red-500/20">
                    <p className="text-sm text-red-300">
                      <strong>Solicitud #{d.requestId}:</strong> {d.errorMessage}
                    </p>
                    {d.nextRetryAt && (
                      <p className="text-xs text-red-400 mt-1">
                        Próximo reintento: {new Date(d.nextRetryAt).toLocaleString('es-PE')}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
