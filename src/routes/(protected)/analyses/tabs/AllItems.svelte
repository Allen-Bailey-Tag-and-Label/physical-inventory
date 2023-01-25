<script>
  import { Datatable } from '$components';
  import { currencyFormat, integerFormat } from '$lib/format';

  // props (internal)
  const columns = [
    {
      classes: '',
      filter: '',
      filterClasses: 'w-[6rem]',
      format: (v) => v.toUpperCase(),
      key: 'type',
      th: 'Type'
    },
    {
      classes: '',
      filter: '',
      filterClasses: 'w-full',
      format: (v) => v,
      key: 'itemNumber',
      th: 'Item #'
    },
    {
      classes: '',
      filter: '',
      filterClasses: 'w-full',
      format: (v) => v,
      key: 'description',
      th: 'Description'
    },
    {
      classes: 'font-mono text-right',
      filter: '',
      filterClasses: 'w-full',
      format: (v) => v,
      key: 'numberOfTickets',
      th: '# of Tickets',
      sortFn: (v) => +v,
      total: true
    },
    { classes: '', filter: '', filterClasses: 'w-[6rem]', format: (v) => v, key: 'uom', th: 'UoM' },
    {
      classes: 'font-mono text-right',
      filter: '',
      filterClasses: 'w-full',
      format: (v) => v,
      key: 'value',
      sortFn: (v) => parseFloat(v),
      th: '07'
    },
    {
      classes: 'font-mono text-right',
      filter: '',
      filterClasses: 'w-full',
      format: integerFormat,
      key: 'beforeUnits',
      th: 'Before Units',
      sortFn: (v) => +v,
      total: true
    },
    {
      classes: 'font-mono text-right',
      filter: '',
      filterClasses: 'w-full',
      format: integerFormat,
      key: 'countUnits',
      th: 'Counted Units',
      sortFn: (v) => +v,
      total: true
    },
    {
      classes: 'font-mono text-right',
      filter: '',
      filterClasses: 'w-full',
      format: integerFormat,
      key: 'varianceUnits',
      th: 'Variance Units',
      sortFn: (v) => +v,
      total: true
    },
    {
      classes: 'font-mono text-right',
      filter: '',
      filterClasses: 'w-full',
      format: currencyFormat,
      key: 'beforeExtended',
      th: 'Before Extended',
      total: true
    },
    {
      classes: 'font-mono text-right',
      filter: '',
      filterClasses: 'w-full',
      format: currencyFormat,
      key: 'countExtended',
      th: 'Count Extended',
      total: true
    },
    {
      classes: 'font-mono text-right',
      filter: '',
      filterClasses: 'w-full',
      format: currencyFormat,
      key: 'varianceExtended',
      th: 'Variance Extended',
      total: true
    }
  ];

  // | Type | Item # | Description | # of Tickets | UoM | 07 | Before Units | Counted Units | Variance Units | Before Extended | Counted Extended  | Variance Extended

  // props (external)
  export let data;
  $: rows = [...data.count.items].map((row) => {
    const itemTickets = Object.values(data.count.tickets).filter(
      ({ itemNumber }) => itemNumber === row.itemNumber
    );
    row.numberOfTickets = itemTickets.length;
    row.beforeUnits = +row.quantity;
    row.countUnits = itemTickets.reduce((total, ticket) => total + +ticket.count, 0);
    row.varianceUnits = row.countUnits - row.beforeUnits;
    row.beforeExtended = +row.beforeUnits * +row.value;
    row.countExtended = +row.countUnits * +row.value;
    row.varianceExtended = row.countExtended - row.beforeExtended;
    return row;
  });
</script>

<Datatable {columns} {rows} />
