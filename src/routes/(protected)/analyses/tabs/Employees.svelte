<script>
  import { Card, Table, Tbody, Td, Th, Thead, Tr } from '$components';

  // props (internal)
  const columns = [
    { classes: '', key: 'employee', th: 'Employee' },
    { classes: '', key: 'username', th: 'Username' },
    { total: true, classes: 'font-mono text-right', key: 'counted', th: 'Counted' },
    { total: true, classes: 'font-mono text-right', key: 'verified', th: 'Verified' }
  ];
  // props (external)
  export let data;

  // props (dynamic)
  $: rows = data.users
    .map((user) => {
      const counted = Object.values(data.count.tickets).filter(
        (ticket) => ticket._counter === user._id
      );
      const verified = Object.values(data.count.tickets).filter(
        (ticket) => ticket._verifier === user._id
      );
      return {
        employee: `${user.firstName} ${user.lastName}`,
        username: user.username,
        counted: counted.length,
        verified: verified.length
      };
    })
    .sort((a, b) => (a.username < b.username ? -1 : a.username > b.username ? 1 : 0));
</script>

<Card class="rounded-none relative p-0 overflow-auto">
  <Table>
    <Thead>
      {#each columns as { th }}
        <Th>{th}</Th>
      {/each}
    </Thead>
    <Tbody>
      {#each rows as row}
        <Tr>
          {#each columns as { classes, key }}
            <Td class={classes}>{row[key]}</Td>
          {/each}
        </Tr>
      {/each}
    </Tbody>
    <tfoot>
      {#each columns as { classes, key, total = false }}
        <Td
          class=" shadow-[inset_0_1px_0_rgba(0,0,0,1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,1)] font-semibold sticky bottom-0 bg-white dark:bg-gray-800 {classes}"
        >
          {#if total}
            {rows.reduce((total, row) => total + row[key], 0)}
          {/if}
        </Td>
      {/each}
    </tfoot>
  </Table>
</Card>
