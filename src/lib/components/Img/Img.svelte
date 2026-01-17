<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';

	type Props = HTMLAttributes<HTMLElement> & {
		alt: string;
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		element?: HTMLImageElement | null;
		offsetHeight?: number;
		offsetWidth?: number;
		src: string;
		transition?: (node: Element, options?: Record<string, any>) => any;
		variants?: string[];
	};
	let {
		alt,
		children,
		class: className,
		clientHeight = $bindable(0),
		clientWidth = $bindable(0),
		element = $bindable(null),
		offsetHeight = $bindable(0),
		offsetWidth = $bindable(0),
		src,
		transition: customTransition = (_) => {},
		variants = [],
		...restProps
	}: Props = $props();
</script>

<img
	{...restProps}
	{alt}
	bind:clientHeight
	bind:clientWidth
	bind:offsetHeight
	bind:offsetWidth
	bind:this={element}
	class={twMerge(
		theme.getComponentVariant('Img', 'default'),
		...variants.map((variant: string) => theme.getComponentVariant('Img', variant)),
		className
	)}
	{src}
	transition:customTransition
/>
