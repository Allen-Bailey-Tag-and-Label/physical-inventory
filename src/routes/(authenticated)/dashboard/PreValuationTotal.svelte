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
	$: rawText = data.onHand.raw;
	$: raw = rawText.split('\r\n').reduce((total, row) => {
		row = row.split('\t');
		const valuation = +row[6] * parseFloat(row[5]);
		total += valuation;
		return total;
	}, 0);
	$: total = fg + raw;
</script>

<DashboardCard title="Pre-Valuation">
	<H3>{format.currency(total)}</H3>
</DashboardCard>
