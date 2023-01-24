import * as db from '$db';

export const load = async () => {
  // get current settings
  const [settings] = await db.find({ collection: 'settings' });

  // get other collections
  const [[count], users] = await Promise.all([
    await db.find({
      collection: 'counts',
      query: { inventoryVersion: settings.inventoryVersion }
    }),
    await db.find({ collection: 'users' })
  ]);

  return { count, settings, users };
};

export const actions = {
  default: async ({ request }) => {
    // get submitted data
    const { inventoryVersion, ticketNumber, ...item } = await Object.fromEntries(
      await request.formData()
    );

    // initialize update variable
    const update = {
      $set: {}
    };

    // update ticketNumber
    update.$set[`tickets.${ticketNumber}`] = { ...item, ticketNumber, createdAt: new Date() };

    await db.findOneAndUpdate({
      collection: 'counts',
      query: { inventoryVersion },
      update
    });

    return { success: true };
  }
};
