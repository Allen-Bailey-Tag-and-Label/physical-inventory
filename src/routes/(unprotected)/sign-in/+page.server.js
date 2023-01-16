import { fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { init as dbInit } from '$db';
import { JWT_SECRET } from '$env/static/private';

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

    // delete password from user
    delete user.password;

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
    const authToken = jwt.sign(user, JWT_SECRET);

    // set auth cookie token
    cookies.set('authToken', authToken, {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7
    });

    throw redirect(301, '/dashboard');
  }
};
