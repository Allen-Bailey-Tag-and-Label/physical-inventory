import { prisma } from '$lib/prisma';
import { items } from '$stores/items/items';
import { formDataToObject } from '$utilities';
import { DateTime } from 'luxon';

export const actions = {
	default: async ({ locals, request }) => {
		const inventoryDate = DateTime.fromFormat(locals.INVENTORY_DATE, 'yyyy-MM-dd', {
			zone: 'America/New_York'
		}).toJSDate();
		const { id } = formDataToObject(await request.formData());
		await prisma.ticket.deleteMany({ where: { id, inventoryDate } });
		return { success: true };
	}
};

export const load = async ({ locals }) => {
	const inventoryDate = DateTime.fromFormat(locals.INVENTORY_DATE, 'yyyy-MM-dd', {
		zone: 'America/New_York'
	}).toJSDate();
	let [tickets] = await Promise.all([
		prisma.ticket.findMany({ where: { inventoryDate }, orderBy: [{ number: 'asc' }] })
	]);

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
