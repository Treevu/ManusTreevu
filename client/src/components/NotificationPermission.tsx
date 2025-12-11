import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PERMISSION_ASKED_KEY = 'treevu_notification_permission_asked';

interface NotificationPermissionProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export function NotificationPermission({ 
  onPermissionGranted, 
  onPermissionDenied 
}: NotificationPermissionProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      setPermission('unsupported');
      return;
    }

    // Check current permission
    setPermission(Notification.permission);

    // Show prompt if not asked before and permission is default
    const asked = localStorage.getItem(PERMISSION_ASKED_KEY);
    if (!asked && Notification.permission === 'default') {
      // Delay showing the prompt
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      localStorage.setItem(PERMISSION_ASKED_KEY, 'true');
      setShowPrompt(false);

      if (result === 'granted') {
        toast.success('¡Notificaciones activadas!', {
          description: 'Te avisaremos sobre cambios importantes en tu FWI y nuevas ofertas.',
        });
        onPermissionGranted?.();
        
        // Register service worker for push
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          console.log('Service Worker ready for push notifications');
        }
      } else {
        onPermissionDenied?.();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Error al solicitar permisos');
    }
  };

  const dismissPrompt = () => {
    localStorage.setItem(PERMISSION_ASKED_KEY, 'true');
    setShowPrompt(false);
  };

  if (permission === 'unsupported' || permission === 'granted' || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-gradient-to-b from-treevu-surface to-treevu-bg border border-white/10 rounded-2xl shadow-2xl p-5">
            {/* Close button */}
            <button
              onClick={dismissPrompt}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>

            {/* Icon */}
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{ 
                  duration: 0.5, 
                  repeat: Infinity, 
                  repeatDelay: 3 
                }}
                className="w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center"
              >
                <Bell className="h-6 w-6 text-brand-primary" />
              </motion.div>
              <div>
                <h3 className="text-white font-semibold">Activa las notificaciones</h3>
                <p className="text-gray-400 text-sm">No te pierdas nada importante</p>
              </div>
            </div>

            {/* Benefits */}
            <ul className="space-y-2 mb-4 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-primary" />
                Alertas de cambios en tu FWI Score
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-primary" />
                Nuevas ofertas y descuentos exclusivos
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-primary" />
                Recordatorios de metas financieras
              </li>
            </ul>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissPrompt}
                className="flex-1 text-gray-400 hover:text-white"
              >
                <BellOff className="h-4 w-4 mr-2" />
                Ahora no
              </Button>
              <Button
                size="sm"
                onClick={requestPermission}
                className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
              >
                <Bell className="h-4 w-4 mr-2" />
                Activar
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook para enviar notificaciones push locales
 */
export function usePushNotification() {
  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return false;
    }

    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  };

  const notifyFWIChange = (oldScore: number, newScore: number) => {
    const diff = newScore - oldScore;
    const emoji = diff > 0 ? '📈' : '📉';
    const message = diff > 0 
      ? `¡Tu FWI subió ${diff} puntos!` 
      : `Tu FWI bajó ${Math.abs(diff)} puntos`;
    
    sendNotification(`${emoji} ${message}`, {
      body: `Tu nuevo score es ${newScore}/100`,
      tag: 'fwi-change',
    });
  };

  const notifyNewOffer = (offerName: string, points: number) => {
    sendNotification('🎁 Nueva oferta disponible', {
      body: `${offerName} por solo ${points} TreePoints`,
      tag: 'new-offer',
    });
  };

  const notifyGoalProgress = (goalName: string, progress: number) => {
    if (progress >= 100) {
      sendNotification('🎉 ¡Meta completada!', {
        body: `Has completado "${goalName}". ¡Felicitaciones!`,
        tag: 'goal-complete',
      });
    } else if (progress >= 75) {
      sendNotification('💪 ¡Casi lo logras!', {
        body: `Estás al ${progress}% de tu meta "${goalName}"`,
        tag: 'goal-progress',
      });
    }
  };

  return { sendNotification, notifyFWIChange, notifyNewOffer, notifyGoalProgress };
}

export default NotificationPermission;
