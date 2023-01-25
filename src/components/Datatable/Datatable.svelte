<script>
  import { copyToClipboard } from '@svelte-put/copy';
  import { onMount } from 'svelte';
  import { Clipboard } from 'sveltewind/components/icons';
  import { browser } from '$app/environment';
  import {
    Button,
    Card,
    Fieldset,
    Icon,
    Input,
    Select,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
  } from '$components';

  // handlers
  const copyClickHandler = () => {
    // create tsv (tab separated view)
    const tsv = tableToString();

    // copy to clipboard
    copyToClipboard(tsv);
  };
  const csvClickHandler = () => {
    if (browser) {
      // create csv (comma separated view)
      const csv = tableToString({ separator: ',' });

      // create temporary link element
      const linkElem = document.createElement('a');

      // update link attribute to csv content
      linkElem.setAttribute('href', `data:application/csv,${encodeURIComponent(csv)}`);

      // update link download file name
      linkElem.setAttribute('download', `export-${new Date().getTime()}.csv`);

      // add link element to document
      document.body.appendChild(linkElem);

      // click link to download
      linkElem.click();

      // delete temporary link element
      linkElem.parentNode.removeChild(linkElem);
    }
  };
  const tableToString = (options) => {
    // get defaults
    const defaults = { separator: '\t' };

    // merge options and defaults;
    options = Object.assign(defaults, options);

    // destructure options
    const { separator } = options;

    // get column headers
    const headers = [...columns].map(({ th }) => th.replace(new RegExp(separator, 'gi'), ''));

    // get body
    const body = [...datatableRows].map((row) =>
      [...columns]
        .map(({ key, format }) => format(row[key]).replace(new RegExp(separator, 'gi'), ''))
        .join(separator)
    );

    // create table string
    const string = [headers.join(separator), ...body].join('\r\n');

    return string;
  };

  // props (internal)
  let mounted = false;
  const sortDirectionOptions = [
    { label: 'ASC', value: 1 },
    { label: 'DESC', value: -1 }
  ];

  // props (external)
  export let columns = [];
  export let exportable = true;
  export let filterable = true;
  export let rows = [];
  export let sortable = true;
  export let sortBy = [...columns][0].key;
  export let sortDirection = 1;

  // props (dynamic)
  $: sortByOptions = [...columns].map(({ key, th }) => {
    return { label: th, value: key };
  });
  $: sortFn = columns.find((obj) => obj.key === sortBy)?.sortFn || ((v) => v);
  $: datatableRows = [...rows]
    .filter((obj) => {
      // initiate filter to true
      let keepRow = true;

      // loop over columns
      columns.forEach(({ filter, key }) => {
        if (filter !== '' && !new RegExp(filter, 'gi').test(obj[key])) {
          return (keepRow = false);
        }
      });
      return keepRow;
    })
    .sort(
      (a, b) =>
        (sortFn(a[sortBy]) < sortFn(b[sortBy])
          ? -1
          : sortFn(a[sortBy]) > sortFn(b[sortBy])
          ? 1
          : 0) * sortDirection
    );
  $: totals = [...columns].map(({ key }) =>
    [...datatableRows].reduce((total, row) => total + +row[key], 0)
  );

  // lifecycle
  onMount(() => {
    columns = columns.map((column) => {
      return {
        classes: '',
        filter: '',
        filterClasses: 'w-full',
        format: (v) => v,
        sortFn: (v) => v,
        total: false,
        ...column
      };
    });
    mounted = true;
  });
</script>

