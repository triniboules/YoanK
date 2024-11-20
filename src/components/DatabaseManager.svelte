<script lang="ts">
    import { onMount } from 'svelte';
    import VideoLibrary from './VideoLibrary.svelte';
    import GridGlide from './GridGlide.svelte';
    import NineGrid from './NineGrid.svelte';
    import ImportButton from './ImportButton.svelte';
    import type { Database } from '$lib/database.types';
    import { supabase } from '$lib/supabaseClient';

    type Video = Database['public']['Tables']['videos']['Row'];
    type Grid = Database['public']['Tables']['grid_configurations']['Row'];

    let activeTab = 'videos';
    let grids: Grid[] = [];
    let videos: Video[] = [];
    let loading = true;
    let gridGlide: GridGlide;
    let selectedVideo: Video | null = null;
    let showViewer = false;

    async function initializeDatabase() {
        try {
            const { data: gridData } = await supabase
                .from('grid_configurations')
                .select('count')
                .single();

            if (!gridData) {
                await supabase.rpc('initialize_database', {});
                
                const { error: gridError } = await supabase
                    .from('grid_configurations')
                    .insert({
                        name: 'Default Grid',
                        description: 'Initial grid configuration',
                        is_active: true
                    });

                if (gridError) throw gridError;
            }
        } catch (error) {
            console.error('Error initializing database:', error);
        }
    }

    async function loadData() {
        loading = true;
        try {
            const [gridResponse, videoResponse] = await Promise.all([
                supabase
                    .from('grid_configurations')
                    .select('*')
                    .order('created_at', { ascending: false }),
                supabase
                    .from('videos')
                    .select('*')
                    .order('created_at', { ascending: false })
            ]);

            if (gridResponse.error) throw gridResponse.error;
            if (videoResponse.error) throw videoResponse.error;

            grids = gridResponse.data || [];
            videos = videoResponse.data || [];
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            loading = false;
        }
    }

    function handleVideoImported(event: CustomEvent<Video>) {
        if (event.detail) {
            loadData(); // Refresh data
        }
    }

    function handleVideoClick(video: Video) {
        selectedVideo = video;
        showViewer = true;
    }

    function handleClose() {
        showViewer = false;
        selectedVideo = null;
    }

    function handleGridSave() {
        if (gridGlide) {
            const gridData = gridGlide.getGridData();
            console.log('Grid data:', gridData);
            // Implement grid saving logic here
        }
    }

    onMount(async () => {
        await initializeDatabase();
        await loadData();
    });
</script>

<div class="database-manager">
    <header>
        <div class="tabs">
            <button
                class:active={activeTab === 'videos'}
                on:click={() => activeTab = 'videos'}
            >
                Video Library
            </button>
            <button
                class:active={activeTab === 'grid'}
                on:click={() => activeTab = 'grid'}
            >
                Grid Editor
            </button>
            <button
                class:active={activeTab === 'ninegrid'}
                on:click={() => activeTab = 'ninegrid'}
            >
                Nine Grid
            </button>
        </div>
        <ImportButton on:videoImported={handleVideoImported} />
    </header>

    <main>
        {#if loading}
            <div class="loading">Loading...</div>
        {:else}
            {#if activeTab === 'videos'}
                <VideoLibrary {videos} on:videoClick={handleVideoClick} />
            {:else if activeTab === 'grid'}
                <div class="grid-container">
                    <div class="grid-actions">
                        <button on:click={handleGridSave}>Save Grid</button>
                    </div>
                    <GridGlide bind:this={gridGlide} {videos} />
                </div>
            {:else if activeTab === 'ninegrid'}
                <NineGrid 
                    columns={3} 
                    gap={16} 
                    aspectRatio={16/9}
                    on:videoClick={handleVideoClick}
                />
            {/if}
        {/if}
    </main>
</div>

<style>
    .database-manager {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .tabs {
        display: flex;
        gap: 0.5rem;
    }

    .tabs button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        background: #f3f4f6;
        cursor: pointer;
        transition: all 0.2s;
    }

    .tabs button.active {
        background: #2563eb;
        color: white;
    }

    main {
        flex: 1;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #6b7280;
    }

    .grid-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .grid-actions {
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }

    .grid-actions button {
        padding: 0.5rem 1rem;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .grid-actions button:hover {
        background: #1d4ed8;
    }
</style>
