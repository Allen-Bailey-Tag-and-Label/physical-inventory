<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLSelectAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';
	import { Option } from '..';

	type Props = HTMLSelectAttributes & {
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		element?: HTMLSelectElement | null;
		option?: Snippet<[{ label: any; value: any }]>;
		options?: { label: any; value: any }[];
		offsetHeight?: number;
		offsetWidth?: number;
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
		option,
		options = [],
		offsetHeight = $bindable(0),
		offsetWidth = $bindable(0),
		transition: customTransition = (_) => {},
		value = $bindable(''),
		variants = [],
		...restProps
	}: Props = $props();
</script>

<select
	{...restProps}
	bind:clientHeight
	bind:clientWidth
	bind:offsetHeight
	bind:offsetWidth
	bind:this={element}
	bind:value
	class={twMerge(
		theme.getComponentVariant('Select', 'default'),
		...variants.map((variant: string) => theme.getComponentVariant('Select', variant)),
		className
	)}
	transition:customTransition
>
	{#if children}
		{@render children()}
	{:else}
		{#each options as { label, value: optionValue }}
			{#if option}
				{@render option({ label, value: optionValue })}
			{:else}
				<Option value={optionValue}>
					{label}
				</Option>
			{/if}
		{/each}
	{/if}
</select>
