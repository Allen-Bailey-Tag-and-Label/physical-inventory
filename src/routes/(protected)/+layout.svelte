<script>
  import { browser } from '$app/environment';
  import { Header } from '$components';
  import store from './store';

  // props (external)
  export let data;

  // props (dynamic)
  $: if (browser) {
    $store.online = window.navigator.onLine;
    window.addEventListener('online', () => ($store.online = true));
    window.addEventListener('offline', () => ($store.online = false));
  }
</script>

<div class="flex flex-grow flex-col overflow-hidden">
  <Header {data} />
  <slot {data} />
</div>
