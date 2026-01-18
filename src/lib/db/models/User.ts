import { Types } from 'mongoose';
import { defineModel } from '../defineModel';

export const User = defineModel('User', {
	isActive: { type: Boolean, default: false },
	passwordHash: { type: String, required: true },
	profile: { type: Types.ObjectId, ref: 'UserProfile' },
	username: { type: String, required: true, unique: true }
});
