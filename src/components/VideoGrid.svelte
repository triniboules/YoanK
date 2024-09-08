<script lang="ts">
  import VideoViewer from './VideoViewer.svelte';

  // Define the type for a video object with youtubeId instead of youtubeUrl
  interface Video {
    id: number;
    name: string;
    youtubeId: string;  // Changed from youtubeUrl to youtubeId
    thumbnail: string;
    description: string;
    showLogo?: boolean; // Optional property to determine if the DA SYNCRO logo should be displayed
  }

  // Define the videos array with the Video type in the specified order
  let videos: Video[] = [
    { id: 1, name: 'Myrto & Derek', youtubeId: 'oojG3E82yzQ', thumbnail: '/image/1.png', description: 'Myrto & Derek\nOpérateur Caméra', showLogo: true },
    { id: 2, name: 'Claire et Martin', youtubeId: 'I-h4WH3tVcc', thumbnail: '/image/2.png', description: 'Claire et Martin\nOpérateur Caméra', showLogo: true },
    { id: 3, name: 'Nathalie & Christophe', youtubeId: 'gZJyI-PGTHI', thumbnail: '/image/3.png', description: 'Nathalie & Christophe\nOpérateur Caméra', showLogo: true },
    { id: 4, name: 'Les Nuits du Réal', youtubeId: 'R2PnDV97Zrg', thumbnail: '/image/4.png', description: 'Les Nuits du Réal\nOpérateur Caméra', showLogo: true  },
    { id: 5, name: 'La Lucarne d\'Arianne', youtubeId: '3d6SlZscoeM', thumbnail: '/image/5.png', description: 'La Lucarne d\'Arianne\nRéalisation\nPrise de son\nOpérateur Caméra' },
    { id: 6, name: 'Litographie - Marko Zoric', youtubeId: 'stdlTlbi_o0', thumbnail: '/image/6.png', description: 'Litographie - Marko Zoric\nRéalisation\nMontage' },
    { id: 7, name: 'Unlocked - Sophie Jarmouni', youtubeId: 'YKA3anXENjQ', thumbnail: '/image/7.png', description: 'Unlocked - Sophie Jarmouni\nAssistant Caméra\nFocus puller' },
    { id: 8, name: 'Rien qu\'ça - GOHU', youtubeId: 'DSNs7fQifyM', thumbnail: '/image/8.png', description: 'Rien qu\'ça - GOHU\nRéalisation\nPrise de vue\nMontage' },
    { id: 9, name: 'Hold Up - Yautjaxx', youtubeId: 'lOygdbJni8A', thumbnail: '/image/9.png', description: 'Hold Up - Yautjaxx\nOpérateur Caméra\nPrise de vue' },
  ];

  // Define selectedVideo with the Video type or null
  let selectedVideo: Video | null = null;

  // Define function with Video parameter type
  const openVideo = (video: Video) => {
    selectedVideo = video;
  };

  // Define function to close the video viewer
  const closeVideo = () => {
    selectedVideo = null;
  };

  // Function to construct the embed URL from the video ID
  function getEmbedUrl(videoId: string) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
</script>

{#if selectedVideo}
  <VideoViewer {selectedVideo} on:close={closeVideo} />
{/if}

<div class="video-grid">
  {#each videos as video}
    <button class="video-item" on:click={() => openVideo(video)} aria-label={`Open ${video.name}`}>
      <div class="thumbnail-wrapper">
        <img src={video.thumbnail} alt={video.name} class="thumbnail" />
        {#if video.showLogo}
          <img src="/image/Da.png" alt="DA SYNCRO logo" class="logo" />
        {/if}
      </div>
      <div class="overlay">
        <p class="description">{video.description}</p>
      </div>
    </button>
  {/each}
</div>

<style>
.video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Default: 3 columns */

  width: 100%;
  padding-bottom: 0;
  box-sizing: border-box;
}

.video-item {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border: none;
  background: none;
  aspect-ratio: 2.39 / 1; /* Keep 2.39:1 aspect ratio for thumbnails */
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
}

.video-item:hover .thumbnail {
  opacity: 0.7;
}

.logo {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 100px;
  height: auto;
  z-index: 1;
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

.description {
  white-space: pre-line; /* Respect the new lines in the text */
  font-size: 1rem; /* Adjust font size as needed */
}

/* Responsive styles */
@media (max-width: 1200px) {
  .video-grid {
    grid-template-columns: repeat(2, 1fr); /* Two columns for screens smaller than 1200px */
  }
}

@media (max-width: 800px) {
  .video-grid {
    grid-template-columns: 1fr; /* One column for screens smaller than 800px */
  }
}
</style>
