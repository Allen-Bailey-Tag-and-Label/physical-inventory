import * as db from '$db';

export async function load() {
  // get current settings
  const [settings] = await db.find({ collection: 'settings' });

  // get current count
  const [count] = await db.find({
    collection: 'counts',
    query: { inventoryVersion: settings.inventoryVersion }
  });

  // get counts
  return { count, settings };
}
