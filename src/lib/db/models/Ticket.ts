import { Types } from 'mongoose';
import { defineModel } from '../defineModel';

export const Ticket = defineModel('Ticket', {
	amounts: [{ type: Number, required: true }],
	branch: { type: Types.ObjectId, required: true, ref: 'Branch' },
	date: { type: Number, required: true },
	itemNumber: { type: String, required: true },
	ticketNumber: { type: Number, required: true },
	totalAmount: { type: Number, required: true },
	uom: { type: String, required: true }
});
