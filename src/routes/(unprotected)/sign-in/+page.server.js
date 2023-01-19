import { fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto-js';
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

    // hash password
    const hash = JSON.stringify(crypto.SHA256(password).words);

    // check if password doesn't match
    if (hash !== user.password) return fail(401, { error: 'Invalid credentials passed.' });

    // delete password from user
    delete user.password;

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
