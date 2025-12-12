import { useEffect, useRef, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';

interface NotificationToastOptions {
  enableSound?: boolean;
  enableToast?: boolean;
  pollInterval?: number;
}

// Icon mapping for toast notifications
const iconMap: Record<string, string> = {
  CheckCircle: '✅',
  XCircle: '❌',
  Wallet: '💰',
  Gift: '🎁',
  ShoppingBag: '🛍️',
  Target: '🎯',
  Trophy: '🏆',
  TrendingUp: '📈',
  AlertTriangle: '⚠️',
  Star: '⭐',
  Flame: '🔥',
  Tag: '🏷️',
  Bell: '🔔',
  Shield: '🛡️',
};

/**
 * Hook para notificaciones en "tiempo real" usando polling
 * Muestra toasts cuando llegan nuevas notificaciones
 */
export function useRealtimeNotifications(options: NotificationToastOptions = {}) {
  const {
    enableSound = true,
    enableToast = true,
    pollInterval = 30000, // 30 segundos por defecto
  } = options;

  const { user } = useAuth();
  const lastCountRef = useRef<number | null>(null);
  const lastNotificationIdRef = useRef<number | null>(null);

  // Query para contar notificaciones no leídas
  const { data: unreadCount = 0 } = trpc.notifications.unreadCount.useQuery(undefined, {
    enabled: !!user,
    refetchInterval: pollInterval,
    refetchIntervalInBackground: true,
  });

  // Query para obtener la última notificación
  const { data: latestNotifications } = trpc.notifications.list.useQuery(
    { limit: 1 },
    {
      enabled: !!user,
      refetchInterval: pollInterval,
      refetchIntervalInBackground: true,
    }
  );

  // Función para reproducir sonido de notificación
  const playNotificationSound = useCallback(() => {
    if (!enableSound) return;
    
    try {
      // Usar Web Audio API para generar un sonido simple
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Silently fail if audio is not available
      console.debug('Audio notification not available');
    }
  }, [enableSound]);

  // Mostrar toast cuando hay nuevas notificaciones
  const showNotificationToast = useCallback((notification: {
    title: string;
    message: string;
    icon?: string | null;
    type?: string;
  }) => {
    if (!enableToast) return;
    
    const icon = notification.icon ? iconMap[notification.icon] || '🔔' : '🔔';
    
    toast(notification.title, {
      description: notification.message,
      icon: icon,
      duration: 5000,
      action: {
        label: 'Ver',
        onClick: () => {
          // Abrir el centro de notificaciones
          const bellButton = document.querySelector('[data-notification-bell]') as HTMLButtonElement;
          if (bellButton) bellButton.click();
        },
      },
    });
  }, [enableToast]);

  // Detectar nuevas notificaciones
  useEffect(() => {
    if (!user) return;
    
    // Inicializar el contador en la primera carga
    if (lastCountRef.current === null) {
      lastCountRef.current = unreadCount;
      if (latestNotifications?.[0]) {
        lastNotificationIdRef.current = latestNotifications[0].id;
      }
      return;
    }
    
    // Verificar si hay nuevas notificaciones
    const latestNotification = latestNotifications?.[0];
    if (latestNotification && lastNotificationIdRef.current !== latestNotification.id) {
      // Nueva notificación detectada
      playNotificationSound();
      showNotificationToast({
        title: latestNotification.title,
        message: latestNotification.message,
        icon: latestNotification.icon,
        type: latestNotification.type,
      });
      
      lastNotificationIdRef.current = latestNotification.id;
    }
    
    lastCountRef.current = unreadCount;
  }, [user, unreadCount, latestNotifications, playNotificationSound, showNotificationToast]);

  return {
    unreadCount,
    latestNotification: latestNotifications?.[0] || null,
  };
}

export default useRealtimeNotifications;
