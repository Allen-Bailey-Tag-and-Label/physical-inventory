import { type Cookies } from '@sveltejs/kit';
import { type ObjectId } from 'mongodb';
import { UserSession } from '$lib/db/models';

class Auth {
	constructor() {}

	async setSession({ _id, cookies }: { _id: ObjectId; cookies: Cookies }) {
		const sessionId = crypto.randomUUID();

		await UserSession.create({
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
			sessionId,
			user: _id
		});

		cookies.set('sessionId', sessionId, {
			httpOnly: true,
			path: '/',
			secure: true
		});
	}
}

export const auth = new Auth();
