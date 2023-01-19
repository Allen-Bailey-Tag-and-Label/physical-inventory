import { init as dbInit } from '$db';

export const actions = {
  default: async ({ request }) => {
    // get submitted data
    let { paste, type } = Object.fromEntries(await request.formData());

    // initialize items object
    const items = {};

    // parse pasted data
    paste = paste.split('\r\n').reduce((obj, row) => {
      const [itemNumber, description, uom, quantity, value] = row.split('\t');
      obj[itemNumber] = { description, uom, quantity, value, type };
      items[itemNumber] = { description, uom, quantity, value, type };
      return obj;
    }, {});

    // add to database
    const db = await dbInit();
    db.data.items = { ...db.data.items, ...items };
    db.data.jdeImports[db.data.settings.inventoryVersion] = paste;
    await db.write();

    return { success: true };
  }
};
