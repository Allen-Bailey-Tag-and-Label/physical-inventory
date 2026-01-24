import { Ticket } from '$lib/db/models';

export const load = async ({ params }) => {
	return {
		tickets: new Promise<Record<string, any>[]>(async (res) => {
			const tickets = await Ticket.find().populate([{ path: 'counter' }, { path: 'verifier' }]);
			const userTickets = tickets.filter((ticket) => ticket.verifier.username === params.username);
			res(JSON.parse(JSON.stringify(userTickets)));
		})
	};
};
