import { PreCount } from '$lib/db/models';
import type { Actions } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const actions: Actions = {
	default: async ({ request }) => {
		const { physicalInventoryBranchId, csv, date } = <Record<string, string>>(
			Object.fromEntries(await request.formData())
		);

		await PreCount.findOneAndUpdate(
			{ branch: new ObjectId(physicalInventoryBranchId), date: +date },
			{ branch: new ObjectId(physicalInventoryBranchId), csv, date: +date },
			{ upsert: true }
		);

		return { success: true };
	}
};
