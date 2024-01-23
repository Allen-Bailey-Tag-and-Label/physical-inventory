<script lang="ts">
	import Items from './Items.svelte';
	import MyTotalTickets from './MyTotalTickets.svelte';
	import TotalTickets from './TotalTickets.svelte';

	// props (external)
	export let data;
</script>

<div class="grid grid-cols-4 gap-6 lg:grid-cols-6 xl:grid-cols-8">
	<Items />
	<TotalTickets {data} />
	<MyTotalTickets {data} />
</div>
