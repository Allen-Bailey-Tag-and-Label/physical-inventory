import { KeyValue } from '$lib/db/models';

export const load = async () => {
	const [physicalInventoryBranchId] = await Promise.all([
		KeyValue.findOne({ key: 'physicalInventoryBranchId' })
	]);

	return {
		physicalInventoryBranchId: JSON.parse(
			JSON.stringify(physicalInventoryBranchId ?? { value: '' })
		)
	};
};
