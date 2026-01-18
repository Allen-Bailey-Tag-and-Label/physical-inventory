<script lang="ts">
	import { Menu } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { clickOutside } from '$lib/attachments';
	import { A, Button, Card, Container, Div, Header, Main, Sheet } from '$lib/components';
	import { fade, fly } from '$lib/transitions';

	// types
	type Props = {
		children: Snippet;
	};

	// $props
	let { children }: Props = $props();

	// $state
	let outerWidth = $state(0);
	let nav = $state({
		close: () => (nav.isVisible = false),
		isVisible: false,
		open: () => (nav.isVisible = true),
		toggle: () => (nav.isVisible = !nav.isVisible)
	});
</script>

<svelte:window bind:outerWidth />

<Div class="flex max-h-screen min-h-screen flex-col overflow-auto md:flex-row-reverse">
	<Main class="flex grow flex-col p-6">
		{#if children}
			{@render children()}
		{/if}
	</Main>
	<Header>
		<Container class="md:px-0">
			<Div class="flex justify-end">
				<Button onclick={nav.open} variants={['icon', 'ghost']}>
					<Menu />
				</Button>
			</Div>
		</Container>
	</Header>
</Div>

{#if nav.isVisible}
	<Div
		class="fixed top-0 left-0 z-100 h-screen w-screen bg-black/70 backdrop-blur"
		transition={(element) => fade(element, { duration: 200 })}
	/>
	<Card
		{@attach clickOutside(nav.close)}
		class="fixed top-0 right-0 z-100 flex max-h-screen min-h-screen min-w-[calc(100vw_-_3rem)] flex-col overflow-auto rounded-none px-0 md:right-auto md:left-0 md:min-w-auto"
		transition={(element) =>
			fly(element, { duration: 200, opacity: 1, x: outerWidth < 768 ? '100%' : '-100%' })}
	>
		<A class="rounded-none" href="/sign-out" variants={['buttonDefault', 'buttonGhost']}>
			Sign Out
		</A>
	</Card>
{/if}
