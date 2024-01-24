<script lang="ts">
	import { DateTime } from 'luxon';
	import { twMerge } from 'tailwind-merge';
	import {
		Button,
		Form,
		Icon,
		Modal,
		ProgressIndicator,
		Table,
		Tbody,
		Td,
		Th,
		Thead,
		Tr
	} from '$components';
	import { Download } from '$icons';
	import { theme } from '$stores';

	const downloadHandler = async () => {
		isOpen = true;
		const response = await fetch('/tickets/download');
		const blob = await response.blob();
		let link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		const date = DateTime.now().toFormat('yyyyMMddhhmmss');
		link.download = `tickets-${date}.xlsx`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		isOpen = false;
	};

	// props (external)
	export let data;

	// props (internal)
	let isOpen: boolean;
</script>

<div class="flex max-h-full flex-grow flex-col items-start space-y-6">
	<div class="flex max-h-full flex-grow flex-col space-y-6">
		<div class="flex justify-end space-x-6">
			<!-- <Form action="/tickets/download.csv" method="GET"> -->
			<Button class={twMerge($theme.buttonIcon)} on:click={downloadHandler}>
				<Icon src={Download} />
			</Button>
			<!-- </Form> -->
		</div>
		<div class="flex max-h-full flex-col overflow-auto">
			<Table>
				<Thead>
					<Th>Ticket #</Th>
					<Th>Item Number</Th>
					<Th>Count</Th>
				</Thead>
				<Tbody>
					{#each data.tickets as ticket}
						<Tr>
							<Td>{ticket.number}</Td>
							<Td>{ticket.itemNumber}</Td>
							<Td>{ticket.count}</Td>
						</Tr>
					{/each}
				</Tbody>
			</Table>
		</div>
	</div>
</div>

<Modal bind:isOpen>
	<div class="flex items-center justify-center">
		<ProgressIndicator />
	</div>
</Modal>
