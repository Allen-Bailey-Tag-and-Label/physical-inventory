<script lang="ts">
	import { type Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';

	type Props = {
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		element?: SVGElement | null;
		offsetHeight?: number;
		offsetWidth?: number;
		transition?: (node: Element, options?: Record<string, any>) => any;
		variants?: string[];
	};
	let {
		children,
		class: className,
		clientHeight = $bindable(0),
		clientWidth = $bindable(0),
		element = $bindable(null),
		offsetHeight = $bindable(0),
		offsetWidth = $bindable(0),
		transition: customTransition = (_) => {},
		variants = [],
		...restProps
	}: Props = $props();
</script>

<svg
	{...restProps}
	bind:clientHeight
	bind:clientWidth
	bind:this={element}
	class={twMerge(
		theme.getComponentVariant('Logo', 'default'),
		...variants.map((variant: string) => theme.getComponentVariant('Logo', variant)),
		className
	)}
	transition:customTransition
	viewBox="0 0 24 11"
	fill="none"
>
	<path
		d="M12 0.366428C12 0.366428 4 2.3947 4 11C6.667 11 12 11 12 11C12 11 17.3335 11 20 11C20 2.3947 12 0.366428 12 0.366428Z"
		fill="currentColor"
	/>
	<path
		d="M3.1785 8.7956C3.451 7.1423 4.021 5.73705 4.7625 4.5562C3.2575 3.46005 1.6135 1.9745 1.0495 0.39545C1.048 0.38995 1.046 0.38555 1.044 0.3817C1.04 0.3696 1.0345 0.3586 1.031 0.34815C1.031 0.34815 1.027 0.35035 1.0265 0.35145C0.936 0.1452 0.7575 0 0.5455 0C0.244 0 0 0.2849 0 0.6358C0 4.7762 1.846 7.5592 3.137 9.00185C3.1495 8.932 3.1655 8.86545 3.1785 8.7956Z"
		fill="currentColor"
	/>
	<path
		d="M23.4545 0C23.2425 0 23.0635 0.1452 22.974 0.35145C22.3975 1.96405 20.671 3.5255 19.141 4.6277C19.926 5.8091 20.555 7.2501 20.8625 9.00295C22.1535 7.5603 24 4.77785 24 0.6358C24 0.2849 23.756 0 23.4545 0Z"
		fill="currentColor"
	/>
</svg>
