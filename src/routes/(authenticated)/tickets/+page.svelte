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
	import { Download, Trash } from '$icons';
	import { theme } from '$stores';
	import { format, objectToFormData } from '$utilities';
	import { invalidateAll } from '$app/navigation';

	// handlers
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
	const submitHandler = async (e) => {
		e.preventDefault();
		isOpen = true;
		const body = objectToFormData({ id: deleteId });
		await fetch('/tickets', { method: 'POST', body });
		isOpen = false;
		deleteIsOpen = false;
		invalidateAll();
	};

	// props (external)
	export let data;

	// props (internal)
	let deleteId: string;
	let deleteIsOpen: boolean;
	let deleteNumber: number;
	let deleteToggle: () => boolean;
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
					<Th></Th>
					<Th>Ticket #</Th>
					<Th>Item Number</Th>
					<Th class="text-right">Count</Th>
					<Th>Date / Time</Th>
					<Th>Is Valid Item Number?</Th>
				</Thead>
				<Tbody>
					{#each data.tickets as ticket}
						<Tr
							class={ticket.isValidItemNumber
								? undefined
								: 'bg-red-500 text-white even:bg-red-500 dark:bg-red-500 dark:even:bg-red-500'}
						>
							<Td class="p-0">
								<Button
									class={twMerge(
										$theme.buttonIcon,
										'bg-red-500 px-1 py-1 hover:bg-red-600 focus:bg-red-600 focus:ring-red-500/30'
									)}
									on:click={() => {
										deleteId = ticket.id;
										deleteNumber = ticket.number;
										deleteToggle();
									}}
								>
									<Icon src={Trash} />
								</Button>
							</Td>
							<Td>
								<a
									class="underline decoration-violet-500 decoration-2 underline-offset-2"
									href="/ticket/{ticket.number}"
								>
									{ticket.number}
								</a>
							</Td>
							<Td>
								<a
									class="underline decoration-violet-500 decoration-2 underline-offset-2"
									href="/itemNumber/{ticket.itemNumber}"
								>
									{ticket.itemNumber}
								</a>
							</Td>
							<Td class="text-right">{format.integer(ticket.count)}</Td>
							<Td>{DateTime.fromJSDate(ticket.dateCreated).toFormat('M/d/yy h:mm a')}</Td>
							<Td class="text-center">{ticket.isValidItemNumber ? 'TRUE' : 'FALSE'}</Td>
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

<Modal bind:isOpen={deleteIsOpen} bind:toggle={deleteToggle}>
	<Form on:submit={submitHandler}>
		<div>Are you sure you want to delete ticket #{deleteNumber}?</div>
		<div class="grid grid-cols-2 gap-6">
			<Button
				class="bg-slate-800 text-white hover:bg-slate-900 focus:bg-slate-900 focus:ring-slate-800/30 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:bg-slate-200 dark:focus:ring-slate-50/30"
				on:click={deleteToggle}>Cancel</Button
			>
			<Button
				class="bg-red-500 px-1 py-1 hover:bg-red-600 focus:bg-red-600 focus:ring-red-500/30"
				type="submit">Delete</Button
			>
		</div>
	</Form>
</Modal>
