const { format } = new Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency' });

export const currency = (value: number) => format(value);
