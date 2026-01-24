import { Branch, KeyValue } from '$lib/db/models';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const { physicalIdBranchId } = <Record<string, string>>(
			Object.fromEntries(await request.formData())
		);

		await KeyValue.findOneAndUpdate(
			{ key: 'physicalInventoryBranchId' },
			{ value: physicalIdBranchId }
		);

		return { success: true };
	}
};

export const load = async () => {
	const [branches, physicalIdBranchId] = await Promise.all([
		Branch.find(),
		KeyValue.findOne({ key: 'physicalInventoryBranchId' })
	]);

	return {
		branches: JSON.parse(JSON.stringify(branches)),
		physicalIdBranchId: JSON.parse(JSON.stringify(physicalIdBranchId))
	};
};
