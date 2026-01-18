<script lang="ts">
	import type { Snippet } from 'svelte';
	import './layout.css';
	import type { LayoutData } from './$types';

	// types
	type Props = {
		children: Snippet;
		data: LayoutData;
	};

	// $props
	let { children, data }: Props = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
	<link rel="alternate icon" href="/icons/icon-16x16.png" />
	<link rel="apple-touch-icon" href="/icons/icon-apple-touch.png" />
	<link rel="manifest" href="/manifest.json" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="theme-color" content="#09090C" />
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover"
	/>
	<title>Physical Inventory</title>
</svelte:head>

{@render children()}
