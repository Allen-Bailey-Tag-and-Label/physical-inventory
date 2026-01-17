<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLFormAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';
	import type { ActionResult } from '@sveltejs/kit';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	type Props = HTMLFormAttributes & {
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		element?: HTMLFormElement | null;
		error?: string | null;
		isSubmitted?: boolean;
		offsetHeight?: number;
		offsetWidth?: number;
		onsubmit?: (event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => any;
		onsubmitComplete?: (result: ActionResult) => any;
		transition?: (node: Element, options?: Record<string, any>) => any;
		variants?: string[];
	};
	let {
		children,
		class: className,
		clientHeight = $bindable(0),
		clientWidth = $bindable(0),
		element = $bindable(null),
		error = $bindable(null),
		isSubmitted = $bindable(false),
		offsetHeight = $bindable(0),
		offsetWidth = $bindable(0),
		onsubmit = $bindable(
			async (event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
				event.preventDefault();
				const body = new FormData(event.currentTarget, event.submitter);
				error = null;
				isSubmitted = true;

				const response = await fetch(event.currentTarget.action, {
					body,
					method: 'POST'
				});

				const result: ActionResult = deserialize(await response.text());

				isSubmitted = false;

				if (result.type === 'failure' && result?.data?.message) {
					error = result.data.message;
				} else if (result.type === 'success') {
					await invalidateAll();
				}

				applyAction(result);

				await onsubmitComplete(result);
			}
		),
		onsubmitComplete = $bindable(async () => {}),
		transition: customTransition = (_) => {},
		variants = [],
		...restProps
	}: Props = $props();
</script>

<form
	{...restProps}
	bind:clientHeight
	bind:clientWidth
	bind:offsetHeight
	bind:offsetWidth
	bind:this={element}
	class={twMerge(
		theme.getComponentVariant('Form', 'default'),
		...variants.map((variant: string) => theme.getComponentVariant('Form', variant)),
		className
	)}
	{onsubmit}
	transition:customTransition
>
	{#if children}
		{@render children()}
	{/if}
</form>
