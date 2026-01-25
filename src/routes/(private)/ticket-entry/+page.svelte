<script lang="ts">
	import { Search as SearchIcon, X } from '@lucide/svelte';
	import { untrack } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { browser } from '$app/environment';
	import { clickOutside } from '$lib/attachments';
	import {
		Button,
		Card,
		Div,
		Field,
		Form,
		Input,
		Label,
		Select,
		SubmitButton
	} from '$lib/components';
	import { items, itemsMap } from '$lib/items/items.svelte';
	import { navigator } from '$lib/navigator';
	import { theme } from '$lib/theme';
	import { fade } from '$lib/transitions';
	import type { PageData } from './$types';

	// types
	type Props = {
		buttonText: string;
		data: PageData;
		onsubmitComplete: () => void;
		operation: 'enter' | 'update';
		ticketInfo: {
			amounts: string[];
			itemNumber: string;
			ticketNumber: string;
			uom: string;
		};
	};
	type Search = {
		close: () => false;
		input: string;
		isVisible: boolean;
		onsubmit: (e: SubmitEvent) => Record<string, any>[] | undefined;
		open: () => true;
		reset: () => void;
		results: Record<string, any>[];
		toggle: () => boolean;
	};
	type Ticket = {
		amount0: string;
		amount1: string;
		amount2: string;
		amount3: string;
		amount4: string;
		amount5: string;
		amount6: string;
		amount7: string;
		amount8: string;
		amount9: string;
		physicalInventoryBranchId: string;
		counter: string;
		date: string;
		itemNumber: string;
		ticketNumber: string;
		totalAmount: number;
		uom: string;
		verifier: string;
	};

	// helpers
	const onsubmit = async (
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) => {
		event.preventDefault();

		let tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') ?? JSON.stringify([]));

		tickets.push({
			amount0: amounts[0],
			amount1: amounts[1],
			amount2: amounts[2],
			amount3: amounts[3],
			amount4: amounts[4],
			amount5: amounts[5],
			amount6: amounts[6],
			amount7: amounts[7],
			amount8: amounts[8],
			amount9: amounts[9],
			physicalInventoryBranchId,
			counter,
			date,
			itemNumber,
			ticketNumber,
			totalAmount,
			uom,
			verifier
		});

		localStorage.setItem('tickets', JSON.stringify(tickets));

		await onsubmitComplete();
	};
	const resetForm = async () => {
		amounts = Array(10).fill('');
		itemNumber = '';
		ticketNumber = '';
		uom = '';
	};
	const submitLocalTickets = async (tickets: Ticket[]) => {
		const body = new FormData();
		body.append('tickets', JSON.stringify(tickets));

		await fetch('?/tickets', {
			body,
			method: 'POST'
		});

		localStorage.setItem('tickets', JSON.stringify([]));
	};

	// $props
	let {
		buttonText = $bindable('Enter Ticket'),
		data,
		onsubmitComplete = $bindable(async () => {
			resetForm();
			elements.ticketNumber?.focus();
		}),
		operation = $bindable('enter'),
		ticketInfo = $bindable({
			amounts: Array(10).fill(''),
			itemNumber: '',
			ticketNumber: '',
			uom: ''
		})
	}: Props = $props();

	// $state
	let amounts = $state(Array(10).fill(''));
	let counter = $state('');
	let date = $state('');
	let elements: {
		ticketNumber: HTMLInputElement | null;
		itemNumber: HTMLInputElement | null;
		uom: HTMLSelectElement | null;
	} = $state({
		ticketNumber: null,
		itemNumber: null,
		uom: null
	});
	let isAdmin = $state(false);
	let isSubmitted = $state(false);
	let item: Record<string, any> | undefined = $state(undefined);
	let itemNumber = $state('');
	let physicalInventoryBranchId = $state('');
	let search: Search = $state({
		close: () => (search.isVisible = false),
		input: '',
		isVisible: false,
		onsubmit: (e: SubmitEvent) => {
			e.preventDefault();

			if (search.input.trim() === '') return (search.results = []);

			const terms = search.input.trim().toLowerCase().split(/\s+/);

			search.results = branchItems
				.filter((item) => {
					if (!terms.length) return true;

					const searchableText = [item.itemNumber, item.description, item.description2]
						.join(' ')
						.toLowerCase();

					return terms.every((term) => searchableText.includes(term));
				})
				.sort((a, b) => a.itemNumber.localeCompare(b.itemNumber));
		},
		open: () => {
			search.isVisible = true;
		},
		reset: () => {
			search.input = '';
		},
		results: [],
		toggle: () => (search.isVisible = !search.isVisible)
	});
	let ticketNumber = $state('');
	let uom = $state('');
	let verifier = $state('');

	// $derived
	const branchItems = $derived.by(() =>
		items
			.filter((item) => {
				if (item.branch !== data.branch.number.toString()) return false;
				if (item.stockingType === 'O') return false;

				return true;
			})
			.sort((a, b) => a.itemNumber.localeCompare(b.itemNumber))
	);
	const conversionFactor = $derived.by(() => {
		if (item === undefined) return 1;
		return item.conversionFactors[uom] ?? 1;
	});
	// const item = $derived.by(() => items.find((i) => i.itemNumber === itemNumber));
	const itemUoms = $derived.by(() => {
		if (item === undefined) return [];
		return Object.keys(item.conversionFactors);
	});
	const isUomPrimary = $derived.by(() => {
		if (item === undefined) return true;
		if (item.uom === uom) return true;
		return false;
	});
	const isValidTicketNumber = $derived.by(() => ticketNumber !== '');
	const isValidItemNumber = $derived.by(() => item !== undefined);
	const isValidUom = $derived.by(() => uom !== '');
	const isValidAmount = $derived.by(() => amounts[0] !== '');
	const uomOptions = $derived.by(() => [
		{ label: '', value: '' },
		...itemUoms.map((label) => ({ label, value: label }))
	]);
	const totalAmount = $derived.by(() => amounts.reduce((total, amount) => total + +amount, 0));

	// $effects
	$effect(() => {
		if (JSON.stringify(ticketInfo)) {
			untrack(() => {
				amounts = [...ticketInfo.amounts];
				itemNumber = ticketInfo.itemNumber;
				ticketNumber = ticketInfo.ticketNumber;
				uom = ticketInfo.uom;
			});
		}
	});
	$effect(() => {
		if (browser) {
			counter = localStorage.getItem('counter') ?? '';
			date = localStorage.getItem('date') ?? '';
			physicalInventoryBranchId = localStorage.getItem('physicalInventoryBranchId') ?? '';
			verifier = localStorage.getItem('verifier') ?? '';
		}
	});
	$effect(() => {
		if (navigator.online && browser) {
			const tickets = JSON.parse(localStorage.getItem('tickets') ?? JSON.stringify([]));

			if (tickets.length > 0) submitLocalTickets(tickets);
		}
	});
	$effect(() => {
		if (browser) {
			isAdmin = (localStorage.getItem('isAdmin') ?? 'false') === 'true';
		}
	});
	$effect(() => {
		if (itemUoms.length === 0) uom = '';
		if (itemUoms.length === 1) uom = itemUoms[0];
	});
	$effect(() => {
		item = itemsMap.get(itemNumber);
	});
