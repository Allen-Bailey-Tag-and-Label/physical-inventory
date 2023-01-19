<script>
  import { onMount } from 'svelte';
  import { Card, Fieldset, Input, Table, Tbody, Td, Th, Thead, Tr, Select } from '$components';
  import store from './store';

  // handlers
  const changeHandler = async () => {
    if ($store._counter !== '' && $store._verifier !== '' && $store.type !== '') {
      entries = [
        ...[...Object.keys(data.counts?.[data.settings.inventoryVersion])]
          .filter(
            (ticketNumber) =>
              data.counts[data.settings.inventoryVersion][ticketNumber]._counter ===
                $store._counter &&
              data.counts[data.settings.inventoryVersion][ticketNumber]._verifier ===
                $store._verifier &&
              data.counts[data.settings.inventoryVersion][ticketNumber].type === $store.type
          )
          .map((ticketNumber) => {
            return {
              ticketNumber,
              itemNumber: data.counts?.[data.settings.inventoryVersion][ticketNumber].itemNumber,
              count: data.counts?.[data.settings.inventoryVersion][ticketNumber].count,
              type: data.counts?.[data.settings.inventoryVersion][ticketNumber].type
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
        formData.append('type', $store.type);
        formData.append('ticketNumber', ticketNumber);
        formData.append('itemNumber', itemNumber);
        formData.append('count', count);

        await fetch('/enter-count', {
          body: formData,
          method: 'POST'
        });

        if (data.counts[data.settings.inventoryVersion] === undefined)
          data.counts[data.settings.inventoryVersion] = {};

        data.counts[data.settings.inventoryVersion][ticketNumber] = {
          _counter: $store._counter,
          _verifier: $store._verifier,
          itemNumber,
          count,
          type: $store.type
        };
      } catch (error) {
        console.log({ error });
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
  let search = '';
  const typeOptions = [
    { label: 'RAW', value: 'rawItems' },
    { label: 'FG', value: 'fgItems' }
  ];

  // props (external)
  export let data;

  // props (dynamic)
  $: searchItems = search.split(' ');
  $: results =
    search === ''
      ? []
      : Object.keys(data.items)
          .filter((itemNumber) => {
            let match = true;
            searchItems.every((searchItem) => {
              if (!new RegExp(searchItem, 'gi').test(data.items[itemNumber].description)) {
                match = false;
                return false;
              }
              return true;
            });
            return match;
          })
          .map((itemNumber) => {
            const { description, uom, type } = data.items[itemNumber];
            return { itemNumber, description, uom, type };
          });

  // lifecycle
  onMount(() => {
    changeHandler();
  });
</script>

<div class="flex flex-grow overflow-hidden">
  <div class="flex flex-col p-[1rem] flex-grow items-start space-y-[1rem] overflow-hidden">
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
      <Card class="p-0 overflow-y-auto relative">
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
                    {data?.jdeImports?.[data.settings.inventoryVersion]?.[itemNumber]?.[key] || ''}
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
      </Card>
    {/if}
  </div>
  <div
    class="flex flex-col p-[1rem] border-l border-black/[.1] dark:border-white/[.1] space-y-[1rem]"
  >
    <div>Item Lookup</div>
    <Fieldset legend="Search">
      <Input bind:value={search} />
    </Fieldset>
    {#if search !== ''}
      <Card
        class="grid grid-cols-[fit-content(10px)_fit-content(10px)] gap-x-[1rem] overflow-y-auto"
      >
        {#each results as { itemNumber, description, uom, type }}
          <div class="whitespace-nowrap">{description}</div>
          <div class="whitespace-nowrap">{itemNumber}</div>
        {/each}
      </Card>
    {/if}
  </div>
</div>
