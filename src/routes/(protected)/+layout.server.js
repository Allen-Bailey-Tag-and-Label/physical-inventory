import { init as dbInit } from '$db';

export async function load({ locals }) {
  // find users in database
  const db = await dbInit();
  const { counts, items, users } = db.data;

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
    items,
    user: locals.user,
    userOptions,
    users
  };
}
