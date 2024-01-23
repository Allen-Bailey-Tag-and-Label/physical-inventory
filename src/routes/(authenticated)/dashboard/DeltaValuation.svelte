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
	$: pre = fg + raw;
	$: after = data.tickets.reduce((total, ticket) => {
		const valuation = ticket.count * ticket.cost07;
		total += valuation;
		return total;
	}, 0);
	$: delta = after - pre;
	$: deltaPercent = delta / pre;
</script>

<DashboardCard title="Delta-Valuation">
	<H3 class={delta < 0 ? 'text-red-500' : 'text-green-500'}>{format.currency(delta)}</H3>
</DashboardCard>
