/// <reference lib="WebWorker" />

import { cacheNames } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

const IMAGE_CACHE = 'pt-images-2026-04-14-10';
const GOOGLE_FONTS_CACHE = 'pt-google-fonts-2026-04-14-10';
const GSTATIC_FONTS_CACHE = 'pt-gstatic-fonts-2026-04-14-10';
const ALLOWED_CACHES = new Set([cacheNames.precache, IMAGE_CACHE, GOOGLE_FONTS_CACHE, GSTATIC_FONTS_CACHE]);

// Auto-activate new service workers immediately so fresh builds always land.
self.addEventListener('install', () => {
  self.skipWaiting();
});

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheKeys = await caches.keys();
    await Promise.all(
      cacheKeys.map((key) => (ALLOWED_CACHES.has(key) ? Promise.resolve(false) : caches.delete(key))),
    );

    await self.clients.claim();
  })());
});

registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    denylist: [/^\/api\//],
  }),
);

registerRoute(
  ({ request, sameOrigin }) => sameOrigin && request.destination === 'image',
  new CacheFirst({
    cacheName: IMAGE_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new CacheFirst({
    cacheName: GOOGLE_FONTS_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: GSTATIC_FONTS_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
);
