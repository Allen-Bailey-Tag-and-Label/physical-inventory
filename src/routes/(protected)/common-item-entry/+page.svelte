<script>
  import { onMount } from 'svelte';
  import { Trash } from 'sveltewind/components/icons';
  import { browser } from '$app/environment';
  import {
    Button,
    Card,
    Fieldset,
    Icon,
    Input,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Select
  } from '$components';
  import layoutStore from '../store';
  import store from '../enter-count/store';
  import DeleteModal from '../enter-count/DeleteModal.svelte';
  import Search from '../enter-count/Search.svelte';

  // handlers
  const changeHandler = async () => {
    if ($store._counter !== '' && $store._verifier !== '' && $store.type !== '') {
      const serverEntries =
        Object.values(data.count?.tickets)?.filter(
          ({ _counter, _verifier, type }) =>
            _counter === $store._counter && _verifier === $store._verifier && type === $store.type
        ) || [];
      const localStorageEntries = browser
        ? Object.values(JSON.parse(localStorage.getItem('offlineTickets')) || {})
        : [];
      const initialEntries = [...serverEntries, ...localStorageEntries].map((entry) => {
        const materialCode = entry.itemNumber.substring(0, 3);
        const weightCode = entry.itemNumber.substring(3, 6);
        const colorCode = entry.itemNumber.substring(6, 8);
        const widthCode = entry.itemNumber.substring(9, 16);
        return { materialCode, weightCode, colorCode, widthCode, ...entry };
      });
      entries = [
        ...initialEntries,
        {
          count: '',
          itemNumber: initialEntries?.[initialEntries.length - 1]?.itemNumber || '',
          materialCode: initialEntries?.[initialEntries.length - 1]?.materialCode || '',
          weightCode: initialEntries?.[initialEntries.length - 1]?.weightCode || '',
          colorCode: initialEntries?.[initialEntries.length - 1]?.colorCode || '',
          widthCode: initialEntries?.[initialEntries.length - 1]?.widthCode || '',
          ticketNumber: ''
        }
      ];
    }
  };
  const addOrUpdateDatabaseHandler = async ({
    count,
    itemNumber,
    materialCode,
    weightCode,
    widthCode,
    colorCode,
    i,
    ticketNumber
  }) => {
    // update database
    if (count !== '' && itemNumber !== '' && ticketNumber !== '' && !isNaN(ticketNumber)) {
      try {
        // evaluate count
        if (count.charAt(0) === '=') count = eval(count.slice(1));

        // check if count is not a number
        if (isNaN(count)) throw `${count} is not a number`;

        // add another row
        if (count !== '' && itemNumber !== '' && i === entries.length - 1 && ticketNumber !== '') {
          entries = [
            ...entries,
            {
              count: '',
              itemNumber,
              materialCode,
              weightCode,
              widthCode,
              colorCode,
              ticketNumber: ''
            }
          ];
        }

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
          await fetch('/enter-count?/update', {
            body: formData,
            method: 'POST'
          });
        }

        // check if user is offline
        if (!$layoutStore.online && browser) {
          // get offlineTickets
          const offlineTickets = JSON.parse(localStorage.getItem('offlineTickets')) || {};

          // add to offlineTickets
          offlineTickets[ticketNumber] = Object.fromEntries(formData);

          // set offlineTickets
          localStorage.setItem('offlineTickets', JSON.stringify(offlineTickets));
        }
      } catch (error) {
        console.log({ error });
      }
    }
  };
  const trashButtonClickHandler = async ({ i, ticketNumber }) => {
    confirmModal.fn = async () => {
      const formData = new FormData();
      formData.append('ticketNumber', ticketNumber);
      formData.append('inventoryVersion', data.settings.inventoryVersion);

      // check if user is online
      if ($layoutStore.online) {
        const response = await fetch('/enter-count?/delete', {
          body: formData,
          method: 'POST'
        });
      }

      // check if user is offline
      if (!$layoutStore.online && browser) {
        // get offlineTickets
        const offlineTickets = JSON.parse(localStorage.getItem('offlineTickets')) || [];

        if (offlineTickets?.[ticketNumber] !== undefined) {
          delete offlineTickets[ticketNumber];
        }

        // set offlineTickets
        localStorage.setItem('offlineTickets', JSON.stringify(offlineTickets));
      }

      entries = [...entries].filter((_, index) => index !== i);
    };
    confirmModal.ticketNumber = ticketNumber;
    confirmModal.show = true;
  };
  const updateItemNumber = async ({ materialCode, weightCode, colorCode, widthCode, i }) => {
    entries[i].itemNumber = `${materialCode}${weightCode}${colorCode} ${widthCode}`;
  };
  const updateItemNumberComponents = async ({ itemNumber, i }) => {
    entries[i].materialCode = itemNumber.substring(0, 3);
    entries[i].weightCode = itemNumber.substring(3, 6);
    entries[i].colorCode = itemNumber.substring(6, 8);
    entries[i].widthCode = itemNumber.substring(9, 16);
  };
  const updateOfflineTickets = async () => {
    // get offlineTickets
    const offlineTickets = JSON.parse(localStorage.getItem('offlineTickets')) || {};

    // upload each
    await Promise.all(
      Object.values(offlineTickets).map(
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
            await fetch('/enter-count?/update', {
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
  const confirmModal = {
    fn: () => {},
    show: false,
    ticketNumber: ''
  };
  let entries = [
    {
      count: '',
      itemNumber: '',
      materialCode: '',
      weightCode: '',
      colorCode: '',
      widthCode: '',
      ticketNumber: ''
    }
  ];
  let results;
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
      <Card class="p-0 overflow-auto max-w-full relative rounded-none">
        <Table>
          <Thead>
            <Th class="px-0 py-0" />
            <Th>Ticket Number</Th>
            <Th>Item Number</Th>
            <Th>Material Code</Th>
            <Th>Weight Code</Th>
            <Th>Color Code</Th>
            <Th>Width Code</Th>
            <Th>Description</Th>
            <Th>UoM</Th>
            <Th>Count</Th>
          </Thead>
          <Tbody>
            {#each entries as { count, itemNumber, materialCode, weightCode, widthCode, colorCode, ticketNumber }, i}
              <Tr class="odd:bg-black/[.05] dark:odd:bg-white/[.05]">
                <Td class="px-0 py-0">
                  {#if i !== entries.length - 1}
                    <Button
                      class="px-[.5rem] bg-red-500 hover:bg-red-600 focus:bg-red-600 focus:ring-red-500/[.3]"
                      on:click={() => {
                        trashButtonClickHandler({ ticketNumber, i });
                      }}
                      tabindex="-1"
                    >
                      <Icon src={Trash} />
                    </Button>
                  {/if}
                </Td>
                <Td class="px-0 py-0">
                  <Input
                    bind:value={ticketNumber}
                    class="rounded-none w-[12rem]"
                    on:change={() => {
                      addOrUpdateDatabaseHandler({
                        count,
                        itemNumber,
                        materialCode,
                        weightCode,
                        widthCode,
                        colorCode,
                        ticketNumber,
                        i
                      });
                    }}
                    type="number"
                  />
                </Td>
                <Td class="px-0 py-0">
                  <Input
                    bind:value={itemNumber}
                    class="rounded-none w-[12rem]"
                    on:keyup={() => {
                      updateItemNumberComponents({ itemNumber, i });
                      addOrUpdateDatabaseHandler({
                        count,
                        itemNumber,
                        materialCode,
                        weightCode,
                        widthCode,
                        colorCode,
                        i
                      });
                    }}
                  />
                </Td>
                <Td class="px-0 py-0">
                  <Input
                    bind:value={materialCode}
                    class="rounded-none w-[10rem]"
                    on:keyup={() => {
                      updateItemNumber({
                        materialCode,
                        weightCode,
                        colorCode,
                        widthCode,
                        i
                      });
                      addOrUpdateDatabaseHandler({
                        count,
                        itemNumber,
                        materialCode,
                        weightCode,
                        widthCode,
                        colorCode,
                        i
                      });
                    }}
                  />
                </Td>
                <Td class="px-0 py-0">
                  <Input
                    bind:value={weightCode}
                    class="rounded-none w-[10rem]"
                    on:keyup={() => {
                      updateItemNumber({
                        materialCode,
                        weightCode,
                        colorCode,
                        widthCode,
                        i
                      });
                      addOrUpdateDatabaseHandler({
                        count,
                        itemNumber,
                        materialCode,
                        weightCode,
                        widthCode,
                        colorCode,
                        i
                      });
                    }}
                  />
                </Td>
                <Td class="px-0 py-0">
                  <Input
                    bind:value={colorCode}
                    class="rounded-none w-[9rem]"
                    on:keyup={() => {
                      updateItemNumber({
                        materialCode,
                        weightCode,
                        colorCode,
                        widthCode,
                        i
                      });
                      addOrUpdateDatabaseHandler({
                        count,
                        itemNumber,
                        materialCode,
                        weightCode,
                        widthCode,
                        colorCode,
                        i
                      });
                    }}
                  />
                </Td>
                <Td class="px-0 py-0">
                  <Input
                    bind:value={widthCode}
                    class="rounded-none w-[10rem]"
                    on:keyup={() => {
                      updateItemNumber({
                        materialCode,
                        weightCode,
                        colorCode,
                        widthCode,
                        i
                      });
                      addOrUpdateDatabaseHandler({
                        count,
                        itemNumber,
                        materialCode,
                        weightCode,
                        widthCode,
                        colorCode,
                        i
                      });
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
                    class="rounded-none w-[12rem] text-right"
                    on:keyup={() => {
                      addOrUpdateDatabaseHandler({
                        count,
                        itemNumber,
                        materialCode,
                        weightCode,
                        widthCode,
                        colorCode,
                        ticketNumber,
                        i
                      });
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
  <Search bind:entries bind:results {data} />
</div>

<DeleteModal
  bind:fn={confirmModal.fn}
  bind:show={confirmModal.show}
  ticketNumber={confirmModal.ticketNumber}
/>
