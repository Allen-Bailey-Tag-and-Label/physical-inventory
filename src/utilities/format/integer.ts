const { format } = new Intl.NumberFormat();

export const integer = (value: number) => format(value);
