import { prisma } from '$lib/prisma';
import { items } from '$stores/items/items';
import { formDataToObject } from '$utilities';

export const actions = {
	default: async ({ request }) => {
		const { id } = formDataToObject(await request.formData());
		await prisma.ticket.deleteMany({ where: { id } });
		return { success: true };
	}
};

export const load = async () => {
	let [tickets] = await Promise.all([prisma.ticket.findMany({ orderBy: [{ number: 'asc' }] })]);

	tickets = tickets.map((ticket) => {
		const item = items.find((obj) => obj.itemNumber === ticket.itemNumber);
		const isValidItemNumber = item !== undefined && item !== null;
		return {
			...ticket,
			isValidItemNumber
		};
	});
	return { tickets };
};
