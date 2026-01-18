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
			const keys = await caches.keys();
			await Promise.all(keys.map((k) => (k === CACHE ? Promise.resolve() : caches.delete(k))));
			await self.clients.claim();
		})()
	);
});

async function networkFirst(request: Request, cache: Cache, timeoutMs = 4000) {
	// Try network, but don’t hang forever on flaky connections.
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const response = await fetch(request, { signal: controller.signal });

		// Cache successful same-origin responses so they’re available offline later
		if (response.ok && response.type === 'basic') {
			cache.put(request, response.clone());
		}

		return response;
	} catch {
		const cached = await cache.match(request);
		if (cached) return cached;

		return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
	} finally {
		clearTimeout(timeout);
	}
}

async function cacheFirst(request: Request, cache: Cache) {
	const cached = await cache.match(request);
	if (cached) return cached;

	const response = await fetch(request);

	if (response.ok && response.type === 'basic') {
		cache.put(request, response.clone());
	}
	return response;
}

self.addEventListener('fetch', (event) => {
	const request = event.request;
	const url = new URL(request.url);

	// Only same-origin GET requests
	if (url.origin !== self.location.origin) return;
	if (request.method !== 'GET') return;

	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE);

			// Pages / route navigations: INTERNET FIRST
			if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
				return networkFirst(request, cache, 4000);
			}

			// Static assets (js/css/images/fonts): usually best as CACHE FIRST
			// (change to networkFirst if you truly want everything internet-first)
			const isAsset =
				url.pathname.startsWith('/_app/') ||
				/\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|otf)$/.test(url.pathname);

			if (isAsset) {
				return cacheFirst(request, cache);
			}

			// Default for other same-origin GET (e.g., JSON endpoints): INTERNET FIRST
			return networkFirst(request, cache, 4000);
		})()
	);
});
