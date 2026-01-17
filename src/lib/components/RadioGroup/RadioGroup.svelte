<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';
	import { Card, Radio } from '..';

	type Props = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		element?: HTMLDivElement | null;
		group?: any;
		offsetHeight?: number;
		offsetWidth?: number;
		transition?: (node: Element, options?: Record<string, any>) => any;
		values?: any[];
		variants?: string[];
	};
	let {
		children,
		class: className,
		clientHeight = $bindable(0),
		clientWidth = $bindable(0),
		element = $bindable(null),
		group = $bindable(null),
		offsetHeight = $bindable(0),
		offsetWidth = $bindable(0),
		transition: customTransition = (_) => {},
		values,
		variants = [],
		...restProps
	}: Props = $props();
</script>

<Card
	{...restProps}
	bind:clientHeight
	bind:clientWidth
	bind:offsetHeight
	bind:offsetWidth
	bind:element
	class={twMerge(
		theme.getComponentVariant('RadioGroup', 'default'),
		...variants.map((variant: string) => theme.getComponentVariant('RadioGroup', variant)),
		className
	)}
	transition={customTransition}
>
	{#if children}
		{@render children()}
	{:else}
		{#each values as value}
			<Radio bind:group {value} />
		{/each}
	{/if}
</Card>
