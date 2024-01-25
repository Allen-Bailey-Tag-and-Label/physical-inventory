<script lang="ts">
	import { Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '$components';
	import { format } from '$utilities';

	// props (external)
	export let data;
</script>

<div class="flex max-h-full flex-grow flex-col items-start space-y-6">
	<div class="flex max-h-full flex-col overflow-auto">
		<Table>
			<Thead>
				<Th>Employee</Th>
				<Th class="text-right">Tickets Counted</Th>
				<Th class="text-right">Tickets Verified</Th>
				<Th class="text-right">Counted Valuation</Th>
			</Thead>
			<Tbody>
				{#each data.rows as row}
					<Tr>
						<Td>{row.firstName} {row.lastName}</Td>
						<Td class="text-right">{row.counted.length}</Td>
						<Td class="text-right">{row.verified.length}</Td>
						<Td class="text-right">{format.currency(row.countedValuation)}</Td>
					</Tr>
				{/each}
			</Tbody>
			<Tfoot>
				<Th>Total</Th>
				<Th class="text-right"
					>{data.rows.reduce((total, row) => (total += row.counted.length), 0)}</Th
				>
				<Th class="text-right"
					>{data.rows.reduce((total, row) => (total += row.verified.length), 0)}</Th
				>
				<Th class="text-right"
					>{format.currency(
						data.rows.reduce((total, row) => (total += row.countedValuation), 0)
					)}</Th
				>
			</Tfoot>
		</Table>
	</div>
</div>
