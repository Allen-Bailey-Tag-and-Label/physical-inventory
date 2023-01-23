<script>
  import { Card, Input, Table, Tbody, Td, Th, Thead, Tr } from '$components';
  import { currencyFormat, integerFormat } from '$lib/format';

  // props (internal)
  const columns = [
    {
      classes: '',
      filter: '',
      filterClasses: 'w-[6rem]',
      format: (v) => v.toUpperCase(),
      key: 'type',
      th: 'Type'
    },
    {
      classes: '',
      filter: '',
      filterClasses: 'w-full',
      format: (v) => v,
      key: 'itemNumber',
      th: 'Item #'
    },
    {
      classes: '',
      filter: '',
      filterClasses: 'w-full',
      format: (v) => v,
      key: 'description',
      th: 'Description'
    },
    {
      classes: 'font-mono text-right',
      filter: '',
      filterClasses: 'w-full',
      format: integerFormat,
      key: 'quantity',
      th: 'Quantity'
    },
    { classes: '', filter: '', filterClasses: 'w-[6rem]', format: (v) => v, key: 'uom', th: 'UoM' },
    {
      classes: 'font-mono text-right',
      filter: '',
      filterClasses: 'w-full',
      format: (v) => v,
      key: 'value',
      th: '07'
    },
    {
      classes: 'font-mono text-right',
      filter: '',
      filterClasses: 'w-full',
      format: currencyFormat,
      key: 'extended',
      th: 'Extended'
    }
  ];

  // props (external)
  export let data;

  $: countedItems = [
    ...new Set(Object.values(data.count.tickets).map(({ itemNumber }) => itemNumber))
  ];
  $: rows = [...data.count.items]
    .filter(({ itemNumber }) => !countedItems.includes(itemNumber))
    .map((row) => {
      row.extended = +row.quantity * +row.value;
      return row;
    });
</script>

<Card class="p-0 relative rounded-none overflow-y-auto">
  <Table>
    <Thead>
      <Tr>
        {#each columns as { th }}
          <Th>{th}</Th>
        {/each}
      </Tr>
      <Tr>
        {#each columns as { filter, filterClasses }}
          <Th class="px-0 py-0 top-auto"
            ><Input bind:value={filter} class="rounded-none {filterClasses}" /></Th
          >
        {/each}
      </Tr>
    </Thead>
    <Tbody>
      {#each rows as row}
        <Tr>
          {#each columns as { classes, key, format }}
            <Td class={classes}>{format(row[key])}</Td>
          {/each}
        </Tr>
      {/each}
    </Tbody>
  </Table>
</Card>
