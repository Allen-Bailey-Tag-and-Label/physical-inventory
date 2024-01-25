import { prisma } from '$lib/prisma/index';

export const load = async () => {
	const [tickets, users] = await Promise.all([
		prisma.ticket.findMany(),
		prisma.user.findMany({ orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }] })
	]);

	const rows = users.map((user) => {
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
	});

	return { rows };
};
