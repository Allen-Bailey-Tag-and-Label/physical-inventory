<script lang="ts">
	import { DashboardCard, H3, H6 } from '$components';
	import { format } from '$utilities';

	// props (external)
	export let data;

	$: total = data.tickets.reduce((total, ticket) => {
		const valuation = ticket.count * ticket.cost07;
		total += valuation;
		return total;
	}, 0);
</script>

<DashboardCard title="After-Valuation">
	<H3>{format.currency(total)}</H3>
</DashboardCard>
