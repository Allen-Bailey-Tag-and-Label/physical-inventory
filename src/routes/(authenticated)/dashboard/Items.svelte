<script lang="ts">
	import { Card, H1, H6 } from '$components';
	import { items } from '$stores';
</script>

<Card class="aspect-square">
	<H6>Total Items</H6>
	<div class="flex flex-grow items-center justify-center">
		<H1>{$items.length}</H1>
	</div>
</Card>
