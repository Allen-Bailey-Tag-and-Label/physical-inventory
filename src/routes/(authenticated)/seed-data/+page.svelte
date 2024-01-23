<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Form } from '$components';

	// props (external)
	export let form;
</script>

<Form use={[enhance]}>
	<Button class="w-[10rem] self-start" type="submit">Seed</Button>
</Form>

{JSON.stringify(form)}
