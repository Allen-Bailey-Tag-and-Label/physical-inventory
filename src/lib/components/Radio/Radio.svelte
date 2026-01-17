<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLLabelAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';
	import { Label } from '..';

	type Props = HTMLLabelAttributes & {
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		element?: HTMLLabelElement | null;
		group?: any;
		input?: Snippet;
		name?: string;
		offsetHeight?: number;
		offsetWidth?: number;
		readonly?: boolean;
		required?: boolean;
		transition?: (node: Element, options?: Record<string, any>) => any;
		value?: any;
		variants?: string[];
	};
	let {
		children,
		class: className,
		clientHeight = $bindable(0),
		clientWidth = $bindable(0),
		element = $bindable(null),
		group = $bindable(null),
		input,
		name,
		offsetHeight = $bindable(0),
		offsetWidth = $bindable(0),
		readonly,
		required,
		transition: customTransition = (_) => {},
		value,
		variants = [],
		...restProps
	}: Props = $props();
</script>

<Label
	{...restProps}
	bind:clientHeight
	bind:clientWidth
	bind:offsetHeight
	bind:offsetWidth
	bind:element
	class={twMerge(
		theme.getComponentVariant('Radio', 'default'),
		...variants.map((variant: string) => theme.getComponentVariant('Radio', variant)),
		className
	)}
	transition={customTransition}
>
	{#if input}
		{@render input()}
	{:else}
		<input bind:group class="sr-only" {name} {readonly} {required} type="radio" {value} />
	{/if}
	{#if children}
		{@render children()}
	{:else}
		{value}
	{/if}
</Label>
