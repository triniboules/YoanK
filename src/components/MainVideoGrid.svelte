<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabase';
  import VideoViewer from './VideoViewer.svelte';
  import type { Database } from '../lib/database.types';

  type Video = Database['public']['Tables']['videos']['Row'];

  let videos: Video[] = [];
  let selectedVideo: Video | null = null;
  let loading = true;
  let error: string | null = null;

  const logoMap = {
    Da: '/image/Da.webp',
    logo: '/image/logo.webp'
  };

  async function fetchVideos() {
    try {
      const { data, error: fetchError } = await supabase
        .from('videos')
        .select('*')
        .order('position', { ascending: true });

      if (fetchError) throw fetchError;

      videos = data || [];
      loading = false;
    } catch (err) {
      console.error('Error fetching videos:', err);
      error = err instanceof Error ? err.message : 'Failed to load videos. Please try again later.';
      loading = false;
    }
  }

  async function recordVideoClick(videoId: string) {
    try {
      const { error: clickError } = await supabase.rpc(
        'increment_video_click',
        { video_uuid: videoId }
      );

      if (clickError) throw clickError;
    } catch (err) {
      console.error('Error recording video click:', err);
    }
  }

  async function openVideo(video: Video) {
    await recordVideoClick(video.id);
    selectedVideo = video;
  }

  function closeVideo() {
    selectedVideo = null;
  }

  function handleImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.opacity = '1';
  }

  function getLogoPath(logoType: 'Da' | 'logo' | 'none' | null): string {
    return logoType ? logoMap[logoType] : '';
  }

  onMount(() => {
    fetchVideos();
  });
</script>

{#if selectedVideo}
  <VideoViewer {selectedVideo} on:close={() => selectedVideo = null} />
{/if}

{#if loading}
  <div class="loading">Loading...</div>
{:else if error}
  <div class="error">{error}</div>
{:else}
  <div class="video-grid">
    {#each videos as video}
      <button class="video-item" on:click={() => openVideo(video)} aria-label={`Open ${video.name}`}>
        <div class="thumbnail-wrapper">
          <img 
            src={video.thumbnail} 
            alt={video.name} 
            class="thumbnail" 
            loading="lazy" 
            on:load={handleImageLoad} 
            style="opacity: 0; transition: opacity 3s ease;" 
          />
          {#if video.show_logo && video.logo_type}
            <img 
              src={getLogoPath(video.logo_type)} 
              alt={video.logo_type === 'Da' ? 'DA SYNCRO logo' : 'Yoann logo'} 
              class="logo {video.logo_type !== 'Da' ? 'small-logo' : ''}" 
            />
          {/if}
        </div>
        <div class="overlay">
          <p class="description">{video.description}</p>
        </div>
      </button>
    {/each}
  </div>
{/if}

<style>
  .video-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(250px, 1fr));
    gap: 5px;
    justify-content: center;
    align-content: center;
    width: 100%;
    max-width: 100vw;
    padding-inline: 10px;
    box-sizing: border-box;
    scale: 99%;
  }

  .loading, .error {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 1.2rem;
  }

  .error {
    color: #ff6b6b;
  }

  .video-item {
    position: relative;
    cursor: pointer;
    overflow: hidden;
    border: none;
    background: none;
    aspect-ratio: 2.39 / 1;
    transition: transform 0.5s ease;
  }

  .thumbnail-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .thumbnail {
    width: 100%;
    height: auto;
    max-height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease;
    opacity: 1;
  }

  .logo {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 100px;
    height: auto;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .small-logo {
    transform: scale(0.7);
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    text-align: center;
    display: none;
    width: 100%;
  }

  .video-item:hover {
    transform: scale(1.01);
  }

  .video-item:hover .overlay {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .video-item:hover .logo {
    opacity: 1;
  }

  .video-item:hover .thumbnail {
    opacity: 0.4;
    filter: blur(2px);
  }

  .description {
    white-space: pre-line;
    font-size: 1rem;
    font-family: 'Roboto Slab', serif;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 1200px) {
    .video-grid {
      grid-template-columns: repeat(2, minmax(250px, 1fr));
    }
  }

  @media (max-width: 800px) {
    .video-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
