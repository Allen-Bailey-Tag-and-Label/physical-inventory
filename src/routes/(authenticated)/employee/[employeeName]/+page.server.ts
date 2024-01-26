import { prisma } from '$lib/prisma/index.js';

export const load = async ({ params }) => {
	const { employeeName } = params;
	const [firstName, lastName] = employeeName.split(/\s/g);
	const [allTickets, user] = await Promise.all([
		prisma.ticket.findMany({
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
