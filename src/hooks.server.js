export async function handle({ event, resolve }) {
	const _userId = event.cookies.get('_userId');
	if (event.url.pathname === '/') {
		if (_userId === undefined) return Response.redirect(`${event.url.origin}/sign-in`, 301);
	}

	const response = await resolve(event);

	return response;
}
