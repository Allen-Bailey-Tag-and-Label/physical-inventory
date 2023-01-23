<script>
  import { Datatable } from '$components';
  import { dateFormat, integerFormat } from '$lib/format';
  import store from './store';

  // props (internal)
  const columns = [
    {
      filter: '',
      filterClasses: 'w-[10rem]',
      classes: '',
      format: (v) => v,
      sortFn: (v) => v,
      key: 'ticketNumber',
      th: 'Ticket #'
    },
    {
      filter: '',
      filterClasses: 'w-full',
      classes: '',
      format: dateFormat,
      sortFn: (v) => v,
      key: 'createdAt',
      th: 'Date'
    },
    { filter: '', classes: '', format: (v) => v, sortFn: (v) => v, key: '_counter', th: 'Counter' },
    {
      filter: '',
      filterClasses: 'w-full',
      classes: '',
      format: (v) => v,
      sortFn: (v) => v,
      key: '_verifier',
      th: 'Verifier'
    },
    {
      filter: '',
      filterClasses: 'w-full',
      classes: '',
      format: (v) => v,
      sortFn: (v) => v,
      key: 'itemNumber',
      th: 'Item #'
    },
    {
      filter: '',
      filterClasses: 'w-full',
      classes: '',
      format: (v) => v,
      sortFn: (v) => v,
      key: 'description',
      th: 'Description'
    },
    {
      filter: '',
      filterClasses: 'w-[6rem]',
      classes: '',
      format: (v) => v,
      sortFn: (v) => v,
      key: 'uom',
      th: 'UoM'
    },
    {
      filter: '',
      filterClasses: 'w-[8rem]',
      classes: 'text-right font-mono',
      format: integerFormat,
      key: 'count',
      sortFn: (v) => +v,
      th: 'Count',
      total: true
    }
  ];

  // props (external)
  export let data;

  $: rows = Object.values(data.count?.tickets).map(
    ({ ticketNumber, _counter, _verifier, itemNumber, count, createdAt }) => {
      // find username of counter and verifier
      _counter = data.users.find((user) => user._id === _counter).username;
      _verifier = data.users.find((user) => user._id === _verifier).username;

      // find item
      const item = data.count.items.find((item) => item.itemNumber === itemNumber);

      // create description, uom and jdeOnHand variables
      const { description, uom } = item;

      // // update createdAt time
      // createdAt = new Date(createdAt);
      // createdAt = `${createdAt.getMonth() + 1}/${createdAt.getDate()}/${createdAt
      //   .getFullYear()
      //   .toString()
      //   .slice(-2)} ${(createdAt.getHours() % 12).toString().padStart(2, '0')}:${createdAt
      //   .getMinutes()
      //   .toString()
      //   .padStart(2, '0')} ${createdAt.getHours() >= 12 ? 'PM' : 'AM'}`;

      return {
        ticketNumber,
        _counter,
        _verifier,
        itemNumber,
        description,
        uom,
        count,
        createdAt
      };
    }
  );
</script>

<div class="flex flex-col flex-grow overflow-y-hidden space-y-[1rem] p-[1rem] items-start">
  <div>Ticket List</div>
  <Datatable
    bind:sortBy={$store.sortBy}
    bind:sortDirection={$store.sortDirection}
    {columns}
    {rows}
  />
</div>
