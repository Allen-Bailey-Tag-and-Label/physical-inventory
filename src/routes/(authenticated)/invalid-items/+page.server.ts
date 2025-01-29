import { DateTime } from 'luxon';
import { prisma } from '$lib/prisma/index';
import { getItems } from '$utilities';

export const load = async ({ locals }) => {
	const inventoryDate = DateTime.fromFormat(locals.INVENTORY_DATE, 'yyyy-MM-dd', {
		zone: 'America/New_York'
	}).toJSDate();
	const [onHand, tickets] = await Promise.all([
		prisma.onHand.findFirst({
			where: {
				date: inventoryDate
			}
		}),
		prisma.ticket.findMany({ where: { inventoryDate } })
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
