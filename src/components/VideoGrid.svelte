<script lang="ts">
  import VideoViewer from './VideoViewer.svelte';
  import { supabase } from '$lib/supabaseClient';
  import type { Database } from '../lib/database.types';

  type Video = Database['public']['Tables']['videos']['Row'] & { position: number };
  type GridVideo = {
    position: number;
    videos: Database['public']['Tables']['videos']['Row'];
  };
  type VideoSourceType = 'youtube' | 'vimeo' | 'local';
  type LogoType = 'Da' | 'Yoann';

  let videos: Video[] = [];
  let selectedVideo: Video | null = null;
  let currentGridId: string | null = null;

  const logoMap: { [key: string]: string } = {
    Da: '/image/Da.webp',
    Yoann: '/image/logo.webp'
  };

  // Fetch videos with their grid positions
  const fetchVideos = async () => {
    try {
      // First get the most recent grid configuration
      const { data: gridData, error: gridError } = await supabase
        .from('grid_configurations')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (gridError) throw gridError;
      
      if (gridData) {
        currentGridId = gridData.id;

        // Then get all videos with their positions in this grid
        const { data, error } = await supabase
          .from('grid_videos')
          .select(`
            position,
            videos (
              id,
              name,
              description,
              source,
              source_id,
              youtube_id,
              thumbnail,
              show_logo,
              logo_type,
              created_at,
              updated_at
            )
          `)
          .eq('grid_id', currentGridId)
          .order('position');

        if (error) throw error;

        if (data) {
          // Type assertion to help TypeScript understand the data structure
          const gridVideos = data as GridVideo[];
          videos = gridVideos.map(item => ({
            ...item.videos,
            position: item.position
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching videos: ", error);
    }
  };

  fetchVideos();

  const openVideo = (video: Video) => {
    selectedVideo = video;
  };

  const closeVideo = () => {
    selectedVideo = null;
  };

  function getEmbedUrl(video: Video) {
    switch (video.source) {
      case 'youtube':
        return `https://www.youtube.com/embed/${video.youtube_id || video.source_id}`;
      case 'vimeo':
        return `https://player.vimeo.com/video/${video.source_id}`;
      case 'local':
        return video.source_id;
      default:
        return '';
    }
  }

  function handleImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.opacity = '1';
  }

  function getLogoPath(logoType: LogoType | null) {
    return logoType && logoMap[logoType] ? logoMap[logoType] : '';
  }
</script>

{#if selectedVideo}
  <VideoViewer {selectedVideo} onClose={closeVideo} />
{/if}

<div class="video-grid">
  {#each videos as video}
    <button class="video-item" on:click={() => openVideo(video)} aria-label={`Open ${video.name}`}>
      <div class="thumbnail-wrapper">
        <img src={video.thumbnail} alt={video.name} class="thumbnail" loading="lazy" on:load={handleImageLoad} style="opacity: 0; transition: opacity 3s ease;" />
        {#if video.show_logo && video.logo_type}
          <img 
            src={getLogoPath(video.logo_type)} 
            alt={video.logo_type === 'Da' ? 'DA SYNCRO logo' : 'Yoann logo'} 
            class="logo {video.logo_type !== 'Da' ? 'small-logo' : ''}" />
        {/if}
      </div>
      <div class="overlay">
        <p class="description">{video.description}</p>
      </div>
    </button>
  {/each}
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap');

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
