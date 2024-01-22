import { prisma } from '$lib/prisma/index.js';

export const load = async ({ locals }) => {
	let users = await prisma.user.findMany();
	users = users.map((user) => {
		delete user.passwordHash;
		return user;
	});
	const userOptions = users
		.map((user) => ({
			label: `${user.firstName} ${user.lastName}`,
			value: user.id
		}))
		.sort((a, b) => a.label.localeCompare(b.label));
	return {
		user: locals.user,
		userOptions,
		users
	};
};
