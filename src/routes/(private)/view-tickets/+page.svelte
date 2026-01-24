<script lang="ts">
	import { A, Card, Table, Tbody, Td, Th, Thead, Tr } from '$lib/components';
	import { format } from '$lib/format';
	import type { PageData } from './$types';

	// types
	type Props = {
		data: PageData;
	};

	// helpers

	// $props()
	let { data }: Props = $props();

	// $state
	let sortDirection = $state(1);
	let sortKey = $state('ticketNumber');
</script>

<Card class="relative mr-auto max-w-full overflow-auto p-0">
	<Table>
		<Thead>
			<Tr>
				<Th class="sticky top-0 left-0 z-10 whitespace-nowrap">Ticket #</Th>
				<Th class="sticky top-0 whitespace-nowrap">Item #</Th>
				<Th class="sticky top-0 whitespace-nowrap">Total Amount</Th>
				<Th class="sticky top-0 whitespace-nowrap">UoM</Th>
				<Th class="sticky top-0 whitespace-nowrap">Counter</Th>
				<Th class="sticky top-0 whitespace-nowrap">Verifier</Th>
				<Th class="sticky top-0 whitespace-nowrap">Created At</Th>
			</Tr>
		</Thead>
		<Tbody>
			{#await data.tickets}
				<Tr><Td colspan={4}>Loading...</Td></Tr>
			{:then tickets}
				{#each tickets as ticket}
					<Tr>
						<Td class="sticky left-0 z-10 whitespace-nowrap"
							><A href="/ticket/{ticket.ticketNumber}">{ticket.ticketNumber}</A></Td
						>
						<Td class="whitespace-nowrap">{ticket.itemNumber}</Td>
						<Td class="text-right whitespace-nowrap">{ticket.totalAmount}</Td>
						<Td class="whitespace-nowrap">{ticket.uom}</Td>
						<Td class="whitespace-nowrap">{ticket.counter.username}</Td>
						<Td class="whitespace-nowrap">{ticket.verifier.username}</Td>
						<Td class="whitespace-nowrap"
							>{format.date(new Date(ticket.createdAt), {
								locale: 'en-US',
								month: 'numeric',
								day: 'numeric',
								year: '2-digit',
								hour: 'numeric',
								minute: '2-digit',
								second: '2-digit'
							})}</Td
						>
					</Tr>
				{/each}
			{/await}
		</Tbody>
	</Table>
</Card>
