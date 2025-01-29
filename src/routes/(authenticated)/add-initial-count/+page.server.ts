import { DateTime } from 'luxon';
import { prisma } from '$lib/prisma/index.js';
import { formDataToObject } from '$utilities';

export const actions = {
	default: async ({ locals, request }) => {
		const inventoryDate = DateTime.fromFormat(locals.INVENTORY_DATE, 'yyyy-MM-dd', {
			zone: 'America/New_York'
		}).toJSDate();
		const data = formDataToObject(await request.formData());
		data.date = inventoryDate;
		await prisma.onHand.upsert({
			where: {
				date: inventoryDate
			},
			update: data,
			create: data
		});
		return { success: true };
	}
};
