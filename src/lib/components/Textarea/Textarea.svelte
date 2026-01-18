<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLTextareaAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';

	type Props = HTMLTextareaAttributes & {
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		element?: HTMLTextAreaElement | null;
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
		offsetHeight = $bindable(0),
		offsetWidth = $bindable(0),
		transition: customTransition = (_) => {},
		value = $bindable(),
		variants = [],
		...restProps
	}: Props = $props();
</script>

<textarea
	{...restProps}
	bind:clientHeight
	bind:clientWidth
	bind:offsetHeight
	bind:offsetWidth
	bind:this={element}
	bind:value
	class={twMerge(
		theme.getComponentVariant('Textarea', 'default'),
		...variants.map((variant: string) => theme.getComponentVariant('Textarea', variant)),
		className
	)}
	transition:customTransition
>
</textarea>
