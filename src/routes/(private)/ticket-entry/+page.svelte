<script lang="ts">
	import { Card, Div, Field, Form, Input, Label, SubmitButton } from '$lib/components';
	import { twMerge } from 'tailwind-merge';
	import type { PageData } from './$types';

	// types
	type Props = {
		data: PageData;
	};

	// $props
	let { data }: Props = $props();

	// $state
	let counts: { amount: string; uom: string }[] = $state(Array(10).fill({ amount: '', uom: '' }));
	let isSubmitted = $state(false);
	let itemNumber = $state('');
	let ticketNumber = $state('');
</script>

<Form bind:isSubmitted class="flex grow flex-col space-y-6 overflow-auto md:items-start">
	<Field label="Ticket #">
		<Input
			bind:value={ticketNumber}
			class="text-right"
			name="ticketNumber"
			required={true}
			type="number"
		/>
	</Field>
	<Field label="Item #">
		<Input bind:value={itemNumber} name="itemNumber" required={true} />
	</Field>
	<Div class="grid grid-cols-2 overflow-auto">
		<Label>Amount</Label>
		<Label>UOM</Label>
		<Card class="col-span-2 grid grid-cols-subgrid overflow-auto p-0">
			{#each counts as _, countIndex}
				<Input
					bind:value={counts[countIndex].amount}
					class={twMerge(
						'col-span-1 rounded-none text-right',
						countIndex === 0 ? 'rounded-tl-md' : undefined,
						countIndex === counts.length - 1 ? 'rounded-bl-md' : undefined
					)}
					name="amount{countIndex}"
					required={countIndex === 0 ? true : undefined}
					type="number"
				/>
				<Input
					bind:value={counts[countIndex].uom}
					class={twMerge(
						'col-span-1 rounded-none',
						countIndex === 0 ? 'rounded-tr-md' : undefined,
						countIndex === counts.length - 1 ? 'rounded-br-md' : undefined
					)}
					name="uom{countIndex}"
					required={countIndex === 0 ? true : undefined}
				/>
			{/each}
		</Card>
	</Div>
	<SubmitButton bind:isSubmitted>Enter Ticket</SubmitButton>
</Form>
