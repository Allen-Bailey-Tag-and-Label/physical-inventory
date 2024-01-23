import { DateTime } from 'luxon';
import { prisma } from '$lib/prisma/index.js';
import { formDataToObject } from '$utilities';
import { items } from '$stores/items/items.js';

export const actions = {
	default: async ({ request }) => {
		const data = formDataToObject(await request.formData());
		data.cost07 = items.find((item) => item.itemNumber === data.itemNumber).cost07;
		data.count = +data.count;
		data.dateCreated = DateTime.fromMillis(+data.dateCreated).toJSDate();
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
