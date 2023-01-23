<script>
  import { Label } from '$components';
  import { AllItems, ItemsNotCounted, Overall } from './tabs';
  import store from './store';

  // props (internal)
  const tabs = [
    { component: AllItems, tab: 'All Items' },
    // { component: ItemsNotCounted, tab: 'Items Not Counted' },
    { component: Overall, tab: 'Overall' }
  ];

  // props (external)
  export let data;
</script>

<div class="flex flex-col flex-grow overflow-hidden space-y-[1rem] p-[1rem] items-start">
  <div>Analyses</div>

  <div class="flex">
    {#each tabs as { tab }}
      <Label class="relative">
        <input
          bind:group={$store.currentTab}
          class="w-0 h-0 absolute top-0 left-0 opacity-0"
          type="radio"
          value={tab}
        />
        <div
          class="flex px-[1rem] py-[.5rem] border-b {$store.currentTab !== tab
            ? 'cursor-pointer border-black/[.1] dark:border-white/[.1]'
            : 'border-blue-500'}"
        >
          {tab}
        </div>
      </Label>
    {/each}
  </div>
  <svelte:component this={tabs.find((tab) => tab.tab === $store.currentTab).component} {data} />
</div>
