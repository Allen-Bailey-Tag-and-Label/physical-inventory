<script lang="ts">
	import { DashboardCard, H3, H6 } from '$components';
	import { format } from '$utilities';

	// props (external)
	export let data;

	$: fgText = data.onHand.fg;
	$: fg = fgText.split('\n').reduce((total, row) => {
		row = row.split('\t');
		const valuation = +row[3] * parseFloat(row[11]);
		total += valuation;
		return total;
	}, 0);
</script>

<DashboardCard title="Pre-FG">
	<H3>{format.currency(fg)}</H3>
</DashboardCard>
