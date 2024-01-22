<script lang="ts">
	import { twMerge } from 'tailwind-merge';
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
	import { Check, Search, X } from '$icons';
	import { items, ticket, theme } from '$stores';

	// handlers
	const submitHandler = (e: CustomEvent) => {
		e.preventDefault();
		$ticket.count = '';
		$ticket.itemNumber = '';
		$ticket.number = (+$ticket.number + 1).toString();
	};

	// props (external)
	export let data;

	// props (internal)
	const modal: {
		close?: () => boolean;
		open?: () => boolean;
		isOpen?: boolean;
		toggle?: () => boolean;
	} = {};
	let search = '';

	// props (dynamic)
	$: item = $items.find((obj) => obj.itemNumber === $ticket.itemNumber);
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
</script>

<Form class="items-start" on:submit={submitHandler}>
	<div class="flex space-x-6">
		<Fieldset legend="Counter">
			<Select bind:value={$ticket.userCountId} options={data.userOptions} />
		</Fieldset>
		<Fieldset legend="Verifier">
			<Select bind:value={$ticket.userVerifytId} options={data.userOptions} />
		</Fieldset>
	</div>
	<Fieldset legend="Ticket #">
		<Input
			bind:value={$ticket.number}
			class="text-right"
			name="number"
			required="required"
			type="number"
		/>
	</Fieldset>
	<div class="grid w-full grid-cols-2 gap-6">
		<Fieldset class="relative" legend="Item #">
			<Input
				bind:value={$ticket.itemNumber}
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
		<Fieldset legend="Item Description">
			<div class="flex h-[3rem] items-center space-x-6">
				<div class={twMerge(item !== undefined ? 'text-green-500' : 'text-red-500')}>
					{#if $ticket.itemNumber !== ''}
						{item === undefined ? 'N/A' : item.description}
					{/if}
				</div>
			</div>
		</Fieldset>
	</div>
	<Fieldset legend="Count">
		<Input
			bind:value={$ticket.count}
			class="text-right"
			name="count"
			required="required"
			type="number"
		/>
	</Fieldset>
	<Button type="submit">Add</Button>
</Form>

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
										$ticket.itemNumber = result.itemNumber;
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
