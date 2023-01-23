<script>
  import { Card, Table, Tbody, Td, Th, Thead, Tr } from '$components';
  import { currencyFormat } from '$lib/format';

  // props (internal)

  // props (external)
  export let data;

  console.log(data.count.items);

  $: before = [...data.count.items].reduce(
    (obj, item) => {
      obj[item.type] = obj[item.type] + +item.quantity * +item.value;
      return obj;
    },
    { fg: 0, raw: 0 }
  );
  $: after = Object.values(data.count.tickets).reduce(
    (obj, ticket) => {
      const item = data.count.items.find((obj) => obj.itemNumber === ticket.itemNumber);
      obj[ticket.type] = obj[ticket.type] + +ticket.count * item.value;
      return obj;
    },
    { fg: 0, raw: 0 }
  );
  $: variance = { fg: after.fg - before.fg, raw: after.raw - before.raw };
  $: rows = [
    { description: 'Before', object: before },
    { description: 'After', object: after },
    { description: 'Variance', object: variance, addClasses: true }
  ];
</script>

<Card class="rounded-none relative font-mono p-0">
  <Table>
    <Thead>
      <Th />
      <Th class="text-center">FG</Th>
      <Th class="text-center">RAW</Th>
      <Th class="text-center">Total</Th>
    </Thead>
    <Tbody>
      {#each rows as { addClasses = false, description, object }}
        <Tr>
          <Td>{description}</Td>
          <Td
            class="text-right {!addClasses
              ? ''
              : object?.fg < 0
              ? 'text-red-500 selection:bg-red-500 selection:text-white'
              : 'text-green-500 selection:bg-green-500 selection:text-white'}"
            >{currencyFormat(object?.fg)}</Td
          >
          <Td
            class="text-right {!addClasses
              ? ''
              : object?.raw < 0
              ? 'text-red-500 selection:bg-red-500 selection:text-white'
              : 'text-green-500 selection:bg-green-500 selection:text-white'}"
            >{currencyFormat(object?.raw)}</Td
          >
          <Td
            class="text-right {!addClasses
              ? ''
              : object?.fg + object?.raw < 0
              ? 'text-red-500 selection:bg-red-500 selection:text-white'
              : 'text-green-500 selection:bg-green-500 selection:text-white'}"
            >{currencyFormat(object?.fg + object?.raw)}</Td
          >
        </Tr>
      {/each}
    </Tbody>
  </Table>
</Card>
