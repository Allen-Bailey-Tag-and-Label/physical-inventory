<script lang="ts">
	import { browser } from '$app/environment';
	import { Div, Field, Form, Input, SubmitButton, Textarea } from '$lib/components';

	// $state
	let date = $state('');
	let isSubmitted = $state(false);
	let physicalInventoryBranchId = $state('');

	// $effects
	$effect(() => {
		if (browser) {
			date = localStorage.getItem('date') ?? '';
			physicalInventoryBranchId = localStorage.getItem('physicalInventoryBranchId') ?? '';
		}
	});
</script>

<Form bind:isSubmitted class="flex grow flex-col space-y-6">
	<Div class="grid grow grid-cols-1 gap-4">
		<Field class="grow" label="CSV">
			<Textarea class="grow" name="csv" required={true}></Textarea>
		</Field>
	</Div>
	<Input value={date} class="sr-only" name="date" type="hidden" />
	<Input
		value={physicalInventoryBranchId}
		class="sr-only"
		name="physicalInventoryBranchId"
		type="hidden"
	/>
	<SubmitButton bind:isSubmitted class="md:ml-auto">Update</SubmitButton>
</Form>
