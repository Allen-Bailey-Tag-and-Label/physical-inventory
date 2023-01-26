<script>
  import { Datatable } from '$components';
  import { currencyFormat } from '$lib/format';

  // props (internal)
  const columns = [
    { classes: '', key: 'description', th: '' },
    { format: currencyFormat, classes: 'font-mono text-right', key: 'fg', th: 'FG' },
    { format: currencyFormat, classes: 'font-mono text-right', key: 'raw', th: 'RAW' },
    { format: currencyFormat, classes: 'font-mono text-right', key: 'total', th: 'Total' }
  ];

  // props (external)
  export let data;

  $: before = [...data.count.items].reduce(
    (obj, item) => {
      obj[item.type] = obj[item.type] + +item.quantity * +item.value;
      return obj;
    },
    { fg: 0, raw: 0 }
  );
  $: after = Object.values(data.count.tickets).reduce(
    (obj, ticket) => {
      const item = data.count.items.find((obj) => obj.itemNumber === ticket.itemNumber);
      if (item !== undefined) obj[ticket.type] = obj[ticket.type] + +ticket.count * item.value;
      return obj;
    },
    { fg: 0, raw: 0 }
  );
  $: variance = { fg: after.fg - before.fg, raw: after.raw - before.raw };
  $: rows = [
    { description: 'Before', fg: before.fg, raw: before.raw, total: before.fg + before.raw },
    { description: 'After', fg: after.fg, raw: after.raw, total: after.fg + after.raw },
    {
      description: 'Variance',
      fg: variance.fg,
      raw: variance.raw,
      total: variance.fg + variance.raw
    }
  ];
</script>

<Datatable {columns} filterable={false} {rows} sortable={false} />
