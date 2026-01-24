import { Ticket } from '$lib/db/models';
import type { Actions } from '@sveltejs/kit';
import { Types } from 'mongoose';

type FormData = {
	amount0: string;
	amount1: string;
	amount2: string;
	amount3: string;
	amount4: string;
	amount5: string;
	amount6: string;
	amount7: string;
	amount8: string;
	amount9: string;
	physicalInventoryBranchId: string;
	counter: string;
	date: string;
	itemNumber: string;
	ticketNumber: string;
	totalAmount: number;
	uom: string;
	verifier: string;
};

type Ticket = {
	amounts: number[];
	branch: Types.ObjectId;
	counter: Types.ObjectId;
	date: number;
	itemNumber: string;
	ticketNumber: number;
	totalAmount: number;
	uom: string;
	verifier: Types.ObjectId;
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
		counter: new Types.ObjectId(formData.counter),
		date: +formData.date,
		itemNumber: formData.itemNumber,
		ticketNumber: +formData.ticketNumber,
		totalAmount: +formData.totalAmount,
		uom: formData.uom,
		verifier: new Types.ObjectId(formData.verifier)
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
