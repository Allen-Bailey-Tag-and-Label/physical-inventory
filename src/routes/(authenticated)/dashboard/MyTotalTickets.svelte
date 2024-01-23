<script lang="ts">
	import { Card, H1, H6 } from '$components';

	// props (external)
	export let data;
</script>

<Card>
	<div class="grid flex-grow grid-cols-2 gap-6">
		<H6 class="text-center">My Counted</H6>
		<H6 class="text-center">My Verified</H6>
		<H1 class="text-center">{data.myCountedTickets.length}</H1>
		<H1 class="text-center">{data.myVerifiedTickets.length}</H1>
	</div>
</Card>
