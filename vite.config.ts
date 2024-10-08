import { defineConfig } from 'vite';
import {sveltekit} from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  css: {
    preprocessorOptions: {
      postcss: {
        config: {
          path: './', // Ensure PostCSS finds the postcss.config.js file
        },
      },
    },
  },
});