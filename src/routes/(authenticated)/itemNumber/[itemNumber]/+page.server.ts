import { INVENTORY_DATE } from '$env/static/private';
import { prisma } from '$lib/prisma/index.js';
import { getItems } from '$utilities';

export const load = async ({ params }) => {
	const { itemNumber } = params;
	const [onHand, tickets] = await Promise.all([
		prisma.onHand.findFirst({ where: { date: INVENTORY_DATE } }),
		prisma.ticket.findMany({
			where: { itemNumber },
			include: { userCount: true, userVerify: true }
		})
	]);
	const items = getItems(onHand, tickets);
	const item = items.find((obj) => obj.itemNumber === itemNumber);

	return { item, tickets };
};
