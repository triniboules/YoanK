<script lang="ts">
    import VideoLibrary from '../../components/VideoLibrary.svelte';
    import GridGlide from '../../components/GridGlide.svelte';
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';

    let gridGlide: GridGlide;
    let activeTab = 'videos';
    let grids = [];
    let videos = [];
    let loading = true;

    async function initializeDatabase() {
        try {
            // Check if tables exist by trying to select from them
            const { data: gridData } = await supabase
                .from('grid_configurations')
                .select('count')
                .single();

            if (!gridData) {
                // Create tables if they don't exist
                await supabase.rpc('initialize_database', {});
                
                // Create default grid
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

    onMount(async () => {
        await initializeDatabase();
        await loadData();
    });

    async function loadData() {
        loading = true;
        try {
            // Load grids
            const { data: gridData, error: gridError } = await supabase
                .from('grid_configurations')
                .select('*')
                .order('created_at', { ascending: false });

            if (gridError) throw gridError;
            grids = gridData || [];

            // Load videos
            const { data: videoData, error: videoError } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (videoError) throw videoError;
            videos = videoData || [];

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            loading = false;
        }
    }

    function handleVideoAdded(event: CustomEvent) {
        if (activeTab === 'grid') {
            gridGlide.addVideo(event.detail);
        }
    }

    function handleClearGrid() {
        if (confirm('Are you sure you want to clear the grid?')) {
            gridGlide.clearGrid();
        }
    }

    function handleSaveGrid() {
        const gridData = gridGlide.getGridData();
        console.log('Grid data:', gridData);
        // You can implement saving grid data to localStorage or a database here
    }
</script>

<div class="container">
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
            Grid Layout
        </button>
    </div>

    <div class="content">
        {#if activeTab === 'videos'}
            <VideoLibrary on:videoAdded={handleVideoAdded} />
        {:else if activeTab === 'grid'}
            <div class="grid-controls">
                <button on:click={handleClearGrid}>Clear Grid</button>
                <button on:click={handleSaveGrid}>Save Grid</button>
            </div>
            <GridGlide bind:this={gridGlide} />
        {/if}
    </div>
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .tabs button {
        padding: 0.5rem 1rem;
        background: #333;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
    }

    .tabs button.active {
        background: #4CAF50;
    }

    .grid-controls {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .grid-controls button {
        padding: 0.5rem 1rem;
        background: #333;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
    }

    .grid-controls button:hover {
        background: #444;
    }
</style>
