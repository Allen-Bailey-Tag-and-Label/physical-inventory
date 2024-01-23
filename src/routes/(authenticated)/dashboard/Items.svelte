<script lang="ts">
	import { DashboardCard, H1 } from '$components';
	import { items } from '$stores';
</script>

<DashboardCard title="Total Items">
	<H1>{$items.length}</H1>
</DashboardCard>
