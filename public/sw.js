// Service Worker for Push Notifications

self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(clients.claim());
});

// Handle push notifications
self.addEventListener("push", (event) => {
  console.log("Push notification received:", event);

  if (!event.data) {
    console.log("No data in push event");
    return;
  }

  const data = event.data.json();
  const title = data.title || "FieldSenseAI";
  const options = {
    body: data.body || data.message,
    icon: data.icon || "/icon-192x192.png",
    badge: data.badge || "/icon-192x192.png",
    tag: data.tag || "general",
    data: data.data || {},
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
