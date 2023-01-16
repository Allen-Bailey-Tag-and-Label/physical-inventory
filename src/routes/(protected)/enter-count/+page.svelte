<script>
  import { Fieldset, Input, Table, Tbody, Td, Th, Thead, Tr, Select } from '$components';
  import store from './store';

  // handlers
  const addCountRow = ({ count, itemNumber, i, ticketNumber }) => {
    if (count !== '' && itemNumber !== '' && i === counts.length - 1 && ticketNumber !== '') {
      counts = [
        ...counts,
        { count: '', description: '', itemNumber: '', uom: '', ticketNumber: '' }
      ];
    }
  };

  // props (internal)
  //   let counts = [...Array(50)].map((_) => {
  //     return { count: '', itemNumber: '', uom: '', ticketNumber: '' };
  //   });
  let counts = [{ count: '', description: '', itemNumber: '', uom: '', ticketNumber: '' }];

  // props (external)
  export let data;
</script>

<div class="flex flex-col p-[1rem] items-start space-y-[1rem] overflow-hidden">
  <div class="flex space-x-[1rem]">
    <Fieldset legend="Counter">
      <Select bind:value={$store._counter} options={data?.userOptions || []} />
    </Fieldset>
    <Fieldset legend="Verifier">
      <Select bind:value={$store._verifier} options={data?.userOptions || []} />
    </Fieldset>
  </div>
  {#if $store._counter !== '' && $store._verifier !== ''}
    <div class="overflow-y-auto relative">
      <Table>
        <Thead>
          <Th class="sticky top-0">Ticket Number</Th>
          <Th class="sticky top-0">Item Number</Th>
          <Th class="sticky top-0">Description</Th>
          <Th class="sticky top-0">UoM</Th>
          <Th class="sticky top-0">Count</Th>
        </Thead>
        <Tbody>
          {#each counts as { count, description, itemNumber, ticketNumber, uom }, i}
            <Tr>
              <Td class="px-0 py-0">
                <Input
                  bind:value={ticketNumber}
                  on:keydown={() => {
                    addCountRow({ count, itemNumber, ticketNumber, i });
                  }}
                />
              </Td>
              <Td class="px-0 py-0">
                <Input
                  bind:value={itemNumber}
                  on:keydown={() => {
                    addCountRow({ count, itemNumber, i });
                  }}
                />
              </Td>
              <Td>{description}</Td>
              <Td>{uom}</Td>
              <Td class="px-0 py-0">
                <Input
                  bind:value={count}
                  on:keydown={() => {
                    addCountRow({ count, itemNumber, ticketNumber, i });
                  }}
                />
              </Td>
            </Tr>
          {/each}
        </Tbody>
      </Table>
    </div>
  {/if}
</div>
