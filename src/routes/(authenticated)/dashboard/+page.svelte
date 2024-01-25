<script lang="ts">
	import AfterValuation from './AfterValuation.svelte';
	import DeltaValuation from './DeltaValuation.svelte';
	import DeltaValuationPercent from './DeltaValuationPercent.svelte';
	import Items from './Items.svelte';
	import MyCountedTickets from './MyCountedTickets.svelte';
	import MyVerifiedTickets from './MyVerifiedTickets.svelte';
	import PreValuationFG from './PreValuationFG.svelte';
	import PreValuationRaw from './PreValuationRAW.svelte';
	import PreValuationTotal from './PreValuationTotal.svelte';
	import TotalTickets from './TotalTickets.svelte';

	// props (external)
	export let data;
</script>

<div class="grid grid-cols-4 gap-6 lg:grid-cols-6">
	<Items />
	<TotalTickets {data} />
	<MyCountedTickets {data} />
	<MyVerifiedTickets {data} />
	{#if data.user.isAdmin}
		<!-- <PreValuationFG {data} /> -->
		<!-- <PreValuationRaw {data} /> -->
		<PreValuationTotal {data} />
		<AfterValuation {data} />
		<DeltaValuation {data} />
		<DeltaValuationPercent {data} />
	{/if}
</div>
