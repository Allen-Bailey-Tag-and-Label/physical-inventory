<script lang="ts">
	import { TicketTable } from '$lib/components';
	import type { PageData } from './$types';

	// types
	type Props = {
		data: PageData;
	};

	// $props
	let { data }: Props = $props();
</script>

<TicketTable tickets={data.tickets} />
