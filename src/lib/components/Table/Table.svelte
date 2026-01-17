<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLTableAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';

	type Props = HTMLTableAttributes & {
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		element?: HTMLTableElement | null;
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

<table
	{...restProps}
	bind:clientHeight
	bind:clientWidth
	bind:offsetHeight
	bind:offsetWidth
	bind:this={element}
	class={twMerge(
		theme.getComponentVariant('Table', 'default'),
		...variants.map((variant: string) => theme.getComponentVariant('Table', variant)),
		className
	)}
	transition:customTransition
>
	{#if children}
		{@render children()}
	{/if}
</table>
