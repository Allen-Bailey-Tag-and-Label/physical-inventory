<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Card, Form, Input, Portal, Table, Tbody, Td, Th, Thead, Tr } from '$components';
	import { slide } from '$transitions';

	// types
	type Item = {
		itemNumber: string;
		description: string;
		type: string;
		uom: string;
		cost07: number;
	};

	// handlers
	const deleteHandler = async () => {
		await fetch('?/deleteMany', { method: 'POST', body: new FormData() });
	};
	const importHandler = async () => {
		const clipboard = await navigator?.clipboard?.readText();
		if (clipboard !== undefined || clipboard !== null) {
			items = clipboard
				.trim()
				.split('\n')
				.map((row) => {
					const [itemNumber, description, type, uom, cost07] = row.split('\t');
					return { itemNumber, description, type, uom, cost07: parseFloat(cost07) };
				});
		}
	};
	const uploadHandler = async () => {
		upload.completed = 0;
		upload.total = items.length;
		upload.status = 'uploading';
		await Promise.all(
			items.map(async (item: Item) => {
				const formData = new FormData();
				Object.keys(item).map((key) => {
					formData.append(key, item[key]);
				});
				await fetch('?/create', {
					method: 'POST',
					body: formData
				});
				upload.completed++;
			})
		);
		items = [];
		await new Promise((resolve) => {
			setTimeout(resolve, 2000);
		});
		upload.status = 'completed';
	};

	// props (internal)
	let items: Item[] = [];
	const upload = {
		completed: 0,
		status: 'complete',
		total: 0
	};
</script>

<div class="relative flex max-h-full flex-grow flex-col">
	<div class="flex space-x-6">
		<Button on:click={deleteHandler}>Delete Items</Button>
		<Button on:click={importHandler}>Import from Clipboard</Button>
		<Button on:click={uploadHandler}>Upload</Button>
	</div>

	<div class="relative mt-6 flex flex-grow flex-col overflow-auto">
		<Table>
			<Thead>
				<Th>Item Number</Th>
				<Th>Description</Th>
				<Th>Item Type</Th>
				<Th>Primary UOM</Th>
				<Th>07 Cost</Th>
			</Thead>
			<Tbody>
				{#each items as row}
					<Tr>
						{#each Object.keys(row) as key}
							<Td>{row[key]}</Td>
						{/each}
					</Tr>
				{/each}
			</Tbody>
		</Table>
	</div>
</div>

<Portal>
	{#if upload.status === 'uploading'}
		<div class="fixed bottom-0 right-0 p-6" transition:slide>
			<Card>Successfully uploaded {upload.completed} of {upload.total}</Card>
		</div>
	{/if}
</Portal>
