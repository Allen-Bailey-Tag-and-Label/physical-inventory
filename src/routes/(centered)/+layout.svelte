<script lang="ts">
	import { Main } from '$lib/components';
	import type { Snippet } from 'svelte';

	// types
	type Props = {
		children: Snippet;
	};

	// $props
	let { children }: Props = $props();
</script>

<Main class="flex min-h-screen min-w-screen flex-col items-center justify-center p-6">
	{#if children}
		{@render children()}
	{/if}
</Main>
