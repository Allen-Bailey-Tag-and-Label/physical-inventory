<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';
	import { Div, Label } from '..';

	type Props = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		element?: HTMLDivElement | null;
		label?: string;
		labelSnippet?: Snippet;
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
		label = $bindable(''),
		labelSnippet,
		offsetHeight = $bindable(0),
		offsetWidth = $bindable(0),
		transition: customTransition = (_) => {},
		variants = [],
		...restProps
	}: Props = $props();
</script>

<Div
	{...restProps}
	bind:clientHeight
	bind:clientWidth
	bind:element
	bind:offsetHeight
	bind:offsetWidth
	class={twMerge(
		theme.getComponentVariant('Field', 'default'),
		...variants.map((variant: string) => theme.getComponentVariant('Field', variant)),
		className
	)}
	transition={customTransition}
>
	{#if labelSnippet}
		{@render labelSnippet()}
	{:else}
		<Label>{label}</Label>
	{/if}
	{#if children}
		{@render children()}
	{/if}
</Div>
