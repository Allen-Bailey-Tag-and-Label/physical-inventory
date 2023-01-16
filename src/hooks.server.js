import { sequence } from '@sveltejs/kit/hooks';
import jwt from 'jsonwebtoken';
import { init as dbInit } from '$db';
import { JWT_SECRET } from '$env/static/private';

const rootRouteHandle = async ({ event, resolve }) => {
  // get authToken cookie
  let authToken = event.cookies.get('authToken');

  // check if route is root
  if (event.url.pathname === '/') {
    // redirect to sign-in route if authToken is undefined
    if (authToken === undefined) return Response.redirect(`${event.url.origin}/sign-in`, 301);

    try {
      // decode authToken
      const { username } = jwt.verify(authToken, JWT_SECRET);

      // find user in database
      const db = await dbInit();
      const { users } = db.data;
      const user = users.filter(
        (obj) => obj.username.toLowerCase() === username.toLowerCase()
      )?.[0];

      // check if no username found
      if (user === undefined) throw 'User not in database';

      // delete password from user
      delete user.password;

      // generate authToken
      authToken = jwt.sign(user, JWT_SECRET);

      // set auth cookie token
      event.cookies.set('authToken', authToken, {
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7
      });

      // redirect to dashboard
      return Response.redirect(`${event.url.origin}/dashboard`, 301);
    } catch (error) {
      console.log(error);

      // redirect to sign-in route if invalid authToken
      if (authToken === undefined) return Response.redirect(`${event.url.origin}/sign-in`, 301);
    }
  }

  const response = await resolve(event);

  return response;
};

export const handle = sequence(rootRouteHandle);
