<script>
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
      <a class="px-[1rem] py-[.5rem]" {href}>{innerHTML}</a>
    {/each}
  </slot>
</Card>
