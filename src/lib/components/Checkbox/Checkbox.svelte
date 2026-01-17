<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLLabelAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';
	import { Div, Label } from '..';
	import { Check } from '@lucide/svelte';
	import { grow } from '$lib/transitions';

	type Props = HTMLLabelAttributes & {
		checked?: boolean;
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		checkmark?: Snippet;
		element?: HTMLLabelElement | null;
		input?: Snippet;
		name?: string;
		offsetHeight?: number;
		offsetWidth?: number;
		readonly?: boolean;
		required?: boolean;
		transition?: (node: Element, options?: Record<string, any>) => any;
		variants?: string[];
	};
	let {
		checked = $bindable(false),
		children,
		class: className,
		clientHeight = $bindable(0),
		clientWidth = $bindable(0),
		checkmark,
		element = $bindable(null),
		input,
		name,
		offsetHeight = $bindable(0),
		offsetWidth = $bindable(0),
		readonly,
		required,
		transition: customTransition = (_) => {},
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
		theme.getComponentVariant('Checkbox', 'default'),
		...variants.map((variant: string) => theme.getComponentVariant('Checkbox', variant)),
		className
	)}
	transition={customTransition}
>
	{#if input}
		{@render input()}
	{:else}
		<input bind:checked class="sr-only" {name} {readonly} {required} type="checkbox" />
	{/if}

	{#if checkmark}
		{@render checkmark()}
	{:else if checked}
		<Div transition={(element) => grow(element, { scale: 0 })}>
			<Check />
		</Div>
	{/if}
</Label>
