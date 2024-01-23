<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Fieldset, Form, Textarea } from '$components';
</script>

<Form class="flex-grow " use={[enhance]}>
	<div class="grid flex-grow grid-cols-2 gap-6">
		<Fieldset class="flex-grow" legend="FG">
			<Textarea class="flex-grow resize-none" name="fg" required="required" />
		</Fieldset>
		<Fieldset class="flex-grow" legend="RAW">
			<Textarea class="flex-grow resize-none" name="raw" required="required" />
		</Fieldset>
	</div>
	<Button class="self-end" type="submit">Submit</Button>
</Form>
