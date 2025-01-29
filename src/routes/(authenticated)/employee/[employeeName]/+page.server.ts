import { prisma } from '$lib/prisma/index.js';
import { DateTime } from 'luxon';

export const load = async ({ locals, params }) => {
	const inventoryDate = DateTime.fromFormat(locals.INVENTORY_DATE, 'yyyy-MM-dd', {
		zone: 'America/New_York'
	}).toJSDate();
	const { employeeName } = params;
	const [firstName, lastName] = employeeName.split(/\s/g);
	const [allTickets, user] = await Promise.all([
		prisma.ticket.findMany({
			where: { inventoryDate },
			include: { userCount: true, userVerify: true },
			orderBy: [{ dateCreated: 'asc' }]
		}),
		prisma.user.findFirst({ where: { firstName, lastName } })
	]);
	const tickets = allTickets.filter(
		(ticket) => ticket.userCountId === user.id || ticket.userVerifyId === user.id
	);
	return { tickets, user };
};
