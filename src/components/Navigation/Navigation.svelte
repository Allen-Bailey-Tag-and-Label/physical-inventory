<script>
  import { page } from '$app/stores';
  import { adminLinks, defaultLinks } from './index';

  // props (external)
  export let data;

  // props (dynamic)
  $: links = [...defaultLinks, ...(data.user?.isAdmin ? adminLinks : [])].sort((a, b) =>
    a.innerHTML < b.innerHTML ? -1 : a.innerHTML > b.innerHTML ? 1 : 0
  );
</script>

<div class="flex">
  <slot>
    {#each links as { href, innerHTML }}
      <a
        class="px-[1rem] py-[.5rem] ring ring-transparent transition duration-200 {$page.url
          .pathname === href
          ? 'bg-blue-500 text-white'
          : 'hover:bg-black/[.1] focus:bg-black/[.1] focus:ring-primary-500/[.3] dark:hover:bg-white/[.1] dark:focus:bg-white/[.1]'}"
        {href}>{innerHTML}</a
      >
    {/each}
  </slot>
</div>
