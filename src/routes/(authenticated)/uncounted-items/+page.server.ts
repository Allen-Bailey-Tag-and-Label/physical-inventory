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

	const uncountedItems = items.filter((item) => {
		if (item.preCount === 0) return false;
		if (tickets.filter((ticket) => ticket.itemNumber === item.itemNumber).length > 0) return false;
		return true;
	});

	return { uncountedItems };
};