</script>

{#if !isAdmin || operation === 'update'}
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
					<SearchIcon />
				</Button>
			</Div>
		</Field>
		<Div class="flex space-x-4">
			<Field label="UOM">
				<Select
					bind:element={elements.uom}
					bind:value={uom}
					options={uomOptions}
					name="uom"
					required={true}
					variants={isValidUom ? undefined : ['error']}
				/>
			</Field>
			<Field label="Primary UOM">
				<Div
					class={twMerge(
						theme.getComponentVariant('Input', 'default'),
						'bg-transparent px-0 shadow-none inset-ring-0 dark:bg-transparent dark:shadow-none'
					)}
				>
					{item?.uom ?? ' '}
				</Div>
			</Field>
		</Div>
		<Div class="grid grid-cols-2 overflow-auto">
			<Label>{uom === '' ? '' : `${uom} `}Amount</Label>
			<Label>Primary Amount</Label>
			<Card class="col-span-2 grid grid-cols-subgrid overflow-auto p-0">
				{#each amounts as _, amountIndex}
					{@const primaryAmount = amounts[amountIndex] * conversionFactor}
					<Input
						bind:value={amounts[amountIndex]}
						class={twMerge(
							'col-span-1 rounded-none text-right',
							amountIndex === 0 ? 'rounded-tl-md' : undefined,
							amountIndex === amounts.length - 1 ? 'rounded-bl-md' : undefined
						)}
						name="amount{amountIndex}"
						required={amountIndex === 0 ? true : undefined}
						step="1"
						type="number"
						variants={!isValidAmount && amountIndex === 0 ? ['error'] : undefined}
					/>
					<Div
						class={twMerge(
							theme.getComponentVariant('Input', 'default'),
							'col-span-1 rounded-none text-right',
							amountIndex === 0 ? 'rounded-tr-md' : undefined,
							amountIndex === amounts.length - 1 ? 'rounded-br-md' : undefined
						)}
					>
						{#if amounts[amountIndex] !== ''}
							{primaryAmount}
						{/if}
					</Div>
				{/each}
			</Card>
			<Div
				class={twMerge(
					theme.getComponentVariant('Input', 'default'),
					'flex justify-between rounded-none bg-transparent px-0 inset-ring-0 dark:bg-transparent'
				)}
			>
				<Div class="font-semibold">Total:</Div>
				<Div>{totalAmount}</Div>
			</Div>
			<Div
				class={twMerge(
					theme.getComponentVariant('Input', 'default'),
					'rounded-none bg-transparent px-0 text-right inset-ring-0 dark:bg-transparent'
				)}
			>
				{totalAmount * conversionFactor}
			</Div>
		</Div>
		<Input value={counter} class="sr-only" name="counter" type="hidden" />
		<Input value={date} class="sr-only" name="date" type="hidden" />
		<Input
			value={physicalInventoryBranchId}
			class="sr-only"
			name="physicalInventoryBranchId"
			type="hidden"
		/>
		<Input value={totalAmount} class="sr-only" name="totalAmount" type="hidden" />
		<Input value={verifier} class="sr-only" name="verifier" type="hidden" />
		<SubmitButton bind:isSubmitted>{buttonText}</SubmitButton>
	</Form>
{:else}
	You're currently logged in as an admin and cannot enter tickets
{/if}

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
				<SearchIcon />
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
