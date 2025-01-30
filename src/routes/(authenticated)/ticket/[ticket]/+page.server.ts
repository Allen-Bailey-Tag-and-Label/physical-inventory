import { DateTime } from 'luxon';
import { prisma } from '$lib/prisma/index.js';
import { items } from '$stores/items/items.js';
import { formDataToObject } from '$utilities';

export const load = async ({ locals, params }) => {
	const inventoryDate = DateTime.fromFormat(locals.INVENTORY_DATE, 'yyyy-MM-dd', {
		zone: 'America/New_York'
	}).toJSDate();
	const [ticket] = await Promise.all([
		prisma.ticket.findFirst({ where: { inventoryDate, number: +params.ticket } })
	]);

	return { ticket };
};

export const actions = {
	default: async ({ locals, request }) => {
		const data = formDataToObject(await request.formData());
		const inventoryDate = DateTime.fromFormat(locals.INVENTORY_DATE, 'yyyy-MM-dd', {
			zone: 'America/New_York'
		}).toJSDate();
		data.cost07 = items.find((item) => item.itemNumber === data.itemNumber).cost07;
		data.count = +data.count;
		data.dateCreated = DateTime.fromMillis(+data.dateCreated).toJSDate();
		data.inventoryDate = inventoryDate;
		data.number = +data.number;
		delete data.id;
		await prisma.ticket.upsert({
			where: {
				inventoryDate,
				number: data.number
			},
			update: data,
			create: data
		});
		return { success: true };
	}
};
