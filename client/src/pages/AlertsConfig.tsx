import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Bell, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Settings,
  History,
  TrendingDown,
  Users,
  Wallet,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

const ALERT_TYPE_INFO: Record<string, { label: string; icon: React.ReactNode; description: string }> = {
  fwi_department_low: {
    label: "FWI Departamento Bajo",
    icon: <TrendingDown className="h-4 w-4" />,
    description: "Alerta cuando el FWI promedio de un departamento baja del umbral"
  },
  fwi_individual_low: {
    label: "FWI Individual Bajo",
    icon: <AlertTriangle className="h-4 w-4" />,
    description: "Alerta cuando un empleado entra en alto riesgo financiero"
  },
  fwi_trend_negative: {
    label: "Tendencia FWI Negativa",
    icon: <TrendingDown className="h-4 w-4" />,
    description: "Alerta cuando el FWI baja durante 3 meses consecutivos"
  },
  ewa_pending_count: {
    label: "EWA Pendientes (Cantidad)",
    icon: <Wallet className="h-4 w-4" />,
    description: "Alerta cuando hay muchas solicitudes EWA pendientes"
  },
  ewa_pending_amount: {
    label: "EWA Pendientes (Monto)",
    icon: <Wallet className="h-4 w-4" />,
    description: "Alerta cuando el monto total de EWA pendiente es alto"
  },
  ewa_user_excessive: {
    label: "Uso Excesivo EWA",
    icon: <AlertTriangle className="h-4 w-4" />,
    description: "Alerta cuando un empleado usa EWA excesivamente"
  },
  high_risk_percentage: {
    label: "% Alto Riesgo Elevado",
    icon: <Users className="h-4 w-4" />,
    description: "Alerta cuando el porcentaje de empleados en alto riesgo supera el umbral"
  },
  new_high_risk_user: {
    label: "Nuevo Alto Riesgo",
    icon: <AlertTriangle className="h-4 w-4" />,
    description: "Alerta cuando un empleado entra en categoría de alto riesgo"
  },
  weekly_risk_summary: {
    label: "Resumen Semanal",
    icon: <Clock className="h-4 w-4" />,
    description: "Resumen semanal del estado de riesgo de la organización"
  }
};

const SEVERITY_COLORS = {
  info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  critical: "bg-red-500/20 text-red-400 border-red-500/30"
};

