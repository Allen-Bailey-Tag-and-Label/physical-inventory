import { connect } from '$lib/db';
import { User, UserSession } from '$lib/db/models';
import { redirect, type Handle } from '@sveltejs/kit';

const publicRoutes = new Set(['/sign-in', '/sign-out']);
const protectedRoutes = new Set(['/admin', '/assign-user', '/master-item-list', '/ticket-entry']);

const handleAuthenticated = (event: any, pathname: string) => {
	if (pathname === '/') {
		throw redirect(303, '/ticket-entry');
	}
};
const handleUnauthenticated = (pathname: string) => {
	if (pathname === '/') {
		throw redirect(303, '/sign-in');
	}
	if (protectedRoutes.has(pathname)) {
		throw redirect(303, '/');
	}
};

export const handle: Handle = async ({ event, resolve }) => {
	await connect();

	const sessionId = event.cookies.get('sessionId');
	const { pathname } = event.url;

	if (!sessionId) {
		handleUnauthenticated(pathname);
		return resolve(event);
	}

	const session = await UserSession.findOne({
		sessionId,
		expiresAt: { $gt: new Date() }
	});

	if (!session) {
		event.cookies.delete('sessionId', { path: '/' });
		handleUnauthenticated(pathname);
		return resolve(event);
	}

	const user = await User.findById(session.user).populate('profile');
	if (!user) {
		handleUnauthenticated(pathname);
		return resolve(event);
	}

	// @ts-ignore
	event.locals.user = user.toObject();

	handleAuthenticated(event, pathname);
	return resolve(event);
};
