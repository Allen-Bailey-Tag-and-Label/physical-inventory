<script lang="ts">
	import { Search, X } from '@lucide/svelte';
	import { twMerge } from 'tailwind-merge';
	import { clickOutside } from '$lib/attachments';
	import { Button, Card, Div, Field, Form, Input, Label, SubmitButton } from '$lib/components';
	import { items } from '$lib/items/items.svelte';
	import { fade } from '$lib/transitions';
	import type { PageData } from './$types';
	import { navigator } from '$lib/navigator';

	// types
	type Props = {
		data: PageData;
	};

	// helpers
	const onsubmit = async (
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) => {
		event.preventDefault();

		let tickets = JSON.parse(localStorage.getItem('tickets') ?? JSON.stringify([]));

		tickets.push({
			ticketNumber,
			itemNumber,
			uom,
			amounts: amounts.map((amount) => +amount),
			totalAmount
		});

		localStorage.setItem('tickets', JSON.stringify(tickets));

		await onsubmitComplete();
	};
	const onsubmitComplete = async () => {
		resetForm();
	};
	const resetForm = async () => {
		amounts = Array(10).fill('');
		itemNumber = '';
		ticketNumber = '';
		uom = '';
	};

	// $props
	let { data }: Props = $props();

	// $state
	let amounts: string[] = $state(Array(10).fill(''));
	let elements: Record<string, HTMLInputElement | null> = $state({
		ticketNumber: null,
		itemNumber: null,
		uom: null
	});
	let isSubmitted = $state(false);
	let itemNumber = $state('');
	let search: {
		close: () => false;
		input: string;
		isVisible: boolean;
		onsubmit: (e: SubmitEvent) => never[] | undefined;
		open: () => true;
		reset: () => void;
		results: Record<string, string>[];
		toggle: () => boolean;
	} = $state({
		close: () => (search.isVisible = false),
		input: '',
		isVisible: false,
		onsubmit: (e: SubmitEvent) => {
			e.preventDefault();

			if (search.input.trim() === '') return (search.results = []);

			const terms = search.input.trim().toLowerCase().split(/\s+/);

			search.results = items
				.filter((item) => {
					if (!terms.length) return true;

					if (item.branch !== data.branch.number.toString()) return false;
					if (item.stockingType === 'O') return false;

					const searchableText = [item.itemNumber, item.description, item.description2]
						.join(' ')
						.toLowerCase();

					return terms.every((term) => searchableText.includes(term));
				})
				.sort((a, b) => a.itemNumber.localeCompare(b.itemNumber));
		},
		open: () => (search.isVisible = true),
		reset: () => {
			search.input = '';
		},
		results: [],
		toggle: () => (search.isVisible = !search.isVisible)
	});
	let ticketNumber = $state('');
	let uom = $state('');

	// $effects
	$effect(() => {});

	// $derived
	const isValidTicketNumber = $derived.by(() => ticketNumber !== '');
	const isValidItemNumber = $derived.by(() => items.some((item) => item.itemNumber === itemNumber));
	const isValidUom = $derived.by(() => uom !== '');
	const totalAmount = $derived.by(() => amounts.reduce((total, amount) => total + +amount, 0));
</script>

<Form
	action="?/ticket"
	bind:isSubmitted
	class="flex grow flex-col space-y-6 overflow-auto md:items-start"
	onsubmit={navigator.online ? undefined : onsubmit}
	{onsubmitComplete}
