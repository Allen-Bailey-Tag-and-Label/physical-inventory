import bcrypt from 'bcryptjs';
import { prisma } from '$lib/prisma/index.js';
import { DEFAULT_USER_PASSWORD } from '$env/static/private';

export const actions = {
	isActive: async ({ request }) => {
		const { id, isActive } = <Record<string, string>>Object.fromEntries(await request.formData());

		await prisma.user.update({
			where: {
				id
			},
			data: {
				isActive: isActive === 'true'
			}
		});
		return { success: true };
	},
	isAdmin: async ({ request }) => {
		const { id, isAdmin } = <Record<string, string>>Object.fromEntries(await request.formData());

		await prisma.user.update({
			where: {
				id
			},
			data: {
				isAdmin: isAdmin === 'true'
			}
		});
		return { success: true };
	},
	'reset-password': async ({ request }) => {
		const { id } = <Record<string, string>>Object.fromEntries(await request.formData());

		const passwordHash: string = await new Promise((res) => {
			bcrypt.hash(DEFAULT_USER_PASSWORD, 10, (_: any, hash: string) => {
				return res(hash);
			});
		});

		await prisma.user.update({
			where: {
				id
			},
			data: {
				passwordHash
			}
		});
		return { success: true };
	}
};
