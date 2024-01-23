<script lang="ts">
	import { Card, H6 } from '$components';

	// props (external)
	export let title = 'Title';
</script>

<Card class="aspect-square">
	<H6>{title}</H6>
	<div class="flex flex-grow items-center justify-center">
		<slot />
	</div>
</Card>
