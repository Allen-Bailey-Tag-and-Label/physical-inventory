import { prisma } from '$lib/prisma';
import { items } from '$stores/items/items';

export const load = async () => {
	let [tickets] = await Promise.all([prisma.ticket.findMany({ orderBy: [{ number: 'asc' }] })]);

	tickets = tickets.map((ticket) => {
		const item = items.find((obj) => obj.itemNumber === ticket.itemNumber);
		const isValidItemNumber = item !== undefined && item !== null;
		return {
			...ticket,
			isValidItemNumber
		};
	});
	return { tickets };
};
