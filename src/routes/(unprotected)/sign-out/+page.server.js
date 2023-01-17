import { redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ cookies }) => {
    // set auth cookie token
    cookies.set('authToken', '', {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: -3600
    });

    throw redirect(301, '/sign-in');
  }
};
