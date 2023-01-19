<script>
  import { Card } from '$components';

  // props (internal)
  const date = `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`;

  // props (external)
  export let data;

  // props (dynamic)
  $: itemsCounted = Object.keys(data.counts[data.settings.inventoryVersion]).map(
    (ticketNumber) => data.counts[data.settings.inventoryVersion][ticketNumber].itemNumber
  );
  $: itemsNotCounted = Object.keys(data.items).filter(
    (itemNumber) => !itemsCounted.includes(itemNumber)
  );
  $: ticketsUserCounted = Object.keys(data.counts[data.settings.inventoryVersion])
    .filter(
      (ticketNumber) =>
        data.counts[data.settings.inventoryVersion][ticketNumber]._counter === data.user._id
    )
    .map((ticketNumber) => data.counts[data.settings.inventoryVersion][ticketNumber]);
  $: ticketsUserVerified = Object.keys(data.counts[data.settings.inventoryVersion])
    .filter(
      (ticketNumber) =>
        data.counts[data.settings.inventoryVersion][ticketNumber]._verifier === data.user._id
    )
    .map((ticketNumber) => data.counts[data.settings.inventoryVersion][ticketNumber]);
  $: totalTickets = Object.keys(data.counts[data.settings.inventoryVersion]).map(
    (ticketNumber) => data.counts[data.settings.inventoryVersion][ticketNumber]
  );
  $: cards = [
    { title: 'Tickets I Counted', value: ticketsUserCounted.length },
    { title: 'Tickets I Verified', value: ticketsUserVerified.length },
    { title: 'Total Tickets Entered', value: totalTickets.length },
    { title: 'Items Counted', value: Object.keys(data.items).length - itemsNotCounted.length },
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
</div>
