const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			...colors,
			'indigo-1000': '#0e0e1b',
		},
		extend: {},
	},
	plugins: [require('@tailwindcss/forms')],
};
