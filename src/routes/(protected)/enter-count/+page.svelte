<script>
  import { twMerge } from 'tailwind-merge';
  import { onMount } from 'svelte';
  import { Fieldset, Input, Table, Tbody, Td, Th, Thead, Tr, Select } from '$components';
  import store from './store';

  // handlers
  const changeHandler = async () => {
    if ($store._counter !== '' && $store._verifier !== '' && $store.type !== '') {
      entries = [
        ...[...Object.keys(data.counts?.[date])]
          .filter(
            (ticketNumber) =>
              data.counts[date][ticketNumber]._counter === $store._counter &&
              data.counts[date][ticketNumber]._verifier === $store._verifier &&
              data.counts[date][ticketNumber].type === $store.type
          )
          .map((ticketNumber) => {
            return {
              ticketNumber,
              itemNumber: data.counts?.[date][ticketNumber].itemNumber,
              count: data.counts?.[date][ticketNumber].count,
              type: data.counts?.[date][ticketNumber].type
            };
          }),
        { count: '', itemNumber: '', ticketNumber: '' }
      ];
    }
  };
  const keyupHandler = async ({ count, itemNumber, i, ticketNumber }) => {
    // update database
    if (count !== '' && itemNumber !== '' && ticketNumber !== '' && !isNaN(ticketNumber)) {
      try {
        // create formData
        const formData = new FormData();
        formData.append('_counter', $store._counter);
        formData.append('_verifier', $store._verifier);
        formData.append('date', date);
        formData.append('type', $store.type);
        formData.append('ticketNumber', ticketNumber);
        formData.append('itemNumber', itemNumber);
        formData.append('count', count);

        await fetch('/enter-count', {
          body: formData,
          method: 'POST'
        });

        if (data.counts[date] === undefined) data.counts[date] = {};

        data.counts[date][ticketNumber] = {
          _counter: $store._counter,
          _verifier: $store._verifier,
          itemNumber,
          count,
          type: $store.type
        };
      } catch (error) {
        console.log(error);
      }
    }

    // add another row
    if (count !== '' && itemNumber !== '' && i === entries.length - 1 && ticketNumber !== '') {
      entries = [...entries, { count: '', itemNumber: '', ticketNumber: '' }];
    }
  };

  // props (internal)
  const date = `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`;
  let entries = [{ count: '', itemNumber: '', ticketNumber: '' }];
  const typeOptions = [
    { label: 'RAW', value: 'rawItems' },
    { label: 'FG', value: 'fgItems' }
  ];

  // props (external)
  export let data;

  // lifecycle
  onMount(() => {
    changeHandler();
  });
</script>

<div class="flex flex-col p-[1rem] items-start space-y-[1rem] overflow-hidden">
  <div class="flex space-x-[1rem]">
    <Fieldset legend="Counter">
      <Select
        bind:value={$store._counter}
        options={data?.userOptions || []}
        on:change={changeHandler}
      />
    </Fieldset>
    <Fieldset legend="Verifier">
      <Select
        bind:value={$store._verifier}
        options={data?.userOptions || []}
        on:change={changeHandler}
      />
    </Fieldset>
    <Fieldset legend="Type">
      <Select bind:value={$store.type} options={typeOptions} on:change={changeHandler} />
    </Fieldset>
  </div>
  {#if $store._counter !== '' && $store._verifier !== '' && $store.type !== ''}
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
          {#each entries as { count, itemNumber, ticketNumber }, i}
            <Tr class="odd:bg-black/[.05] dark:odd:bg-white/[.05]">
              <Td class="px-0 py-0">
                <Input
                  bind:value={ticketNumber}
                  class="rounded-none w-[12rem]"
                  on:keyup={() => {
                    keyupHandler({ count, itemNumber, ticketNumber, i });
                  }}
                  type="number"
                />
              </Td>
              <Td class="px-0 py-0">
                <Input
                  bind:value={itemNumber}
                  class="rounded-none"
                  on:keyup={() => {
                    keyupHandler({ count, itemNumber, i });
                  }}
                />
              </Td>
              {#each ['description', 'uom'] as key}
                <Td
                  class="ring ring-transparent ring-offset-1 ring-offset-black/[.1] dark:ring-offset-white/[.1]"
                >
                  {data?.items?.[date]?.[itemNumber]?.[key] || ''}
                </Td>
              {/each}
              <Td class="px-0 py-0">
                <Input
                  bind:value={count}
                  class="rounded-none w-[12rem]"
                  on:keyup={() => {
                    keyupHandler({ count, itemNumber, ticketNumber, i });
                  }}
                  type="number"
                />
              </Td>
            </Tr>
          {/each}
        </Tbody>
      </Table>
    </div>
  {/if}
</div>
