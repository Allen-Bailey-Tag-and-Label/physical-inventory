const { format } = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const currency = (value: number) => format(value);
