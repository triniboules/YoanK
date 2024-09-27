<script lang="ts">
    import { SvelteComponent } from 'svelte';
    import Entrance from '../components/Entrance.svelte';
    import Footer from '../components/Footer.svelte';
  
    let showEntrance = true;
    let headerComponent: typeof SvelteComponent | null = null;
    let videoGridComponent: typeof SvelteComponent | null = null;
    let isLoading = true; // State to track loading status
  
    /**
     * Handles access by hiding the entrance component.
     */
    const handleAccess = () => {
        showEntrance = false;
    };
  
    const preloadComponents = async (maxRetries = 3, retryDelay = 1000) => {
        try {
            const [HeaderModule, VideoGridModule] = await Promise.all([
                import('./Header.svelte'),
                import('../components/VideoGrid.svelte')
            ]);
  
            headerComponent = HeaderModule.default as typeof SvelteComponent;
            videoGridComponent = VideoGridModule.default as typeof SvelteComponent;
            isLoading = false; // Set loading to false after components are loaded
        } catch (error) {
            console.error('Failed to preload components', error);
            if (maxRetries > 0) {
                setTimeout(() => preloadComponents(maxRetries - 1, retryDelay), retryDelay);
            } else {
                isLoading = false; // Stop loading if retries are exhausted
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
    {#if isLoading}
        <p>Loading components...</p> <!-- Optional loading message -->
    {:else if headerComponent && videoGridComponent}
        <svelte:component this={headerComponent} />
        <main>
            <svelte:component this={videoGridComponent} />
        </main>
        <Footer />
    {/if}
{/if}
