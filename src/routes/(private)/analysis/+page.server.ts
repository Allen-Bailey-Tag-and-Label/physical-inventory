import { Branch, KeyValue, PreCount, Ticket } from '$lib/db/models';
import { ObjectId } from 'mongodb';

export const load = async () => {
	const precountMap: Map<string, number> = new Map();

	const [physicalInventoryBranchId] = await Promise.all([
		KeyValue.findOne({ key: 'physicalInventoryBranchId' })
	]);

	if (!physicalInventoryBranchId) return { branch: { number: 0 }, precountMap, tickets: [] };

	const [branch] = await Promise.all([
		Branch.findOne({ _id: new ObjectId(physicalInventoryBranchId.value) })
	]);

	if (!branch) return { branch: { number: 0 }, precountMap, tickets: [] };

	const today = new Date();
	const date = +`${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;

	const [preCount, tickets] = await Promise.all([
		PreCount.findOne({ branch: branch._id, date }),
		Ticket.find({ branch: branch._id, date })
	]);

	if (preCount) {
		preCount.csv.split('\n').forEach((row: Record<string, any>) => {
			const [itemNumber, amount] = row.split('\t');

			precountMap.set(itemNumber, +amount);
		});
	}

	return {
		branch: JSON.parse(JSON.stringify(branch)),
		precountMap,
		tickets: JSON.parse(JSON.stringify(tickets))
	};
};
