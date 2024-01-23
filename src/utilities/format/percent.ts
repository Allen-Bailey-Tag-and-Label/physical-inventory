export const percent = (
	value: number,
	options: { [key: string]: any } = {
		style: 'percent',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}
) => {
	const { format } = new Intl.NumberFormat('en-US', options);

	return format(value);
};
