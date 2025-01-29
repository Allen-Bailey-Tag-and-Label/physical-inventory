import { prisma } from '$lib/prisma/index';
import { DateTime } from 'luxon';

export const load = async ({ locals }) => {
	const inventoryDate = DateTime.fromFormat(locals.INVENTORY_DATE, 'yyyy-MM-dd', {
		zone: 'America/New_York'
	}).toJSDate();
	const [tickets, users] = await Promise.all([
		prisma.ticket.findMany({ where: { inventoryDate } }),
		prisma.user.findMany({ orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }] })
	]);

	const rows = users
		.map((user) => {
			const counted = [...tickets].filter((ticket) => ticket.userCountId === user.id);
			const countedValuation = counted.reduce(
				(total, ticket) => (total += ticket.cost07 * ticket.count),
				0
			);
			const verified = [...tickets].filter((ticket) => ticket.userVerifyId === user.id);
			return {
				...user,
				counted,
				countedValuation,
				verified
			};
		})
		.filter(({ counted, verified }) => counted.length > 0 || verified.length > 0);

	return { rows };
};
