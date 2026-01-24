import { browser } from '$app/environment';

let navigator = $state({ online: true });

if (browser) {
	window.addEventListener('online', () => (navigator.online = true));
	window.addEventListener('offline', () => (navigator.online = false));
}

export { navigator };
