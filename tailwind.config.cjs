const { tailwindcssPaletteGenerator } = require('@bobthered/tailwindcss-palette-generator');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/sveltewind/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: tailwindcssPaletteGenerator({
				colors: ['#4b0cdf', '#706783'],
				names: ['violet', 'slate']
			})
		}
	},

	plugins: []
};

module.exports = config;
