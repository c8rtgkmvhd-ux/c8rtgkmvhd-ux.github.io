// Cyclette offline support: always try the network first so updates show up,
// fall back to the saved copy when there is no connection.
const CACHE = "cyclette-v4";
const CORE = ["./", "index.html", "manifest.webmanifest", "config.js", "supabase.js",   "fonts/fredoka-latin-400-normal.woff2", "fonts/fredoka-latin-500-normal.woff2", "fonts/nunito-latin-400-normal.woff2",
  "fonts/nunito-latin-600-normal.woff2", "fonts/nunito-latin-700-normal.woff2", "fonts/nunito-latin-800-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  // let icons and images load straight from the network so the home screen always gets the real file
  if (e.request.destination === "image" || /\.(png|ico|svg)$/.test(url.pathname)) return;
  e.respondWith(
    fetch(e.request).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("index.html")))
  );
});
