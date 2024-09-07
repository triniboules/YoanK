<script lang="ts">
  import VideoViewer from './VideoViewer.svelte';

  // Define the type for a video object with youtubeId instead of youtubeUrl
  interface Video {
    id: number;
    name: string;
    youtubeId: string;  // Changed from youtubeUrl to youtubeId
    thumbnail: string;
    description: string;
  }

  // Define the videos array with the Video type in the specified order
  let videos: Video[] = [
    { id: 1, name: 'Myrto & Derek', youtubeId: 'oojG3E82yzQ', thumbnail: '/src/lib/image/1.png', description: 'Myrto & Derek' },
    { id: 2, name: 'Claire et Martin', youtubeId: 'I-h4WH3tVcc', thumbnail: '/src/lib/image/2.png', description: 'Claire et Martin' },
    { id: 3, name: 'Nathalie & Christophe', youtubeId: 'gZJyI-PGTHI', thumbnail: '/src/lib/image/3.png', description: 'Nathalie & Christophe' },
    { id: 4, name: 'Les Nuits du Réal', youtubeId: 'R2PnDV97Zrg', thumbnail: '/src/lib/image/4.png', description: 'Les Nuits du Réal' },
    { id: 5, name: 'La Lucarne d\'Arianne', youtubeId: '3d6SlZscoeM', thumbnail: '/src/lib/image/5.png', description: 'La Lucarne d\'Arianne' },
    { id: 6, name: 'Litographie - Marko Zoric', youtubeId: 'stdlTlbi_o0', thumbnail: '/src/lib/image/6.png', description: 'Litographie - Marko Zoric' },
    { id: 7, name: 'Unlocked - Sophie Jarmouni', youtubeId: 'YKA3anXENjQ', thumbnail: '/src/lib/image/7.png', description: 'Unlocked - Sophie Jarmouni' },
    { id: 8, name: 'Rien qu\'ça - GOHU', youtubeId: 'DSNs7fQifyM', thumbnail: '/src/lib/image/8.png', description: 'Rien qu\'ça - GOHU' },
    { id: 9, name: 'Hold Up - Yautjaxx', youtubeId: 'lOygdbJni8A', thumbnail: '/src/lib/image/9.png', description: 'Hold Up - Yautjaxx' },
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
      </div>
      <div class="overlay">
        <p>{video.name}</p>
      </div>
    </button>
  {/each}
</div>

<style>
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(33%, 1fr)); /* Ensure each image takes up 33% */
  gap: 0px; /* 2px gap between each grid item */
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.video-item {
  position: auto;
  cursor: pointer;
  overflow: hidden;
  border: none;
  background: none;
  width: 100%;
  aspect-ratio: 2.39 / 1; /* Ensure all thumbnails maintain a 2.39:1 aspect ratio */
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
  width: 100%;
  height: 100%;
  object-fit: contain; /* Ensure image is fully visible without cropping */
  transition: opacity 0.3s ease;
}

.video-item:hover .thumbnail {
  opacity: 0.7;
}

.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  display: none;
}

.video-item:hover .overlay {
  display: block;
}
</style>
