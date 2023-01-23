<script>
  import { Card, Fieldset, Input, Select, Table, Tbody, Td, Th, Thead, Tr } from '$components';
  import { onMount } from 'svelte';

  // props (internal)
  const sortDirectionOptions = [
    { label: 'ASC', value: 1 },
    { label: 'DESC', value: -1 }
  ];

  // props (external)
  export let columns = [];
  export let rows = [];
  export let sortBy = [...columns][0].key;
  export let sortDirection = 1;

  // props (dynamic)
  $: sortByOptions = [...columns].map(({ key, th }) => {
    return { label: th, value: key };
  });
  $: sortFn = columns.find((obj) => obj.key === sortBy)?.sortFn || ((v) => v);
  $: datatableRows = [...rows]
    .filter((obj) => {
      // initiate filter to true
      let keepRow = true;

      // loop over columns
      columns.forEach(({ filter, key }) => {
        if (filter !== '' && !new RegExp(filter, 'gi').test(obj[key])) {
          return (keepRow = false);
        }
      });
      return keepRow;
    })
    .sort(
      (a, b) =>
        (sortFn(a[sortBy]) < sortFn(b[sortBy])
          ? -1
          : sortFn(a[sortBy]) > sortFn(b[sortBy])
          ? 1
          : 0) * sortDirection
    );

  // lifecycle
  onMount(() => {
    columns = columns.map((column) => {
      return {
        filter: '',
        filterClasses: 'w-full',
        classes: '',
        format: (v) => v,
        sortFn: (v) => v,
        ...column
      };
    });
  });
</script>

<div class="flex space-x-[1rem]">
  <Fieldset legend="Sort By">
    <Select bind:value={sortBy} options={sortByOptions} />
  </Fieldset>
  <Fieldset legend="Sort Direction">
    <Select bind:value={sortDirection} options={sortDirectionOptions} />
  </Fieldset>
</div>
<Card class="p-0 overflow-y-auto relative rounded-none">
  <Table>
    <Thead>
      <Tr>
        {#each columns as { th }}
          <Th>{th}</Th>
        {/each}
      </Tr>
      <Tr>
        {#each columns as { filter, filterClasses }}
          <Th class="px-0 py-0 top-[2.5rem]">
            <Input bind:value={filter} class="rounded-none {filterClasses}" />
          </Th>
        {/each}
      </Tr>
    </Thead>
    <Tbody>
      {#each datatableRows as row}
        <Tr>
          {#each columns as { classes, key, format }}
            <Td class={classes}>{format(row[key])}</Td>
          {/each}
        </Tr>
      {/each}
    </Tbody>
  </Table>
</Card>
