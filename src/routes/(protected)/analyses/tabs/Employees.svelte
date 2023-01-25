<script>
  import { Datatable } from '$components';

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
  $: rows = data.users.map((user) => {
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
  });
</script>

<Datatable {columns} filterable={false} {rows} sortable={false} />
