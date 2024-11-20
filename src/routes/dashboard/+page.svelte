<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';
    import VideoLibrary from '../../components/VideoLibrary.svelte';
    import GridEditor from '../../components/GridEditor.svelte';
    import GridSelector from '../../components/GridSelector.svelte';
    import type { Database } from '$lib/database.types';

    let selectedGridId: string | null = null;
    let error: string | null = null;
    let activeTab: 'library' | 'grid' = 'library';

    async function handleAddToGrid(event: CustomEvent) {
        const { video, gridId } = event.detail;
        try {
            // Get the current max position
            const { data: posData, error: posError } = await supabase
                .from('grid_videos')
                .select('position')
                .eq('grid_id', gridId)
                .order('position', { ascending: false })
                .limit(1);

            if (posError) throw posError;

            const nextPosition = posData && posData[0] ? posData[0].position + 1 : 0;

            // Add video to grid
            const { error: addError } = await supabase
                .from('grid_videos')
                .insert({
                    grid_id: gridId,
                    video_id: video.id,
                    position: nextPosition
                });

            if (addError) throw addError;

            // Switch to grid tab
            activeTab = 'grid';
        } catch (err) {
            console.error('Error adding video to grid:', err);
            error = err instanceof Error ? err.message : 'Failed to add video to grid';
        }
    }
</script>

<div class="dashboard">
    <header class="header">
        <h1>Video Dashboard</h1>
        <nav class="tabs">
            <button 
                class:active={activeTab === 'library'} 
                on:click={() => activeTab = 'library'}
            >
                Video Library
            </button>
            <button 
                class:active={activeTab === 'grid'} 
                on:click={() => activeTab = 'grid'}
            >
                Grid Editor
            </button>
        </nav>
    </header>

    <div class="grid-selector-container">
        <GridSelector bind:selectedGridId />
    </div>

    <main class="content">
        {#if error}
            <div class="error">{error}</div>
        {/if}

        {#if activeTab === 'library'}
            <VideoLibrary
                {selectedGridId}
                on:addToGrid={handleAddToGrid}
            />
        {:else if activeTab === 'grid' && selectedGridId}
            <GridEditor gridId={selectedGridId} />
        {/if}
    </main>
</div>

<style>
    .dashboard {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: #0f0f0f;
        color: white;
        padding: 2rem;
        gap: 2rem;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    h1 {
        margin: 0;
        font-size: 2rem;
        font-weight: 600;
        color: white;
    }

    .tabs {
        display: flex;
        gap: 1rem;
    }

    button {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    button:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    button.active {
        background: #4CAF50;
    }

    .grid-selector-container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
    }

    .content {
        flex: 1;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }

    .error {
        background: rgba(220, 53, 69, 0.2);
        color: #dc3545;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
        .dashboard {
            padding: 1rem;
        }

        .header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
            text-align: center;
        }

        .tabs {
            flex-direction: column;
        }

        button {
            width: 100%;
        }
    }
</style>
