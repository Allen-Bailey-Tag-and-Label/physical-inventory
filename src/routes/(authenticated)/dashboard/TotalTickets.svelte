<script lang="ts">
	import { DashboardCard, H1 } from '$components';

	// props (external)
	export let data;
</script>

<DashboardCard title="Total Tickets">
	<H1>{data.tickets.length}</H1>
</DashboardCard>
