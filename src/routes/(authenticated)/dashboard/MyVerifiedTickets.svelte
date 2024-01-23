<script lang="ts">
	import { DashboardCard, H1, H6 } from '$components';
	import { format } from '$utilities';

	// props (external)
	export let data;
</script>

<DashboardCard title="My Verified Tickets">
	<H1 class="text-center">{format.integer(data.myVerifiedTickets.length)}</H1>
</DashboardCard>
