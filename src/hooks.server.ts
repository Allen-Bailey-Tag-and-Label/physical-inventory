import { prisma } from '$lib/prisma';
import type { Handle } from '@sveltejs/kit';

const getUser = async (event) => {
	const id = event.cookies.get('session_id');
	if (id === undefined || id === null) return event;
	const user = await prisma.user.findFirst({ where: { id } });
	if (user === undefined || user === null) return event;
	delete user.passwordHash;
	event.locals.user = user;
	return event;
};

export const handle: Handle = async ({ event, resolve }) => {
	const unauthenticatedRoutes = ['/register', '/sign-in'];
	if (!unauthenticatedRoutes.includes(event.url.pathname)) {
		event = await getUser(event);
		if (event.locals?.user === undefined)
			return new Response('Redirect', { status: 303, headers: { Location: '/sign-in' } });
		if (event.url.pathname === '/')
			return new Response('Redirect', {
				status: 303,
				headers: { Location: event.locals.user.isAdmin ? '/dashboard' : '/add-ticket' }
			});
	}
	const response = await resolve(event);
	return response;
};
