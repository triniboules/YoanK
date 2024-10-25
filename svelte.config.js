import adapter from '@sveltejs/adapter-netlify'; // Change adapter here
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  
  kit: {
    // Use the Netlify adapter for deploying to Netlify
    adapter: adapter(),
  }
};

export default config;
