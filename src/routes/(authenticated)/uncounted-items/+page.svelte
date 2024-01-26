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
				<Th>Item Number</Th>
				<Th>Description</Th>
				<Th class="text-right">07</Th>
				<Th class="text-right">Pre Count</Th>
				<Th class="text-right">After Count</Th>
				<Th class="text-right">Delta Count</Th>
				<Th class="text-right">Pre Valuation</Th>
				<Th class="text-right">After Valuation</Th>
				<Th class="text-right">Delta Valuation</Th>
			</Thead>
			<Tbody>
				{#each data.uncountedItems.sort( (a, b) => (Math.abs(a.deltaValuation) < Math.abs(b.deltaValuation) ? 1 : Math.abs(a.deltaValuation) > Math.abs(b.deltaValuation) ? -1 : 0) ) as item}
					<Tr>
						<Td>
							<a
								class="underline decoration-violet-500 decoration-2 underline-offset-2"
								href="/itemNumber/{encodeURIComponent(item.itemNumber)}"
							>
								{item.itemNumber}
							</a>
						</Td>
						<Td>{item.description}</Td>
						<Td class="text-right">{item.cost07}</Td>
						<Td class="text-right">{format.integer(item.preCount)}</Td>
						<Td class="text-right">{format.integer(item.afterCount)}</Td>
						<Td class="text-right">{format.integer(item.deltaCount)}</Td>
						<Td class="text-right">{format.currency(item.preValuation)}</Td>
						<Td class="text-right">{format.currency(item.afterValuation)}</Td>
						<Td class="text-right">{format.currency(item.deltaValuation)}</Td>
					</Tr>
				{/each}
			</Tbody>
			<Tfoot>
				<Th colspan="3">Total</Th>
				<Th class="text-right">
					{format.integer(data.uncountedItems.reduce((total, item) => (total += item.preCount), 0))}
				</Th>
				<Th class="text-right">
					{format.integer(
						data.uncountedItems.reduce((total, item) => (total += item.afterCount), 0)
					)}
				</Th>
				<Th class="text-right">
					{format.integer(
						data.uncountedItems.reduce((total, item) => (total += item.deltaCount), 0)
					)}
				</Th>
				<Th class="text-right">
					{format.currency(
						data.uncountedItems.reduce((total, item) => (total += item.preValuation), 0)
					)}
				</Th>
				<Th class="text-right">
					{format.currency(
						data.uncountedItems.reduce((total, item) => (total += item.afterValuation), 0)
					)}
				</Th>
				<Th class="text-right">
					{format.currency(
						data.uncountedItems.reduce((total, item) => (total += item.deltaValuation), 0)
					)}
				</Th>
			</Tfoot>
		</Table>
	</div>
</div>
