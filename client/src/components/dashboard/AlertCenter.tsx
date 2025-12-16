import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, AlertTriangle, AlertOctagon, X } from 'lucide-react';

export interface Alert {
  id: string;
  type: 'threshold' | 'anomaly' | 'trend';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  metric: string;
  currentValue: number;
  threshold?: number;
  recommendedAction: string;
  createdAt: Date;
  isResolved: boolean;
}

interface AlertCenterProps {
  alerts?: Alert[];
  onResolve?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  isLoading?: boolean;
}

export default function AlertCenter({
  alerts = [],
  onResolve,
  onDismiss,
  isLoading = false,
}: AlertCenterProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const activeAlerts = alerts.filter(a => !a.isResolved && !dismissedAlerts.includes(a.id));
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');
  const warningAlerts = activeAlerts.filter(a => a.severity === 'warning');
  const infoAlerts = activeAlerts.filter(a => a.severity === 'info');

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
    onDismiss?.(alertId);
  };

  const handleResolve = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
    onResolve?.(alertId);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const AlertItem = ({ alert }: { alert: Alert }) => (
    <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {getSeverityIcon(alert.severity)}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white">{alert.title}</h4>
            <p className="text-sm text-gray-400 mt-1">{alert.description}</p>
            <p className="text-xs text-gray-500 mt-2">
              {alert.createdAt.toLocaleDateString()} {alert.createdAt.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleResolve(alert.id)}
            className="text-green-400 hover:bg-green-500/10"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDismiss(alert.id)}
            className="text-gray-400 hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {alert.recommendedAction && (
        <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-sm text-blue-300">
          💡 {alert.recommendedAction}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-gray-500">{alert.metric}</span>
        <div className="flex gap-2">
          <span className="text-white font-mono">{alert.currentValue.toFixed(2)}</span>
          {alert.threshold && (
            <>
              <span className="text-gray-500">/</span>
              <span className="text-gray-400 font-mono">{alert.threshold.toFixed(2)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">Cargando alertas...</div>
        </CardContent>
      </Card>
    );
  }

  if (activeAlerts.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-white">
            <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
            Centro de Alertas
          </CardTitle>
          <CardDescription className="text-gray-400">
            No hay alertas activas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500/50" />
            <p className="text-gray-400">¡Excelente! Todo está bajo control</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center text-white">
              <AlertCircle className="h-5 w-5 mr-2 text-amber-400" />
              Centro de Alertas
            </CardTitle>
            <CardDescription className="text-gray-400">
              {activeAlerts.length} alerta{activeAlerts.length !== 1 ? 's' : ''} activa{activeAlerts.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {criticalAlerts.length > 0 && (
              <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                {criticalAlerts.length} Crítica{criticalAlerts.length !== 1 ? 's' : ''}
              </Badge>
            )}
            {warningAlerts.length > 0 && (
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {warningAlerts.length} Aviso{warningAlerts.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {criticalAlerts.length > 0 || warningAlerts.length > 0 ? (
          <Tabs defaultValue="critical" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-treevu-surface/50 border border-white/10">
              {criticalAlerts.length > 0 && (
                <TabsTrigger value="critical" className="text-red-400">
                  Críticas ({criticalAlerts.length})
                </TabsTrigger>
              )}
              {warningAlerts.length > 0 && (
                <TabsTrigger value="warning" className="text-amber-400">
                  Avisos ({warningAlerts.length})
                </TabsTrigger>
              )}
              {infoAlerts.length > 0 && (
                <TabsTrigger value="info" className="text-blue-400">
                  Info ({infoAlerts.length})
                </TabsTrigger>
              )}
            </TabsList>

            {criticalAlerts.length > 0 && (
              <TabsContent value="critical" className="space-y-3">
                {criticalAlerts.map(alert => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </TabsContent>
            )}

            {warningAlerts.length > 0 && (
              <TabsContent value="warning" className="space-y-3">
                {warningAlerts.map(alert => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </TabsContent>
            )}

            {infoAlerts.length > 0 && (
              <TabsContent value="info" className="space-y-3">
                {infoAlerts.map(alert => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map(alert => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
