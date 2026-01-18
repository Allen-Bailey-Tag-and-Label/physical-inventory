<script lang="ts">
	import { Field, Form, SubmitButton, Textarea } from '$lib/components';

	// $state
	let isSubmitted = $state(false);
</script>

<Form bind:isSubmitted class="flex grow flex-col space-y-6 overflow-auto">
	<Field class="flex grow flex-col" label="CSV">
		<Textarea class="grow resize-none" name="csv" />
	</Field>
	<SubmitButton bind:isSubmitted class="md:ml-auto">Update</SubmitButton>
</Form>
