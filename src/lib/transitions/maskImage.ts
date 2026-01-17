import { cubicInOut } from 'svelte/easing';

type Options = {
	delay?: number;
	direction?: 'down' | 'left' | 'right' | 'up';
	duration?: number;
	easing?: (t: number) => number;
};

export const maskImage = (_: Element, { delay, direction, duration, easing }: Options = {}) => {
	return {
		delay: delay ?? 0,
		duration: duration ?? 200,
		css: (t: number) => {
			const eased = easing?.(t) ?? cubicInOut(t);

			const maskImage = {
				deg: 180,
				from: `black ${eased * 100}%`,
				to: 'transparent 0%'
			};

			if (direction === 'left') maskImage.deg = 270;
			if (direction === 'right') maskImage.deg = 90;
			if (direction === 'up') maskImage.deg = 0;

			return `
                mask-image: linear-gradient(${maskImage.deg}deg, ${maskImage.from}, ${maskImage.to});
                -webkit-mask-image: linear-gradient(${maskImage.deg}deg, ${maskImage.from}, ${maskImage.to});
            `;
		}
	};
};
