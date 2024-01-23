<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { goto } from '$app/navigation';
	import {
		Button,
		Fieldset,
		Form,
		Icon,
		Input,
		Modal,
		Select,
		Table,
		Tbody,
		Td,
		Th,
		Thead,
		Tr
	} from '$components';
	import { Check, Search } from '$icons';
	import { isOnline, items, ticket, tickets, theme } from '$stores';
	import { formDataToObject, objectToFormData } from '$utilities';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	// handlers
	const searchHandler = (e: CustomEvent) => {
		e.preventDefault();
		goto(`/ticket/${data.ticket.number}`);
	};
	const submitHandler = async (e: CustomEvent) => {
		e.preventDefault();
		try {
			const body = objectToFormData(data.ticket);
			body.append('dateCreated', Date.now());
			if ($isOnline) {
				await fetch(`/ticket/${data.ticket.number}`, {
					method: 'POST',
					body
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	// props (external)
	export let data;

	// props (internal)
	let itemNumberElem;
	const modal: {
		close?: () => boolean;
		open?: () => boolean;
		isOpen?: boolean;
		toggle?: () => boolean;
	} = {};
	let search = '';

	// props (dynamic)
	$: item = $items.find((obj) => obj.itemNumber === data.ticket.itemNumber);
	$: searchRegExp = `^${search
		.split(/\s/g)
		.map((word) => `(?=.*${word})`)
		.join('')}.*$`;
	$: searchResults =
		search === ''
			? []
			: [...$items].filter(
					(item) =>
						new RegExp(searchRegExp, 'gi').test(item.description) ||
						new RegExp(searchRegExp, 'gi').test(item.itemNumber)
				);

	onMount(() => {
		if (browser) {
			itemNumberElem = document.querySelector('input[name="itemNumber"]');
		}
	});
</script>

<div class="flex flex-col space-y-6">
	<Form class="flex flex-row items-end space-x-6" on:submit={searchHandler}>
		<Fieldset legend="Ticket #">
			<Input bind:value={data.ticket.number} />
		</Fieldset>
		<Button class={twMerge($theme.buttonIcon)} type="submit">
			<Icon src={Search} />
		</Button>
	</Form>

	<Form class="items-start" on:submit={submitHandler}>
		<div class="flex space-x-6">
			<Fieldset legend="Counter">
				<Select bind:value={data.ticket.userCountId} options={data.userOptions} />
			</Fieldset>
			<Fieldset legend="Verifier">
				<Select bind:value={data.ticket.userVerifyId} options={data.userOptions} />
			</Fieldset>
		</div>
		<!-- <Fieldset legend="Ticket #">
			<Input
				bind:value={data.ticket.number}
				class="text-right"
				name="number"
				required="required"
				type="number"
			/>
		</Fieldset> -->
		<div class="flex items-center space-x-6">
			<Fieldset class="relative w-[30rem]" legend="Item #">
				<Input
					bind:value={data.ticket.itemNumber}
					class={twMerge('')}
					name="itemNumber"
					required="required"
				/>
				<Button
					class={twMerge('absolute right-0 top-0', $theme.buttonIcon)}
					on:click={modal.toggle}
					tabindex="-1"
				>
					<Icon src={Search} />
				</Button>
			</Fieldset>
			<Fieldset legend="UOM">
				<div class="flex h-[3rem] items-center space-x-6">
					<div class={twMerge(item !== undefined ? 'text-green-500' : 'text-red-500')}>
						{#if data.ticket.itemNumber !== ''}
							{item === undefined ? 'N/A' : item.uom}
						{/if}
					</div>
				</div>
			</Fieldset>
			<Fieldset legend="Description">
				<div class="flex h-[3rem] items-center space-x-6">
					<div class={twMerge(item !== undefined ? 'text-green-500' : 'text-red-500')}>
						{#if data.ticket.itemNumber !== ''}
							{item === undefined ? 'N/A' : item.description}
						{/if}
					</div>
				</div>
			</Fieldset>
		</div>
		<Fieldset legend="Count">
			<Input
				bind:value={data.ticket.count}
				class="text-right"
				name="count"
				required="required"
				type="number"
			/>
		</Fieldset>
		<Button type="submit">Update</Button>
	</Form>
</div>

<Modal
	bind:close={modal.close}
	bind:open={modal.open}
	bind:isOpen={modal.isOpen}
	bind:toggle={modal.toggle}
>
	<div class="flex flex-col">
		<Fieldset legend="Search">
			<Input bind:value={search} name="search" />
		</Fieldset>
		<div class="mt-6 flex max-h-[75dvh] flex-grow flex-col overflow-auto">
			<Table>
				<Thead>
					<Th></Th>
					<Th>Item #</Th>
					<Th>Description</Th>
					<Th>UOM</Th>
				</Thead>
				<Tbody>
					{#each searchResults as result}
						<Tr>
							<Td class="px-0 py-0">
								<Button
									class={twMerge($theme.buttonIcon, 'px-1 py-1')}
									on:click={() => {
										data.ticket.itemNumber = result.itemNumber;
										search = '';
										modal.close();
									}}
								>
									<Icon src={Check} />
								</Button>
							</Td>
							<Td class="py-0">{result.itemNumber}</Td>
							<Td class="py-0">{result.description}</Td>
							<Td class="py-0">{result.uom}</Td>
						</Tr>
					{/each}
				</Tbody>
			</Table>
		</div>
	</div>
</Modal>
