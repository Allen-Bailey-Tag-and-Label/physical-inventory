import bcrypt from 'bcryptjs';
import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { prisma } from '$lib/prisma/index.js';
import { formDataToObject } from '$utilities';

export const actions = {
	default: async ({ cookies, request }) => {
		const { password, username } = formDataToObject(await request.formData());
		const user = await prisma.user.findFirst({ where: { username } });

		if (user === null) return fail(401, { error: 'Username does not exist' });

		if (!bcrypt.compareSync(password, user.passwordHash))
			return fail(401, { error: 'Could not verify credentials' });

		delete user.passwordHash;

		cookies.set('session_id', user.id, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 7
		});

		return redirect(300, user.isAdmin ? '/dashboard' : '/add-ticket');
	}
};
