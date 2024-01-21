<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Card, Checkbox, Fieldset, Form, Input, Portal } from '$components';

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
		<Fieldset legend="First Name">
			<Input name="firstName" required="required" />
		</Fieldset>
		<Fieldset legend="Last Name">
			<Input name="lastName" required="required" />
		</Fieldset>
		<Fieldset legend="Is Admin?">
			<Checkbox name="isAdmin" required="required" />
		</Fieldset>
		<Button type="submit">Register</Button>
	</Form>
</Card>

<Portal>
	{#if form?.success}
		<div class="fixed bottom-0 right-0 p-6">
			<Card>Successfully created username "{form?.username}"</Card>
		</div>
	{/if}
</Portal>
