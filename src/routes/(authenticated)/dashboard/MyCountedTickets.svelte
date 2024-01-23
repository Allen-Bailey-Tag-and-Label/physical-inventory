<script lang="ts">
	import { DashboardCard, H1, H6 } from '$components';
	import { format } from '$utilities';

	// props (external)
	export let data;
</script>

<DashboardCard title="My Counted Tickets">
	<H1 class="text-center">{format.integer(data.myCountedTickets.length)}</H1>
</DashboardCard>
