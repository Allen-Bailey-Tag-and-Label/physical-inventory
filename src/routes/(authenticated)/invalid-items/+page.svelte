<script lang="ts">
	import { Table, Tbody, Td, Th, Thead, Tr } from '$components';
	import { format } from '$utilities';

	// props (external)
	export let data;
</script>

<div class="flex max-h-full flex-grow flex-col items-start space-y-6">
	<div class="flex max-h-full flex-col overflow-auto">
		<Table>
			<Thead>
				<Th>Item Number</Th>
				<Th class="text-right">Tickets</Th>
				<Th class="text-right">Pre Count</Th>
				<Th class="text-right">After Count</Th>
			</Thead>
			<Tbody>
				{#each Object.keys(data.invalidItems).sort((a, b) => a.localeCompare(b)) as key}
					{@const afterCount = data.invalidItems[key].reduce(
						(total, ticket) => (total += ticket.count),
						0
					)}
					<Tr>
						<Td>
							<a
								class="underline decoration-violet-500 decoration-2 underline-offset-2"
								href="/itemNumber/{encodeURIComponent(key)}"
							>
								{key}
							</a>
						</Td>
						<Td>{data.invalidItems[key].length}</Td>
						<Td class="text-right">{format.integer(0)}</Td>
						<Td class="text-right">{format.integer(afterCount)}</Td>
					</Tr>
				{/each}
			</Tbody>
		</Table>
	</div>
</div>
