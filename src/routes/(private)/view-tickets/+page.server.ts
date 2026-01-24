import { Ticket } from '$lib/db/models';

export const load = async () => {
	return {
		tickets: new Promise<Record<string, any>[]>(async (res) => {
			const tickets = await Ticket.find().populate([{ path: 'counter' }, { path: 'verifier' }]);
			res(JSON.parse(JSON.stringify(tickets)));
		})
	};
};
