<script>
  import { onMount } from 'svelte';
  import { Button, Card, Input, Select, Table, Tbody, Td, Th, Thead, Tr } from '$components';

  // handlers
  const addClickHandler = async ({ itemNumber, description, uom, quantity, value, type, i }) => {
    const formData = new FormData();
    formData.append('itemNumber', itemNumber);
    formData.append('description', description);
    formData.append('uom', uom);
    formData.append('quantity', quantity);
    formData.append('value', value);
    formData.append('type', type);
    formData.append('inventoryVersion', data.settings.inventoryVersion);

    await fetch('/missing-items', {
      body: formData,
      method: 'POST'
    });

    rows = [...rows].filter((_, index) => i !== index);
  };

  // props (internal)
  let rows = [];
  const uomOptions = ['EA', 'FT', 'LB', 'SQ', 'UN'].map((uom) => {
    return { label: uom, value: uom };
  });

  // props (external)
  export let data;

  // props (dynamic)
  $: itemNumbers = [...data.count?.items].map(({ itemNumber }) => itemNumber);

  // lifecycle
  onMount(() => {
    rows = Object.keys(data.count?.tickets || {})
      .map((ticketNumber) => {
        const { itemNumber, type } = data.count.tickets[ticketNumber];
        const description = '';
        const uom = '';
        const quantity = '';
        const value = '';
        return {
          itemNumber,
          description,
          uom,
          quantity,
          value,
          type
        };
      })
      .filter(({ itemNumber }) => !itemNumbers.includes(itemNumber));
  });
</script>

<div class="flex flex-col flex-grow overflow-hidden space-y-[1rem] p-[1rem] self-start">
  <div>Missing Items</div>
  <Card class="px-0 py-0 relative overflow-auto max-w-full">
    <Table>
      <Thead>
        <Th>Item #</Th>
        <Th>Type</Th>
        <Th>Description</Th>
        <Th>UoM</Th>
        <Th>07</Th>
        <Th>Before Units</Th>
        <Th />
      </Thead>
      <Tbody>
        {#each rows as { itemNumber, description, uom, quantity, value, type }, i}
          <Tr>
            <Td>{itemNumber}</Td>
            <Td>{type.toUpperCase()}</Td>
            <Td class="px-0 py-0"><Input bind:value={description} class="w-[25rem]" /></Td>
            <Td class="px-0 py-0"
              ><Select bind:value={uom} class="w-[6rem]" options={uomOptions} /></Td
            >
            <Td class="px-0 py-0"><Input bind:value class="w-[10rem]" /></Td>
            <Td class="px-0 py-0"><Input bind:value={quantity} class="w-[14rem]" /></Td>
            <Td class="py-0"
              ><Button
                on:click={() => {
                  addClickHandler({ itemNumber, description, uom, quantity, value, type, i });
                }}>Add</Button
              ></Td
            >
          </Tr>
        {/each}
      </Tbody>
    </Table>
  </Card>
</div>
