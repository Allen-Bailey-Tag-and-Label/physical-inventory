import { fail, redirect, type Actions } from '@sveltejs/kit';
import { compareSync } from 'bcrypt';
import { auth } from '$lib/auth';
import { User } from '$lib/db/models';

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const { password, username } = <Record<string, string>>(
			Object.fromEntries(await request.formData())
		);

		const user = await User.findOne({ username });

		if (!user) return fail(400, { message: 'Could not find username' });
		if (!compareSync(password, user.passwordHash))
			return fail(400, { message: 'Credentials do not match' });

		await auth.setSession({ _id: user._id, cookies });

		redirect(303, '/assign-user');
	}
};
