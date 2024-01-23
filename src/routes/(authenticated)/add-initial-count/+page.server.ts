import { INVENTORY_DATE } from '$env/static/private';
import { prisma } from '$lib/prisma/index.js';
import { formDataToObject } from '$utilities';

export const actions = {
	default: async ({ request }) => {
		const data = formDataToObject(await request.formData());
		data.date = INVENTORY_DATE;
		await prisma.onHand.upsert({
			where: {
				date: INVENTORY_DATE
			},
			update: data,
			create: data
		});
		return { success: true };
	}
};
