<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Card, Fieldset, Form, Input, Portal } from '$components';
	import { slide } from '$transitions';

	// props (external)
	export let form;
</script>

<Card>
	<Form use={[enhance]}>
		<Fieldset legend="Username">
			<Input name="username" required="required" />
		</Fieldset>
		<Fieldset legend="Password">
			<Input name="password" required="required" type="password" />
		</Fieldset>
		<Button type="submit">Sign In</Button>
	</Form>
</Card>

<Portal>
	{#if form?.error}
		<div class="fixed bottom-0 right-0 p-6" transition:slide>
			<Card class="bg-red-500 dark:bg-red-500">
				{form.error}
			</Card>
		</div>
	{/if}
</Portal>
