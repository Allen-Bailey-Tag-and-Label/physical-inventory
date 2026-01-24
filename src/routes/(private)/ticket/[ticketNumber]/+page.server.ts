import { redirect, type Actions } from '@sveltejs/kit';
import { Types } from 'mongoose';
import { Ticket } from '$lib/db/models';

type Ticket = {
	amounts: number[];
	branch: Types.ObjectId;
	date: number;
	itemNumber: string;
	ticketNumber: number;
	totalAmount: number;
	uom: string;
};
const sanitizeTicketData = (formData: Record<string, string>): Ticket => {
	return {
		amounts: [
			+formData.amount0,
			+formData.amount1,
			+formData.amount2,
			+formData.amount3,
			+formData.amount4,
			+formData.amount5,
			+formData.amount6,
			+formData.amount7,
			+formData.amount8,
			+formData.amount9
		],
		branch: new Types.ObjectId(formData.physicalInventoryBranchId),
		date: +formData.date,
		itemNumber: formData.itemNumber,
		ticketNumber: +formData.ticketNumber,
		totalAmount: +formData.totalAmount,
		uom: formData.uom
	};
};

export const actions: Actions = {
	ticket: async ({ request }) => {
		const formData = <Record<string, string>>Object.fromEntries(await request.formData());

		const ticket: Ticket = sanitizeTicketData(formData);

		await Ticket.findOneAndUpdate(
			{ branch: ticket.branch, date: ticket.date, ticketNumber: ticket.ticketNumber },
			ticket,
			{ upsert: true }
		);

		return { success: true };
	},
	tickets: async ({ request }) => {
		const data = <Record<string, string>>Object.fromEntries(await request.formData());

		const bulkOperations = JSON.parse(data.tickets).map((formData: Record<string, string>) => {
			const ticket = sanitizeTicketData(formData);

			return {
				updateOne: {
					filter: { branch: ticket.branch, date: ticket.date, ticketNumber: ticket.ticketNumber },
					update: ticket,
					upsert: true
				}
			};
		});

		await Ticket.bulkWrite(bulkOperations);

		return { success: true };
	}
};

export const load = async ({ params }) => {
	const ticket = await Ticket.findOne({ ticketNumber: +params.ticketNumber });

	if (!ticket) redirect(303, '/view-tickets');

	return {
		ticketInfo: {
			amounts: ticket.amounts.map((number) => (number === 0 ? '' : number.toString())),
			itemNumber: ticket.itemNumber,
			ticketNumber: ticket.ticketNumber.toString(),
			uom: ticket.uom
		}
	};
};
