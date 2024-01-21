import bcrypt from 'bcryptjs';
import { prisma } from '$lib/prisma/index.js';
import { formDataToObject } from '$utilities';

type Data = {
	firstName: string;
	isAdmin: boolean | string;
	lastName: string;
	password?: string;
	passwordHash?: string;
	username: string;
};

export const actions = {
	default: async ({ request }) => {
		const data: Data = formDataToObject(await request.formData());
		data.isAdmin = data.isAdmin === 'on' ? true : false;
		const passwordHash: string = await new Promise((res) => {
			bcrypt.hash(data.password, 10, (err, hash: string) => {
				return res(hash);
			});
		});
		delete data.password;
		data.passwordHash = passwordHash;
		await prisma.user.create({ data });
		return { username: data.username, success: true };
	}
};
