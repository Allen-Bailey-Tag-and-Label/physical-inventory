import { DateTime } from 'luxon';
import { prisma } from '$lib/prisma/index.js';
import { items } from '$stores/items/items.js';
import { formDataToObject } from '$utilities';

export const load = async ({ params }) => {
	const [ticket] = await Promise.all([
		prisma.ticket.findFirst({ where: { number: +params.ticket } })
	]);

	return { ticket };
};

export const actions = {
	default: async ({ request }) => {
		const data = formDataToObject(await request.formData());
		data.cost07 = items.find((item) => item.itemNumber === data.itemNumber).cost07;
		data.count = +data.count;
		data.dateCreated = DateTime.fromMillis(+data.dateCreated).toJSDate();
		data.number = +data.number;
		delete data.id;
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
