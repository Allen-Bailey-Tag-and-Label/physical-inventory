<script lang="ts">
	import { DateTime } from 'luxon';
	import { Table, Tbody, Td, Th, Thead, Tr } from '$components';
	import { format } from '$utilities';

	// props (external)
	export let data;
</script>

<div class="flex max-h-full flex-grow flex-col items-start space-y-6">
	<div>{data.user.firstName} {data.user.lastName}</div>
	<div class="flex max-h-full flex-col overflow-auto">
		<Table>
			<Thead>
				<Th class="text-right">Ticket #</Th>
				<Th class="text-right">Date</Th>
				<Th>Counter</Th>
				<Th>Verifier</Th>
				<Th class="text-right">Count</Th>
				<Th class="text-right">Valuation</Th>
			</Thead>
			<Tbody>
				{#each data.tickets as ticket}
					<Tr>
						<Td class="text-right">
							<a
								class="underline decoration-violet-500 decoration-2 underline-offset-2"
								href="/ticket/{encodeURIComponent(ticket.number)}"
							>
								{ticket.number}
							</a>
						</Td>
						<Td class="text-right"
							>{DateTime.fromJSDate(ticket.dateCreated).toFormat('M/d/yy h:mm a')}</Td
						>
						<Td>{ticket.userCount.firstName} {ticket.userCount.lastName}</Td>
						<Td>{ticket.userVerify.firstName} {ticket.userVerify.lastName}</Td>
						<Td class="text-right">{format.integer(ticket.count)}</Td>
						<Td class="text-right">{format.currency(ticket.cost07 * ticket.count)}</Td>
					</Tr>
				{/each}
			</Tbody>
		</Table>
	</div>
</div>