export default function AlertsConfig() {
  const { user } = useAuth();
  // Using sonner toast directly
  const [activeTab, setActiveTab] = useState("rules");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    alertType: "fwi_department_low" as string,
    threshold: 50,
    comparisonOperator: "lt" as "lt" | "lte" | "gt" | "gte" | "eq",
    notifyEmail: true,
    notifyPush: true,
    notifyInApp: true,
    cooldownMinutes: 60
  });
  
  // Queries
  const { data: rules, refetch: refetchRules } = trpc.alerts.getRules.useQuery({});
  const { data: history, refetch: refetchHistory } = trpc.alerts.getHistory.useQuery({ limit: 50 });
  
  // Mutations
  const createRule = trpc.alerts.createRule.useMutation({
    onSuccess: () => {
      toast.success("Regla creada - La regla de alerta se creó correctamente");
      refetchRules();
      setShowCreateForm(false);
      setNewRule({
        name: "",
        description: "",
        alertType: "fwi_department_low",
        threshold: 50,
        comparisonOperator: "lt",
        notifyEmail: true,
        notifyPush: true,
        notifyInApp: true,
        cooldownMinutes: 60
      });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });
  
  const toggleRule = trpc.alerts.toggleRule.useMutation({
    onSuccess: () => {
      refetchRules();
    }
  });
  
  const deleteRule = trpc.alerts.deleteRule.useMutation({
    onSuccess: () => {
      toast.success("Regla eliminada");
      refetchRules();
    }
  });
  
  const acknowledgeAlert = trpc.alerts.acknowledge.useMutation({
    onSuccess: () => {
      refetchHistory();
    }
  });
  
  const resolveAlert = trpc.alerts.resolve.useMutation({
    onSuccess: () => {
      toast.success("Alerta resuelta");
      refetchHistory();
    }
  });
  
  const createDefaults = trpc.alerts.createDefaults.useMutation({
    onSuccess: () => {
      toast.success("Reglas predeterminadas creadas");
      refetchRules();
    }
  });
  
  // Access check
  if (!user || (user.role !== "admin" && user.role !== "b2b_admin")) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <Card className="bg-[#111113]/80 border-white/10">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Acceso Restringido</h2>
            <p className="text-white/60">Solo administradores pueden configurar alertas</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const handleCreateRule = () => {
    createRule.mutate({
      name: newRule.name,
      description: newRule.description || undefined,
      alertType: newRule.alertType as any,
      threshold: newRule.threshold,
      comparisonOperator: newRule.comparisonOperator,
      notifyEmail: newRule.notifyEmail,
      notifyPush: newRule.notifyPush,
      notifyInApp: newRule.notifyInApp,
      cooldownMinutes: newRule.cooldownMinutes
    });
  };
  
  return (
    <div className="min-h-screen bg-[#0B0B0C]">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/b2b">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Bell className="h-6 w-6 text-emerald-400" />
                Configuración de Alertas
              </h1>
              <p className="text-white/60">Configura alertas automáticas para monitorear tu organización</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {(!rules || rules.length === 0) && (
              <Button
                variant="outline"
                onClick={() => createDefaults.mutate({})}
                disabled={createDefaults.isPending}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Crear Reglas Predeterminadas
              </Button>
            )}
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Regla
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="rules" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <Settings className="h-4 w-4 mr-2" />
              Reglas ({rules?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <History className="h-4 w-4 mr-2" />
              Historial ({history?.length || 0})
            </TabsTrigger>
          </TabsList>
          
          {/* Rules Tab */}
          <TabsContent value="rules" className="space-y-4">
            {showCreateForm && (
              <Card className="bg-[#111113]/80 border-white/10 backdrop-blur-xl mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Nueva Regla de Alerta</CardTitle>
                  <CardDescription className="text-white/60">
                    Define cuándo y cómo quieres ser notificado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Nombre</Label>
                      <Input
                        value={newRule.name}
                        onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                        placeholder="Ej: FWI Bajo en Ventas"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white/80">Tipo de Alerta</Label>
                      <Select
                        value={newRule.alertType}
                        onValueChange={(v) => setNewRule({ ...newRule, alertType: v })}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(ALERT_TYPE_INFO).map(([key, info]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                {info.icon}
                                {info.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Operador</Label>
                      <Select
                        value={newRule.comparisonOperator}
                        onValueChange={(v: any) => setNewRule({ ...newRule, comparisonOperator: v })}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lt">Menor que (&lt;)</SelectItem>
                          <SelectItem value="lte">Menor o igual (≤)</SelectItem>
                          <SelectItem value="gt">Mayor que (&gt;)</SelectItem>
                          <SelectItem value="gte">Mayor o igual (≥)</SelectItem>
                          <SelectItem value="eq">Igual a (=)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white/80">Umbral</Label>
                      <Input
                        type="number"
                        value={newRule.threshold}
                        onChange={(e) => setNewRule({ ...newRule, threshold: parseInt(e.target.value) || 0 })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white/80">Cooldown (minutos)</Label>
                      <Input
                        type="number"
                        value={newRule.cooldownMinutes}
                        onChange={(e) => setNewRule({ ...newRule, cooldownMinutes: parseInt(e.target.value) || 60 })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white/80">Descripción (opcional)</Label>
                    <Input
                      value={newRule.description}
                      onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                      placeholder="Descripción de la regla..."
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newRule.notifyEmail}
                        onCheckedChange={(c) => setNewRule({ ...newRule, notifyEmail: c })}
                      />
                      <Label className="text-white/80">Email</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newRule.notifyPush}
                        onCheckedChange={(c) => setNewRule({ ...newRule, notifyPush: c })}
                      />
                      <Label className="text-white/80">Push</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newRule.notifyInApp}
                        onCheckedChange={(c) => setNewRule({ ...newRule, notifyInApp: c })}
                      />
                      <Label className="text-white/80">In-App</Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="ghost"
                      onClick={() => setShowCreateForm(false)}
                      className="text-white/60"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCreateRule}
                      disabled={!newRule.name || createRule.isPending}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      Crear Regla
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {rules && rules.length > 0 ? (
              <div className="grid gap-4">
                {rules.map((rule) => {
                  const typeInfo = ALERT_TYPE_INFO[rule.alertType] || { label: rule.alertType, icon: <Bell />, description: "" };
                  return (
                    <Card key={rule.id} className="bg-[#111113]/80 border-white/10 backdrop-blur-xl">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${rule.isEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                              {typeInfo.icon}
                            </div>
                            <div>
                              <h3 className="font-medium text-white">{rule.name}</h3>
                              <p className="text-sm text-white/60">{typeInfo.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                                  {rule.comparisonOperator === "lt" ? "<" : rule.comparisonOperator === "gt" ? ">" : rule.comparisonOperator} {rule.threshold}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                                  Cooldown: {rule.cooldownMinutes}min
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={rule.isEnabled}
                              onCheckedChange={(checked) => toggleRule.mutate({ ruleId: rule.id, isEnabled: checked })}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteRule.mutate({ ruleId: rule.id })}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="bg-[#111113]/80 border-white/10 backdrop-blur-xl">
                <CardContent className="p-12 text-center">
                  <Bell className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No hay reglas de alerta</h3>
                  <p className="text-white/60 mb-4">Crea tu primera regla o usa las predeterminadas</p>
                  <Button
                    onClick={() => createDefaults.mutate({})}
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    Crear Reglas Predeterminadas
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {history && history.length > 0 ? (
              <div className="space-y-3">
                {history.map((alert) => {
                  const typeInfo = ALERT_TYPE_INFO[alert.alertType] || { label: alert.alertType, icon: <Bell /> };
                  return (
                    <Card key={alert.id} className="bg-[#111113]/80 border-white/10 backdrop-blur-xl">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${SEVERITY_COLORS[alert.severity]}`}>
                              {typeInfo.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge className={SEVERITY_COLORS[alert.severity]}>
                                  {alert.severity.toUpperCase()}
                                </Badge>
                                {alert.resolvedAt && (
                                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Resuelto
                                  </Badge>
                                )}
                              </div>
                              <p className="text-white mt-1">{alert.message}</p>
                              <p className="text-xs text-white/40 mt-1">
                                {new Date(alert.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          {!alert.resolvedAt && (
                            <div className="flex gap-2">
                              {!alert.acknowledgedAt && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => acknowledgeAlert.mutate({ alertId: alert.id })}
                                  className="border-white/20 text-white hover:bg-white/10"
                                >
                                  Reconocer
                                </Button>
                              )}
                              <Button
                                size="sm"
                                onClick={() => resolveAlert.mutate({ alertId: alert.id })}
                                className="bg-emerald-500 hover:bg-emerald-600"
                              >
                                Resolver
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="bg-[#111113]/80 border-white/10 backdrop-blur-xl">
                <CardContent className="p-12 text-center">
                  <History className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No hay alertas en el historial</h3>
                  <p className="text-white/60">Las alertas aparecerán aquí cuando se disparen</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
