import { prisma } from '$lib/prisma/index.js';

export const load = async ({ locals }) => {
	const result = await prisma.user.findMany();
	const users = result.map(({ passwordHash, ...user }) => {
		return user;
	});
	const userOptions = users
		.filter(({ isActive }) => isActive)
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
