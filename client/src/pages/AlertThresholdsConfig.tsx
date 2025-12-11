import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, ArrowLeft, Save, RotateCcw, AlertTriangle, 
  Bell, Mail, MessageSquare, Info, Shield, TrendingDown
} from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ThresholdConfig {
  fwiCriticalThreshold: number;
  fwiWarningThreshold: number;
  fwiHealthyThreshold: number;
  riskCriticalPercentage: number;
  riskWarningPercentage: number;
  ewaMaxPendingCount: number;
  ewaMaxPendingAmount: number;
  ewaMaxPerEmployee: number;
  notifyOnCritical: boolean;
  notifyOnWarning: boolean;
  notifyOnInfo: boolean;
  notifyEmails: string;
  notifySlackWebhook: string;
}

function ThresholdSlider({ 
  label, 
  description, 
  value, 
  onChange, 
  min = 0, 
  max = 100,
  unit = '%',
  color = 'emerald'
}: {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
  color?: 'emerald' | 'amber' | 'red';
}) {
  const colorClasses = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500'
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-white font-medium">{label}</Label>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <div className={`px-3 py-1 rounded-full ${colorClasses[color]}/20 text-${color}-400 font-mono text-sm`}>
          {value}{unit}
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={1}
        className="w-full"
      />
    </div>
  );
}

