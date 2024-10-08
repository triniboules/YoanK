/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{svelte,html,js,ts}",  // Include .js and .ts files for dynamic class usage
    "./src/routes/**/*.{svelte,html,js,ts}",  // Include all SvelteKit route files
    "./src/lib/**/*.{svelte,html,js,ts}", // Include lib components if you use them
  ],
  theme: {
    extend: {
      // Extend Tailwind's default configuration (colors, spacing, etc.)
      colors: {
        primary: '#1E40AF',  // Custom primary color example
      },
    },
  },
  plugins: [],
}
