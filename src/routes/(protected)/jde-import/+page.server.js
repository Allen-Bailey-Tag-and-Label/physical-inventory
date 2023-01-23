import * as db from '$db';

export const load = async () => {
  // get current settings
  const [settings] = await db.find({ collection: 'settings' });

  return { settings };
};

export const actions = {
  default: async ({ request }) => {
    // get current settings
    const [settings] = await db.find({ collection: 'settings' });

    // get submitted data
    let { paste } = Object.fromEntries(await request.formData());

    // get items
    const items = paste.split('\r\n').reduce((array, row) => {
      const [itemNumber, description, uom, quantity, value, type] = row.split('\t');
      array.push({ itemNumber, description, uom, quantity, value, type });
      return array;
    }, []);

    // send to database
    await db.findOneAndUpdate({
      collection: 'counts',
      query: { inventoryVersion: settings.inventoryVersion },
      update: { $set: { items } }
    });

    return { success: true };
  }
};
