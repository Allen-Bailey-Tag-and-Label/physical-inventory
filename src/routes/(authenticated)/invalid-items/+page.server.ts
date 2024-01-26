import { INVENTORY_DATE } from '$env/static/private';
import { prisma } from '$lib/prisma/index';
import { getItems } from '$utilities';

export const load = async () => {
	const [onHand, tickets] = await Promise.all([
		prisma.onHand.findFirst({ where: { date: INVENTORY_DATE } }),
		prisma.ticket.findMany()
	]);

	const items = getItems(onHand, tickets);

	const invalidItems = tickets.reduce((invalidItems, ticket) => {
		if (items.find((item) => item.itemNumber === ticket.itemNumber) === undefined) {
			if (invalidItems?.[ticket.itemNumber] === undefined) invalidItems[ticket.itemNumber] = [];
			invalidItems[ticket.itemNumber] = [...invalidItems[ticket.itemNumber], ticket];
		}
		return invalidItems;
	}, {});

	return { invalidItems };
};
