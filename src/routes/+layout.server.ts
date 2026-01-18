export const load = async ({ locals }) => {
	return {
		user: JSON.parse(JSON.stringify(locals?.user ?? null))
	};
};
