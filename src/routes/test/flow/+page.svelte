<script lang="ts">
    import VideoLibrary from '../../../components/VideoLibrary.svelte';
    import GridSelector from '../../../components/GridSelector.svelte';
    import GridEditor from '../../../components/GridEditor.svelte';
    import VideoAnalytics from '../../../components/VideoAnalytics.svelte';
    import { slide } from 'svelte/transition';
    
    let selectedGridId: string | null = null;
    let showAnalytics = false;
    let activeComponent: 'library' | 'editor' = 'library';
</script>

<div class="flow-container">
    <nav class="navigation">
        <button 
            class:active={activeComponent === 'library'}
            on:click={() => activeComponent = 'library'}
        >
            Video Library
        </button>
        <button 
            class:active={activeComponent === 'editor'}
            on:click={() => activeComponent = 'editor'}
        >
            Grid Editor
        </button>
        <button 
            class:active={showAnalytics}
            on:click={() => showAnalytics = !showAnalytics}
        >
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
        </button>
    </nav>

    <div class="main-content">
        <div class="grid-selector-container">
            <GridSelector on:gridSelected={(e) => selectedGridId = e.detail} />
        </div>

        <div class="component-container">
            {#if activeComponent === 'library'}
                <VideoLibrary />
            {:else if activeComponent === 'editor' && selectedGridId}
                <GridEditor gridId={selectedGridId} />
            {:else if activeComponent === 'editor' && !selectedGridId}
                <div class="no-grid-message">
                    Please select a grid from the Grid Selector above to start editing.
                </div>
            {/if}
        </div>

        {#if showAnalytics}
            <div class="analytics-container" transition:slide>
                <VideoAnalytics />
            </div>
        {/if}
    </div>
</div>

<style>
    .flow-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: #1a1a1a;
        color: #ffffff;
    }

    .navigation {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: #2a2a2a;
        border-bottom: 1px solid #333;
    }

    .navigation button {
        background: #3a3a3a;
        color: #ffffff;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .navigation button:hover {
        background: #4a4a4a;
    }

    .navigation button.active {
        background: #5a5a5a;
        box-shadow: 0 0 0 2px #666;
    }

    .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
        overflow: auto;
    }

    .grid-selector-container {
        background: #2a2a2a;
        padding: 1rem;
        border-radius: 8px;
    }

    .component-container {
        flex: 1;
        background: #2a2a2a;
        padding: 1rem;
        border-radius: 8px;
        overflow: auto;
    }

    .analytics-container {
        background: #2a2a2a;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
    }

    .no-grid-message {
        text-align: center;
        padding: 2rem;
        color: #888;
        font-style: italic;
    }

    @media (max-width: 768px) {
        .navigation {
            flex-wrap: wrap;
        }

        .navigation button {
            flex: 1;
            min-width: 120px;
        }
    }
</style>
