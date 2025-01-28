import { DateTime } from 'luxon';
import { prisma } from '$lib/prisma/index.js';
import { formDataToObject } from '$utilities';

export const actions = {
	default: async ({ locals, request }) => {
		const data = formDataToObject(await request.formData());
		data.date = DateTime.fromFormat(locals.INVENTORY_DATE, 'yyyy-MM-dd', {
			zone: 'America/New_York'
		}).toJSDate();
		await prisma.onHand.upsert({
			where: {
				date: DateTime.fromFormat(locals.INVENTORY_DATE, 'yyyy-MM-dd', {
					zone: 'America/New_York'
				}).toJSDate()
			},
			update: data,
			create: data
		});
		return { success: true };
	}
};
