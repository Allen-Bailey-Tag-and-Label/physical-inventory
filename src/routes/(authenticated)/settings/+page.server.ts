import { REDIS_URL } from '$env/static/private';
import Redis from 'ioredis';

export const actions = {
	default: async ({ request }) => {
		const data = <Record<string, string>>Object.fromEntries(await request.formData());
		const client = new Redis(REDIS_URL);
		await client.set('inventoryDate', data.inventoryDate);
		return { success: true };
	}
};

export const load = async ({ locals }) => {
	return {
		inventoryDate: locals.INVENTORY_DATE
	};
};
