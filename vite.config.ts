import { defineConfig, loadEnv } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
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
    // Vite options tailored for Svelte
    define: {
      'process.env': env
    }
  };
});