export default function AlertThresholdsConfig() {
  const { user, loading: authLoading } = useAuth();
  const [hasChanges, setHasChanges] = useState(false);
  const [config, setConfig] = useState<ThresholdConfig>({
    fwiCriticalThreshold: 30,
    fwiWarningThreshold: 50,
    fwiHealthyThreshold: 70,
    riskCriticalPercentage: 25,
    riskWarningPercentage: 15,
    ewaMaxPendingCount: 10,
    ewaMaxPendingAmount: 50000,
    ewaMaxPerEmployee: 3,
    notifyOnCritical: true,
    notifyOnWarning: true,
    notifyOnInfo: false,
    notifyEmails: '',
    notifySlackWebhook: ''
  });
  
  // Fetch default thresholds
  const { data: defaults, isLoading: defaultsLoading } = trpc.thresholds.getDefaults.useQuery();
  
  // Update mutation
  const updateMutation = trpc.thresholds.update.useMutation({
    onSuccess: () => {
      toast.success('Configuración guardada exitosamente');
      setHasChanges(false);
    },
    onError: (error) => {
      toast.error('Error al guardar: ' + error.message);
    }
  });
  
  // Initialize config with defaults
  useEffect(() => {
    if (defaults) {
      setConfig(prev => ({
        ...prev,
        ...defaults,
        notifyEmails: '',
        notifySlackWebhook: ''
      }));
    }
  }, [defaults]);
  
  const updateConfig = <K extends keyof ThresholdConfig>(key: K, value: ThresholdConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };
  
  const handleSave = () => {
    updateMutation.mutate({
      organizationId: 1, // Default organization
      ...config
    });
  };
  
  const handleReset = () => {
    if (defaults) {
      setConfig({
        ...defaults,
        notifyEmails: '',
        notifySlackWebhook: ''
      });
      setHasChanges(true);
    }
  };

  if (authLoading || defaultsLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-primary/8 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>
      
      {/* Header */}
      <header className="bg-treevu-surface/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-10 relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/b2b">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-display font-bold text-white">Configuración de Alertas</h1>
                <p className="text-sm text-gray-400">Personaliza los umbrales de alerta para tu organización</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restaurar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || updateMutation.isPending}
                className="bg-brand-primary hover:bg-brand-primary/90 text-black font-medium"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FWI Thresholds */}
          <Card className="border-0 bg-treevu-surface/60 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Umbrales de FWI</CardTitle>
                  <CardDescription>Define los niveles de alerta según el índice de bienestar financiero</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ThresholdSlider
                label="Umbral Crítico"
                description="FWI por debajo de este valor genera alerta crítica"
                value={config.fwiCriticalThreshold}
                onChange={(v) => updateConfig('fwiCriticalThreshold', v)}
                color="red"
              />
              <ThresholdSlider
                label="Umbral de Advertencia"
                description="FWI por debajo de este valor genera advertencia"
                value={config.fwiWarningThreshold}
                onChange={(v) => updateConfig('fwiWarningThreshold', v)}
                color="amber"
              />
              <ThresholdSlider
                label="Umbral Saludable"
                description="FWI por encima de este valor se considera saludable"
                value={config.fwiHealthyThreshold}
                onChange={(v) => updateConfig('fwiHealthyThreshold', v)}
                color="emerald"
              />
              
              {/* Visual indicator */}
              <div className="mt-4 p-4 rounded-lg bg-black/30">
                <p className="text-xs text-gray-400 mb-2">Vista previa de rangos:</p>
                <div className="h-4 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-red-500 transition-all" 
                    style={{ width: `${config.fwiCriticalThreshold}%` }}
                  />
                  <div 
                    className="bg-amber-500 transition-all" 
                    style={{ width: `${config.fwiWarningThreshold - config.fwiCriticalThreshold}%` }}
                  />
                  <div 
                    className="bg-yellow-500 transition-all" 
                    style={{ width: `${config.fwiHealthyThreshold - config.fwiWarningThreshold}%` }}
                  />
                  <div 
                    className="bg-emerald-500 transition-all flex-1"
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>0</span>
                  <span>{config.fwiCriticalThreshold}</span>
                  <span>{config.fwiWarningThreshold}</span>
                  <span>{config.fwiHealthyThreshold}</span>
                  <span>100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Thresholds */}
          <Card className="border-0 bg-treevu-surface/60 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Umbrales de Riesgo</CardTitle>
                  <CardDescription>Define alertas según el porcentaje de empleados en riesgo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ThresholdSlider
                label="Riesgo Crítico"
                description="Porcentaje de empleados en riesgo para alerta crítica"
                value={config.riskCriticalPercentage}
                onChange={(v) => updateConfig('riskCriticalPercentage', v)}
                color="red"
              />
              <ThresholdSlider
                label="Riesgo de Advertencia"
                description="Porcentaje de empleados en riesgo para advertencia"
                value={config.riskWarningPercentage}
                onChange={(v) => updateConfig('riskWarningPercentage', v)}
                color="amber"
              />
              
              <Separator className="bg-white/10" />
              
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-200 font-medium">Ejemplo de aplicación</p>
                    <p className="text-xs text-amber-200/70 mt-1">
                      Con 100 empleados y umbral crítico en {config.riskCriticalPercentage}%, 
                      se activará una alerta crítica cuando {config.riskCriticalPercentage} o más 
                      empleados estén en estado de alto riesgo.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EWA Thresholds */}
          <Card className="border-0 bg-treevu-surface/60 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Umbrales de EWA</CardTitle>
                  <CardDescription>Controla las alertas de adelantos de nómina</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Máximo de solicitudes pendientes</Label>
                <p className="text-xs text-gray-400">Alerta cuando hay más de este número de solicitudes pendientes</p>
                <Input
                  type="number"
                  value={config.ewaMaxPendingCount}
                  onChange={(e) => updateConfig('ewaMaxPendingCount', parseInt(e.target.value) || 0)}
                  className="bg-black/30 border-white/20 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Monto máximo pendiente (MXN)</Label>
                <p className="text-xs text-gray-400">Alerta cuando el monto total pendiente supera este valor</p>
                <Input
                  type="number"
                  value={config.ewaMaxPendingAmount}
                  onChange={(e) => updateConfig('ewaMaxPendingAmount', parseInt(e.target.value) || 0)}
                  className="bg-black/30 border-white/20 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Máximo por empleado (mensual)</Label>
                <p className="text-xs text-gray-400">Alerta cuando un empleado solicita más de este número de EWAs</p>
                <Input
                  type="number"
                  value={config.ewaMaxPerEmployee}
                  onChange={(e) => updateConfig('ewaMaxPerEmployee', parseInt(e.target.value) || 0)}
                  className="bg-black/30 border-white/20 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-0 bg-treevu-surface/60 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Bell className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Preferencias de Notificación</CardTitle>
                  <CardDescription>Configura cómo y cuándo recibir alertas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div>
                      <Label className="text-white">Alertas Críticas</Label>
                      <p className="text-xs text-gray-400">Notificar inmediatamente</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.notifyOnCritical}
                    onCheckedChange={(v) => updateConfig('notifyOnCritical', v)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div>
                      <Label className="text-white">Advertencias</Label>
                      <p className="text-xs text-gray-400">Notificar en resumen diario</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.notifyOnWarning}
                    onCheckedChange={(v) => updateConfig('notifyOnWarning', v)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div>
                      <Label className="text-white">Informativas</Label>
                      <p className="text-xs text-gray-400">Notificar en resumen semanal</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.notifyOnInfo}
                    onCheckedChange={(v) => updateConfig('notifyOnInfo', v)}
                  />
                </div>
              </div>
              
              <Separator className="bg-white/10" />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <Label className="text-white">Emails adicionales</Label>
                  </div>
                  <p className="text-xs text-gray-400">Separa múltiples emails con comas</p>
                  <Input
                    type="text"
                    placeholder="hr@empresa.com, ceo@empresa.com"
                    value={config.notifyEmails}
                    onChange={(e) => updateConfig('notifyEmails', e.target.value)}
                    className="bg-black/30 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <Label className="text-white">Webhook de Slack</Label>
                  </div>
                  <p className="text-xs text-gray-400">URL del webhook para notificaciones en Slack</p>
                  <Input
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={config.notifySlackWebhook}
                    onChange={(e) => updateConfig('notifySlackWebhook', e.target.value)}
                    className="bg-black/30 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
