import { init as dbInit } from '$db';

export const actions = {
  default: async ({ request }) => {
    // get submitted daata
    let { paste } = Object.fromEntries(await request.formData());

    // parse pasted data
    paste = paste.split('\n').map((row) => {
      const [itemNumber, description, uom, quantity, value] = row.split('\t');
      return { itemNumber, description, uom, quantity, value };
    });

    // get date
    const date = `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`;

    // add to database
    const db = await dbInit();
    db.data.counts.push({ date, paste });
    await db.write();

    return { date, success: true };
  }
};
