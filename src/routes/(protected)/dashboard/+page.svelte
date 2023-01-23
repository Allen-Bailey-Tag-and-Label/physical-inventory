<script>
  import { Card } from '$components';

  // props (internal)

  // props (external)
  export let data;

  // props (dynamic)
  $: ticketsUserCounted =
    Object.values(data.count?.tickets)?.filter((ticket) => ticket._counter === data.user._id) || [];
  $: ticketsUserVerified =
    Object.values(data.count?.tickets)?.filter((ticket) => ticket._verifier === data.user._id) ||
    [];
  $: totalTickets = Object.values(data.count?.tickets) || [];
  $: itemsCounted = Object.keys(
    Object.values(data.count?.tickets)?.reduce((obj, ticket) => {
      obj[ticket.itemNumber] = ticket.itemNumber;
      return obj;
    }, {}) || {}
  );
  $: itemsNotCounted = [...data.count.items].filter(
    (item) => !itemsCounted.includes(item.itemNumber)
  );
  $: cards = [
    { title: 'Tickets I Counted', value: ticketsUserCounted.length },
    { title: 'Tickets I Verified', value: ticketsUserVerified.length },
    { title: 'Total Tickets Entered', value: totalTickets.length },
    { title: 'Items Counted', value: itemsCounted.length },
    { title: 'Items Not Counted', value: itemsNotCounted.length }
  ];
</script>

<div class="flex flex-col flex-grow p-[1rem] space-y-[1rem]">
  <div>Dashboard</div>
  <div class="flex space-x-[1rem]">
    {#each cards as { title, value }}
      <Card class="flex flex-col space-[1rem] items-center">
        <div>{title}</div>
        <div class="text-[2rem] font-semibold">{value}</div>
      </Card>
    {/each}
  </div>
  <!-- <div>{JSON.stringify(data)}</div> -->
</div>
