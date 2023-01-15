export async function handle({ event, resolve }) {
  const authToken = event.cookies.get('authToken');
  if (event.url.pathname === '/') {
    if (authToken === undefined) return Response.redirect(`${event.url.origin}/sign-in`, 301);
  }

  const response = await resolve(event);

  return response;
}
