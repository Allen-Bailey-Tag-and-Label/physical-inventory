import * as db from '$db';
import { load } from '../analyses/+page.server';

const actions = {
  default: async ({ request }) => {
    try {
      // get submitted data
      const { itemNumber, description, uom, quantity, value, type, inventoryVersion } =
        Object.fromEntries(await request.formData());

      // find current doc from database
      const [doc] = await db.find({ collection: 'counts', query: { inventoryVersion } });

      // add item
      doc.items.push({ itemNumber, description, uom, quantity, value, type });

      // update database
      await db.findOneAndUpdate({
        collection: 'counts',
        query: { inventoryVersion },
        update: { $set: { items: doc.items } }
      });
    } catch (error) {
      console.log(error);
    }

    return { success: true };
  }
};

export { actions, load };
