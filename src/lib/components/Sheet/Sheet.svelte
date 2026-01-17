<script lang="ts">
	import { type Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';
	import { Modal } from '..';
	import { cubicInOut } from 'svelte/easing';

	type Props = {
		backdrop?: Snippet;
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		closeButton?: Snippet;
		content?: Snippet;
		element?: HTMLDivElement | null;
		isBackdrop?: boolean;
		isCloseButton?: boolean;
		offsetHeight?: number;
		offsetWidth?: number;
		position?: 'bottom' | 'left' | 'right' | 'top';
		title?: Snippet;
		titleText?: string;
		transition?: (node: Element, options?: Record<string, any>) => any;
		variants?: string[];
	};
	let {
		backdrop,
		children,
		class: className,
		clientHeight = $bindable(0),
		clientWidth = $bindable(0),
		closeButton,
		content,
		element = $bindable(null),
		isBackdrop = $bindable(true),
		isCloseButton = $bindable(true),
		offsetHeight = $bindable(0),
		offsetWidth = $bindable(0),
		position = $bindable('right'),
		title,
		titleText = $bindable(''),
		transition,
		variants = [],
		...restProps
	}: Props = $props();

	const positionClasses: { bottom: string; left: string; right: string; top: string } = {
		bottom: 'left-0 bottom-0 max-w-screen w-full max-h-[calc(100vh-3rem)] sm:h-auto',
		left: 'left-0 top-0 max-h-screen h-full max-w-[calc(100vw-3rem)] sm:w-auto',
		right: 'right-0 top-0 max-h-screen h-full max-w-[calc(100vw-3rem)] sm:w-auto',
		top: 'left-0 top-0 max-w-screen w-full max-h-[calc(100vh-3rem)] sm:h-auto'
	};

	// $derives
	const positionTransition = $derived(() => {
		return {
			duration: 200,
			css: (t: number) => {
				const eased = cubicInOut(t);

				if (position === 'bottom') return `translate: 0 ${(1 - eased) * 100}%`;
				if (position === 'left') return `translate: -${(1 - eased) * 100}% 0`;
				if (position === 'right') return `translate: ${(1 - eased) * 100}% 0`;
				if (position === 'top') return `translate: 0 -${(1 - eased) * 100}%`;
				return ``;
			}
		};
	});
</script>

<Modal
	{...restProps}
	{backdrop}
	bind:clientHeight
	bind:clientWidth
	bind:isBackdrop
	bind:isCloseButton
	bind:offsetHeight
	bind:offsetWidth
	bind:element
	class={twMerge(
		theme.getComponentVariant('Sheet', 'default'),
		...variants.map((variant: string) => theme.getComponentVariant('Sheet', variant)),
		positionClasses[position],
		className
	)}
	{closeButton}
	{title}
	{titleText}
	transition={transition ? transition : positionTransition}
>
	{#if content}
		{@render content()}
	{:else if children}
		{@render children()}
	{/if}
</Modal>
