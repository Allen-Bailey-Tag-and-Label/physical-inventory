<script>
  import { page } from '$app/stores';

  // props (internal)
  let links = [
    { href: '/dashboard', innerHTML: 'Dashboard' },
    { href: '/enter-count', innerHTML: 'Enter Count' },
    { href: '/item-lookup', innerHTML: 'Item Lookup' }
  ];
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
