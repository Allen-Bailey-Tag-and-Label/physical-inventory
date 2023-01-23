<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { Card, Fieldset, Input, Table, Tbody, Td, Th, Thead, Tr, Select } from '$components';
  import layoutStore from '../store';
  import store from './store';

  // handlers
  const changeHandler = async () => {
    if ($store._counter !== '' && $store._verifier !== '' && $store.type !== '') {
      const initialEntries =
        Object.values(data.count?.tickets)?.filter(
          ({ _counter, _verifier, type }) =>
            _counter === $store._counter && _verifier === $store._verifier && type === $store.type
        ) || [];
      entries = [...initialEntries, { count: '', itemNumber: '', ticketNumber: '' }];
    }
  };
  const rowChangeHandler = async ({ count, itemNumber, i, ticketNumber }) => {
    // update database
    if (count !== '' && itemNumber !== '' && ticketNumber !== '' && !isNaN(ticketNumber)) {
      try {
        // evaluate count
        if (count.charAt(0) === '=') count = eval(count.slice(1));

        // check if count is not a number
        if (isNaN(count)) throw `${count} is not a number`;

        // create formData
        const formData = new FormData();
        formData.append('_counter', $store._counter);
        formData.append('_verifier', $store._verifier);
        formData.append('type', $store.type);
        formData.append('ticketNumber', ticketNumber);
        formData.append('itemNumber', itemNumber);
        formData.append('count', count);
        formData.append('inventoryVersion', data.settings.inventoryVersion);

        // check if user is online
        if ($layoutStore.online) {
          await fetch('/enter-count', {
            body: formData,
            method: 'POST'
          });
        }

        // check if user is offline
        if (!$layoutStore.online && browser) {
          // get offlineTickets
          const offlineTickets = JSON.parse(localStorage.getItem('offlineTickets')) || [];

          // add to offlineTickets
          offlineTickets.push(Object.fromEntries(formData));

          // set offlineTickets
          localStorage.setItem('offlineTickets', JSON.stringify(offlineTickets));

          console.log(JSON.parse(localStorage.getItem('offlineTickets')));
        }
      } catch (error) {
        console.log({ error });
      }
    }

    // add another row
    if (count !== '' && itemNumber !== '' && i === entries.length - 1 && ticketNumber !== '') {
      entries = [...entries, { count: '', itemNumber: '', ticketNumber: '' }];
    }
  };
  const updateOfflineTickets = async () => {
    // get offlineTickets
    const offlineTickets = JSON.parse(localStorage.getItem('offlineTickets')) || [];

    // upload each
    await Promise.all(
      offlineTickets.map(
        async ({
          _counter,
          _verifier,
          type,
          ticketNumber,
          itemNumber,
          count,
          inventoryVersion
        }) => {
          // create formData
          const formData = new FormData();
          formData.append('_counter', _counter);
          formData.append('_verifier', _verifier);
          formData.append('type', type);
          formData.append('ticketNumber', ticketNumber);
          formData.append('itemNumber', itemNumber);
          formData.append('count', count);
          formData.append('inventoryVersion', inventoryVersion);

          try {
            await fetch('/enter-count', {
              body: formData,
              method: 'POST'
            });

            localStorage.setItem('offlineTickets', JSON.stringify([]));
          } catch (error) {
            console.log(error);
          }
        }
      )
    );
  };

  // props (internal)
  let entries = [{ count: '', itemNumber: '', ticketNumber: '' }];
  let search = '';
  const typeOptions = [
    { label: 'RAW', value: 'raw' },
    { label: 'FG', value: 'fg' }
  ];

  // props (external)
  export let data;

  // props (dynamic)
  $: if ($layoutStore.online && browser) {
    updateOfflineTickets();
  }
  $: userOptions = [...data.users]
    .map((user) => {
      return { label: `${user.firstName} ${user.lastName}`, value: user._id };
    })
    .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));
  $: searchItems = search.split(' ');
  $: results =
    search === ''
      ? []
      : [...data.count.items].filter(({ description }) => {
          let match = true;
          searchItems.every((searchItem) => {
            if (!new RegExp(searchItem, 'gi').test(description)) {
              match = false;
              return false;
            }
            return true;
          });
          return match;
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
          options={userOptions || []}
          on:change={changeHandler}
        />
      </Fieldset>
      <Fieldset legend="Verifier">
        <Select
          bind:value={$store._verifier}
          options={userOptions || []}
          on:change={changeHandler}
        />
      </Fieldset>
      <Fieldset legend="Type">
        <Select bind:value={$store.type} options={typeOptions} on:change={changeHandler} />
      </Fieldset>
    </div>
    {#if $store._counter !== '' && $store._verifier !== '' && $store.type !== ''}
      <Card class="p-0 overflow-y-auto relative rounded-none">
        <Table>
          <Thead>
            <Th>Ticket Number</Th>
            <Th>Item Number</Th>
            <Th>Description</Th>
            <Th>UoM</Th>
            <Th>Count</Th>
          </Thead>
          <Tbody>
            {#each entries as { count, itemNumber, ticketNumber }, i}
              <Tr class="odd:bg-black/[.05] dark:odd:bg-white/[.05]">
                <Td class="px-0 py-0">
                  <Input
                    bind:value={ticketNumber}
                    class="rounded-none w-[12rem]"
                    on:change={() => {
                      rowChangeHandler({ count, itemNumber, ticketNumber, i });
                    }}
                    type="number"
                  />
                </Td>
                <Td class="px-0 py-0">
                  <Input
                    bind:value={itemNumber}
                    class="rounded-none"
                    on:change={() => {
                      rowChangeHandler({ count, itemNumber, i });
                    }}
                  />
                </Td>
                {#each ['description', 'uom'] as key}
                  <Td
                    class="ring ring-transparent ring-offset-1 ring-offset-black/[.1] dark:ring-offset-white/[.1]"
                  >
                    {[...data.count.items]?.filter((item) => item.itemNumber === itemNumber)?.[0]?.[
                      key
                    ] || ''}
                  </Td>
                {/each}
                <Td class="px-0 py-0">
                  <Input
                    bind:value={count}
                    class="rounded-none w-[12rem]"
                    on:change={() => {
                      rowChangeHandler({ count, itemNumber, ticketNumber, i });
                    }}
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
