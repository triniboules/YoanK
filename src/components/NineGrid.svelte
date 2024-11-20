<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import type { Database } from '$lib/database.types';
    import { onMount } from 'svelte';

    type Video = Database['public']['Tables']['videos']['Row'];
    
    export let columns = 3;
    export let gap = 10;
    export let aspectRatio = 16/9;

    let gridVideos: Video[] = [];
    let loading = true;
    let error: string | null = null;
    let containerWidth = 0;
    let itemWidth = 0;

    $: {
        itemWidth = (containerWidth - (gap * (columns - 1))) / columns;
    }

    async function loadVideos() {
        try {
            const { data, error: fetchError } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(9);

            if (fetchError) throw fetchError;
            gridVideos = data || [];
            loading = false;
        } catch (err) {
            console.error('Error loading videos:', err);
            error = err instanceof Error ? err.message : 'Failed to load videos';
            loading = false;
        }
    }

    function handleDragStart(e: DragEvent, video: Video, index: number) {
        if (!e.dataTransfer) return;
        e.dataTransfer.setData('text/plain', JSON.stringify({ id: video.id, index }));
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        e.dataTransfer!.dropEffect = 'move';
    }

    function handleDrop(e: DragEvent, targetVideo: Video, targetIndex: number) {
        e.preventDefault();
        const data = e.dataTransfer?.getData('text/plain');
        if (!data) return;

        const { index: sourceIndex } = JSON.parse(data);
        if (sourceIndex === targetIndex) return;

        // Reorder videos
        const newVideos = [...gridVideos];
        const [removed] = newVideos.splice(sourceIndex, 1);
        newVideos.splice(targetIndex, 0, removed);
        gridVideos = newVideos;
    }

    onMount(loadVideos);
</script>

<div class="nine-grid" bind:clientWidth={containerWidth}>
    {#if loading}
        <div class="loading">Loading videos...</div>
    {:else if error}
        <div class="error">{error}</div>
    {:else}
        <div 
            class="grid-container"
            style="
                grid-template-columns: repeat({columns}, 1fr);
                gap: {gap}px;
            "
        >
            {#each gridVideos as video, i (video.id)}
                <div
                    class="grid-item"
                    style="
                        width: {itemWidth}px;
                        height: {itemWidth / aspectRatio}px;
                    "
                    draggable="true"
                    on:dragstart={(e) => handleDragStart(e, video, i)}
                    on:dragover={handleDragOver}
                    on:drop={(e) => handleDrop(e, video, i)}
                    role="button"
                    tabindex="0"
                >
                    <img
                        src={video.thumbnail}
                        alt={video.name}
                        class="thumbnail"
                    />
                    <div class="overlay">
                        <h3>{video.name}</h3>
                        {#if video.show_logo && video.logo_type}
                            <div class="logo {video.logo_type.toLowerCase()}-logo"></div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .nine-grid {
        width: 100%;
        padding: 1rem;
        background: #1a1a1a;
        border-radius: 8px;
    }

    .grid-container {
        display: grid;
        width: 100%;
    }

    .grid-item {
        position: relative;
        background: #2a2a2a;
        border-radius: 4px;
        overflow: hidden;
        cursor: move;
        transition: transform 0.2s;
    }

    .grid-item:hover {
        transform: scale(1.02);
    }

    .thumbnail {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.7);
        padding: 0.5rem;
        opacity: 0;
        transition: opacity 0.2s;
    }

    .grid-item:hover .overlay {
        opacity: 1;
    }

    .overlay h3 {
        margin: 0;
        font-size: 0.9rem;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .logo {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 40px;
        height: 40px;
        background-size: contain;
        background-repeat: no-repeat;
    }

    .da-logo {
        background-image: url('/image/Da.webp');
    }

    .yoann-logo {
        background-image: url('/image/logo.webp');
    }

    .loading {
        text-align: center;
        padding: 2rem;
        color: #666;
    }

    .error {
        text-align: center;
        padding: 2rem;
        color: #dc2626;
    }
</style>
