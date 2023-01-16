import { init as dbInit } from '$db';

export async function load() {
  // find users in database
  const db = await dbInit();
  const { counts, fgItems, rawItems, users } = db.data;

  // create options
  const dateOptions = [...Object.keys(counts)]
    .map((date) => {
      return { label: date, value: date };
    })
    .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));
  const userOptions = [...users]
    .map((user) => {
      return { label: `${user.firstName} ${user.lastName}`, value: user._id };
    })
    .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));

  return {
    counts,
    dateOptions,
    fgItems,
    rawItems,
    userOptions,
    users
  };
}
