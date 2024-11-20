<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from '$lib/supabaseClient';
    import type { PostgrestError } from '@supabase/supabase-js';

    interface Video {
        id: string;
        description: string;
        name: string;
        source: 'youtube' | 'vimeo' | 'local';
        source_id: string;
        thumbnail: string;
        show_logo: boolean;
        logo_type: 'none' | 'logo' | 'Da' | null;
        created_at: string;
        updated_at: string;
        position: number;
        [key: string]: string | number | boolean | null; // Index signature for dynamic access
    }

    let videos: Video[] = [];
    let draggedVideoId: string | null = null;
    let draggedIndex: number | null = null;
    let hasUnsavedChanges = false;
    let message = '';
    let messageType: 'error' | 'success' | null = null;
    let editVideoId: string = "";
    let editedVideo: Partial<Video> & { [key: string]: any } = {};
    let isCreateMode: boolean = false;

    onMount(() => {
        loadVideos();
        const channel = supabase
            .channel('videos')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'videos' },
                () => loadVideos()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    });

    const loadVideos = async () => {
        try {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('position');

            if (error) throw error;

            videos = data || [];
        } catch (error) {
            const pgError = error as PostgrestError;
            setMessage(`Failed to load videos: ${pgError.message}`, 'error');
        }
    };

    const handleDragStart = (e: DragEvent, id: string) => {
        if (!e.dataTransfer || !e.target) return;
        
        draggedVideoId = id;
        draggedIndex = videos.findIndex(v => v.id === id);
        e.dataTransfer.effectAllowed = 'move';
        const target = e.target as HTMLElement;
        target.closest('.video-item')?.classList.add('dragging');
    };

    const handleDragEnd = () => {
        draggedVideoId = null;
        draggedIndex = null;
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        if (!draggedVideoId || !draggedIndex || !e.target) return;
        
        const target = e.target as HTMLElement;
        const targetItem = target.closest('.video-item');
        if (!targetItem) return;

        const targetId = targetItem.getAttribute('data-id');
        if (!targetId || targetId === draggedVideoId) return;

        const targetIndex = videos.findIndex(v => v.id === targetId);
        if (targetIndex === -1) return;

        // Only update if position changed
        if (targetIndex !== draggedIndex) {
            const draggedVideo = videos[draggedIndex];
            videos.splice(draggedIndex, 1);
            videos.splice(targetIndex, 0, draggedVideo);
            videos = videos; // trigger reactivity
            draggedIndex = targetIndex;
            hasUnsavedChanges = true;
        }
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
    };

    const saveVideoOrder = async () => {
        if (!hasUnsavedChanges) {
            setMessage('No changes to save', 'success');
            return;
        }

        try {
            // Update positions one by one to avoid touching other fields
            for (let i = 0; i < videos.length; i++) {
                const { error } = await supabase
                    .from('videos')
                    .update({ position: i })
                    .eq('id', videos[i].id);
                
                if (error) throw error;
            }

            hasUnsavedChanges = false;
            setMessage('Video order saved successfully', 'success');
        } catch (error) {
            const pgError = error as PostgrestError;
            setMessage(`Failed to save changes: ${pgError.message}`, 'error');
        }
    };

    const setMessage = (text: string, type: 'error' | 'success') => {
        message = text;
        messageType = type;
        setTimeout(() => {
            message = '';
            messageType = null;
        }, 3000);
    };

    const handleClick = (id: string) => {
        const video = videos.find(v => v.id === id);
        if (!video) return;

        editVideoId = id;
        editedVideo = { ...video };
    };

    const createNewVideo = () => {
        isCreateMode = true;
        editedVideo = {
            name: '',
            description: '',
            source: 'youtube' as const,
            source_id: '',
            thumbnail: '',
            show_logo: false,
            logo_type: null
        };
    };

    const handleSave = async () => {
        try {
            if (!editedVideo.name) {
                throw new Error('Name is required');
            }

            if (isCreateMode) {
                const videoData = {
                    ...editedVideo,
                    position: videos.length
                };
                const { data, error } = await supabase
                    .from('videos')
                    .insert([videoData])
                    .select();

                if (error) throw error;
                if (data) {
                    videos = [...videos, data[0]];
                    setMessage("Video created successfully!", 'success');
                }
            } else {
                // Get the original video
                const originalVideo = videos.find(v => v.id === editVideoId);
                if (!originalVideo) {
                    throw new Error('Video not found');
                }

                // Compare each field and only include changed ones
                const changes: Partial<Video> = {};
                (Object.keys(editedVideo) as Array<keyof Video>).forEach(key => {
                    if (key === 'name' || editedVideo[key] !== originalVideo[key]) {
                        changes[key] = editedVideo[key] ?? originalVideo[key];
                    }
                });

                // Only update if there are changes
                if (Object.keys(changes).length > 0) {
                    const { error } = await supabase
                        .from('videos')
                        .update({
                            ...changes,
                            name: editedVideo.name || originalVideo.name, // Ensure name is always set
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', editVideoId);

                    if (error) throw error;
                    videos = videos.map(v => v.id === editVideoId ? { ...v, ...changes } : v);
                    setMessage("Video updated successfully!", 'success');
                } else {
                    setMessage("No changes to save", 'success');
                }
            }
            exitEditMode();
        } catch (error) {
            const pgError = error as PostgrestError;
            setMessage(`Failed to save video: ${pgError.message}`, 'error');
        }
    };

    const exitEditMode = () => {
        editVideoId = "";
        editedVideo = {};
        isCreateMode = false;
    };

    const deleteVideo = async (id: string) => {
        if (!confirm('Are you sure you want to delete this video?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('videos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            videos = videos.filter(video => video.id !== id);
            setMessage("Video deleted successfully!", 'success');
            exitEditMode();
        } catch (error) {
            const pgError = error as PostgrestError;
            setMessage(`Failed to delete video: ${pgError.message}`, 'error');
        }
    };

    const getDefaultThumbnail = (videoId: string) => {
        return videoId ? 
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` :
            '/placeholder-thumbnail.jpg';
    };

    const closeModal = () => {
        exitEditMode();
    };
</script>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        width: 100vw;
    }

    .container {
        width: 100%;
        max-width: calc(100vw - 232px); /* 200px sidebar + 32px padding */
        margin: 0 auto;
        padding: 1rem;
        color: #fff;
    }

    .message {
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 4px;
        text-align: center;
    }

    .message.error {
        background: #ff4444;
        color: white;
    }

    .message.success {
        background: #28a745;
        color: white;
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        color: black;
    }

    button {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
    }

    .save-button {
        background-color: #4CAF50;
        color: white;
        font-weight: bold;
        margin-top: 20px;
    }

    .save-button:hover {
        background-color: #45a049;
    }

    .cancel-button {
        background-color: #f44336;
        color: white;
        margin-right: 10px;
    }

    .cancel-button:hover {
        background-color: #da190b;
    }

    .delete-button {
        background-color: #dc3545;
        color: white;
        margin-right: auto;
    }

    .delete-button:hover {
        background-color: #c82333;
    }

    .button-group {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        width: 100%;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
    }

    .form-group label {
        font-weight: 500;
        color: var(--text-1);
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        padding: 0.5rem;
        border: 1px solid var(--surface-3);
        border-radius: 4px;
        background: var(--surface-1);
        color: var(--text-1);
        width: 100%;
        font-size: 1rem;
    }

    .form-group textarea {
        min-height: 100px;
        resize: vertical;
    }

    .checkbox-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .checkbox-group input[type="checkbox"] {
        width: auto;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        padding: 1.5rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        margin-top: 1rem;
    }

    @media (max-width: 1200px) {
        .grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .grid {
            grid-template-columns: 1fr;
        }
    }

    .video-item {
        background: #2a2a2a;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s;
        cursor: pointer;
    }

    .video-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .video-item.dragging {
        opacity: 0.5;
    }

    .thumbnail-wrapper {
        position: relative;
        padding-top: 56.25%;
        background: #000;
    }

    .thumbnail {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .logo-badge {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
    }

    .video-info {
        padding: 1rem;
    }

    h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
        color: #fff;
    }

    .video-description {
        font-size: 0.9rem;
        color: #888;
        margin-bottom: 1rem;
        white-space: pre-wrap;
        word-break: break-word;
        max-height: 100px;
        overflow-y: auto;
    }

    .video-source {
        font-size: 0.8rem;
        color: #888;
        margin: 0.5rem 0;
    }

    .button-row {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .button-row button {
        flex: 1;
        padding: 0.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        color: white;
    }

    .edit-button {
        background: #007bff;
    }

    .edit-button:hover {
        background: #0056b3;
    }

    .delete-button {
        background: #dc3545;
    }

    .delete-button:hover {
        background: #c82333;
    }

    .controls {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .create-button, .save-order-button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }

    .create-button {
        background: #007bff;
        color: white;
    }

    .save-order-button {
        background: #28a745;
        color: white;
    }
</style>

<div class="container">
    {#if message}
        <div class="message {messageType}">{message}</div>
    {/if}

    <div class="controls">
        <button class="create-button" on:click={createNewVideo}>Add Video</button>
        <button class="save-order-button" on:click={saveVideoOrder}>Save Video Order</button>
    </div>

    <div 
        class="grid" 
        role="grid"
        tabindex="0"
        on:dragover={handleDragOver}
        on:drop={handleDrop}
    >
        {#each videos as video (video.id)}
            <div
                class="video-item"
                draggable="true"
                on:dragstart={(e) => handleDragStart(e, video.id)}
                on:dragend={handleDragEnd}
                on:click={() => handleClick(video.id)}
                on:keydown={(e) => e.key === 'Enter' && handleClick(video.id)}
                class:dragging={draggedVideoId === video.id}
                role="gridcell"
                tabindex="0"
                data-id={video.id}
            >
                <div class="thumbnail-wrapper">
                    <img 
                        src={video.thumbnail || getDefaultThumbnail(video.source_id || '')} 
                        alt={video.name}
                        class="thumbnail"
                    />
                    {#if video.show_logo}
                        <div class="logo-badge">
                            {video.logo_type}
                        </div>
                    {/if}
                </div>
                <div class="video-info">
                    <h3>{video.name}</h3>
                    <div class="video-description">{video.description}</div>
                    <div class="video-source">
                        Source: {video.source}
                        {#if video.source === 'youtube'}
                            <br>ID: {video.source_id}
                        {:else}
                            <br>ID: {video.source_id}
                        {/if}
                    </div>
                </div>
            </div>
        {/each}
    </div>

    {#if editVideoId || isCreateMode}
        <div 
            class="modal" 
            on:click|self={closeModal}
            on:keydown={(e) => e.key === 'Escape' && closeModal()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
        >
            <div class="modal-content">
                <h2 id="dialog-title">{editedVideo.id ? 'Edit Video' : 'Add Video'}</h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="name">Name *</label>
                        <input
                            type="text"
                            id="name"
                            bind:value={editedVideo.name}
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea
                            id="description"
                            bind:value={editedVideo.description}
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label for="source">Source</label>
                        <select id="source" bind:value={editedVideo.source}>
                            <option value="youtube">YouTube</option>
                            <option value="vimeo">Vimeo</option>
                            <option value="local">Local</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="source_id">Source ID</label>
                        <input
                            type="text"
                            id="source_id"
                            bind:value={editedVideo.source_id}
                        />
                    </div>

                    <div class="form-group">
                        <label for="thumbnail">Thumbnail URL</label>
                        <input
                            type="text"
                            id="thumbnail"
                            bind:value={editedVideo.thumbnail}
                        />
                    </div>

                    <div class="form-group">
                        <div class="checkbox-group">
                            <input
                                type="checkbox"
                                id="show_logo"
                                bind:checked={editedVideo.show_logo}
                            />
                            <label for="show_logo">Show Logo</label>
                        </div>
                    </div>

                    {#if editedVideo.show_logo}
                        <div class="form-group">
                            <label for="logo_type">Logo Type</label>
                            <select 
                                id="logo_type" 
                                bind:value={editedVideo.logo_type}
                            >
                                <option value="none">None</option>
                                <option value="Da">DA</option>
                                <option value="logo">Yoann</option>
                            </select>
                        </div>
                    {/if}
                </div>

                <div class="button-group">
                    {#if !isCreateMode}
                        <button 
                            type="button"
                            class="delete-button" 
                            on:click={() => deleteVideo(editVideoId)}
                        >
                            Delete
                        </button>
                    {/if}
                    <button 
                        type="button"
                        class="cancel-button" 
                        on:click={closeModal}
                    >
                        Cancel
                    </button>
                    <button 
                        type="button"
                        class="save-button" 
                        on:click={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>