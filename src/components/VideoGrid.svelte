<script lang="ts">
  import VideoViewer from './VideoViewer.svelte';

  interface Video {
    id: number;
    name: string;
    youtubeId: string;
    thumbnail: string;
    description: string;
    showLogo?: boolean;
  }

  let videos: Video[] = [
    { id: 1, name: 'Myrto & Derek', youtubeId: 'oojG3E82yzQ', thumbnail: '/image/1.webp', description: 'Myrto & Derek\nOpérateur Caméra', showLogo: true },
    { id: 2, name: 'Claire et Martin', youtubeId: 'I-h4WH3tVcc', thumbnail: '/image/2.webp', description: 'Claire et Martin\nOpérateur Caméra', showLogo: true },
    { id: 3, name: 'Nathalie & Christophe', youtubeId: 'gZJyI-PGTHI', thumbnail: '/image/3.webp', description: 'Nathalie & Christophe\nOpérateur Caméra', showLogo: true },
    { id: 4, name: 'Les Nuits du Réal', youtubeId: 'R2PnDV97Zrg', thumbnail: '/image/4.webp', description: 'Les Nuits du Réal\nOpérateur Caméra', showLogo: true  },
    { id: 5, name: 'La Lucarne d\'Arianne', youtubeId: '3d6SlZscoeM', thumbnail: '/image/5.webp', description: 'La Lucarne d\'Arianne\nRéalisation\nPrise de son\nOpérateur Caméra' },
    { id: 6, name: 'Litographie - Marko Zoric', youtubeId: 'stdlTlbi_o0', thumbnail: '/image/6.webp', description: 'Litographie - Marko Zoric\nRéalisation\nMontage' },
    { id: 7, name: 'Unlocked - Sophie Jarmouni', youtubeId: 'YKA3anXENjQ', thumbnail: '/image/7.webp', description: 'Unlocked - Sophie Jarmouni\nAssistant Caméra\nFocus puller' },
    { id: 8, name: 'Rien qu\'ça - GOHU', youtubeId: 'DSNs7fQifyM', thumbnail: '/image/8.webp', description: 'Rien qu\'ça - GOHU\nRéalisation\nPrise de vue\nMontage' },
    { id: 9, name: 'Hold Up - Yautjaxx', youtubeId: 'lOygdbJni8A', thumbnail: '/image/9.webp', description: 'Hold Up - Yautjaxx\nOpérateur Caméra\nPrise de vue' },
  ];

  let selectedVideo: Video | null = null;

  const openVideo = (video: Video) => {
    selectedVideo = video;
  };

  const closeVideo = () => {
    selectedVideo = null;
  };

  function getEmbedUrl(videoId: string) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  function handleImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.opacity = '1';
  }

  function handleLogoLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.opacity = '1';
  }
</script>

{#if selectedVideo}
  <VideoViewer {selectedVideo} on:close={closeVideo} />
{/if}

<div class="video-grid">
  {#each videos as video}
    <button class="video-item" on:click={() => openVideo(video)} aria-label={`Open ${video.name}`}>
      <div class="thumbnail-wrapper">
        <img src={video.thumbnail} alt={video.name} class="thumbnail" loading="lazy" on:load={handleImageLoad} style="opacity: 0; transition: opacity 3s ease;" />
        {#if video.showLogo}
          <img src="/image/Da.webp" alt="DA SYNCRO logo" class="logo" on:load={handleLogoLoad} style="opacity: 0; transition: opacity 6s ease;" />
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
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
    padding-bottom: 8px;
    box-sizing: border-box;
  }

  .video-item {
    position: relative;
    cursor: pointer;
    overflow: hidden;
    border: none;
    background: none;
    aspect-ratio: 2.39 / 1;
    width: 100%;
  }

  .thumbnail-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    width: 101%;
    height: 99%;
    object-fit: fill;
    transition: opacity 0.3s ease;
    opacity: 0;
  }

  .logo {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 100px;
    height: auto;
    z-index: 1;
    opacity: 0;
    transition: opacity 3s ease;
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

  .video-item:hover .overlay {
    display: block;
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
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 800px) {
    .video-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
