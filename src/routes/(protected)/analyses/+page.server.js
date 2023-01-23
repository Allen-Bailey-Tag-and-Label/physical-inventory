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
