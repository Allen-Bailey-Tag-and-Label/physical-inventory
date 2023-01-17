<script>
  import { enhance } from '$app/forms';
  import { Button, Card, Navigation } from '$components';

  // props (external)
  export let data;
</script>

<Card class="flex-row items-center justify-between px-[.5rem] py-[.5rem] rounded-none">
  <slot>
    <Navigation />
    <div class="flex items-center space-x-[1rem]">
      <div>Welcome {data?.user?.firstName} {data?.user?.lastName}!</div>
      <form method="POST" action="/sign-out" use={enhance}>
        <Button type="submit">Sign Out</Button>
      </form>
    </div>
  </slot>
</Card>
