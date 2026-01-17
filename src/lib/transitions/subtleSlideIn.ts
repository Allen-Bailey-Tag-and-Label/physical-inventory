import { cubicInOut } from 'svelte/easing';

type Options = {
	duration?: number;
	easing?: (t: number) => number;
	translate?: {
		x?: string;
		y?: string;
	};
};

export const subtleSlideIn = (_: Element, { duration, easing, translate }: Options = {}) => {
	return {
		duration: duration ?? 200,
		css: (t: number) => {
			const eased = easing?.(t) ?? cubicInOut(t);

			const opacity = eased;
			const translateY = (1 - eased) * 0.5;

			return `
                opacity: ${opacity};
                translate: ${translate?.x ?? '-50%'} calc(${translate?.y ?? '-50%'} - ${translateY}rem);
            `;
		}
	};
};
