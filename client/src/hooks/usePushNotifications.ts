import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: vapidKey } = trpc.notifications.getVapidKey.useQuery();
  const { data: pushStatus, refetch: refetchStatus } = trpc.notifications.getPushStatus.useQuery(undefined, {
    enabled: isSupported,
  });
  
  const subscribeMutation = trpc.notifications.subscribePush.useMutation();
  const unsubscribeMutation = trpc.notifications.unsubscribePush.useMutation();
  const testPushMutation = trpc.notifications.testPush.useMutation();

  // Check if push notifications are supported
  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  // Update subscription status from server
  useEffect(() => {
    if (pushStatus) {
      setIsSubscribed(pushStatus.subscribed);
    }
  }, [pushStatus]);

  // Register service worker
  const registerServiceWorker = useCallback(async (): Promise<ServiceWorkerRegistration | null> => {
    if (!('serviceWorker' in navigator)) return null;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      console.log('[Push] Service worker registered:', registration.scope);
      return registration;
    } catch (error) {
      console.error('[Push] Service worker registration failed:', error);
      return null;
    }
  }, []);

  // Convert VAPID key to Uint8Array
  const urlBase64ToUint8Array = useCallback((base64String: string): Uint8Array<ArrayBuffer> => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const buffer = new ArrayBuffer(rawData.length);
    const outputArray = new Uint8Array(buffer);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }, []);

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !vapidKey?.publicKey) {
      toast.error('Las notificaciones push no están disponibles');
      return false;
    }

    setIsLoading(true);

    try {
      // Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        toast.error('Permiso de notificaciones denegado');
        setIsLoading(false);
        return false;
      }

      // Register service worker
      const registration = await registerServiceWorker();
      if (!registration) {
        toast.error('Error al registrar el service worker');
        setIsLoading(false);
        return false;
      }

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey.publicKey),
      });

      // Send subscription to server
      const p256dhKey = subscription.getKey('p256dh');
      const authKey = subscription.getKey('auth');
      
      if (!p256dhKey || !authKey) {
        toast.error('Error al obtener claves de suscripción');
        setIsLoading(false);
        return false;
      }

      const p256dhArray = Array.from(new Uint8Array(p256dhKey as ArrayBuffer));
      const authArray = Array.from(new Uint8Array(authKey as ArrayBuffer));

      const result = await subscribeMutation.mutateAsync({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode.apply(null, p256dhArray)),
          auth: btoa(String.fromCharCode.apply(null, authArray)),
        },
        userAgent: navigator.userAgent,
      });

      if (result.success) {
        setIsSubscribed(true);
        toast.success('¡Notificaciones push activadas!');
        refetchStatus();
        return true;
      } else {
        toast.error('Error al guardar la suscripción');
        return false;
      }
    } catch (error) {
      console.error('[Push] Subscription error:', error);
      toast.error('Error al activar notificaciones');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, vapidKey, registerServiceWorker, urlBase64ToUint8Array, subscribeMutation, refetchStatus]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe from browser
        await subscription.unsubscribe();

        // Remove from server
        await unsubscribeMutation.mutateAsync({
          endpoint: subscription.endpoint,
        });
      }

      setIsSubscribed(false);
      toast.success('Notificaciones push desactivadas');
      refetchStatus();
      return true;
    } catch (error) {
      console.error('[Push] Unsubscribe error:', error);
      toast.error('Error al desactivar notificaciones');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, unsubscribeMutation, refetchStatus]);

  // Send test notification
  const sendTest = useCallback(async (): Promise<boolean> => {
    if (!isSubscribed) {
      toast.error('Primero activa las notificaciones push');
      return false;
    }

    try {
      const result = await testPushMutation.mutateAsync();
      if (result.success) {
        toast.success('¡Notificación de prueba enviada!');
        return true;
      } else {
        toast.error('Error al enviar notificación de prueba');
        return false;
      }
    } catch (error) {
      console.error('[Push] Test error:', error);
      toast.error('Error al enviar notificación de prueba');
      return false;
    }
  }, [isSubscribed, testPushMutation]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    deviceCount: pushStatus?.deviceCount || 0,
    subscribe,
    unsubscribe,
    sendTest,
  };
}
