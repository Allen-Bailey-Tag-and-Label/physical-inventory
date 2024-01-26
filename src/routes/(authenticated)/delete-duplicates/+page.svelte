<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Form } from '$components';
</script>

<Form class="items-start" use={[enhance]}>
	<Button type="submit">Delete</Button>
</Form>
