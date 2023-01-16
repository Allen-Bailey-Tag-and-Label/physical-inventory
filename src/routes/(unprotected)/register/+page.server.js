import crypto from 'crypto';
import { init as dbInit } from '$db';

export const actions = {
  default: async ({ request }) => {
    // get submitted data
    const {
      firstName,
      lastName,
      password: originalPassword
    } = Object.fromEntries(await request.formData());

    // create unique salt
    const salt = crypto.randomBytes(8).toString('hex');

    // get hashed password
    const hash = await new Promise((resolve, reject) => {
      crypto.scrypt(originalPassword, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      });
    });

    // update password with salt and hash
    const password = `${salt}:${hash}`;

    // generate username
    const username = `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}`;

    // generate _id
    const _id = crypto.randomBytes(16).toString('hex');

    // create user in database
    const db = await dbInit();
    db.data.users.push({ _id, firstName, lastName, password, username });
    await db.write();

    return { success: true, username };
  }
};
