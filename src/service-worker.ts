/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const CACHE = `cache-${version}`;

// What we precache during install (app shell + static assets)
const PRECACHE_URLS = [
	...build, // your built JS/CSS output
	...files // everything in /static
];

// Optional offline fallback (create static/offline.html if you want this)
const OFFLINE_FALLBACK = '/offline.html';

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE);
			await cache.addAll(PRECACHE_URLS);

			// If you add an offline page, precache it too (ignore if it doesn't exist)
			try {
				await cache.add(OFFLINE_FALLBACK);
			} catch {
				// no offline.html, that's fine
			}

			// Activate updated SW immediately
			await self.skipWaiting();
		})()
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			// Remove old caches
			const keys = await caches.keys();
			await Promise.all(
				keys.map((key) => (key !== CACHE ? caches.delete(key) : Promise.resolve()))
			);

			// Take control of clients right away
			await self.clients.claim();
		})()
	);
});

// Offline-first fetch handling
self.addEventListener('fetch', (event) => {
	const req = event.request;
	const url = new URL(req.url);

	// Only handle same-origin requests (avoid breaking 3rd party stuff)
	if (url.origin !== self.location.origin) return;

	// Don't mess with non-GET requests
	if (req.method !== 'GET') return;

	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE);

			// 1) Navigations: try cache first, then network, then offline fallback
			if (req.mode === 'navigate') {
				const cached = await cache.match(req);
				if (cached) return cached;

				try {
					const fresh = await fetch(req);
					// Cache the navigation response so this route works offline next time
					cache.put(req, fresh.clone());
					return fresh;
				} catch {
					// If you created static/offline.html, return it; otherwise last resort:
					return (await cache.match(OFFLINE_FALLBACK)) ?? new Response('Offline', { status: 503 });
				}
			}

			// 2) Everything else (assets / same-origin GET): cache-first, then network
			const cached = await cache.match(req);
			if (cached) return cached;

			try {
				const fresh = await fetch(req);

				// Cache successful basic responses
				if (fresh.ok && fresh.type === 'basic') {
					cache.put(req, fresh.clone());
				}
				return fresh;
			} catch {
				// If it's an image/font/etc you might return a placeholder here if desired
				return new Response('Offline', { status: 503 });
			}
		})()
	);
});
