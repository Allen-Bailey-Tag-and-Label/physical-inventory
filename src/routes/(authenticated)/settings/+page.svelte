<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Fieldset, Form, Input } from '$components';

	export let data;
</script>

<Form class="items-start" use={[enhance]}>
	<Fieldset legend="Inventory Date">
		<Input name="inventoryDate" value={data.inventoryDate} type="date" />
	</Fieldset>
	<Button type="submit">Update</Button>
</Form>
