<script lang="ts">
	import { A, Card, DataTable, Table, Td, Thead } from '$lib/components';
	import { format } from '$lib/format';
	import { items, itemsMap } from '$lib/items/items.svelte';
	import { untrack } from 'svelte';
	import type { PageData } from './$types';

	// types
	type Props = {
		data: PageData;
	};

	// props
	let { data }: Props = $props();

	// $state
	let columns = $state([
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
				const aItem = itemsMap.get(a.itemNumber);
				const bItem = itemsMap.get(b.itemNumber);

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
			label: 'Tickets',
			snippet: NumberSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) =>
				a.tickets.length - b.tickets.length,
			valueFn: (row: Record<string, any>) => row.tickets.length
		},
		{
			label: '07',
			snippet: NumberSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) => a['07'] - b['07'],
			valueFn: (row: Record<string, any>) => row['07']
		},
		{
			label: 'UOM',
			snippet: StringSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) => a.uom.localeCompare(b.uom),
			valueFn: (row: Record<string, any>) => row.uom
		},
		{
			label: 'Count (Pre)',
			snippet: NumberSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) => a.pre.count - b.pre.count,
			valueFn: (row: Record<string, any>) => row.pre.count
		},
		{
			label: 'Count (Post)',
			snippet: NumberSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) => a.post.count - b.post.count,
			valueFn: (row: Record<string, any>) => row.post.count
		},
		{
			label: 'Count (Var.)',
			snippet: NumberSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) => {
				const aValue = a.post.count - a.pre.count;
				const bValue = b.post.count - b.pre.count;
				return aValue - bValue;
			},
			valueFn: (row: Record<string, any>) => row.post.count - row.pre.count
		},
		{
			label: 'Valuation (Pre)',
			snippet: NumberSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) => a.pre.valuation - b.pre.valuation,
			valueFn: (row: Record<string, any>) => format.currency(row.pre.valuation)
		},
		{
			label: 'Valuation (Post)',
			snippet: NumberSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) =>
				a.post.valuation - b.post.valuation,
			valueFn: (row: Record<string, any>) => format.currency(row.post.valuation)
		},
		{
			label: 'Valuation (Var.)',
			snippet: NumberSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) => {
				const aValue = a.post.valuation - a.pre.valuation;
				const bValue = b.post.valuation - b.pre.valuation;
				return aValue - bValue;
			},
			valueFn: (row: Record<string, any>) => format.currency(row.post.valuation - row.pre.valuation)
		},
		{
			label: 'Valuation (Var. Abs.)',
			snippet: NumberSnippet,
			sortFn: (a: Record<string, any>, b: Record<string, any>) => {
				const aValue = Math.abs(a.post.valuation - a.pre.valuation);
				const bValue = Math.abs(b.post.valuation - b.pre.valuation);
				return aValue - bValue;
			},
			valueFn: (row: Record<string, any>) => format.currency(row.post.valuation - row.pre.valuation)
		}
	]);
	let rows: Record<string, any>[] = $state([]);

	// $effects
	$effect(() => {
		untrack(() => {
			rows = [...items]
				.filter((item) => {
					if (+item.branch !== data.branch.number) return false;
					if (item.stockingType === 'O') return false;

					return true;
				})
				.map((row) => {
					const item = itemsMap.get(row.itemNumber);

					if (!item) return row;

					const tickets = data.tickets.filter(
						(ticket: Record<string, any>) => ticket.itemNumber === row.itemNumber
					);

					row.post = {
						count: tickets.reduce(
							(total: number, ticket: Record<string, any>) =>
								total + ticket.totalAmount * item.conversionFactors[ticket.uom],
							0
						)
					};
					row.pre = {
						count: data.precountMap.get(row.itemNumber) ?? 0
					};
					row.post.valuation = row.post.count * row['07'];
					row.pre.valuation = row.pre.count * row['07'];
					row.tickets = tickets;

					return row;
				});
		});
	});
</script>

<DataTable bind:columns bind:data={rows} />

{#snippet ItemNumberSnippet({
	row,
	valueFn
}: {
	row: Record<string, any>;
	valueFn: (row: Record<string, any>) => any;
})}
	<Td class="whitespace-nowrap">
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
