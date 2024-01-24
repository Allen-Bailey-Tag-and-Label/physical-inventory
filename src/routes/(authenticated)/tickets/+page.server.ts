import { prisma } from '$lib/prisma';

export const load = async () => {
	const [tickets] = await Promise.all([prisma.ticket.findMany({ orderBy: [{ number: 'asc' }] })]);

	return { tickets };
};
