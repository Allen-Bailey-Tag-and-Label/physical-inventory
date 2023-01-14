const config = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/sveltewind/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Montserrat', 'sans-serif']
			}
		}
	},

	plugins: []
};

module.exports = config;