>
	<Field label="Ticket #">
		<Input
			bind:element={elements.ticketNumber}
			bind:value={ticketNumber}
			class="text-right"
			name="ticketNumber"
			required={true}
			type="number"
			variants={isValidTicketNumber ? undefined : ['error']}
		/>
	</Field>
	<Field label="Item #">
		<Div class="relative w-full md:max-w-[28rem]">
			<Input
				bind:element={elements.itemNumber}
				bind:value={itemNumber}
				class={twMerge('w-full md:min-w-[28rem]')}
				name="itemNumber"
				required={true}
				variants={isValidItemNumber ? undefined : ['error']}
			/>
			<Button
				class="absolute top-0 right-0"
				onclick={search.open}
				tabindex={-1}
				type="button"
				variants={['icon', 'ghost']}
			>
				<Search />
			</Button>
		</Div>
	</Field>
	<Field label="UOM">
		<Input
			bind:element={elements.uom}
			bind:value={uom}
			name="uom"
			required={true}
			variants={isValidUom ? undefined : ['error']}
		/>
	</Field>
	<Div class="grid grid-cols-1 overflow-auto">
		<Label>Amount</Label>
		<Card class="col-span-1 grid grid-cols-subgrid overflow-auto p-0">
			{#each amounts as _, amountIndex}
				<Input
					bind:value={amounts[amountIndex]}
					class={twMerge(
						'col-span-1 rounded-none text-right',
						amountIndex === 0 ? 'rounded-tl-md' : undefined,
						amountIndex === amounts.length - 1 ? 'rounded-bl-md' : undefined
					)}
					name="amount{amountIndex}"
					required={amountIndex === 0 ? true : undefined}
					type="number"
				/>
			{/each}
		</Card>
	</Div>
	<Input value={totalAmount} class="sr-only" name="totalAmount" type="hidden" />
	<SubmitButton bind:isSubmitted>Enter Ticket</SubmitButton>
</Form>

{#if search.isVisible}
	<Div
		class="fixed top-0 left-0 z-200 h-screen w-screen bg-black/70 backdrop-blur"
		transition={(element) => fade(element, { duration: 200 })}
	/>
	<Card
		{@attach clickOutside(search.close)}
		class="fixed top-1/2 left-1/2 z-200 flex max-h-[calc(100vh_-_3rem)] max-w-[calc(100vw_-_3rem)] -translate-x-1/2 -translate-y-1/2 flex-col space-y-6 overflow-auto"
		transition={(element) => fade(element, { duration: 200 })}
	>
		<Form class="flex items-end space-x-4" onsubmit={search.onsubmit}>
			<Field class="grow" label="Search">
				<Div class="relative">
					<Input bind:value={search.input} class="w-full" />
					<Button
						class="absolute top-0 right-0"
						onclick={search.reset}
						tabindex={-1}
						type="button"
						variants={['icon', 'ghost']}
					>
						<X />
					</Button>
				</Div>
			</Field>
			<Button type="submit" variants={['icon']}>
				<Search />
			</Button>
		</Form>
		<Field class="flex grow flex-col overflow-auto" label="Results">
			<Card class="grid grow grid-cols-[repeat(4,_fit-content(0px))] gap-x-4 gap-y-1 overflow-auto">
				<Div class="col-span-4 grid grid-cols-subgrid gap-x-4 gap-y-1">
					<Div />
					<Label>Item #</Label>
					<Label>Description</Label>
					<Label>Description 2</Label>
				</Div>
				<Div
					class="col-span-4 grid grow grid-cols-subgrid items-center gap-x-4 gap-y-1 overflow-auto"
				>
					{#if search.results.length === 0}
						<Div class="col-span-4">No Results</Div>
					{:else}
						{#each search.results as result}
							<Button
								onclick={() => {
									itemNumber = result.itemNumber;

									setTimeout(() => {
										if (elements.uom) elements.uom.focus();
										search.isVisible = false;
									}, 0);
								}}
								type="button">Select</Button
							>
							<Div class="whitespace-nowrap">{result.itemNumber}</Div>
							<Div class="whitespace-nowrap">{result.description}</Div>
							<Div class="whitespace-nowrap">{result.description2}</Div>
						{/each}
					{/if}
				</Div>
			</Card>
		</Field>
		<Div class="grid grid-cols-1 gap-4 md:flex md:justify-end">
			<Button class="whitespace-nowrap" onclick={search.close} variants={['contrast']}
				>Cancel</Button
			>
		</Div>
	</Card>
{/if}
