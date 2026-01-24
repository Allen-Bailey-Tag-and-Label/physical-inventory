<script lang="ts">
	import { browser } from '$app/environment';
	import { Field, Form, Select, SubmitButton } from '$lib/components';
	import type { PageData } from './$types';

	// types
	type Props = {
		data: PageData;
	};

	// helpers
	const onsubmitComplete = () => {
		if (browser) {
			localStorage.setItem('physicalInventoryBranchId', data.physicalInventoryBranchId.value);
		}
	};

	// $props
	let { data }: Props = $props();

	// $state
	let isSubmitted = $state(false);

	// $derives
	const branchOptions = $derived.by(() =>
		data.branches.map((branch: Record<string, any>) => ({
			label: branch.number,
			value: branch._id
		}))
	);
</script>

<Form bind:isSubmitted class="flex flex-col items-start space-y-6" {onsubmitComplete}>
	<Field label="Branch">
		<Select
			bind:value={data.physicalIdBranchId.value}
			name="physicalIdBranchId"
			options={branchOptions}
		/>
	</Field>
	<SubmitButton bind:isSubmitted>Update</SubmitButton>
</Form>
