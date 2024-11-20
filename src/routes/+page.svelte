<script lang="ts">
    import { SvelteComponent } from 'svelte';
    import Entrance from '../components/Entrance.svelte';
    import Footer from '../components/Footer.svelte';
    import MainVideoGrid from '../components/MainVideoGrid.svelte';
  
    let showEntrance = true;
    let headerComponent: typeof SvelteComponent | null = null;
    let isLoading = true;

    /**
     * Handles access by hiding the entrance component.
     */
    const handleAccess = () => {
        showEntrance = false;
    };
  
    const preloadComponents = async (maxRetries = 3, retryDelay = 1000) => {
        try {
            const HeaderModule = await import('./Header.svelte');
            headerComponent = HeaderModule.default as typeof SvelteComponent;
            isLoading = false;
        } catch (error) {
            console.error('Failed to preload components', error);
            if (maxRetries > 0) {
                setTimeout(() => preloadComponents(maxRetries - 1, retryDelay), retryDelay);
            } else {
                isLoading = false;
            }
        }
    };

    preloadComponents();
</script>

<head>
    <title>Yoann Kittery - Content Creator, Videographer & Video Production Specialist</title>
    <meta name="description" content="Yoann Kittery is a professional content creator specializing in video production for weddings, music videos, corporate events, and more. Discover high-quality video editing, cinematography, and creative video solutions." />
    <meta name="keywords" content="Yoann Kittery, content creator, videographer, video production, weddings, corporate events, music videos, video editing" />
    <meta name="robots" content="index, follow" />
</head>

{#if showEntrance}
    <Entrance onAccess={handleAccess} />
{:else}
    {#if !isLoading && headerComponent}
        <svelte:component this={headerComponent} />
        <MainVideoGrid />
    {/if}
    <Footer />
{/if}

<style>
    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :global(body) {
        margin: 0;
        padding: 0;
        width: 100vw;
        min-height: 100vh;
        background-color: #1a1a1a;
        overflow-x: hidden;
    }

    :root {
      --font-body: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
        Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      --font-mono: 'Fira Mono', monospace;
      --color-bg-0: rgb(202, 216, 228);
      --color-bg-1: rgb(0, 0, 0); /* Background color */
      --color-bg-2: hsl(224, 44%, 95%);
      --color-theme-1: #ff3e00;
      --color-theme-2: #4075a6;
      --color-text: rgba(255, 255, 255, 0.7); /* Text color */
 
      font-family: var(--font-body);
      color: var(--color-text);
    }
</style>