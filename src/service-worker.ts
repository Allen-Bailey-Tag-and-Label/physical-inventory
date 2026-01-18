/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const CACHE = `cache-${version}`;
const PRECACHE_URLS = [...build, ...files];

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE);
			await cache.addAll(PRECACHE_URLS);
			await self.skipWaiting();
		})()
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			// Clear old versioned caches
			const keys = await caches.keys();
			await Promise.all(keys.map((k) => (k === CACHE ? Promise.resolve() : caches.delete(k))));
			await self.clients.claim();
		})()
	);
});

self.addEventListener('fetch', (event) => {
	const request = event.request;
	const url = new URL(request.url);

	// Only handle same-origin GET requests
	if (url.origin !== self.location.origin) return;
	if (request.method !== 'GET') return;

	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE);

			// 1) NETWORK FIRST
			try {
				const response = await fetch(request);

				// 2) On success, update cache (so offline has something later)
				// Only cache basic (same-origin) successful responses.
				if (response.ok && response.type === 'basic') {
					cache.put(request, response.clone());
				}

				return response;
			} catch {
				// 3) If no network, fall back to cache
				const cached = await cache.match(request);
				if (cached) return cached;

				// No offline fallback response/page; let it fail naturally.
				// (Returning a failed fetch keeps behavior consistent with "no offline responses".)
				return fetch(request);
			}
		})()
	);
});
