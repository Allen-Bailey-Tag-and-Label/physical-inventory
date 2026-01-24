<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Div } from '$lib/components';
	import './layout.css';
	import { navigator } from '$lib/navigator';
	import { twMerge } from 'tailwind-merge';

	// types
	type Props = {
		children: Snippet;
	};

	// $props
	let { children }: Props = $props();
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

<Div
	class={twMerge(
		'pointer-events-none fixed top-0 left-0 z-200 h-1 w-full',
		navigator.online ? 'bg-green-500' : 'bg-red-500'
	)}
/>
{@render children()}
