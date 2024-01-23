<script lang="ts">
	import { DashboardCard, H3, H6 } from '$components';
	import { format } from '$utilities';

	// props (external)
	export let data;

	$: rawText = data.onHand.raw;
	$: raw = rawText.split('\r\n').reduce((total, row) => {
		row = row.split('\t');
		const valuation = +row[6] * parseFloat(row[5]);
		total += valuation;
		return total;
	}, 0);
</script>

<DashboardCard title="Pre-RAW">
	<H3>{format.currency(raw)}</H3>
</DashboardCard>
