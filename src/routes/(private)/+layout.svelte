<script lang="ts">
	import { Menu, TriangleAlert } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { clickOutside } from '$lib/attachments';
	import { A, Button, Card, Container, Div, Header, Main, Modal, P } from '$lib/components';
	import { fade, fly } from '$lib/transitions';
	import { browser } from '$app/environment';

	// types
	type Props = {
		children: Snippet;
	};

	// $props
	let { children }: Props = $props();

	// $state
	let isAdmin = $state(false);
	let nav = $state({
		adminItems: ['Master Item List'],
		close: () => (nav.isVisible = false),
		isVisible: false,
		userItems: ['Ticket Entry'],
		open: () => (nav.isVisible = true),
		toggle: () => (nav.isVisible = !nav.isVisible)
	});
	let outerWidth = $state(0);
	let signOutIsVisible = $state(false);

	// $derives
	const navItems = $derived.by(() => {
		let items = isAdmin ? [...nav.adminItems, ...nav.userItems] : [...nav.userItems];
		return items
			.sort((a, b) => {
				return a.localeCompare(b);
			})
			.map((label) => ({
				href: `/${label.toLowerCase().replace(' ', '-')}`,
				label
			}));
	});

	// $effects
	$effect(() => {
		if (browser) {
			isAdmin = localStorage.getItem('isAdmin') === 'true';
		}
	});
</script>

<svelte:window bind:outerWidth />

<Div class="flex max-h-screen min-h-screen flex-col overflow-auto md:flex-row-reverse">
	<Main class="flex grow flex-col overflow-auto p-6">
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
		<Div class="flex grow flex-col">
			{#each navItems as { href, label }}
				{@render navItem(href, label)}
			{/each}
		</Div>
		<Button
			class="rounded-none text-left"
			onclick={() => {
				nav.isVisible = false;
				signOutIsVisible = true;
			}}
			variants={['ghost']}>Sign Out</Button
		>
	</Card>
{/if}

{#if signOutIsVisible}
	<Div
		class="fixed top-0 left-0 z-100 h-screen w-screen bg-black/70 backdrop-blur"
		transition={(element) => fade(element, { duration: 200 })}
	/>
	<Card
		{@attach clickOutside(() => (signOutIsVisible = false))}
		class="fixed top-1/2 left-1/2 z-100 flex w-full max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col space-y-6"
		transition={(element) => fade(element, { duration: 200 })}
	>
		<TriangleAlert class="mx-auto h-[5rem] w-[5rem] text-red-500" />
		<P>Are you sure you want to sign out?</P>
		<Div class="grid grid-cols-2 gap-4 md:flex md:justify-end">
			<Button
				class="whitespace-nowrap"
				onclick={() => (signOutIsVisible = false)}
				variants={['contrast']}>Cancel</Button
			>
			<A
				class="text-center whitespace-nowrap"
				href="/sign-out"
				variants={['buttonDefault', 'buttonError']}
			>
				Sign Out
			</A>
		</Div>
	</Card>
{/if}

{#snippet navItem(href: string, label: string)}
	<A class="rounded-none" {href} variants={['buttonDefault', 'buttonGhost']}>
		{label}
	</A>
{/snippet}
