import { ObjectId } from 'mongodb';
import * as db from '$db';
import offlineTickets from './offlineTickets';

export const GET = async () => {
  // find current ticket doc
  const [doc] = await db.find({
    collection: 'counts',
    query: { _id: ObjectId('63d16dfa12c025d2ab1f92ca') }
  });

  // fixed offlineTickets
  const fixedOfflineTickets = offlineTickets.reduce((obj, ticket) => {
    obj[ticket.ticketNumber] = {
      createdAt: new Date(),
      ...ticket
    };
    return obj;
  }, {});

  // delete tickets entered by bob
  doc.tickets = {
    ...Object.keys(doc.tickets).reduce((obj, key) => {
      if (doc.tickets[key]._counter !== '63ca9d2f12c025d2abf5948c') obj[key] = doc.tickets[key];
      return obj;
    }, {}),
    ...fixedOfflineTickets
  };

  // set document
  await db.findOneAndUpdate({
    collection: 'counts',
    query: { _id: ObjectId('63d16dfa12c025d2ab1f92ca') },
    update: { $set: { tickets: doc.tickets } }
  });

  return new Response(null, { status: 200 });
};
