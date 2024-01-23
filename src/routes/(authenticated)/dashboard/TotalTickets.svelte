<script lang="ts">
	import { DashboardCard, H1 } from '$components';
	import { format } from '$utilities';

	// props (external)
	export let data;
</script>

<DashboardCard title="Total Tickets">
	<H1>{format.integer(data.tickets.length)}</H1>
</DashboardCard>
