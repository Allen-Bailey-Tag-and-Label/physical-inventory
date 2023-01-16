<script>
  import { theme } from 'sveltewind/stores';
  import { page } from '$app/stores';
  import '../app.postcss';

  theme.set({
    card: 'dark:bg-white/[.025]',
    form: 'min-w-[320px]',
    input: 'bg-transparent dark:bg-transparent',
    select: 'bg-transparent dark:bg-gray-800',
    th: 'dark:bg-gray-800'
  });

  $: title = [
    ...$page.url.pathname
      .substring(1)
      .split('/')
      .map((directory) => {
        const words = directory
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
        return words.join(' ');
      }),
    'Physical Inventory',
    'Allen Baily Tag & Label'
  ].join(' - ');
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<slot />

<style>
  :global(::-webkit-scrollbar) {
    width: 0.5rem;
  }
  :global(::-webkit-scrollbar-thumb) {
    background: rgb(11, 92, 224);
    border-radius: 0.5rem;
  }
</style>
