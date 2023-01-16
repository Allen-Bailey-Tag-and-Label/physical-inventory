<script>
  import { page } from '$app/stores';
  import { Card } from '$components';

  // props (internal)
  let links = [
    { href: '/dashboard', innerHTML: 'Dashboard' },
    { href: '/enter-count', innerHTML: 'Enter Count' }
  ];
</script>

<Card class="flex-row items-center px-0 py-0 rounded-none">
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
</Card>
