import { init as dbInit } from '$db';

export const actions = {
  default: async ({ request }) => {
    // get submitted data
    const { _counter, _verifier, type, date, ticketNumber, itemNumber, count } =
      await Object.fromEntries(await request.formData());

    // update database
    const db = await dbInit();
    if (db.data.counts[date] === undefined) db.data.counts[date] = {};

    db.data.counts[date][ticketNumber] = { _counter, _verifier, itemNumber, count, type };
    await db.write();

    return { success: true };
  }
};
