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
      format: integerFormat,
      key: 'quantity',
      th: 'Quantity'
    },
    { classes: '', filter: '', filterClasses: 'w-[6rem]', format: (v) => v, key: 'uom', th: 'UoM' },
    {
      classes: 'font-mono text-right',
      filter: '',
      filterClasses: 'w-full',
      format: (v) => v,
      key: 'value',
      th: '07'
    },
    {
      classes: 'font-mono text-right',
      filter: '',
      filterClasses: 'w-full',
      format: currencyFormat,
      key: 'extended',
      th: 'Extended'
    }
  ];

  // props (external)
  export let data;

  $: countedItems = [
    ...new Set(Object.values(data.count.tickets).map(({ itemNumber }) => itemNumber))
  ];
  $: rows = [...data.count.items]
    .filter(({ itemNumber }) => !countedItems.includes(itemNumber))
    .map((row) => {
      row.extended = +row.quantity * +row.value;
      return row;
    });
</script>

<Datatable {columns} {rows} />
