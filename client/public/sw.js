// Treevü Push Notification Service Worker
// Maneja notificaciones push y cache offline
const CACHE_NAME = 'treevu-v1';
const OFFLINE_URL = '/offline.html';

// Recursos a cachear para modo offline
const STATIC_ASSETS = [
  '/',
  '/offline.html',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.log('[SW] Some assets failed to cache');
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
    ])
  );
});

// Fetch event - cache strategy for offline support
self.addEventListener('fetch', (event) => {
  // Solo cachear requests GET
  if (event.request.method !== 'GET') return;

  // No cachear requests de API
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return new Response('Offline', { status: 503 });
        });
    })
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);
  
  let data = {
    title: 'Treevü',
    body: 'Tienes una nueva notificación',
    icon: '/logo-192.png',
    badge: '/badge-72.png',
    tag: 'treevu-notification',
    data: {}
  };
  
  try {
    if (event.data) {
      const payload = event.data.json();
      data = {
        title: payload.title || data.title,
        body: payload.body || payload.message || data.body,
        icon: payload.icon || data.icon,
        badge: data.badge,
        tag: payload.tag || `treevu-${Date.now()}`,
        data: {
          url: payload.actionUrl || payload.url || '/',
          type: payload.type || 'general',
          notificationId: payload.notificationId
        },
        actions: payload.actions || [],
        requireInteraction: payload.requireInteraction || false,
        vibrate: [200, 100, 200]
      };
    }
  } catch (e) {
    console.error('[SW] Error parsing push data:', e);
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag,
      data: data.data,
      actions: data.actions,
      requireInteraction: data.requireInteraction,
      vibrate: data.vibrate
    })
  );
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(urlToOpen);
            return;
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Notification close event - track dismissals
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event);
});

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-notifications') {
    console.log('[SW] Syncing notifications...');
  }
});
