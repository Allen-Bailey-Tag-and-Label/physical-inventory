import { init as dbInit } from '$db';

export async function load() {
  // find users in database
  const db = await dbInit();
  const { users } = db.data;

  // create user select options
  const userOptions = [...users]
    .map((user) => {
      return { label: `${user.firstName} ${user.lastName}`, value: user._id };
    })
    .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));

  return {
    userOptions,
    users
  };
}
