import { DateTime } from 'luxon';
import { prisma } from '$lib/prisma/index.js';
import { getItems } from '$utilities';

export const load = async ({ locals, params }) => {
	const { itemNumber } = params;
	const [onHand, tickets] = await Promise.all([
		prisma.onHand.findFirst({
			where: {
				date: DateTime.fromFormat(locals.INVENTORY_DATE, 'yyyy-MM-dd', {
					zone: 'America/New_York'
				}).toJSDate()
			}
		}),
		prisma.ticket.findMany({
			where: { itemNumber },
			include: { userCount: true, userVerify: true }
		})
	]);
	const items = getItems(onHand, tickets);
	const item = items.find((obj) => obj.itemNumber === itemNumber);

	return { item, tickets };
};
