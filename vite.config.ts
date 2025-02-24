import { sveltekit } from '@sveltejs/kit/vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,
	plugins: [sveltekit(), purgeCss()],
});
