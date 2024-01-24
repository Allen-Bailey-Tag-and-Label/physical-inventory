<script lang="ts">
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import {
		Button,
		Fieldset,
		Form,
		Icon,
		Input,
		Table,
		Tbody,
		Td,
		Tfoot,
		Th,
		Thead,
		Tr
	} from '$components';
	import { Search } from '$icons';
	import { format } from '$utilities';
	import { theme } from 'sveltewind/stores';
	import { goto } from '$app/navigation';

	// handlers
	const submitHandler = (e: CustomEvent) => {
		e.preventDefault();
		goto(`/itemNumber/${itemNumber}`);
	};

	// props (external)
	export let data;

	// props (internal)
	let itemNumber = '';

	onMount(() => {
		itemNumber = data.item.itemNumber;
	});
</script>

{#if data.item === undefined}
	<div>Could not find item</div>
{:else}
	<div class="flex flex-grow flex-col items-start space-y-6">
		<Form class="flex flex-row items-end space-x-6" on:submit={submitHandler}>
			<Fieldset legend="Item Number">
				<Input bind:value={itemNumber} />
			</Fieldset>
			<Button class={twMerge($theme.buttonIcon)} type="submit">
				<Icon src={Search} />
			</Button>
		</Form>
		<Table>
			<Thead>
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
				<Tr>
					<Td>{data.item.description}</Td>
					<Td class="text-right">{data.item.cost07}</Td>
					<Td class="text-right">{format.integer(data.item.preCount)}</Td>
					<Td class="text-right">{format.integer(data.item.afterCount)}</Td>
					<Td class="text-right">{format.integer(data.item.deltaCount)}</Td>
					<Td class="text-right">{format.currency(data.item.preValuation)}</Td>
					<Td class="text-right">{format.currency(data.item.afterValuation)}</Td>
					<Td class="text-right">{format.currency(data.item.deltaValuation)}</Td>
				</Tr>
			</Tbody>
		</Table>
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
{/if}
