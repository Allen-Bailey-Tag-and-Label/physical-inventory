import { DateTime } from 'luxon';
import { prisma } from '$lib/prisma/index.js';
import { formDataToObject } from '$utilities';

export const actions = {
	default: async ({ request }) => {
		const data = formDataToObject(await request.formData());
		data.count = +data.count;
		data.dateCreated = DateTime.fromMillis(+data.dateCreated).toJSDate();
		data.number = +data.number;
		// await prisma.ticket.create({ data });
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
