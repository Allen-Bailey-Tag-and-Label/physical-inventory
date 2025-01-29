import { DateTime } from 'luxon';
import { prisma } from '$lib/prisma/index.js';
import { formDataToObject } from '$utilities';
import { items } from '$stores/items/items.js';

export const actions = {
	default: async ({ locals, request }) => {
		const data = formDataToObject(await request.formData());
		const cost07 = items.find((item) => item.itemNumber === data.itemNumber)?.cost07;
		data.cost07 = cost07 || 0;
		data.count = +data.count;
		data.dateCreated = DateTime.fromMillis(+data.dateCreated).toJSDate();
		data.inventoryDate = DateTime.fromFormat(locals.INVENTORY_DATE, 'yyyy-MM-dd', {
			zone: 'America/New_York'
		}).toJSDate();
		data.number = +data.number;
		await prisma.ticket.upsert({
			where: {
				number: data.number
			},
			update: data,
			create: data
		});
		return { success: true };
	}
};
