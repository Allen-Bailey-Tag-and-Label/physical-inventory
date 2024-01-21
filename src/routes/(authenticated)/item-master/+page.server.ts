import { prisma } from '$lib/prisma/index.js';
import { formDataToObject } from '$utilities';

export const actions = {
	create: async ({ request }) => {
		const data = formDataToObject(await request.formData());
		data.cost07 = parseFloat(data.cost07);
		await prisma.item.create({ data });
		return { success: true };
	},
	deleteMany: async () => {
		await prisma.item.deleteMany();
		return { success: true };
	}
};
