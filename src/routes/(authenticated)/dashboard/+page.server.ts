import { INVENTORY_DATE } from '$env/static/private';
import { prisma } from '$lib/prisma';

export const load = async ({ locals }) => {
	const [onHand, tickets] = await Promise.all([
		prisma.onHand.findFirst({ where: { date: INVENTORY_DATE } }),
		prisma.ticket.findMany()
	]);
	const myCountedTickets = [...tickets].filter((ticket) => ticket.userCountId === locals.user.id);
	const myVerifiedTickets = [...tickets].filter((ticket) => ticket.userVerifyId === locals.user.id);

	return { myCountedTickets, myVerifiedTickets, onHand, tickets };
};
