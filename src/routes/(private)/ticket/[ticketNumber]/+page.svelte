<script lang="ts">
	import TicketEntryRoute from '../../ticket-entry/+page.svelte';
	import type { PageData } from './$types';

	// types
	type Props = {
		data: PageData;
		ticketInfo: {
			amounts: string[];
			itemNumber: string;
			ticketNumber: string;
			uom: string;
		};
	};

	// $props
	let { data }: Props = $props();
</script>

<TicketEntryRoute
	buttonText="Update Ticket"
	{data}
	onsubmitComplete={() => {}}
	operation="update"
	ticketInfo={data.ticketInfo}
/>
