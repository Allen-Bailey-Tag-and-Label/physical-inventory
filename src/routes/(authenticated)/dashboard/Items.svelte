<script lang="ts">
	import { DashboardCard, H1 } from '$components';
	import { items } from '$stores';
	import { format } from '$utilities';
</script>

<DashboardCard title="Total Items">
	<H1>{format.integer($items.length)}</H1>
</DashboardCard>
