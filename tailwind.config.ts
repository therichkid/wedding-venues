import { contentPath, skeleton } from '@skeletonlabs/skeleton/plugin';
import { catppuccin } from '@skeletonlabs/skeleton/themes';
import forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', contentPath(import.meta.url, 'svelte')],
	darkMode: 'class',
	plugins: [forms, skeleton({ themes: [catppuccin] })],
	theme: { extend: {} }
} satisfies Config;
