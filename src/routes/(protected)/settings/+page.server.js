import { init as dbInit } from '$db';

export const actions = {
  default: async ({ request }) => {
    // get submitted data
    const { inventoryVersion } = Object.fromEntries(await request.formData());

    // connect to db
    const db = await dbInit();

    // update settings
    db.data.settings.inventoryVersion = inventoryVersion;

    // check if value exists in counts and jdeImports
    if (db.data.counts?.[inventoryVersion] === undefined) db.data.counts[inventoryVersion] = {};
    if (db.data.jdeImports?.[inventoryVersion] === undefined)
      db.data.jdeImports[inventoryVersion] = {};

    // update db
    await db.write();

    return { inventoryVersion, success: true };
  }
};
