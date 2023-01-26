<script>
  import { Trash } from 'sveltewind/components/icons';
  import { Button, Card, Icon } from '$components';

  // props (external)
  export let fn = () => {};
  export let show = false;
  export let ticketNumber = '';
</script>

<div
  class="fixed top-0 left-0 z-[1] w-screen h-screen pointer-events-none flex items-center justify-center"
>
  <div
    class="absolute top-0 z-[1] left-0 w-screen h-screen transition duration-200 bg-black/[.7] {!show
      ? 'opacity-0 pointer-events-none'
      : 'opacity-100 pointer-events-auto'}"
    on:click={() => (show = !show)}
  />
  <Card
    class="z-[1] bg-white dark:bg-gray-800 space-y-[2rem] {!show
      ? 'opacity-0 pointer-events-none'
      : 'opacity-100 pointer-events-auto'} "
  >
    <Icon class="w-[6rem] h-[6rem] text-red-500 self-center" src={Trash} />
    <div>Are you sure you want to delete ticket number {ticketNumber}?</div>
    <div class="grid grid-cols-2 gap-[1rem]">
      <Button on:click={() => (show = !show)}>Cancel</Button>
      <Button
        class="bg-red-500 hover:bg-red-600 focus:bg-red-600 focus:ring-red-500/[.3]"
        on:click={async () => {
          await fn();
          show = !show;
        }}>Delete</Button
      >
    </div>
  </Card>
</div>
