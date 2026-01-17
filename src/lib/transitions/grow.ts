import { cubicInOut } from 'svelte/easing';

type Options = {
	duration?: number;
	easing?: (t: number) => number;
	opacity?: number;
	scale?: number;
};

export const grow = (_: Element, { duration, easing, opacity, scale }: Options = {}) => {
	return {
		duration: duration ?? 200,
		css: (t: number) => {
			const eased = easing?.(t) ?? cubicInOut(t);

			const opacityValue = (opacity ?? 1) * eased;
			const scaleValue = eased * (1 - (scale ?? 0.95)) + (scale ?? 0.95);

			return `
                opacity: ${opacityValue};
                scale: ${scaleValue};
            `;
		}
	};
};
