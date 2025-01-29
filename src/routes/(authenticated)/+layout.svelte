<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { twMerge } from 'tailwind-merge';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { Button, Card, Icon, Portal } from '$components';
	import { Menu, X } from '$icons';
	import { isOnline, theme, tickets } from '$stores';
	import { fade } from '$transitions';
	import { objectToFormData } from '$utilities';

	type Route = {
		label: string;
		href: string;
	};
	type Nav = {
		isOpen: boolean;
		routes: {
			admin: Route[];
			all: Route[];
			default: Route[];
		};
		toggle: () => boolean;
	};

	// handlers
	const uploadOfflineTicket = async () => {
		const offlineTicketIndex = $tickets.findIndex((ticket) => ticket.uploaded === false);
		const offlineTicket = { ...$tickets[offlineTicketIndex] };
		delete offlineTicket.uploaded;
		await fetch('/add-ticket', {
			method: 'POST',
			body: objectToFormData(offlineTicket)
		});
		$tickets[offlineTicketIndex].uploaded = true;
	};

	// transition
	const slide = (node: Node, { duration = 200 } = { duration: 200 }) => {
		return {
			duration,
			css: (t: number) => {
				const eased = cubicInOut(t);

				return `
                    transform: translateX(-${(1 - eased) * 100}%)
                `;
			}
		};
	};

	// props (external)
	export let data;

	// props (internal)
	const nav: Nav = {
		isOpen: false,
		routes: {
			admin: [
				{ label: 'Add Initial Count', href: '/add-initial-count' },
				{ label: 'Dashboard', href: '/dashboard' },
				{ label: 'Delete Duplicates', href: '/delete-duplicates' },
				{ label: 'Employees', href: '/employees' },
				{ label: 'Item Number', href: '/itemNumber' },
				{ label: 'Invalid Items', href: '/invalid-items' },
				{ label: 'Settings', href: '/settings' },
				{ label: 'Ticket', href: '/ticket' },
				{ label: 'Tickets', href: '/tickets' },
				{ label: 'Uncounted Items', href: '/uncounted-items' },
				{ label: 'User Management', href: '/user-management' },
				{ label: 'Variances', href: '/variances' }
			],
			all: [],
			default: [{ label: 'Add Ticket', href: '/add-ticket' }]
		},
		toggle: () => (nav.isOpen = !nav.isOpen)
	};

	// props (dynamic)
	$: if (browser) {
		$isOnline = window?.navigator?.onLine;
		window.addEventListener('online', () => {
			$isOnline = true;
		});
		window.addEventListener('offline', () => {
			$isOnline = false;
		});
	}
	$: if ($isOnline && [...$tickets].filter((ticket) => !ticket.uploaded).length > 0)
		uploadOfflineTicket();
	$: nav.routes.all = (
		data?.user?.isAdmin ? [...nav.routes.admin, ...nav.routes.default] : [...nav.routes.default]
	).sort((a, b) => a.label.localeCompare(b.label));
</script>

<div class="flex max-h-[100vh] min-h-[100vh] flex-col">
	<div class="h-[.25rem] {$isOnline ? 'bg-green-500' : 'bg-red-500'}" />
	<div class="relative flex max-h-full flex-grow overflow-auto">
		<Card class="rounded-none p-0">
			<Button
				class={twMerge($theme.buttonTransparent, $theme.buttonIcon, 'z-[1]')}
				on:click={nav.toggle}
			>
				<Icon src={nav.isOpen ? X : Menu} />
			</Button>

			<Portal>
				{#if nav.isOpen}
					<button
						class="fixed left-0 top-0 h-[100vh] w-[100dvw] bg-black/70"
						on:click={nav.toggle}
						transition:fade={{ duration: 200 }}
					/>
					<div class="fixed left-0 top-0" transition:slide>
						<Card class="max-h-[100vh] min-h-[100vh] overflow-y-auto rounded-none p-0 pt-[3rem]">
							<div class="flex flex-grow flex-col">
								{#each nav.routes.all as { label, href }}
									<a
										class={twMerge(
											'px-6 py-3',
											$page.url.pathname === href ? 'bg-violet-500 text-white' : undefined
										)}
										{href}
										on:click={nav.toggle}
									>
										{label}
									</a>
								{/each}
							</div>
							<a class={twMerge('px-6 py-3')} href="/sign-out">Sign Out</a>
						</Card>
					</div>
				{/if}
			</Portal>
		</Card>
		<div class="flex max-h-full flex-grow flex-col p-6">
			<slot />
		</div>
	</div>
</div>
