<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

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

    let videos: Video[] = [];
    let loading = true;
    let error: string | null = null;
    let showAddForm = false;
    let newVideo: Partial<Video> = {
        source: 'youtube'
    };

    onMount(fetchVideos);

    async function fetchVideos() {
        try {
            const { data, error: fetchError } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            videos = data || [];
        } catch (err) {
            console.error('Error fetching videos:', err);
            error = err instanceof Error ? err.message : 'Failed to load videos';
        } finally {
            loading = false;
        }
    }

    async function addVideo() {
        if (!newVideo.source_id) {
            error = 'Video URL or ID is required';
            return;
        }

        try {
            // Extract video ID from YouTube URL
            let sourceId = newVideo.source_id;
            const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
            const match = newVideo.source_id.match(youtubeRegex);
            if (match) {
                sourceId = match[1];
            }

            // Get video thumbnail
            const thumbnail = `https://img.youtube.com/vi/${sourceId}/maxresdefault.jpg`;

            // Add video to database
            const { data: insertedVideo, error: createError } = await supabase
                .from('videos')
                .insert([{
                    source: 'youtube',
                    source_id: sourceId,
                    name: newVideo.name || sourceId,
                    description: newVideo.description || '',
                    thumbnail,
                    user_id: (await supabase.auth.getUser()).data.user?.id
                }])
                .select()
                .single();

            if (createError) throw createError;

            videos = [insertedVideo, ...videos];
            showAddForm = false;
            newVideo = { source: 'youtube' };
            dispatch('videoAdded', insertedVideo);
        } catch (err) {
            console.error('Error adding video:', err);
            error = err instanceof Error ? err.message : 'Failed to add video';
        }
    }

    async function deleteVideo(videoId: string) {
        if (!confirm('Are you sure you want to delete this video?')) return;

        try {
            const { error: deleteError } = await supabase
                .from('videos')
                .delete()
                .eq('id', videoId);

            if (deleteError) throw deleteError;
            videos = videos.filter(v => v.id !== videoId);
        } catch (err) {
            console.error('Error deleting video:', err);
            error = err instanceof Error ? err.message : 'Failed to delete video';
        }
    }

    function getThumbnailUrl(video: Video): string {
        if (video.thumbnail) return video.thumbnail;
        if (video.source === 'youtube') {
            return `https://img.youtube.com/vi/${video.source_id}/maxresdefault.jpg`;
        }
        return '/placeholder.jpg';
    }
</script>

<div class="video-library">
    <div class="header">
        <h2>Video Library</h2>
        <button class="add-button" on:click={() => showAddForm = true}>
            Add New Video
        </button>
    </div>

    {#if error}
        <div class="error">{error}</div>
    {/if}

    {#if showAddForm}
        <div class="add-form">
            <input
                type="text"
                bind:value={newVideo.name}
                placeholder="Video Name"
                class="input"
            />
            <textarea
                bind:value={newVideo.description}
                placeholder="Video Description"
                class="input"
            ></textarea>
            <input
                type="text"
                bind:value={newVideo.source_id}
                placeholder="Video ID (YouTube ID)"
                class="input"
            />
            <div class="form-buttons">
                <button class="save-button" on:click={addVideo}>Add Video</button>
                <button class="cancel-button" on:click={() => showAddForm = false}>Cancel</button>
            </div>
        </div>
    {/if}

    {#if loading}
        <div class="loading">Loading videos...</div>
    {:else}
        <div class="video-grid">
            {#each videos as video}
                <div class="video-item">
                    <img
                        src={getThumbnailUrl(video)}
                        alt={video.name}
                        class="thumbnail"
                    />
                    <div class="video-info">
                        <h3>{video.name}</h3>
                        <p>{video.description}</p>
                    </div>
                    <div class="video-actions">
                        <button class="delete-button" on:click={() => deleteVideo(video.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .video-library {
        background: #1a1a1a;
        padding: 1rem;
        border-radius: 8px;
        color: #fff;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .video-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
    }

    .video-item {
        background: #2a2a2a;
        border-radius: 8px;
        overflow: hidden;
    }

    .thumbnail {
        width: 100%;
        aspect-ratio: 16/9;
        object-fit: cover;
    }

    .video-info {
        padding: 1rem;
    }

    .video-info h3 {
        margin: 0;
        color: #fff;
    }

    .video-info p {
        color: #aaa;
        margin: 0.5rem 0;
        font-size: 0.9rem;
    }

    .video-actions {
        display: flex;
        padding: 1rem;
        gap: 0.5rem;
    }

    .delete-button {
        background: #ff4444;
        color: white;
        border: none;
        padding: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
    }

    .add-form {
        background: #2a2a2a;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .input {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        background: #333;
        border: 1px solid #444;
        color: white;
        border-radius: 4px;
    }

    .form-buttons {
        display: flex;
        gap: 0.5rem;
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
</style>
