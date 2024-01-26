import { prisma } from '$lib/prisma/index';

export const actions = {
	default: async () => {
		const tickets = await prisma.ticket.findMany();
		for (let i = 0; i < tickets.length; i++) {
			const [ticket, ...duplicateTickets] = [...tickets].filter(
				(ticket) => ticket.number === tickets[i].number
			);
			if (duplicateTickets.length > 0) {
				for (let j = 0; j < duplicateTickets.length; j++) {
					await prisma.ticket.deleteMany({
						where: {
							id: duplicateTickets[j].id
						}
					});
				}
			}
		}

		return { success: true };
	}
};
