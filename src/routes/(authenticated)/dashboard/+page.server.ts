import { DateTime } from 'luxon';
import { prisma } from '$lib/prisma';

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
	const myCountedTickets = [...tickets].filter((ticket) => ticket.userCountId === locals.user.id);
	const myVerifiedTickets = [...tickets].filter((ticket) => ticket.userVerifyId === locals.user.id);

	return {
		myCountedTickets,
		myVerifiedTickets,
		onHand: onHand ? onHand : { fg: '', raw: '' },
		tickets
	};
};
