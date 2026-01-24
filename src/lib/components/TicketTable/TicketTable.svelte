<script lang="ts">
	import { A, Button, Card, Table, Tbody, Td, Th, Thead, Tr } from '$lib/components';
	import { format } from '$lib/format';
	import { theme } from '$lib/theme';
	import { twMerge } from 'tailwind-merge';
	import Div from '../Div/Div.svelte';
	import { ChevronDown } from '@lucide/svelte';
	import { browser } from '$app/environment';

	// types
	type Props = {
		sortColumnIndex?: number;
		sortDirection?: -1 | 1;
		tickets: Promise<Record<string, any>[]>;
	};

	// helpers
	const ticketFilter = (ticket: Record<string, any>) => {
		if (ticket.date !== +date) return false;
		if (ticket.branch !== physicalInventoryBranchId) return false;

		return true;
	};

	// $props()
	let { sortColumnIndex = $bindable(0), sortDirection = $bindable(1), tickets }: Props = $props();

	// $state
	const columns = $state([
		{
			label: 'Ticket #',
			sortFn: (a: Record<string, any>, b: Record<string, any>) => a.ticketNumber - b.ticketNumber
		},
		{
			label: 'Item #',
			sortFn: (a: Record<string, any>, b: Record<string, any>) =>
				a.itemNumber.localeCompare(b.itemNumber)
		},
		{
			label: 'Total Amount',
			sortFn: (a: Record<string, any>, b: Record<string, any>) => a.ticketNumber - b.ticketNumber
		},
		{
			label: 'UoM',
			sortFn: (a: Record<string, any>, b: Record<string, any>) => a.uom.localeCompare(b.uom)
		},
		{
			label: 'Counter',
			sortFn: (a: Record<string, any>, b: Record<string, any>) =>
				a.counter.username.localeCompare(b.counter.username)
		},
		{
			label: 'Verifier',
			sortFn: (a: Record<string, any>, b: Record<string, any>) =>
				a.verifier.username.localeCompare(b.verifier.username)
		},
		{
			label: 'Created At',
			sortFn: (a: Record<string, any>, b: Record<string, any>) => {
				const aDate = new Date(a.createdAt);
				const bDate = new Date(b.createdAt);

				return aDate.getTime() - bDate.getTime();
			}
		}
	]);
	let date = $state('');
	let physicalInventoryBranchId = $state('');

	// $effects

	$effect(() => {
		if (browser) {
			date = localStorage.getItem('date') ?? '';
			physicalInventoryBranchId = localStorage.getItem('physicalInventoryBranchId') ?? '';
		}
	});
</script>

<Card class="relative mr-auto max-w-full overflow-auto p-0">
	<Table>
		<Thead>
			<Tr>
				{#each columns as { label }, columnIndex}
					<Th
						class={twMerge(
							'sticky top-0 p-0 whitespace-nowrap',
							columnIndex === 0 ? 'left-0 z-10' : undefined
						)}
					>
						<Button
							class={twMerge(
								theme.getComponentVariant('Th', 'default'),
								'flex w-full justify-between space-x-4 rounded-none hover:bg-primary-500/10 focus:bg-primary-500/10'
							)}
							onclick={() => {
								if (sortColumnIndex === columnIndex) sortDirection *= -1;
								if (sortColumnIndex !== columnIndex) {
									sortColumnIndex = columnIndex;
									sortDirection = 1;
								}
							}}
						>
							<Div>
								{label}
							</Div>
							<Div class="w-6">
								{#if columnIndex === sortColumnIndex}
									<ChevronDown
										class={twMerge(
											'transition duration-200',
											sortDirection === -1 ? 'rotate-180' : 'rotate-0'
										)}
									/>
								{/if}
							</Div>
						</Button>
					</Th>
				{/each}
			</Tr>
		</Thead>
		<Tbody>
			{#await tickets}
				<Tr><Td colspan={columns.length}>Loading...</Td></Tr>
			{:then tickets}
				{#each tickets
					.filter(ticketFilter)
					.sort((a, b) => columns[sortColumnIndex].sortFn(a, b) * sortDirection) as ticket}
					<Tr>
						<Td class="sticky left-0 z-10 whitespace-nowrap">
							<A href="/ticket/{ticket.ticketNumber}">
								{ticket.ticketNumber}
							</A>
						</Td>
						<Td class="whitespace-nowrap">
							<A href="/item-number/{ticket.itemNumber}">
								{ticket.itemNumber}
							</A>
						</Td>
						<Td class="text-right whitespace-nowrap">{ticket.totalAmount}</Td>
						<Td class="whitespace-nowrap">{ticket.uom}</Td>
						<Td class="whitespace-nowrap">
							<A href="/counter/{ticket.counter.username}">
								{ticket.counter.username}
							</A>
						</Td>
						<Td class="whitespace-nowrap">
							<A href="/verifier/{ticket.verifier.username}">
								{ticket.verifier.username}
							</A>
						</Td>
						<Td class="whitespace-nowrap">
							{format.date(new Date(ticket.createdAt), {
								locale: 'en-US',
								month: 'numeric',
								day: 'numeric',
								year: '2-digit',
								hour: 'numeric',
								minute: '2-digit',
								second: '2-digit'
							})}
						</Td>
					</Tr>
				{/each}
			{/await}
		</Tbody>
	</Table>
</Card>
