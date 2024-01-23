<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { Button, Fieldset, Form, Icon, Input } from '$components';
	import { Search } from '$icons';
	import { theme } from 'sveltewind/stores';
	import { goto } from '$app/navigation';

	// handlers
	const submitHandler = (e: CustomEvent) => {
		e.preventDefault();
		goto(`/itemNumber/${itemNumber}`);
	};

	// props (internal)
	let itemNumber = '';
</script>

<div class="flex flex-grow flex-col space-y-6">
	<Form class="flex flex-row items-end space-x-6" on:submit={submitHandler}>
		<Fieldset legend="Item Number">
			<Input bind:value={itemNumber} />
		</Fieldset>
		<Button class={twMerge($theme.buttonIcon)} type="submit">
			<Icon src={Search} />
		</Button>
	</Form>
</div>
