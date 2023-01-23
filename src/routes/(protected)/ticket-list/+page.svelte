<script>
  import { Card, Fieldset, Input, Select, Table, Tbody, Td, Th, Thead, Tr } from '$components';
  import { integerFormat } from '$lib/format';
  import store from './store';

  // props (internal)
  const columns = [
    {
      filter: '',
      filterClasses: 'w-[10rem]',
      classes: '',
      format: (v) => v,
      sortFn: (v) => v,
      key: 'ticketNumber',
      th: 'Ticket #'
    },
    {
      filter: '',
      filterClasses: 'w-full',
      classes: '',
      format: (v) => v,
      sortFn: (v) => v,
      key: 'createdAt',
      th: 'Date'
    },
    { filter: '', classes: '', format: (v) => v, sortFn: (v) => v, key: '_counter', th: 'Counter' },
    {
      filter: '',
      filterClasses: 'w-full',
      classes: '',
      format: (v) => v,
      sortFn: (v) => v,
      key: '_verifier',
      th: 'Verifier'
    },
    {
      filter: '',
      filterClasses: 'w-full',
      classes: '',
      format: (v) => v,
      sortFn: (v) => v,
      key: 'itemNumber',
      th: 'Item #'
    },
    {
      filter: '',
      filterClasses: 'w-full',
      classes: '',
      format: (v) => v,
      sortFn: (v) => v,
      key: 'description',
      th: 'Description'
    },
    {
      filter: '',
      filterClasses: 'w-[6rem]',
      classes: '',
      format: (v) => v,
      sortFn: (v) => v,
      key: 'uom',
      th: 'UoM'
    },
    {
      filter: '',
      filterClasses: 'w-[8rem]',
      classes: 'text-right font-mono',
      format: integerFormat,
      key: 'count',
      sortFn: (v) => +v,
      th: 'Count'
    }
  ];
  const sortByOptions = [...columns].map(({ key, th }) => {
    return { label: th, value: key };
  });
  const sortDirectionOptions = [
    { label: 'ASC', value: 1 },
    { label: 'DESC', value: -1 }
  ];

  // props (external)
  export let data;

  $: sortFn = columns.find((obj) => obj.key === $store.sortBy)?.sortFn;
  $: rows = Object.values(data.count?.tickets)
    .map(({ ticketNumber, _counter, _verifier, itemNumber, count, createdAt }) => {
      // find username of counter and verifier
      _counter = data.users.find((user) => user._id === _counter).username;
      _verifier = data.users.find((user) => user._id === _verifier).username;

      // find item
      const item = data.count.items.find((item) => item.itemNumber === itemNumber);

      // create description, uom and jdeOnHand variables
      const { description, uom } = item;

      // update createdAt time
      createdAt = new Date(createdAt);
      createdAt = `${createdAt.getMonth() + 1}/${createdAt.getDate()}/${createdAt
        .getFullYear()
        .toString()
        .slice(-2)} ${(createdAt.getHours() % 12).toString().padStart(2, '0')}:${createdAt
        .getMinutes()
        .toString()
        .padStart(2, '0')} ${createdAt.getHours() >= 12 ? 'PM' : 'AM'}`;

      return {
        ticketNumber,
        _counter,
        _verifier,
        itemNumber,
        description,
        uom,
        count,
        createdAt
      };
    })
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
        (sortFn(a[$store.sortBy]) < sortFn(b[$store.sortBy])
          ? -1
          : sortFn(a[$store.sortBy]) > sortFn(b[$store.sortBy])
          ? 1
          : 0) * $store.sortDirection
    );
</script>

<div class="flex flex-col flex-grow overflow-y-hidden space-y-[1rem] p-[1rem] items-start">
  <div>Ticket List</div>
  <div class="flex space-x-[1rem]">
    <Fieldset legend="Sort By">
      <Select bind:value={$store.sortBy} options={sortByOptions} />
    </Fieldset>
    <Fieldset legend="Sort Direction">
      <Select bind:value={$store.sortDirection} options={sortDirectionOptions} />
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
            <Th class="px-0 py-0">
              <Input bind:value={filter} class="rounded-none {filterClasses}" />
            </Th>
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
</div>
