type Options = Intl.DateTimeFormatOptions & {
	locale?: Intl.LocalesArgument;
};

export const date = (date: Date, options: Options = { locale: 'en-CA' }) => {
	try {
		const { locale, ...restOptions } = options;
		const { format } = new Intl.DateTimeFormat(locale ?? 'en-CA', restOptions);

		return format(date);
	} catch (error) {
		return 'Invalid Date Format';
	}
};
