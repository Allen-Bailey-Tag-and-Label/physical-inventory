import { twMerge } from 'tailwind-merge';

const backdropBlur = 'backdrop-blur';
const background = 'bg-gray-50 dark:bg-gray-950';
const duration = 'duration-200';
const glass = {
	light: 'bg-gray-50/60',
	dark: 'dark:bg-gray-950/80'
};
const outline = 'outline-none';
const padding = {
	x: 'px-6',
	y: 'py-3'
};
const ring = 'inset-ring inset-ring-gray-950/10 dark:inset-ring-gray-50/5';
const rounded = 'rounded-md';
const shadow = 'shadow-lg dark:shadow-black/50';
const transition = 'transition';

const input = twMerge(
	background,
	duration,
	outline,
	padding.x,
	padding.y,
	twMerge(
		ring,
		'hover:inset-ring-primary-500 focus:inset-ring-primary-500',
		'ring-2 ring-transparent focus:ring-primary-500/30'
	),
	rounded,
	shadow,
	transition
);

const theme: Record<string, Record<string, string>> = {
	A: {
		default:
			'shadow-[0_0.09375rem_0_var(--color-primary-500)] hover:shadow-transparent transition duration-200'
	},
	AnimateOnScroll: {
		default: 'inline-block',
		slideDown: 'overflow-hidden data-[animate-on-scroll]:[&>*]:translate-y-[calc(-100%_-_2rem)]',
		slideUp: 'overflow-hidden data-[animate-on-scroll]:[&>*]:translate-y-[calc(100%_+_2rem)]'
	},
	AnimateOnScrollGroup: { default: '' },
	Button: {
		contrast:
			'bg-gray-950 text-gray-50 hover:bg-gray-900 focus:bg-gray-900 hover:text-gray-50 focus:text-gray-50 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gray-100 dark:focus:bg-gray-100 dark:hover:text-gray-950 dark:focus:text-gray-950',
		default: twMerge(
			outline,
			padding.x,
			padding.y,
			rounded,
			'bg-primary-500 cursor-pointer text-white hover:bg-primary-600 focus:bg-primary-700 transition duration-200 disabled:bg-gray-500 disabled:text-white'
		),
		error: 'bg-red-500 hover:bg-red-600 focus:bg-red-600',
		ghost:
			'bg-transparent text-current hover:bg-black/10 focus:bg-black/10 dark:hover:bg-white/10 dark:focus:bg-white/10',
		icon: 'px-3',
		light: 'bg-gray-50 text-gray-950 hover:bg-white focus:bg-white',
		square: 'rounded-none'
	},
	Canvas: { default: '' },
	Card: {
		blueToPurple:
			'bg-linear-to-br from-blue-500 to-purple-500 selection:bg-white selection:text-blue-500',
		default: twMerge(
			twMerge(backdropBlur, glass.light, glass.dark, 'backdrop-blur'),
			ring,
			rounded,
			shadow,
			'p-6 flex flex-col'
		),
		greenToTeal:
			'bg-linear-to-br from-green-500 to-teal-500 selection:bg-white selection:text-green-500',
		light: 'dark:bg-white dark:text-slate-950',
		orangeToRed:
			'bg-linear-to-br from-orange-500 to-red-500 selection:bg-white selection:text-orange-500'
	},
	Checkbox: {
		default: twMerge(
			input,
			'flex items-center justify-center aspect-square w-8 p-0 has-checked:bg-primary-500 dark:has-checked:bg-primary-500 has-checked:text-gray-50'
		)
	},
	Container: {
		default: twMerge(padding.x, 'mx-auto w-full max-w-7xl'),
		full: 'max-w-none'
	},
	Div: {
		default: ''
	},
	Field: { default: 'flex flex-col' },
	Footer: {
		default:
			'py-24 sm:py-26 md:py-28 lg:py-30 xl:py-32 bg-gray-950 text-gray-50 dark:bg-gray-50 dark:text-gray-950'
	},
	Form: {
		default: ''
	},
	H1: {
		default: 'text-6xl font-semibold'
	},
	H2: {
		default: 'text-5xl font-semibold'
	},
	H3: {
		default: 'text-4xl font-semibold'
	},
	H4: {
		default: 'text-3xl font-semibold'
	},
	H5: {
		default: 'text-2xl font-semibold'
	},
	H6: {
		default: 'text-xl font-semibold'
	},
	Header: {
		default: twMerge(
			backdropBlur,
			duration,
			glass.dark,
			glass.light,
			transition,
			'sticky top-0 z-100'
		)
	},
	Img: { default: '' },
	Input: {
		default: twMerge(input),
		error:
			'inset-ring-red-500 dark:inset-ring-red-500 hover:inset-ring-red-500 hover:dark:inset-ring-red-500 focus:inset-ring-red-500 focus:dark:inset-ring-red-500',
		glass: twMerge(backdropBlur, glass.light, glass.dark),
		light: 'dark:bg-gray-50 dark:text-slate-950'
	},
	Label: { default: 'whitespace-nowrap' },
	Logo: { default: 'h-12' },
	Modal: {
		default:
			'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[calc(100vh-3rem)] overflow-auto z-100 w-full max-w-[calc(100vw-3rem)] sm:max-w-lg',
		error: 'bg-red-500 dark:bg-red-500 text-white dark:text-white'
	},
	Nav: { default: '' },
	Option: { default: '' },
	P: { default: '' },
	Radio: {
		default: twMerge(
			input,
			'has-checked:inset-ring-primary-500 has-checked:bg-primary-200 dark:has-checked:bg-primary-800'
		)
	},
	RadioGroup: { default: twMerge('p-1') },
	Section: {
		min: 'py-0',
		default: 'py-[12.5vh]'
	},
	Select: {},
	Span: { default: '' },
	Spinner: { default: 'w-6 aspect-square' },
	Sheet: {
		default:
			'max-w-none sm:max-w-none max-h-none top-auto right-auto bottom-auto left-auto translate-x-0 translate-y-0 rounded-none'
	},
	SubmitButton: { default: '' },
	Table: {
		default: twMerge(
			shadow,
			'inset-ring inset-ring-gray-950/10 dark:inset-ring-gray-50/5 bg-gray-50 dark:bg-gray-950 p-6'
		)
	},
	Tbody: {
		default: ''
	},
	Td: {
		default: twMerge(padding.x, padding.y)
	},
	Textarea: {},
	Th: {
		default: twMerge(
			padding.x,
			padding.y,
			'bg-gray-950 text-gray-50 dark:bg-gray-50 dark:text-gray-950'
		)
	},
	Thead: {
		default: ''
	},
	Tr: {
		default:
			'transition duration-200 bg-transparent [&>td]:transition [&>td]:duration-200 [&>td]:bg-white even:[&>td]:bg-gray-100 dark:[&>td]:bg-gray-950 dark:even:[&>td]:bg-gray-900 hover:[&>td]:bg-primary-50 even:hover:[&>td]:bg-primary-50 dark:hover:[&>td]:bg-primary-950 dark:even:hover:[&>td]:bg-primary-950'
	}
};

Object.keys(theme.Button).forEach((key) => {
	theme.A[`button${key[0].toUpperCase() + key.slice(1)}`] = twMerge(
		'shadow-none',
		theme.Button[key]
	);
	theme.SubmitButton[key] = theme.Button[key];
});
Object.keys(theme.Input).forEach((key) => {
	theme.Select[key] = theme.Input[key];
	theme.Textarea[key] = theme.Input[key];
});

export { theme };
