/* ============================================================
   KARRAMNA AGRO — Service Worker (PWA)
   Stratégie :
   - Pages HTML : réseau en priorité, secours sur le cache si hors-ligne
     (contenu à jour quand la connexion est bonne, site quand même
     utilisable en cas de coupure).
   - CSS / JS / icônes / images : cache en priorité (rapide, économise
     la donnée mobile), avec mise à jour en arrière-plan.
   ============================================================ */

const CACHE_VERSION = "karramna-v1";
const APP_SHELL = [
  "./",
  "index.html",
  "catalogue.html",
  "packs.html",
  "panier.html",
  "apropos.html",
  "contact.html",
  "compte.html",
  "professionnels.html",
  "devis.html",
  "css/style.css",
  "js/data.js",
  "js/i18n.js",
  "js/auth.js",
  "js/loyalty.js",
  "js/catalog.js",
  "js/account-page.js",
  "js/main.js",
  "images/logo/logo.svg",
  "icons/favicon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "manifest.json",
  "offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function isHTMLRequest(request) {
  return request.mode === "navigate" || (request.headers.get("accept") || "").includes("text/html");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // ne pas intercepter les ressources externes (ex. images.pexels.com)

  if (isHTMLRequest(request)) {
    // Réseau en priorité pour les pages, secours cache, puis page hors-ligne dédiée
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("offline.html"))
        )
    );
    return;
  }

  // Assets statiques (CSS, JS, images, icônes) : cache en priorité
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
