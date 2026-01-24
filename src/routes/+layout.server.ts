import { Branch, KeyValue } from '$lib/db/models';

export const load = async ({ locals }) => {
	const [branches, physicalInventoryBranchId] = await Promise.all([
		Branch.find(),
		KeyValue.findOne({ key: 'physicalInventoryBranchId' })
	]);

	const branch = branches.find(
		(branch) => JSON.parse(JSON.stringify(branch._id)) === physicalInventoryBranchId.value
	);

	return {
		branch: JSON.parse(JSON.stringify(branch)),
		user: JSON.parse(JSON.stringify(locals?.user ?? null))
	};
};
