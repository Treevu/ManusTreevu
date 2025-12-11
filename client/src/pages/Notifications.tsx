import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowLeft,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronRight,
  Gift,
  Flame,
  Loader2,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  Tag,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  Wallet,
  XCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  CheckCircle: <CheckCircle className="h-6 w-6 text-green-500" />,
  XCircle: <XCircle className="h-6 w-6 text-red-500" />,
  Wallet: <Wallet className="h-6 w-6 text-blue-500" />,
  Gift: <Gift className="h-6 w-6 text-purple-500" />,
  ShoppingBag: <ShoppingBag className="h-6 w-6 text-orange-500" />,
  Target: <Target className="h-6 w-6 text-cyan-500" />,
  Trophy: <Trophy className="h-6 w-6 text-yellow-500" />,
  TrendingUp: <TrendingUp className="h-6 w-6 text-green-500" />,
  AlertTriangle: <AlertTriangle className="h-6 w-6 text-amber-500" />,
  Star: <Star className="h-6 w-6 text-yellow-500" />,
  Flame: <Flame className="h-6 w-6 text-orange-500" />,
  Tag: <Tag className="h-6 w-6 text-pink-500" />,
  Bell: <Bell className="h-6 w-6 text-gray-500" />,
  Shield: <Shield className="h-6 w-6 text-red-500" />,
};

// Type labels
const typeLabels: Record<string, string> = {
  ewa_approved: "EWA",
  ewa_rejected: "EWA",
  ewa_disbursed: "EWA",
  treepoints_received: "TreePoints",
  treepoints_redeemed: "TreePoints",
  goal_progress: "Metas",
  goal_completed: "Metas",
  fwi_improved: "FWI",
  fwi_alert: "FWI",
  level_up: "Logros",
  streak_milestone: "Logros",
  offer_available: "Ofertas",
  system_announcement: "Sistema",
  security_alert: "Seguridad",
};

export default function Notifications() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  
  const utils = trpc.useUtils();
  
  const { data: allNotifications = [], isLoading: loadingAll } = trpc.notifications.list.useQuery(
    { limit: 100 },
    { enabled: isAuthenticated }
  );
  
  const { data: unreadNotifications = [], isLoading: loadingUnread } = trpc.notifications.list.useQuery(
    { limit: 100, unreadOnly: true },
    { enabled: isAuthenticated }
  );
  
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.unreadCount.invalidate();
    },
  });
  
  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.unreadCount.invalidate();
      toast.success("Todas las notificaciones marcadas como leídas");
    },
  });
  
  const deleteMutation = trpc.notifications.delete.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.unreadCount.invalidate();
      toast.success("Notificación eliminada");
    },
  });
  
  const deleteAllMutation = trpc.notifications.deleteAll.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.unreadCount.invalidate();
      toast.success("Todas las notificaciones eliminadas");
    },
  });

  if (authLoading) {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Notificaciones</h1>
        <p className="text-gray-600 mb-6 text-center">
          Inicia sesión para ver tus notificaciones
        </p>
        <a href={getLoginUrl()}>
          <Button className="bg-green-600 hover:bg-green-700">
            Iniciar Sesión
          </Button>
        </a>
      </div>
    );
  }

  const renderNotificationList = (notifications: typeof allNotifications, isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <BellOff className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium">No hay notificaciones</p>
          <p className="text-sm text-gray-400 mt-1">Te avisaremos cuando haya algo nuevo</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {notifications.map((notification) => {
          const icon = notification.icon ? iconMap[notification.icon] || iconMap.Bell : iconMap.Bell;
          const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { 
            addSuffix: true, 
            locale: es 
          });
          const typeLabel = typeLabels[notification.type] || "Sistema";

          return (
            <Card 
              key={notification.id} 
              className={`transition-all ${notification.isRead ? "bg-white" : "bg-green-50/50 border-green-200"}`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      notification.isRead ? "bg-gray-100" : "bg-green-100"
                    }`}>
                      {icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-semibold ${notification.isRead ? "text-gray-700" : "text-gray-900"}`}>
                          {notification.title}
                        </h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          notification.isRead ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
                        }`}>
                          {typeLabel}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {timeAgo}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {notification.actionUrl && (
                        <Link href={notification.actionUrl}>
                          <Button variant="outline" size="sm" className="h-8 text-xs text-green-600 border-green-200 hover:bg-green-50">
                            {notification.actionLabel || "Ver más"}
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      )}
                      {!notification.isRead && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs text-gray-500 hover:text-gray-700"
                          onClick={() => markAsReadMutation.mutate({ notificationId: notification.id })}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Marcar como leída
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs text-gray-400 hover:text-red-500 ml-auto"
                        onClick={() => deleteMutation.mutate({ notificationId: notification.id })}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

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
                <h1 className="text-xl font-bold text-gray-900">Notificaciones</h1>
                <p className="text-sm text-gray-500">
                  {unreadNotifications.length} sin leer de {allNotifications.length} total
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadNotifications.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending}
                >
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Marcar todas como leídas
                </Button>
              )}
              {allNotifications.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => deleteAllMutation.mutate()}
                  disabled={deleteAllMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar todas
                </Button>
              )}
              <Link href="/settings/notifications">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5 text-gray-500" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Todas ({allNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              <BellOff className="h-4 w-4" />
              Sin leer ({unreadNotifications.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {renderNotificationList(allNotifications, loadingAll)}
          </TabsContent>
          
          <TabsContent value="unread">
            {renderNotificationList(unreadNotifications, loadingUnread)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
