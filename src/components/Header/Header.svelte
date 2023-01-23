<script>
  import { Wifi } from 'sveltewind/components/icons';
  import { enhance } from '$app/forms';
  import { Button, Card, Icon, Navigation } from '$components';
  import layoutStore from '../../routes/(protected)/store';

  // props (external)
  export let data;
</script>

<Card class="flex-row items-center justify-between px-[.5rem] py-[.0rem] rounded-none">
  <slot>
    <Navigation {data} />
    <div class="flex items-center space-x-[1rem]">
      <div>Welcome {data?.user?.firstName} {data?.user?.lastName}!</div>
      <form method="POST" action="/sign-out" use={enhance}>
        <Button type="submit">Sign Out</Button>
      </form>
      {#if $layoutStore.online !== undefined}
        <Icon class={$layoutStore.online ? 'text-green-500' : 'text-red-500'} src={Wifi} />
      {/if}
    </div>
  </slot>
</Card>
