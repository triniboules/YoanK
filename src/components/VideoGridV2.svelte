<script lang="ts">
  import VideoViewer from './VideoViewer.svelte';
  import { getAllVideos, recordVideoClick, getGridVideos } from '../lib/services/video.service';
  import type { Database } from '../lib/database.types';

  type Video = Database['public']['Tables']['videos']['Row'];
  
  export let gridId: string | null = null;
  
  let videos: Video[] = [];
  let selectedVideo: Video | null = null;
  let error: string | null = null;
  let isLoading = true;

  const logoMap: { [key: string]: string } = {
    Da: '/image/Da.webp',
    Yoann: '/image/logo.webp'
  };

  // Fetch and initialize the list of videos
  const fetchVideos = async () => {
    try {
      isLoading = true;
      if (gridId) {
        const gridVideos = await getGridVideos(gridId);
        videos = gridVideos.map(gv => gv.videos);
      } else {
        // Fetch all videos
        videos = await getAllVideos();
        // Sort by click count
        videos.sort((a, b) => (b.click_count || 0) - (a.click_count || 0));
      }
      error = null;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to fetch videos';
      console.error("Error fetching videos: ", err);
      videos = [];
    } finally {
      isLoading = false;
    }
  };

  // Watch for gridId changes
  $: {
    if (gridId !== undefined) {
      fetchVideos();
    }
  }

  const openVideo = async (video: Video) => {
    try {
      const userId = localStorage.getItem('userId') || 'anonymous';
      await recordVideoClick(video.id, userId);
      selectedVideo = video;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to record video click';
      console.error("Error recording video click: ", err);
    }
  };

  const closeVideo = () => {
    selectedVideo = null;
  };
</script>

<div class="video-grid">
  {#if isLoading}
    <div class="loading">Loading videos...</div>
  {:else if error}
    <div class="error-message">
      {error}
      <button on:click={() => { error = null; fetchVideos(); }}>Retry</button>
    </div>
  {:else if videos.length === 0}
    <div class="no-videos">
      {gridId ? 'No videos in this grid yet.' : 'No videos available.'}
    </div>
  {:else}
    {#each videos as video, index}
      <button 
        class="video-item"
        on:click={() => openVideo(video)}
        aria-label={`Play video: ${video.name}`}
      >
        <div class="thumbnail-container">
          <img
            src={video.thumbnail}
            alt={video.name}
            class="thumbnail"
            loading={index < 6 ? "eager" : "lazy"}
          />
          {#if video.showLogo && video.logoType && logoMap[video.logoType]}
            <img
              src={logoMap[video.logoType]}
              alt={`${video.logoType} logo`}
              class="logo"
            />
          {/if}
        </div>
        <div class="video-info">
          <h3>{video.name}</h3>
          <p>{video.description}</p>
          <div class="video-source">
            Source: {video.source || 'YouTube'}
          </div>
        </div>
      </button>
    {/each}
  {/if}
</div>

{#if selectedVideo}
  <VideoViewer selectedVideo={selectedVideo} onClose={closeVideo} />
{/if}

<style>
  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
  }

  .video-item {
    cursor: pointer;
    transition: transform 0.2s;
    background: #1a1a1a;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: none;
    padding: 0;
    width: 100%;
    text-align: left;
  }

  .video-item:hover {
    transform: translateY(-5px);
  }

  .video-item:focus {
    outline: 2px solid #ffffff;
    transform: translateY(-5px);
  }

  .thumbnail-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
    overflow: hidden;
  }

  .thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .logo {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .video-info {
    padding: 1rem;
  }

  .video-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: #ffffff;
  }

  .video-info p {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #999;
  }

  .video-source {
    font-size: 0.8rem;
    color: #666;
  }

  .loading {
    grid-column: 1 / -1;
    text-align: center;
    padding: 2rem;
    color: #ffffff;
    font-size: 1.2rem;
  }

  .error-message {
    grid-column: 1 / -1;
    background: rgba(255, 0, 0, 0.1);
    color: #ff6b6b;
    padding: 1rem;
    border-radius: 4px;
    text-align: center;
  }

  .no-videos {
    grid-column: 1 / -1;
    text-align: center;
    padding: 2rem;
    color: #999;
    font-style: italic;
  }

  @media (max-width: 768px) {
    .video-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }
  }
</style>
