import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, Info, Bell, ArrowRight, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface ActiveAlertsWidgetProps {
  className?: string;
  limit?: number;
}

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    textColor: "text-red-400",
    iconColor: "text-red-500",
    label: "Crítico"
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-400",
    iconColor: "text-amber-500",
    label: "Advertencia"
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
    iconColor: "text-blue-500",
    label: "Info"
  }
};

export function ActiveAlertsWidget({ className, limit = 3 }: ActiveAlertsWidgetProps) {
  const { data: alerts, isLoading } = trpc.alerts.getHistory.useQuery(
    { onlyUnresolved: true, limit },
    { 
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: true 
    }
  );

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alertas Activas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeAlerts = alerts?.filter(a => !a.resolvedAt) || [];

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            Alertas Activas
            {activeAlerts.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-red-500/20 text-red-400">
                {activeAlerts.length}
              </span>
            )}
          </CardTitle>
          <Link href="/dashboard/alerts">
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-white">
              Ver todas <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {activeAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-sm font-medium text-white">Sin alertas activas</p>
            <p className="text-xs text-muted-foreground mt-1">
              Todo está funcionando correctamente
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeAlerts.slice(0, limit).map((alert) => {
              const config = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.info;
              const Icon = config.icon;
              
              return (
                <Link key={alert.id} href={`/dashboard/alerts?highlight=${alert.id}`}>
                  <div 
                    className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor} hover:bg-white/5 transition-colors cursor-pointer group`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${config.iconColor}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold ${config.textColor}`}>
                            {config.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(alert.createdAt), { 
                              addSuffix: true, 
                              locale: es 
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-white/90 line-clamp-2 group-hover:text-white transition-colors">
                          {alert.message}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              );
            })}
            
            {activeAlerts.length > limit && (
              <Link href="/dashboard/alerts">
                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-white">
                  +{activeAlerts.length - limit} alertas más
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ActiveAlertsWidget;
