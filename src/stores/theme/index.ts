import { theme } from 'sveltewind/stores';
import { sveltewind } from 'sveltewind/themes';
import { twMerge } from 'tailwind-merge';

theme.set(sveltewind);

theme.set({
	buttonIcon: 'px-3',
	buttonTransparent:
		'bg-transparent focus:bg-transparent hover:bg-transparent dark:bg-transparent dark:focus:bg-transparent dark:hover:bg-transparent',
	select: 'py-3',
	tr: 'even:bg-black/5 dark:even:bg-white/[.025]'
});

export { theme };
