<script>
  import { theme } from 'sveltewind/stores';
  import { page } from '$app/stores';
  import '../app.postcss';

  theme.set({
    card: 'dark:bg-white/[.025]',
    checkbox: 'bg-transparent dark:bg-tranparent',
    form: 'min-w-[320px]',
    input: 'bg-transparent dark:bg-transparent',
    select: 'bg-transparent dark:bg-gray-800',
    table: 'bg-transparent dark:bg-transparent',
    textarea: 'bg-transparent dark:bg-transparent',
    th: 'dark:bg-gray-800 sticky top-0 border-b-0 shadow-[inset_0_-1px_0_rgba(0,0,0,1)] dark:shadow-[inset_0_-1px_0_rgba(255,255,255,1)]',
    tr: 'transition duration-200 odd:bg-black/[.05] dark:odd:bg-white/[.05] hover:bg-blue-500/[.05] hover:odd:bg-blue-500/[.1]'
  });

  $: title = [
    ...$page.url.pathname
      .substring(1)
      .split('/')
      .map((directory) => {
        const words = directory
          .split('-')
          .map((word) =>
            word.length === 3 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)
          );
        return words.join(' ');
      }),
    'Physical Inventory',
    'Allen Baily Tag & Label'
  ].join(' - ');
</script>

<svelte:head>
  <title>{title}</title>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
  <meta name="msapplication-TileColor" content="#da532c" />
  <meta name="theme-color" content="#ffffff" />
  <meta name="description" content="Allen Bailey Tag & Label Physical Inventory App" />
</svelte:head>

<slot />

<style>
  :global(::-webkit-scrollbar) {
    height: 0.5rem;
    width: 0.5rem;
  }
  :global(::-webkit-scrollbar-thumb) {
    background: rgb(11, 92, 224);
    border-radius: 0.5rem;
  }
</style>
