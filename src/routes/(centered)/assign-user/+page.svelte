<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import {
		A,
		Button,
		Card,
		Div,
		Field,
		Form,
		Input,
		Select,
		Spinner,
		SubmitButton
	} from '$lib/components';
	import { slide } from '$lib/transitions';
	import type { PageData } from './$types';

	// types
	type Props = {
		data: PageData;
	};

	// helpers
	const onAdminClick = async () => {
		localStorage.removeItem('counter');
		localStorage.setItem('isAdmin', 'true');
		localStorage.removeItem('verifier');

		goto('/admin');
	};
	const onsubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		localStorage.setItem('counter', counter);
		localStorage.setItem('isAdmin', 'false');
		localStorage.setItem('verifier', verifier);

		goto('/ticket-entry');
	};

	// $props
	let { data }: Props = $props();

	// $state
	let counter = $state('');
	let error = $state(null);
	let isSubmitted = $state(false);
	let verifier = $state('');
</script>

<Card class="w-full max-w-sm">
	{#await data.users}
		<Spinner />
	{:then users}
		<Form bind:error bind:isSubmitted class="flex flex-col space-y-6" {onsubmit}>
			<Field label="Counter">
				<Select
					bind:value={counter}
					options={[
						{ label: '', value: '' },
						...users.map((user) => ({ label: user.username, value: user._id }))
					]}
					name="counter"
					required={true}
				/>
			</Field>
			<Field label="Verifier">
				<Select
					bind:value={verifier}
					options={[
						{ label: '', value: '' },
						...users.map((user) => ({ label: user.username, value: user._id }))
					]}
					name="verifier"
					required={true}
				/>
			</Field>
			{#if error !== null}
				<Div class="text-red-500" transition={slide}>
					{error}
				</Div>
			{/if}
			<Div class="grid grid-cols-2 gap-4 md:flex md:justify-end">
				<Button onclick={onAdminClick} type="button" variants={['contrast']}>Admin</Button>
				<SubmitButton bind:isSubmitted>Assign</SubmitButton>
			</Div>
		</Form>
	{/await}
</Card>
