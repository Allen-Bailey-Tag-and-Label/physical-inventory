<script>
  import { copy } from '@svelte-put/copy';
  import { Clipboard } from 'sveltewind/components/icons';
  import { Button, Card, Fieldset, Icon, Input } from '$components';

  // handlers
  const copyHandler = (itemNumber) => {
    entries[entries.length - 1].itemNumber = itemNumber;
    search = '';
  };

  // props (internal)
  let search = '';

  // props (external)
  export let data;
  export let entries;
  export let results = [];

  // props (dynamic)
  $: searchItems = search.split(' ');
  $: if (search) {
    results =
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
  }
</script>

<div
  class="flex flex-col p-[1rem] border-l border-black/[.1] dark:border-white/[.1] space-y-[1rem]"
>
  <div>Item Lookup</div>
  <Fieldset legend="Search">
    <Input bind:value={search} />
  </Fieldset>
  {#if search !== ''}
    <Card
      class="grid grid-cols-[fit-content(10px)_fit-content(10px)_fit-content(10px)] gap-x-[1rem] overflow-y-auto items-center gap-y-[.25rem]"
    >
      {#each results as { itemNumber, description }}
        <div class="whitespace-nowrap">{description}</div>
        <div class="whitespace-nowrap">{itemNumber}</div>
        <div class="relative">
          <Button class="px-[.5rem]" on:copied={() => copyHandler(itemNumber)} use={[copy]}>
            <Icon src={Clipboard} />
          </Button>
        </div>
      {/each}
    </Card>
  {/if}
</div>
