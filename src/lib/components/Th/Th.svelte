<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';

	type Props = HTMLAttributes<HTMLElement> & {
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		element?: HTMLElement | null;
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

<th
	{...restProps}
	bind:clientHeight
	bind:clientWidth
	bind:offsetHeight
	bind:offsetWidth
	bind:this={element}
	class={twMerge(
		theme.getComponentVariant('Th', 'default'),
		...variants.map((variant: string) => theme.getComponentVariant('Th', variant)),
		className
	)}
	transition:customTransition
>
	{#if children}
		{@render children()}
	{/if}
</th>
