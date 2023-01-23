import * as db from '$db';

export const load = async () => {
  // get current settings
  const [settings] = await db.find({ collection: 'settings' });

  return { settings };
};

export const actions = {
  default: async ({ request }) => {
    // get submitted data
    const { inventoryVersion } = Object.fromEntries(await request.formData());

    // update settings
    await db.findOneAndUpdate({
      collection: 'settings',
      query: { index: 0 },
      update: {
        $set: {
          inventoryVersion
        }
      }
    });

    return { inventoryVersion, success: true };
  }
};
