import { INVENTORY_DATE } from '$env/static/private';
import { prisma } from '$lib/prisma';
import { getItems } from '$utilities';

export const load = async () => {
	const [onHand, tickets] = await Promise.all([
		prisma.onHand.findFirst({ where: { date: INVENTORY_DATE } }),
		prisma.ticket.findMany()
	]);
	const items = getItems(onHand, tickets);

	return { items };
};
