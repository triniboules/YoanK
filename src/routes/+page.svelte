<script lang="ts">
    import { SvelteComponent } from 'svelte';
    import Entrance from '../components/Entrance.svelte'; // Import Entrance.svelte component

    let showEntrance = true; // Flag to control whether the entrance is shown

    // Define types for dynamically imported components
    let headerComponent: typeof SvelteComponent | null = null;
    let videoGridComponent: typeof SvelteComponent | null = null;

    // Function to handle entrance click and show main content
    const handleAccess = () => {
        showEntrance = false;
    };

    // Preload components
    const preloadComponents = async () => {
        try {
            // Dynamically import components
            const [HeaderModule, VideoGridModule] = await Promise.all([
                import('./Header.svelte'),
                import('../components/VideoGrid.svelte')
            ]);

            headerComponent = HeaderModule.default as typeof SvelteComponent;
            videoGridComponent = VideoGridModule.default as typeof SvelteComponent;
        } catch (error) {
            console.error('Failed to preload components', error);
        }
    };

    // Preload components when the script runs
    preloadComponents();
</script>

{#if showEntrance}
    <!-- Display the Entrance screen initially -->
    <Entrance onAccess={handleAccess} />
{:else}
    <!-- After entrance, display the header and video grid -->
    {#if headerComponent && videoGridComponent}
        <svelte:component this={headerComponent} />
        <main>
            <svelte:component this={videoGridComponent} />
            <footer>
                <p>Crafted made by <a href="mailto:ksylvestre1@hotmail.com">Sylvestre</a> &copy; {new Date().getFullYear()}</p>
            </footer>
        </main>
    {/if}
{/if}
