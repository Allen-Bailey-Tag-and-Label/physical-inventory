import Redis from 'ioredis';
import { prisma } from '$lib/prisma';
import type { Handle } from '@sveltejs/kit';
import { REDIS_URL } from '$env/static/private';

const getUser = async (event) => {
	const id = event.cookies.get('session_id');
	if (id === undefined || id === null) return event;
	const result = await prisma.user.findFirst({ where: { id } });
	if (result === undefined || result === null) return event;
	const { passwordHash, ...user } = result;
	event.locals.user = user;
	return event;
};

const client = new Redis(REDIS_URL);

export const handle: Handle = async ({ event, resolve }) => {
	const INVENTORY_DATE = (await client.get('inventoryDate')) || '';
	event.locals.INVENTORY_DATE = INVENTORY_DATE;
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
