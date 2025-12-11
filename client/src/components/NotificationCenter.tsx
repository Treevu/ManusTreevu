import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronRight,
  Gift,
  Flame,
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
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

// Icon mapping for notification types
const iconMap: Record<string, React.ReactNode> = {
  CheckCircle: <CheckCircle className="h-5 w-5 text-green-500" />,
  XCircle: <XCircle className="h-5 w-5 text-red-500" />,
  Wallet: <Wallet className="h-5 w-5 text-blue-500" />,
  Gift: <Gift className="h-5 w-5 text-purple-500" />,
  ShoppingBag: <ShoppingBag className="h-5 w-5 text-orange-500" />,
  Target: <Target className="h-5 w-5 text-cyan-500" />,
  Trophy: <Trophy className="h-5 w-5 text-yellow-500" />,
  TrendingUp: <TrendingUp className="h-5 w-5 text-green-500" />,
  AlertTriangle: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  Star: <Star className="h-5 w-5 text-yellow-500" />,
  Flame: <Flame className="h-5 w-5 text-orange-500" />,
  Tag: <Tag className="h-5 w-5 text-pink-500" />,
  Bell: <Bell className="h-5 w-5 text-gray-500" />,
  Shield: <Shield className="h-5 w-5 text-red-500" />,
};

// Type colors for notification badges
const typeColors: Record<string, string> = {
  ewa_approved: "bg-green-100 text-green-700",
  ewa_rejected: "bg-red-100 text-red-700",
  ewa_disbursed: "bg-blue-100 text-blue-700",
  treepoints_received: "bg-purple-100 text-purple-700",
  treepoints_redeemed: "bg-orange-100 text-orange-700",
  goal_progress: "bg-cyan-100 text-cyan-700",
  goal_completed: "bg-yellow-100 text-yellow-700",
  fwi_improved: "bg-green-100 text-green-700",
  fwi_alert: "bg-amber-100 text-amber-700",
  level_up: "bg-yellow-100 text-yellow-700",
  streak_milestone: "bg-orange-100 text-orange-700",
  offer_available: "bg-pink-100 text-pink-700",
  system_announcement: "bg-gray-100 text-gray-700",
  security_alert: "bg-red-100 text-red-700",
};

interface NotificationItemProps {
  notification: {
    id: number;
    type: string;
    title: string;
    message: string;
    icon: string | null;
    actionUrl: string | null;
    actionLabel: string | null;
    isRead: boolean;
    createdAt: Date;
  };
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const icon = notification.icon ? iconMap[notification.icon] || iconMap.Bell : iconMap.Bell;
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { 
    addSuffix: true, 
    locale: es 
  });

  return (
    <div 
      className={`p-4 border-b last:border-b-0 transition-colors ${
        notification.isRead ? "bg-white" : "bg-green-50/50"
      }`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-medium ${notification.isRead ? "text-gray-700" : "text-gray-900"}`}>
              {notification.title}
            </h4>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {timeAgo}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {notification.actionUrl && (
              <Link href={notification.actionUrl}>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 px-2">
                  {notification.actionLabel || "Ver más"}
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            )}
            {!notification.isRead && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs text-gray-500 hover:text-gray-700 px-2"
                onClick={() => onMarkAsRead(notification.id)}
              >
                <Check className="h-3 w-3 mr-1" />
                Marcar leída
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs text-gray-400 hover:text-red-500 px-2 ml-auto"
              onClick={() => onDelete(notification.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  
  const utils = trpc.useUtils();
  
  const { data: notifications = [], isLoading } = trpc.notifications.list.useQuery(
    { limit: 20 },
    { enabled: open }
  );
  
  const { data: unreadCount = 0 } = trpc.notifications.unreadCount.useQuery();
  
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

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate({ notificationId: id });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ notificationId: id });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-9 w-9 rounded-full"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">Notificaciones</h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs text-gray-600 hover:text-gray-900"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Marcar todas
              </Button>
            )}
            <Link href="/settings/notifications">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4 text-gray-500" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <BellOff className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm font-medium">No tienes notificaciones</p>
              <p className="text-xs text-gray-400 mt-1">Te avisaremos cuando haya algo nuevo</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2 flex justify-between">
              <Link href="/notifications">
                <Button variant="ghost" size="sm" className="text-xs text-green-600 hover:text-green-700">
                  Ver todas las notificaciones
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-gray-500 hover:text-red-500"
                onClick={() => deleteAllMutation.mutate()}
                disabled={deleteAllMutation.isPending}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Borrar todas
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
