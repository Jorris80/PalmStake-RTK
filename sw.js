/* PALMSTAKE RTK ENTERPRISE — Service Worker (offline-first PWA)
 * Shell & pustaka: stale-while-revalidate · Navigasi: network-first → cache
 * Ubin peta berlisensi organisasi (?psoffline=1): cache-first, dibatasi · ubin publik OSM/Esri/OpenTopo: tidak disimpan massal · API Apps Script: selalu jaringan (antrean offline ada di IndexedDB) */
const VERSION = 'psrtk-1.0.1';
const TILES = 'psrtk-tiles';
const TILE_MAX = 6000;
const SHELL = ['./', './index.html', './manifest.json', './icon.svg'];
const CDN = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.9.4/dist/images/layers.png',
  'https://unpkg.com/leaflet@1.9.4/dist/images/layers-2x.png',
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js'
];
const PUBLIC_TILE_HOSTS = /(tile\.openstreetmap\.org|arcgisonline\.com|tile\.opentopomap\.org)$/; // tidak di-cache SW (kebijakan penyedia ubin)
const API_HOSTS = /(script\.google\.com|script\.googleusercontent\.com)$/;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => Promise.all(SHELL.concat(CDN).map((u) => c.add(new Request(u, { cache: 'reload' })).catch(() => null)))));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== TILES).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

async function trimTiles() {
  const c = await caches.open(TILES); const keys = await c.keys();
  if (keys.length > TILE_MAX) await Promise.all(keys.slice(0, keys.length - TILE_MAX).map((k) => c.delete(k)));
}
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (API_HOSTS.test(url.hostname)) return; // data selalu dari jaringan
  if (PUBLIC_TILE_HOSTS.test(url.hostname)) return; // ikuti cache HTTP browser biasa, tanpa penyimpanan massal
  if (url.searchParams.get('psoffline') === '1') { // ubin berlisensi organisasi: boleh offline
    e.respondWith(caches.open(TILES).then(async (c) => {
      const hit = await c.match(req); if (hit) return hit;
      try { const res = await fetch(req); if (res && (res.ok || res.type === 'opaque')) { c.put(req, res.clone()); if (Math.random() < 0.02) trimTiles(); } return res; }
      catch (err) { return new Response('', { status: 504 }); }
    }));
    return;
  }
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => { const cp = res.clone(); caches.open(VERSION).then((c) => c.put('./index.html', cp)); return res; })
      .catch(() => caches.match('./index.html').then((r) => r || caches.match('./'))));
    return;
  }
  e.respondWith(caches.open(VERSION).then(async (c) => {
    const hit = await c.match(req);
    const net = fetch(req).then((res) => { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
