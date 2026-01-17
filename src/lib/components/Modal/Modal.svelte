<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';
	import { Button, Card, Div } from '../';
	import { clickOutside, portal } from '$lib/attachments';
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { grow } from '$lib/transitions';
	import { X } from '@lucide/svelte';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
		backdrop?: Snippet;
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		close?: () => void;
		closeButton?: Snippet;
		content?: Snippet;
		element?: HTMLDivElement | null;
		isBackdrop?: boolean;
		isCloseButton?: boolean;
		isVisible?: boolean;
		offsetHeight?: number;
		offsetWidth?: number;
		open?: () => void;
		title?: Snippet;
		titleText?: string;
		toggle?: () => void;
		transition?: (node: Element, options?: Record<string, any>) => any;
		variants?: string[];
	};
	let {
		backdrop,
		children,
		class: className,
		clientHeight = $bindable(0),
		clientWidth = $bindable(0),
		close = $bindable(() => (isVisible = false)),
		closeButton,
		content,
		element = $bindable(null),
		isBackdrop = $bindable(true),
		isCloseButton = $bindable(true),
		isVisible = $bindable(false),
		offsetHeight = $bindable(0),
		offsetWidth = $bindable(0),
		open = $bindable(() => (isVisible = true)),
		title,
		titleText = $bindable(''),
		toggle = $bindable(() => (isVisible = !isVisible)),
		transition: customTransition = () => grow,
		variants = [],
		...restProps
	}: Props = $props();
</script>

{#if backdrop}
	{@render backdrop()}
{:else if isVisible}
	<Card
		{@attach portal}
		class="fixed top-0 left-0 z-100 h-full w-full rounded-none"
		transition={(element) => fade(element, { duration: 200, easing: cubicInOut })}
	/>
{/if}

<Card
	{...restProps}
	{@attach clickOutside(() => {
		isVisible = false;
	})}
	{@attach portal}
	bind:clientHeight
	bind:clientWidth
	bind:element
	bind:offsetHeight
	bind:offsetWidth
	class={twMerge(
		theme.getComponentVariant('Modal', 'default'),
		...variants.map((variant: string) => theme.getComponentVariant('Modal', variant)),
		className
	)}
	transition={customTransition}
>
	{#if content}
		{@render content()}
	{:else}
		{#if title}
			{@render title()}
		{:else}
			<Div class={twMerge(theme.getComponentVariant('H4', 'default'), 'pb-6')}>
				{titleText}
			</Div>
		{/if}
		{#if children}
			{@render children()}
		{/if}
		{#if isCloseButton}
			{#if closeButton}
				{@render closeButton()}
			{:else}
				<Button class="absolute top-6 right-6" onclick={close} variants={['icon', 'ghost']}>
					<X />
				</Button>
			{/if}
		{/if}
	{/if}
</Card>
