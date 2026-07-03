const CACHE_NAME = "e-housing-v158";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=158",
  "./app.js?v=158",
  "./manifest.webmanifest?v=158",
  "./favicon.ico",
  "./favicon-16.png",
  "./favicon-32.png",
  "./logo-e-housing.png",
  "./default-user-photo.png",
  "./default-user-photo-192.png",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./assets/cartoon/cartoon-background.webp",
  "./assets/cartoon/cartoon-header-banner.webp",
  "./assets/cartoon/cartoon-owner-overview-banner.webp",
  "./assets/cartoon/logo-e-housing-cartoon.png?v=158",
  "./assets/cartoon/icon-overview.png?v=158",
  "./assets/cartoon/icon-documents.png?v=158",
  "./assets/cartoon/icon-documentHistory.png?v=158",
  "./assets/cartoon/icon-votes.png?v=158",
  "./assets/cartoon/icon-billing.png?v=158",
  "./assets/cartoon/icon-executions.png?v=158",
  "./assets/cartoon/icon-finance.png?v=158",
  "./assets/cartoon/icon-messages.png?v=158",
  "./assets/cartoon/icon-calendar.png?v=158",
  "./assets/cartoon/icon-activities.png?v=158",
  "./assets/cartoon/icon-photoAlbum.png?v=158",
  "./assets/cartoon/icon-owners.png?v=158",
  "./assets/cartoon/icon-emails.png?v=158",
  "./assets/cartoon/icon-logs.png?v=158",
  "./assets/cartoon/icon-settings.png?v=158",
  "./assets/cartoon/icon-profile.png?v=158",
  "./assets/cartoon/icon-pwa.png?v=158",
  "./assets/cartoon/icon-info.png?v=158"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("./index.html")));
    return;
  }

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "./";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
      return undefined;
    })
  );
});
