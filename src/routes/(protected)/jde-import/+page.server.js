import { init as dbInit } from '$db';

export const actions = {
  default: async ({ request }) => {
    // get submitted data
    let { paste, type } = Object.fromEntries(await request.formData());

    // parse pasted data
    paste = paste.split('\r\n').reduce((obj, row) => {
      const [itemNumber, description, uom, quantity, value] = row.split('\t');
      obj[itemNumber] = { description, uom, quantity, value, type };
      return obj;
    }, {});

    // get date
    const date = `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`;

    // add to database
    const db = await dbInit();
    db.data.items[date] = paste;
    await db.write();

    return { date, success: true };
  }
};
