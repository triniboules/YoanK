<!-- GridGlide.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';

    interface Video {
        id: string;
        name: string;
        description: string;
        source: 'youtube';
        source_id: string;
        thumbnail: string;
        created_at: string;
        updated_at: string;
        user_id: string;
    }

    interface GridItem {
        video: Video;
        position: number;
        width: number;
        height: number;
    }

    export let columns = 3;
    export let gap = 10;
    export let aspectRatio = 16/9;

    let gridItems: GridItem[] = [];
    let draggedItem: GridItem | null = null;
    let containerWidth = 0;
    let itemWidth = 0;

    $: {
        itemWidth = (containerWidth - (gap * (columns - 1))) / columns;
    }

    function handleDragStart(item: GridItem) {
        draggedItem = item;
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
    }

    function handleDrop(targetItem: GridItem) {
        if (!draggedItem || draggedItem === targetItem) return;

        const draggedIndex = gridItems.indexOf(draggedItem);
        const targetIndex = gridItems.indexOf(targetItem);

        // Reorder items
        gridItems = gridItems.reduce((acc: GridItem[], item, i) => {
            if (i === draggedIndex) return acc;
            if (i === targetIndex) {
                if (draggedIndex > targetIndex) {
                    return [...acc, draggedItem!, item];
                } else {
                    return [...acc, item, draggedItem!];
                }
            }
            return [...acc, item];
        }, []);

        // Update positions
        gridItems = gridItems.map((item, index) => ({
            ...item,
            position: index
        }));

        draggedItem = null;
    }

    export function addVideo(video: Video) {
        const newItem: GridItem = {
            video,
            position: gridItems.length,
            width: 1,
            height: 1
        };
        gridItems = [...gridItems, newItem];
    }

    export function removeVideo(videoId: string) {
        gridItems = gridItems.filter(item => item.video.id !== videoId);
        // Update positions after removal
        gridItems = gridItems.map((item, index) => ({
            ...item,
            position: index
        }));
    }

    export function clearGrid() {
        gridItems = [];
    }

    export function getGridData() {
        return gridItems.map(item => ({
            videoId: item.video.id,
            position: item.position,
            width: item.width,
            height: item.height
        }));
    }
</script>

<div class="grid-container" bind:clientWidth={containerWidth}>
    {#each gridItems as item (item.video.id)}
        <div
            class="grid-item"
            role="button"
            tabindex="0"
            style="
                width: {itemWidth}px;
                height: {itemWidth / aspectRatio}px;
                transform: translate(
                    {(item.position % columns) * (itemWidth + gap)}px,
                    {Math.floor(item.position / columns) * ((itemWidth / aspectRatio) + gap)}px
                )
            "
            draggable="true"
            on:dragstart={() => handleDragStart(item)}
            on:dragover={handleDragOver}
            on:drop={() => handleDrop(item)}
            on:keydown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDrop(item);
                }
            }}
        >
            <img
                src={item.video.thumbnail}
                alt={item.video.name}
                class="thumbnail"
            />
            <div class="overlay">
                <h3>{item.video.name}</h3>
                <button class="remove-button" on:click={() => removeVideo(item.video.id)}>
                    Remove
                </button>
            </div>
        </div>
    {/each}
</div>

<style>
    .grid-container {
        position: relative;
        width: 100%;
        min-height: 200px;
        padding: 1px; /* Prevent margin collapse */
    }

    .grid-item {
        position: absolute;
        transition: transform 0.3s ease;
        cursor: move;
        background: #1a1a1a;
        border-radius: 4px;
        overflow: hidden;
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
        transition: opacity 0.2s ease;
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

    .remove-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: #ff4444;
        color: white;
        border: none;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
    }

    .remove-button:hover {
        background: #ff6666;
    }
</style>
