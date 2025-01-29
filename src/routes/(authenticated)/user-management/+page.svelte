<script lang="ts">
	import { Button, Checkbox, Table, Tbody, Td, Th, Thead, Tr } from '$components';

	// props (external)
	export let data;
</script>

pac
<div class="flex max-h-full flex-grow flex-col items-start space-y-6">
	<div class="flex max-h-full flex-grow flex-col space-y-6">
		<div class="flex justify-end space-x-6"></div>
	</div>
	<div class="flex max-h-full flex-col overflow-auto">
		<Table>
			<Thead>
				<Th>Employee</Th>
				<Th>Is Active?</Th>
				<Th>Is Admin?</Th>
				<Th>Password</Th>
			</Thead>
			<Tbody>
				{#each data.users.sort( (a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`) ) as { id, firstName, lastName, isActive, isAdmin }}
					<Tr>
						<Td>{firstName} {lastName}</Td>
						<Td>
							<Checkbox
								bind:checked={isActive}
								on:change={async () => {
									const formData = new FormData();
									formData.append('id', id);
									formData.append('isActive', isActive.toString());

									await fetch('?/isActive', {
										method: 'POST',
										body: formData
									});
								}}
							/>
						</Td>
						<Td>
							<Checkbox
								bind:checked={isAdmin}
								on:change={async () => {
									const formData = new FormData();
									formData.append('id', id);
									formData.append('isAdmin', isAdmin.toString());

									await fetch('?/isAdmin', {
										method: 'POST',
										body: formData
									});
								}}
							/>
						</Td>
						<Td class="py-0">
							<Button
								class="py-2"
								on:click={async () => {
									const formData = new FormData();
									formData.append('id', id);

									await fetch('?/reset-password', {
										method: 'POST',
										body: formData
									});
								}}
							>
								Reset
							</Button>
						</Td>
					</Tr>
				{/each}
			</Tbody>
		</Table>
	</div>
</div>
