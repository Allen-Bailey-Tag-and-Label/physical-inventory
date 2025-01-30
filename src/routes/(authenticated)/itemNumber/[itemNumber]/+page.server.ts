import { DateTime } from 'luxon';
import { prisma } from '$lib/prisma/index.js';
import { getItems } from '$utilities';

export const load = async ({ locals, params }) => {
	const { itemNumber } = params;
	const inventoryDate = DateTime.fromFormat(locals.INVENTORY_DATE, 'yyyy-MM-dd', {
		zone: 'America/New_York'
	}).toJSDate();
	const [onHand, tickets] = await Promise.all([
		prisma.onHand.findFirst({
			where: {
				date: inventoryDate
			}
		}),
		prisma.ticket.findMany({
			where: { inventoryDate, itemNumber },
			include: { userCount: true, userVerify: true }
		})
	]);
	const items = getItems(onHand, tickets);
	const item = items.find((obj) => obj.itemNumber === itemNumber);
	console.log(item);

	return { item, tickets };
};
