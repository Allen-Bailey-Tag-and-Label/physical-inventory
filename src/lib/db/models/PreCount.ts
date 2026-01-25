import { Types } from 'mongoose';
import { defineModel } from '../defineModel';

export const PreCount = defineModel('PreCount', {
	branch: { type: Types.ObjectId, required: true, ref: 'Branch' },
	csv: { type: String, required: true },
	date: { type: Number, required: true }
});
