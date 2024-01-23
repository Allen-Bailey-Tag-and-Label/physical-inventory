<script>
	import { Pwa, Title } from 'sveltewind/components';
	import { theme } from '$stores';
	import '../app.pcss';
</script>

<Pwa>
	<link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
	<link rel="alternate icon" href="/icons/icon-16x16.png" />
	<link rel="apple-touch-icon" href="/icons/icon-apple-touch.png" />
	<link rel="manifest" href="/manifest.json" />
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover"
	/>
	<slot name="theme">
		<meta name="theme-color" content="#FFF" />
	</slot>
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</Pwa>
<Title base="Physical Inventory" />
<slot />
