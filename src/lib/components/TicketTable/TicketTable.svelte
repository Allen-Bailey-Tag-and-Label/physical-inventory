<script lang="ts">
	import { browser } from '$app/environment';
	import { A, Card, DataTable, Td } from '$lib/components';
	import { itemsMap } from '$lib/items/items.svelte';
	import { format } from '$lib/format';

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
			snippet: TicketNumberSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) => a.ticketNumber - b.ticketNumber,
			valueFn: (row: Record<string, any>) => row.ticketNumber
		},
		{
			label: 'Item #',
			snippet: ItemNumberSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) =>
				a.itemNumber.localeCompare(b.itemNumber),
			valueFn: (row: Record<string, any>) => row.itemNumber
		},
		{
			label: 'Description',
			snippet: StringSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) => {
				const aItem = itemsMap.get(b.itemNumber);
				const bItem = itemsMap.get(a.itemNumber);

				if (!aItem || !bItem) return 0;
				return aItem.description.localeCompare(bItem.description);
			},
			valueFn: (row: Record<string, any>) => {
				const item = itemsMap.get(row.itemNumber);
				if (!item) return '';
				return item.description;
			}
		},
		{
			label: 'Total Amount',
			snippet: NumberSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) => {
				const aItem = itemsMap.get(a.itemNumber);
				const bItem = itemsMap.get(b.itemNumber);

				if (!aItem || !bItem) return 0;

				const aValue = a.totalAmount * aItem.conversionFactors[a.uom];
				const bValue = b.totalAmount * bItem.conversionFactors[b.uom];

				return Math.floor(aValue) - Math.floor(bValue);
			},
			valueFn: (row: Record<string, any>) => {
				const item = itemsMap.get(row.itemNumber);

				if (!item) return 0;

				return Math.floor(row.totalAmount * item.conversionFactors[row.uom]);
			}
		},
		{
			label: 'UoM',
			snippet: StringSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) => {
				const aItem = itemsMap.get(a.itemNumber);
				const bItem = itemsMap.get(b.itemNumber);

				if (!aItem || !bItem) return 0;

				return aItem.uom.localeCompare(bItem.uom);
			},
			valueFn: (row: Record<string, any>) => {
				const item = itemsMap.get(row.itemNumber);

				if (!item) return 0;

				return item.uom;
			}
		},
		{
			label: 'Counter',
			snippet: CounterSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) =>
				a.counter.username.localeCompare(b.counter.username),
			valueFn: (row: Record<string, any>) => row.counter.username
		},
		{
			label: 'Verifier',
			snippet: VerifierSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) =>
				a.verifier.username.localeCompare(b.verifier.username),
			valueFn: (row: Record<string, any>) => row.verifier.username
		},
		{
			label: 'Created At',
			snippet: StringSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) => {
				const aDate = new Date(a.createdAt);
				const bDate = new Date(b.createdAt);

				return aDate.getTime() - bDate.getTime();
			},
			valueFn: (row: Record<string, any>) =>
				format.date(new Date(row.createdAt), {
					locale: 'en-US',
					month: 'numeric',
					day: 'numeric',
					year: '2-digit',
					hour: 'numeric',
					minute: '2-digit',
					second: '2-digit'
				})
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

{#await tickets}
	<Card>Loading...</Card>
{:then tickets}
	<DataTable {columns} data={tickets.filter(ticketFilter)} />
{/await}

{#snippet CounterSnippet({
	row,
	valueFn
}: {
	row: Record<string, any>;
	valueFn: (row: Record<string, any>) => any;
})}
	<Td class="whitespace-nowrap">
		<A href="/counter/{row.counter.username}">
			{valueFn(row)}
		</A>
	</Td>
{/snippet}
{#snippet ItemNumberSnippet({
	row,
	valueFn
}: {
	row: Record<string, any>;
	valueFn: (row: Record<string, any>) => any;
})}
	<Td class="text-right whitespace-nowrap">
		<A href="/item-number/{row.itemNumber}">
			{valueFn(row)}
		</A>
	</Td>
{/snippet}
{#snippet NumberSnippet({
	row,
	valueFn
}: {
	row: Record<string, any>;
	valueFn: (row: Record<string, any>) => any;
})}
	<Td class="text-right whitespace-nowrap">
		{valueFn(row)}
	</Td>
{/snippet}
{#snippet StringSnippet({
	row,
	valueFn
}: {
	row: Record<string, any>;
	valueFn: (row: Record<string, any>) => any;
})}
	<Td class="whitespace-nowrap">
		{valueFn(row)}
	</Td>
{/snippet}
{#snippet TicketNumberSnippet({
	row,
	valueFn
}: {
	row: Record<string, any>;
	valueFn: (row: Record<string, any>) => any;
})}
	<Td class="text-right whitespace-nowrap">
		<A href="/ticket/{row.ticketNumber}">
			{valueFn(row)}
		</A>
	</Td>
{/snippet}
{#snippet VerifierSnippet({
	row,
	valueFn
}: {
	row: Record<string, any>;
	valueFn: (row: Record<string, any>) => any;
})}
	<Td class="whitespace-nowrap">
		<A href="/verifier/{row.verifier.username}">
			{valueFn(row)}
		</A>
	</Td>
{/snippet}
