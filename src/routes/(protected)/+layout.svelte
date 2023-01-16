<script>
  import { Header } from '$components';

  // props (external)
  export let data;
</script>

<div class="flex flex-grow flex-col overflow-hidden">
  <Header />
  <slot {data} />
</div>
