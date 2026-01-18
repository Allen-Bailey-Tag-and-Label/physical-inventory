<script lang="ts">
	import { Card, Div, Field, Form, Input, SubmitButton } from '$lib/components';
	import { slide } from '$lib/transitions';

	// $state
	let error = $state(null);
	let isSubmitted = $state(false);
</script>

<Card class="w-full max-w-sm">
	<Form bind:error bind:isSubmitted class="flex flex-col space-y-6">
		<Field label="Username">
			<Input name="username" required={true} />
		</Field>
		<Field label="Password">
			<Input name="password" required={true} type="password" />
		</Field>
		{#if error !== null}
			<Div class="text-red-500" transition={slide}>
				{error}
			</Div>
		{/if}
		<SubmitButton bind:isSubmitted>Sign In</SubmitButton>
	</Form>
</Card>