{#if mounted}
  <div class="flex flex-col space-y-[1rem] max-w-full overflow-hidden">
    {#if exportable || sortable}
      <div class="flex items-center justify-between self-stretch">
        <div class="flex space-x-[1rem]">
          {#if sortable}
            <Fieldset legend="Sort By">
              <Select bind:value={sortBy} options={sortByOptions} />
            </Fieldset>
            <Fieldset legend="Sort Direction">
              <Select bind:value={sortDirection} options={sortDirectionOptions} />
            </Fieldset>
          {/if}
        </div>
        <div class="flex">
          {#if exportable}
            <Fieldset class="items-end flex-row" legend="Export">
              <Button class="px-[.5rem] mr-[1rem]" on:click={copyClickHandler}>
                <Icon src={Clipboard} />
              </Button>
              <Button class="px-[.5rem]" on:click={csvClickHandler}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_807_30)">
                    <path
                      d="M22.9255 17.5642L20.5345 23.2955C20.4624 23.4707 20.3399 23.6206 20.1824 23.726C20.0248 23.8315 19.8395 23.8878 19.6498 23.8878C19.4602 23.8878 19.2748 23.8315 19.1173 23.726C18.9598 23.6206 18.8372 23.4707 18.7652 23.2955L16.3742 17.5642C16.3255 17.4482 16.3002 17.3237 16.2997 17.1979C16.2992 17.0721 16.3235 16.9474 16.3712 16.831C16.419 16.7146 16.4892 16.6087 16.5779 16.5194C16.6666 16.43 16.772 16.3591 16.8882 16.3105C17.0044 16.2618 17.129 16.2366 17.255 16.2361C17.3809 16.2356 17.5058 16.2598 17.6223 16.3075C17.7389 16.3552 17.8449 16.4253 17.9343 16.5139C18.0238 16.6025 18.0948 16.7079 18.1435 16.8239L19.6498 20.4418L21.1562 16.8239C21.2048 16.7079 21.2759 16.6025 21.3653 16.5139C21.4548 16.4253 21.5608 16.3552 21.6773 16.3075C21.7939 16.2598 21.9187 16.2356 22.0447 16.2361C22.1706 16.2366 22.2953 16.2618 22.4114 16.3105C22.5276 16.3591 22.6331 16.43 22.7218 16.5194C22.8105 16.6087 22.8807 16.7146 22.9285 16.831C22.9762 16.9474 23.0005 17.0721 23 17.1979C22.9995 17.3237 22.9742 17.4482 22.9255 17.5642ZM4.58651 18.1493C4.96767 18.153 5.33394 18.2976 5.61464 18.5552C5.7073 18.6406 5.81614 18.7066 5.93474 18.7494C6.05335 18.7921 6.17932 18.8107 6.30523 18.804C6.43113 18.7973 6.55442 18.7655 6.66783 18.7105C6.78124 18.6555 6.88247 18.5783 6.96556 18.4836C7.13672 18.2967 7.22657 18.0496 7.21536 17.7966C7.20415 17.5436 7.0928 17.3054 6.90578 17.1343C6.26836 16.5626 5.44323 16.244 4.58651 16.2388C2.61393 16.2388 1 17.9582 1 20.0597C1 22.1612 2.61393 23.8806 4.58651 23.8806C5.44323 23.8754 6.26836 23.5568 6.90578 22.9851C7.0928 22.814 7.20415 22.5758 7.21536 22.3228C7.22657 22.0698 7.13672 21.8227 6.96556 21.6358C6.88247 21.5411 6.78124 21.464 6.66783 21.4089C6.55442 21.3539 6.43113 21.3221 6.30523 21.3154C6.17932 21.3088 6.05335 21.3273 5.93474 21.37C5.81614 21.4128 5.7073 21.4788 5.61464 21.5642C5.33394 21.8218 4.96767 21.9664 4.58651 21.9702C3.66597 21.9702 2.9128 21.1105 2.9128 20.0597C2.9128 19.009 3.66597 18.1493 4.58651 18.1493ZM20.6062 8.59703H14.8678C14.6142 8.59703 14.3709 8.49639 14.1915 8.31725C14.0122 8.13811 13.9114 7.89514 13.9114 7.6418V1.91046H3.391V12.4179C3.391 12.6713 3.29024 12.9142 3.11088 13.0934C2.93152 13.2725 2.68826 13.3731 2.4346 13.3731C2.18095 13.3731 1.93768 13.2725 1.75832 13.0934C1.57896 12.9142 1.4782 12.6713 1.4782 12.4179V1.91046C1.4782 1.40378 1.67973 0.91785 2.03845 0.559572C2.39717 0.201294 2.8837 1.53912e-05 3.391 1.53912e-05H14.8678C15.1223 -0.00141739 15.3671 0.0972356 15.5493 0.274642L22.2321 6.96121C22.3239 7.04912 22.3967 7.15485 22.446 7.27189C22.4953 7.38893 22.5202 7.51481 22.519 7.6418V12.4179C22.519 12.6713 22.4183 12.9142 22.2389 13.0934C22.0596 13.2725 21.8163 13.3731 21.5626 13.3731C21.309 13.3731 21.0657 13.2725 20.8864 13.0934C20.707 12.9142 20.6062 12.6713 20.6062 12.4179V8.59703ZM15.8242 6.68658H19.2553L15.8242 3.25971V6.68658ZM12.2019 19.0806C11.8312 18.9851 11.1737 18.806 11.0422 18.6507V18.6269C11.0422 18.2328 11.3291 18.0299 11.8791 18.0299C12.3063 18.0385 12.7217 18.1713 13.0746 18.4119H13.0626C13.2361 18.5496 13.4508 18.6252 13.6723 18.6269C13.926 18.6269 14.1692 18.5262 14.3486 18.3471C14.528 18.168 14.6287 17.925 14.6287 17.6716C14.6311 17.5318 14.601 17.3932 14.5408 17.2669C14.4807 17.1405 14.3921 17.0298 14.282 16.9433C13.5922 16.4147 12.7485 16.1254 11.8791 16.1194C10.2651 16.1194 9.12942 17.1463 9.12942 18.6269C9.12942 20.1075 10.6836 20.6567 11.7117 20.9313C12.1182 21.0388 12.5486 21.1463 12.8116 21.3015C13.0746 21.4567 12.955 21.4209 12.955 21.4925C12.955 21.5642 12.955 22.0896 11.8791 22.0896C11.4519 22.0809 11.0365 21.9481 10.6836 21.7075H10.6955C10.522 21.5698 10.3074 21.4942 10.0858 21.4925C9.83216 21.4925 9.5889 21.5932 9.40954 21.7723C9.23018 21.9515 9.12942 22.1944 9.12942 22.4478C9.12708 22.5876 9.15716 22.7262 9.2173 22.8525C9.27744 22.9789 9.36602 23.0896 9.47611 23.1761C10.1659 23.7047 11.0096 23.994 11.8791 24C13.7441 24 14.8678 23.0567 14.8678 21.4925C14.8678 19.9284 13.1941 19.3433 12.2019 19.0806Z"
                      fill="currentColor"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_807_30">
                      <rect width="24" height="24" fill="currentColor" />
                    </clipPath>
                  </defs>
                </svg>
              </Button>
            </Fieldset>
          {/if}
        </div>
      </div>
    {/if}
    <Card class="p-0 overflow-auto max-w-full relative rounded-none">
      <Table>
        <Thead>
          <Tr>
            {#each columns as { th }}
              <Th
                class={filterable
                  ? 'shadow-[0_0_0_rgba(0,0,0,0)] dark:shadow-[0_0_0_rgba(0,0,0,0)]'
                  : ''}>{th}</Th
              >
            {/each}
          </Tr>
          {#if filterable}
            <Tr>
              {#each columns as { filter, filterClasses }}
                <Th class="px-0 py-0 top-[calc(2.5rem_-_0px)] border-b-[1px] border-blue-500">
                  <Input
                    bind:value={filter}
                    class="rounded-none ring-offset-0 ring-0 {filterClasses}"
                  />
                </Th>
              {/each}
            </Tr>
          {/if}
        </Thead>
        <Tbody>
          {#each datatableRows as row}
            <Tr>
              {#each columns as { classes, key, format }}
                <Td class={classes}>{format(row[key])}</Td>
              {/each}
            </Tr>
          {/each}
        </Tbody>
        {#if [...columns].filter(({ total }) => total).length > 0}
          <tfoot>
            <Tr>
              {#each columns as { classes, format, total }, i}
                <Td
                  class="bottom-0 bg-white dark:bg-gray-800 sticky font-semibold shadow-[inset_0_1px_0_rgba(0,0,0,1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,1)] {classes}"
                  >{total ? format(totals[i]) : ''}</Td
                >
              {/each}
            </Tr>
          </tfoot>
        {/if}
      </Table>
    </Card>
  </div>
{/if}
