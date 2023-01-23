import crypto from 'crypto-js';
import * as db from '$db';

export const actions = {
  default: async ({ request }) => {
    // get submitted data
    let { firstName, isAdmin, lastName, password } = Object.fromEntries(await request.formData());

    // get hashed password
    password = JSON.stringify(crypto.SHA256(password).words);

    // generate username
    const username = `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}`;

    // create user in database
    await db.insertOne({
      collection: 'users',
      doc: {
        firstName,
        lastName,
        password,
        username,
        isAdmin: isAdmin === 'on' ? true : false
      }
    });

    return { success: true, username };
  }
};
