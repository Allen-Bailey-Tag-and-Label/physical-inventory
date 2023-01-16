import { Low as LowDB } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { resolve } from 'path';

// get file path
const file = resolve('./src/db/db.json');

// configure lowdb to write to JSONFile
const adapter = new JSONFile(file);
const db = new LowDB(adapter);

const init = async () => {
  await db.read();

  if (db?.data === null) {
    db.data = { users: [] };
    await db.write();
  }

  return db;
};

export { init };
