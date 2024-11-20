<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    interface Video {
        id: string;
        name: string;
        description: string;
        source: 'youtube' | 'vimeo' | 'local';
        source_id: string;
        thumbnail: string;
        show_logo: boolean;
        logo_type: 'Da' | 'Yoann' | null;
        position: number;
    }

    interface GridVideo extends Video {
        grid_video_id: string;
    }

    interface GridConfig {
        id: string;
        name: string;
        description: string;
    }

    export let gridId: string | null = null;
    
    let videos: GridVideo[] = Array(9).fill(null);
    let loading = true;
    let error: string | null = null;
    let draggedVideo: GridVideo | null = null;
    let gridConfigs: GridConfig[] = [];
    let currentGridName = '';
    let currentGridDescription = '';
    let showNewGridForm = false;

    onMount(async () => {
        await fetchGridConfigs();
        if (gridId) {
            await fetchGridVideos();
        }
    });

    async function fetchGridConfigs() {
        try {
            const { data, error: fetchError } = await supabase
                .from('grid_configurations')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            gridConfigs = data || [];
        } catch (err) {
            console.error('Error fetching grid configurations:', err);
            error = 'Failed to load grid configurations';
        }
    }

    async function fetchGridVideos() {
        if (!gridId) return;
        
        try {
            const { data, error: fetchError } = await supabase
                .from('grid_videos')
                .select(`
                    id as grid_video_id,
                    position,
                    videos (
                        id,
                        name,
                        description,
                        source,
                        source_id,
                        thumbnail,
                        show_logo,
                        logo_type
                    )
                `)
                .eq('grid_id', gridId)
                .order('position');

            if (fetchError) throw fetchError;

            // Initialize a 9-position array with nulls
            const newVideos = Array(9).fill(null);
            
            // Fill in the positions we have videos for
            (data || []).forEach(item => {
                if (item.position >= 0 && item.position < 9) {
                    newVideos[item.position] = {
                        ...item.videos,
                        grid_video_id: item.grid_video_id,
                        position: item.position
                    };
                }
            });

            videos = newVideos;
            loading = false;
        } catch (err) {
            console.error('Error fetching grid videos:', err);
            error = 'Failed to load grid videos';
            loading = false;
        }
    }

    async function createNewGrid() {
        try {
            const { data, error: createError } = await supabase
                .from('grid_configurations')
                .insert([
                    {
                        name: currentGridName,
                        description: currentGridDescription
                    }
                ])
                .select()
                .single();

            if (createError) throw createError;

            gridConfigs = [...gridConfigs, data];
            gridId = data.id;
            showNewGridForm = false;
            currentGridName = '';
            currentGridDescription = '';
            videos = Array(9).fill(null);
        } catch (err) {
            console.error('Error creating grid:', err);
            error = 'Failed to create grid';
        }
    }

    async function switchGrid(newGridId: string) {
        gridId = newGridId;
        await fetchGridVideos();
    }

    async function updatePositions() {
        if (!gridId) return;

        try {
            const updates = videos
                .map((video, index) => {
                    if (!video) return null;
                    return {
                        id: video.grid_video_id,
                        position: index
                    };
                })
                .filter(update => update !== null);

            const { error: updateError } = await supabase
                .from('grid_videos')
                .upsert(updates);

            if (updateError) throw updateError;
        } catch (err) {
            console.error('Error updating positions:', err);
            error = 'Failed to update positions';
        }
    }

    async function handleDrop(targetPosition: number) {
        if (!draggedVideo || !gridId) return;

        try {
            const draggedPosition = videos.findIndex(v => v && v.grid_video_id === draggedVideo.grid_video_id);
            if (draggedPosition === -1) return;

            // Update local state
            const updatedVideos = [...videos];
            updatedVideos[draggedPosition] = null;
            updatedVideos[targetPosition] = { ...draggedVideo, position: targetPosition };

            videos = updatedVideos;

            // Update database
            const { error: updateError } = await supabase
                .from('grid_videos')
                .upsert({
                    id: draggedVideo.grid_video_id,
                    grid_id: gridId,
                    video_id: draggedVideo.id,
                    position: targetPosition,
                    user_id: (await supabase.auth.getUser()).data.user?.id
                });

            if (updateError) throw updateError;
        } catch (err) {
            console.error('Error updating positions:', err);
            error = err instanceof Error ? err.message : 'Failed to update positions';
            await fetchGridVideos();
        }
    }

    async function removeVideo(gridVideoId: string) {
        if (!confirm('Are you sure you want to remove this video from the grid?')) return;

        try {
            const { error: deleteError } = await supabase
                .from('grid_videos')
                .delete()
                .eq('id', gridVideoId);

            if (deleteError) throw deleteError;

            const position = videos.findIndex(v => v && v.grid_video_id === gridVideoId);
            if (position !== -1) {
                videos[position] = null;
                videos = [...videos];
            }
            
            dispatch('videoRemoved', gridVideoId);
        } catch (err) {
            console.error('Error removing video:', err);
            error = err instanceof Error ? err.message : 'Failed to remove video';
        }
    }

    function handleDragStart(video: GridVideo) {
        draggedVideo = video;
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
    }

    function getThumbnailUrl(video: Video): string {
        if (video.thumbnail) return video.thumbnail;
        if (video.source === 'youtube') {
            return `https://img.youtube.com/vi/${video.source_id}/maxresdefault.jpg`;
        }
        return '/placeholder.jpg';
    }
