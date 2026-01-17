<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';

	// Types
	type Props = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		element?: HTMLDivElement | null;
		offsetHeight?: number;
		offsetWidth?: number;
		root?: Element | Document | null;
		rootMargin?: string;
		staggerDuration?: number;
		threshold?: number;
		transition?: (node: Element, options?: Record<string, any>) => any;
		variants?: string[];
	};

	// helpers
	const attachment = () => {
		return (element: Element) => {
			const elements = [...element.querySelectorAll('[data-animate-on-scroll]')];

			const handler = (entries: IntersectionObserverEntry[]) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						elements.forEach(async (childElement, index) => {
							await new Promise((res) => setTimeout(res, index * staggerDuration));
							(childElement as HTMLElement).removeAttribute('data-animate-on-scroll');
						});
					}
				});
			};

			const observer = new IntersectionObserver(handler, {
				root,
				rootMargin,
				threshold
			});

			observer.observe(element);

			return () => {
				observer.unobserve(element);
				observer.disconnect();
			};
		};
	};
	let {
		children,
		class: className,
		clientHeight = $bindable(0),
		clientWidth = $bindable(0),
		element = $bindable(null),
		offsetHeight = $bindable(0),
		offsetWidth = $bindable(0),
		root = null,
		rootMargin = '0px',
		staggerDuration = 25,
		threshold = 0.5,
		transition: customTransition = (_) => {},
		variants = [],
		...restProps
	}: Props = $props();
</script>

<div
	{...restProps}
	{@attach attachment()}
	bind:clientHeight
	bind:clientWidth
	bind:offsetHeight
	bind:offsetWidth
	bind:this={element}
	class={twMerge(
		theme.getComponentVariant('AnimateOnScrollGroup', 'default'),
		...variants.map((variant: string) =>
			theme.getComponentVariant('AnimateOnScrollGroup', variant)
		),
		className
	)}
	transition:customTransition
>
	{#if children}
		{@render children()}
	{/if}
</div>
