import { prisma } from '$lib/prisma';

export const load = async ({ locals }) => {
	const tickets = await prisma.ticket.findMany();
	const myCountedTickets = [...tickets].filter((ticket) => ticket.userCountId === locals.user.id);
	const myVerifiedTickets = [...tickets].filter((ticket) => ticket.userVerifyId === locals.user.id);

	return { myCountedTickets, myVerifiedTickets, tickets };
};
