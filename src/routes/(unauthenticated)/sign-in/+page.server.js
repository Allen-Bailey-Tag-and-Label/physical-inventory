import crypto from 'crypto';
import { init as dbInit } from '$db';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ cookies, request }) => {
    // get submitted data
    const { password, username } = Object.fromEntries(await request.formData());

    // find user in database
    const db = await dbInit();
    const { users } = db.data;
    const user = users.filter((obj) => obj.username.toLowerCase() === username.toLowerCase())?.[0];

    // check if no username found
    if (user === undefined) return fail(401, { error: 'Incorrect username provided.' });

    // get salt and hash from database
    const [salt, hash] = user.password.split(':');

    // compare password
    try {
      await new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
          if (err) reject(err);
          if (hash !== derivedKey.toString('hex')) reject('Incorrect credentials passed.');
          resolve();
        });
      });
    } catch (error) {
      return fail(401, { error });
    }

    // generate authToken
    const authToken = `${username}:${salt}:${hash}`;
    console.log(authToken);

    // set auth cookie token
    cookies.set('authToken', authToken, {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7
    });

    console.log(cookies.get('authToken'));

    // throw redirect(301, '/dashboard');
    return { success: true };
  }
};
