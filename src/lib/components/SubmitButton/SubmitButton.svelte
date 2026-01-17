<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLButtonAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';
	import { Button, Div, Spinner } from '..';

	type Props = HTMLButtonAttributes & {
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		content?: Snippet;
		element?: HTMLButtonElement | null;
		isSubmitted?: boolean;
		offsetHeight?: number;
		offsetWidth?: number;
		transition?: (node: Element, options?: Record<string, any>) => any;
		type?: 'button' | 'reset' | 'submit';
		variants?: string[];
	};
	let {
		children,
		class: className,
		clientHeight = $bindable(0),
		clientWidth = $bindable(0),
		content,
		element = $bindable(null),
		isSubmitted = $bindable(false),
		offsetHeight = $bindable(0),
		offsetWidth = $bindable(0),
		transition: customTransition = (_) => {},
		type = $bindable('submit'),
		variants = [],
		...restProps
	}: Props = $props();
</script>

<Button
	{...restProps}
	bind:clientHeight
	bind:clientWidth
	bind:offsetHeight
	bind:offsetWidth
	bind:element
	class={twMerge(
		theme.getComponentVariant('SubmitButton', 'default'),
		...variants.map((variant: string) => theme.getComponentVariant('SubmitButton', variant)),
		className
	)}
	transition={customTransition}
	{type}
>
	{#if content}
		{@render content()}
	{:else}
		<Div class="relative h-full w-full overflow-hidden">
			<Div
				class={twMerge(
					'transition duration-200',
					isSubmitted ? 'translate-y-[-200%]' : 'translate-y-0'
				)}
			>
				{#if children}
					{@render children()}
				{/if}
			</Div>
			<Div
				class={twMerge(
					'absolute top-1/2 left-1/2 -translate-x-1/2 transition duration-200',
					isSubmitted ? '-translate-y-1/2' : 'translate-y-[150%]'
				)}
			>
				<Spinner />
			</Div>
		</Div>
	{/if}
</Button>
