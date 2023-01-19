import crypto from 'crypto-js';
import { init as dbInit } from '$db';

export const actions = {
  default: async ({ request }) => {
    // get submitted data
    let { firstName, isAdmin, lastName, password } = Object.fromEntries(await request.formData());

    // get hashed password
    password = JSON.stringify(crypto.SHA256(password).words);

    // generate username
    const username = `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}`;

    // generate _id
    const _id = Math.random().toString(16).slice(2);

    // create user in database
    const db = await dbInit();
    db.data.users.push({
      _id,
      firstName,
      lastName,
      password,
      username,
      isAdmin: isAdmin === 'on' ? true : false
    });
    await db.write();

    return { success: true, username };
  }
};