</script>

<div class="grid-editor">
    <h2>Grid Editor</h2>

    <div class="grid-controls">
        <select bind:value={gridId} on:change={() => switchGrid(gridId)}>
            <option value="">Select a grid configuration</option>
            {#each gridConfigs as config}
                <option value={config.id}>{config.name}</option>
            {/each}
        </select>

        <button on:click={() => showNewGridForm = true}>Create New Grid</button>
    </div>

    {#if showNewGridForm}
        <div class="new-grid-form">
            <input 
                type="text" 
                bind:value={currentGridName} 
                placeholder="Grid Name"
                required
            />
            <input 
                type="text" 
                bind:value={currentGridDescription} 
                placeholder="Grid Description"
            />
            <button on:click={createNewGrid}>Create</button>
            <button on:click={() => showNewGridForm = false}>Cancel</button>
        </div>
    {/if}

    {#if error}
        <div class="error">{error}</div>
    {/if}

    {#if loading && gridId}
        <div class="loading">Loading grid videos...</div>
    {:else}
        <div class="video-grid">
            {#each videos as video, position}
                <div
                    class="video-slot"
                    class:empty={!video}
                    on:dragover={handleDragOver}
                    on:drop={() => handleDrop(position)}
                >
                    {#if video}
                        <div
                            class="video-item"
                            draggable="true"
                            on:dragstart={() => handleDragStart(video)}
                        >
                            <div class="thumbnail-wrapper">
                                <img
                                    src={getThumbnailUrl(video)}
                                    alt={video.name}
                                    class="thumbnail"
                                />
                                {#if video.show_logo && video.logo_type}
                                    <div class="logo {video.logo_type.toLowerCase()}-logo"></div>
                                {/if}
                            </div>
                            <div class="video-info">
                                <h3>{video.name}</h3>
                                <p>{video.description}</p>
                            </div>
                            <button 
                                class="remove-button"
                                on:click={() => removeVideo(video.grid_video_id)}
                            >
                                Remove
                            </button>
                        </div>
                    {:else}
                        <div class="empty-slot">
                            Empty Slot {position + 1}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .grid-editor {
        background: #1a1a1a;
        padding: 1rem;
        border-radius: 8px;
        color: #fff;
    }

    .grid-controls {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .grid-controls select {
        flex: 1;
        padding: 0.5rem;
        border-radius: 4px;
        background: #2a2a2a;
        color: #fff;
        border: 1px solid #444;
    }

    .grid-controls button {
        padding: 0.5rem 1rem;
        background: #444;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .new-grid-form {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        background: #2a2a2a;
        border-radius: 4px;
    }

    .new-grid-form input {
        flex: 1;
        padding: 0.5rem;
        border-radius: 4px;
        background: #333;
        color: #fff;
        border: 1px solid #444;
    }

    .video-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        padding: 1rem;
    }

    .video-slot {
        background: #2a2a2a;
        border-radius: 8px;
        aspect-ratio: 16/9;
        overflow: hidden;
    }

    .video-slot.empty {
        border: 2px dashed #444;
    }

    .empty-slot {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 0.9rem;
    }

    .video-item {
        height: 100%;
        cursor: move;
        position: relative;
    }

    .video-item:hover {
        transform: scale(1.02);
    }

    .thumbnail-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .thumbnail {
        width: 100%;
        height: 100%;
        object-fit: cover;
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

    .video-info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem;
        background: linear-gradient(transparent, rgba(0,0,0,0.8));
    }

    .video-info h3 {
        margin: 0;
        font-size: 1rem;
        color: #fff;
    }

    .video-info p {
        margin: 0.5rem 0 0;
        font-size: 0.8rem;
        color: #aaa;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .remove-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 68, 68, 0.8);
        color: white;
        border: none;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
    }

    .video-item:hover .remove-button {
        opacity: 1;
    }

    .error {
        background: #ff4444;
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .loading {
        text-align: center;
        color: #666;
        padding: 1rem;
    }

    @media (max-width: 768px) {
        .video-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
