import { INVENTORY_DATE } from '$env/static/private';
import { prisma } from '$lib/prisma/index.js';

export const load = async ({ params }) => {
	const { itemNumber } = params;
	const [onHand, tickets] = await Promise.all([
		prisma.onHand.findFirst({ where: { date: INVENTORY_DATE } }),
		prisma.ticket.findMany({
			where: { itemNumber },
			include: { userCount: true, userVerify: true }
		})
	]);
	const { fg: fgText, raw: rawText } = onHand;
	const fg = fgText
		.split('\r\n')
		.map((item) => item.split('\t'))
		// .filter((item) => item[3] !== '0')
		.map((item) => {
			const itemNumber = item[0];
			const description = item[1];
			const cost07 = parseFloat(item[11]);
			const preCount = +item[15];
			const preValuation = preCount * cost07;
			const itemNumberTickets = [...tickets].filter((ticket) => ticket.itemNumber === itemNumber);
			const afterCount = itemNumberTickets.reduce((total, ticket) => (total += ticket.count), 0);
			const afterValuation = afterCount * cost07;
			const deltaCount = afterCount - preCount;
			const deltaValuation = afterValuation - preValuation;
			return {
				itemNumber,
				description,
				cost07,
				preCount,
				preValuation,
				itemNumberTicketsCount: itemNumberTickets.length,
				afterCount,
				afterValuation,
				deltaCount,
				deltaValuation
			};
		});
	const raw = rawText
		.split('\r\n')
		.map((item) => item.split('\t'))
		// .filter((item) => item[6] !== '0')
		.map((item) => {
			const itemNumber = item[0];
			const description = item[1];
			const cost07 = parseFloat(item[5]);
			const preCount = +item[6];
			const preValuation = preCount * cost07;
			const itemNumberTickets = [...tickets].filter((ticket) => ticket.itemNumber === itemNumber);
			const afterCount = itemNumberTickets.reduce((total, ticket) => (total += ticket.count), 0);
			const afterValuation = afterCount * cost07;
			const deltaCount = afterCount - preCount;
			const deltaValuation = afterValuation - preValuation;
			return {
				itemNumber,
				description,
				cost07,
				preCount,
				preValuation,
				itemNumberTicketsCount: itemNumberTickets.length,
				afterCount,
				afterValuation,
				deltaCount,
				deltaValuation
			};
		});
	const items = [...fg, ...raw];
	const item = items.find((obj) => obj.itemNumber === itemNumber);

	return { item, tickets };
};
