import { model, Schema, Types } from 'mongoose';

export const UserSessionSchema = new Schema({
	expiresAt: { type: Date, index: true },
	sessionId: { type: String, unique: true, index: true },
	user: { type: Types.ObjectId, ref: 'User' }
});

export const UserSession = model('UserSession', UserSessionSchema);
