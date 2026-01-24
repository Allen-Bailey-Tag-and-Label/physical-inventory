import { KeyValue } from '$lib/db/models';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	ticket: async ({ request }) => {
		const {
			ticketNumber,
			itemNumber,
			uom,
			amount0,
			amount1,
			amount2,
			amount3,
			amount4,
			amount5,
			amount6,
			amount7,
			amount8,
			amount9,
			totalAmount
		} = <Record<string, string>>Object.fromEntries(await request.formData());

		const physicalInventoryBranchId = await KeyValue.findOne({ key: 'physicalInventoryBranchId' });
		const today = new Date();
		const date = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
	}
};
