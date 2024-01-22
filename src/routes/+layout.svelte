<script>
	import { Pwa, Title } from 'sveltewind/components';
	import { theme } from '$stores';
	import '../app.pcss';
</script>

<Pwa />
<Title base="Physical Inventory" />
<slot />
