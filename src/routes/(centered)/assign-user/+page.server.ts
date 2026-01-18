import { User } from '$lib/db/models';

export const load = async () => {
	return {
		users: new Promise(async (res) => {
			const users = await User.find().sort({ username: 'asc' });
			res(JSON.parse(JSON.stringify(users)));
		})
	};
};
