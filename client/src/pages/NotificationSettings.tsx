import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { 
  ArrowLeft, 
  Bell, 
  BellRing,
  CheckCircle,
  Gift, 
  Loader2, 
  Mail, 
  Shield, 
  Smartphone, 
  Target, 
  TrendingUp, 
  Trophy, 
  Wallet,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

interface PreferenceGroup {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: {
    key: string;
    label: string;
    description: string;
  }[];
}

const preferenceGroups: PreferenceGroup[] = [
  {
    title: "Adelantos de Salario (EWA)",
    description: "Notificaciones sobre tus solicitudes de adelanto",
    icon: <Wallet className="h-5 w-5 text-blue-500" />,
    items: [
      { key: "ewaApproved", label: "Adelanto aprobado", description: "Cuando tu solicitud sea aprobada" },
      { key: "ewaRejected", label: "Adelanto rechazado", description: "Cuando tu solicitud no sea aprobada" },
      { key: "ewaDisbursed", label: "Adelanto transferido", description: "Cuando el dinero esté en camino" },
    ],
  },
  {
    title: "TreePoints",
    description: "Notificaciones sobre tus puntos de recompensa",
    icon: <Gift className="h-5 w-5 text-purple-500" />,
    items: [
      { key: "treepointsReceived", label: "Puntos recibidos", description: "Cuando recibas TreePoints" },
      { key: "treepointsRedeemed", label: "Puntos canjeados", description: "Cuando canjees tus puntos" },
    ],
  },
  {
    title: "Metas Financieras",
    description: "Notificaciones sobre el progreso de tus metas",
    icon: <Target className="h-5 w-5 text-cyan-500" />,
    items: [
      { key: "goalProgress", label: "Progreso de meta", description: "Actualizaciones de avance en tus metas" },
      { key: "goalCompleted", label: "Meta completada", description: "Cuando alcances una meta" },
    ],
  },
  {
    title: "FWI Score",
    description: "Notificaciones sobre tu índice de bienestar financiero",
    icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    items: [
      { key: "fwiImproved", label: "Score mejorado", description: "Cuando tu FWI Score suba" },
      { key: "fwiAlert", label: "Alerta de score", description: "Cuando tu FWI Score necesite atención" },
    ],
  },
  {
    title: "Logros y Gamificación",
    description: "Notificaciones sobre tus logros en la plataforma",
    icon: <Trophy className="h-5 w-5 text-yellow-500" />,
    items: [
      { key: "levelUp", label: "Subida de nivel", description: "Cuando subas de nivel" },
      { key: "streakMilestone", label: "Racha alcanzada", description: "Cuando alcances una racha de días" },
    ],
  },
  {
    title: "Ofertas y Promociones",
    description: "Notificaciones sobre ofertas disponibles",
    icon: <Gift className="h-5 w-5 text-pink-500" />,
    items: [
      { key: "offerAvailable", label: "Nueva oferta", description: "Cuando haya ofertas para ti" },
    ],
  },
  {
    title: "Sistema y Seguridad",
    description: "Notificaciones importantes del sistema",
    icon: <Shield className="h-5 w-5 text-red-500" />,
    items: [
      { key: "systemAnnouncement", label: "Anuncios del sistema", description: "Actualizaciones importantes" },
      { key: "securityAlert", label: "Alertas de seguridad", description: "Actividad sospechosa en tu cuenta" },
    ],
  },
];

export default function NotificationSettings() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  // Push notifications hook
  const {
    isSupported: pushSupported,
    permission: pushPermission,
    isSubscribed: pushSubscribed,
    isLoading: pushLoading,
    deviceCount,
    subscribe: subscribePush,
    unsubscribe: unsubscribePush,
    sendTest: sendTestPush,
  } = usePushNotifications();
  
  const { data: preferences, isLoading } = trpc.notifications.getPreferences.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const [localPrefs, setLocalPrefs] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);
  
  const updateMutation = trpc.notifications.updatePreferences.useMutation({
    onSuccess: () => {
      toast.success("Preferencias guardadas correctamente");
      setHasChanges(false);
    },
    onError: () => {
      toast.error("Error al guardar las preferencias");
    },
  });
  
  const testEmailMutation = trpc.notifications.testEmail.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Email de prueba enviado correctamente");
      } else {
        toast.error(result.error || "Error al enviar email de prueba");
      }
    },
    onError: () => {
      toast.error("Error al enviar email de prueba");
    },
  });
  
  useEffect(() => {
    if (preferences) {
      const prefs: Record<string, boolean> = {};
      Object.entries(preferences).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          prefs[key] = value;
        }
      });
      setLocalPrefs(prefs);
    }
  }, [preferences]);
  
  const handleToggle = (key: string, value: boolean) => {
    setLocalPrefs(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };
  
  const handleSave = () => {
    updateMutation.mutate(localPrefs);
  };
  
  const handleEnableAll = () => {
    const allEnabled: Record<string, boolean> = {};
    preferenceGroups.forEach(group => {
      group.items.forEach(item => {
        allEnabled[item.key] = true;
      });
    });
    allEnabled.inAppEnabled = true;
    allEnabled.emailEnabled = localPrefs.emailEnabled ?? false;
    allEnabled.pushEnabled = localPrefs.pushEnabled ?? false;
    setLocalPrefs(allEnabled);
    setHasChanges(true);
  };
  
  const handleDisableAll = () => {
    const allDisabled: Record<string, boolean> = {};
    preferenceGroups.forEach(group => {
      group.items.forEach(item => {
        allDisabled[item.key] = false;
      });
    });
    allDisabled.inAppEnabled = false;
    allDisabled.emailEnabled = false;
    allDisabled.pushEnabled = false;
    setLocalPrefs(allDisabled);
    setHasChanges(true);
  };

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled) {
      const success = await subscribePush();
      if (success) {
        handleToggle('pushEnabled', true);
      }
    } else {
      const success = await unsubscribePush();
      if (success) {
        handleToggle('pushEnabled', false);
      }
    }
  };

  const handleEmailToggle = (enabled: boolean) => {
    if (enabled && !user?.email) {
      toast.error("Necesitas configurar un email en tu perfil primero");
      return;
    }
    handleToggle('emailEnabled', enabled);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <Bell className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuración de Notificaciones</h1>
        <p className="text-gray-600 mb-6 text-center">
          Inicia sesión para personalizar tus preferencias de notificación
        </p>
        <a href={getLoginUrl()}>
          <Button className="bg-green-600 hover:bg-green-700">
            Iniciar Sesión
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/app">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Preferencias de Notificación</h1>
                <p className="text-sm text-gray-500">Personaliza qué notificaciones quieres recibir</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleEnableAll}>
                Activar todas
              </Button>
              <Button variant="outline" size="sm" onClick={handleDisableAll}>
                Desactivar todas
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSave}
                disabled={!hasChanges || updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Delivery Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-500" />
              Métodos de Entrega
            </CardTitle>
            <CardDescription>
              Elige cómo quieres recibir tus notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* In-App Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <Label className="text-base font-medium">Notificaciones en la app</Label>
                  <p className="text-sm text-gray-500">Recibe notificaciones dentro de Treevü</p>
                </div>
              </div>
              <Switch
                checked={localPrefs.inAppEnabled ?? true}
                onCheckedChange={(checked) => handleToggle('inAppEnabled', checked)}
              />
            </div>
            
            <Separator />
            
            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-medium">Notificaciones push</Label>
                    {pushSubscribed && (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        Activo ({deviceCount} {deviceCount === 1 ? 'dispositivo' : 'dispositivos'})
                      </span>
                    )}
                    {!pushSupported && (
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        <XCircle className="h-3 w-3" />
                        No soportado
                      </span>
                    )}
                    {pushSupported && pushPermission === 'denied' && (
                      <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        <XCircle className="h-3 w-3" />
                        Bloqueado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {!pushSupported 
                      ? "Tu navegador no soporta notificaciones push"
                      : pushPermission === 'denied'
                      ? "Habilita las notificaciones en la configuración de tu navegador"
                      : "Recibe alertas incluso cuando no estés en Treevü"
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {pushSubscribed && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={sendTestPush}
                    disabled={pushLoading}
                  >
                    <BellRing className="h-4 w-4 mr-1" />
                    Probar
                  </Button>
                )}
                <Switch
                  checked={pushSubscribed}
                  onCheckedChange={handlePushToggle}
                  disabled={!pushSupported || pushPermission === 'denied' || pushLoading}
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-medium">Notificaciones por email</Label>
                    {localPrefs.emailEnabled && user?.email && (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        Activo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {user?.email 
                      ? `Enviar notificaciones a ${user.email}`
                      : "Configura un email en tu perfil para activar esta opción"
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {localPrefs.emailEnabled && user?.email && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => testEmailMutation.mutate()}
                    disabled={testEmailMutation.isPending}
                  >
                    {testEmailMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <Mail className="h-4 w-4 mr-1" />
                    )}
                    Probar
                  </Button>
                )}
                <Switch
                  checked={localPrefs.emailEnabled ?? false}
                  onCheckedChange={handleEmailToggle}
                  disabled={!user?.email}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Categories */}
        <div className="space-y-6">
          {preferenceGroups.map((group) => (
            <Card key={group.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {group.icon}
                  {group.title}
                </CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.items.map((item, index) => (
                  <div key={item.key}>
                    {index > 0 && <Separator className="mb-4" />}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">{item.label}</Label>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                      <Switch
                        checked={localPrefs[item.key] ?? true}
                        onCheckedChange={(checked) => handleToggle(item.key, checked)}
                        disabled={!localPrefs.inAppEnabled && !localPrefs.emailEnabled && !pushSubscribed}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Save Button (Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t md:hidden">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleSave}
            disabled={!hasChanges || updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
