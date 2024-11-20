<script lang="ts">
    import { onMount } from 'svelte';
    import NineGrid from '../../components/NineGrid.svelte';
    import VideoViewer from '../../components/VideoViewer.svelte';
    import ImportButton from '../../components/ImportButton.svelte';
    import type { Database } from '$lib/database.types';

    type Video = Database['public']['Tables']['videos']['Row'];

    let selectedVideo: Video | null = null;
    let showViewer = false;

    function handleVideoClick(video: Video) {
        selectedVideo = video;
        showViewer = true;
    }

    function handleClose() {
        showViewer = false;
        selectedVideo = null;
    }

    function handleVideoImported(event: CustomEvent<Video>) {
        // Refresh the grid when a new video is imported
        if (event.detail) {
            // The grid will automatically refresh on mount
            showViewer = false;
        }
    }
</script>

<div class="grid-page">
    <header>
        <h1>Video Grid</h1>
        <ImportButton on:videoImported={handleVideoImported} />
    </header>

    <main>
        <NineGrid 
            columns={3} 
            gap={16} 
            aspectRatio={16/9}
            on:videoClick={handleVideoClick}
        />
    </main>

    {#if showViewer && selectedVideo}
        <VideoViewer 
            selectedVideo={selectedVideo} 
            onClose={handleClose}
        />
    {/if}
</div>

<style>
    .grid-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    h1 {
        font-size: 2rem;
        color: #333;
        margin: 0;
    }

    main {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
</style>
