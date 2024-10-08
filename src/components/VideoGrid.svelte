<script lang="ts">
  import VideoViewer from './VideoViewer.svelte';
  import { db } from './firebase';
  import { collection, getDocs, doc, setDoc, increment, arrayUnion } from "firebase/firestore";
  import type { Video } from '../types';

  let videos: Video[] = [];
  let selectedVideo: Video | null = null;

  const logoMap: { [key: string]: string } = {
    Da: '/image/Da.webp',
    Yoann: '/image/logo.webp'
  };

  // Fetch and initialize the list of videos
  const fetchVideos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "videos"));
      videos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        description: doc.data().description || '',
        name: doc.data().name || '',
        thumbnail: doc.data().thumbnail || '',
        youtubeId: doc.data().youtubeId || '',
        position: typeof doc.data().position === 'number' ? doc.data().position : 0,
        showLogo: typeof doc.data().showLogo === 'boolean' ? doc.data().showLogo : false,
        logoType: doc.data().logoType || '', // Ensure that logoType can be an empty string, not undefined
        clickCount: typeof doc.data().clickCount === 'number' ? doc.data().clickCount : 0,
        clicks: Array.isArray(doc.data().clicks) ? doc.data().clicks : []
      })) as Video[];

      videos.sort((a, b) => a.position - b.position);
    } catch (error) {
      console.error("Error fetching videos: ", error);
    }
  };

  fetchVideos();

  const openVideo = async (video: Video) => {
    await recordVideoClick(video.id);
    selectedVideo = video;
  };

  const closeVideo = () => {
    selectedVideo = null;
  };

  // Record a click for the video
  async function recordVideoClick(videoId: string) {
    try {
      const userId = localStorage.getItem('userId') || 'anonymous';
      const clickTimestamp = new Date();

      const videoRef = doc(db, "videos", videoId);
      await setDoc(videoRef, {
        clickCount: increment(1),
        clicks: arrayUnion({ userId, timestamp: clickTimestamp }),
      }, { merge: true });

      console.log(`Recorded click for Video ID: ${videoId} by User ID: ${userId}`);
    } catch (error) {
      console.error("Error recording video click: ", error);
    }
  }

  function getEmbedUrl(videoId: string) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  function handleImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.opacity = '1';
  }

  function getLogoPath(logoType: string | undefined) {
    return logoType && logoMap[logoType] ? logoMap[logoType] : ''; // Handle undefined
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
        {#if video.showLogo && video.logoType}
          <img 
            src={getLogoPath(video.logoType)} 
            alt={video.logoType === 'Da' ? 'DA SYNCRO logo' : 'Yoann logo'} 
            class="logo {video.logoType !== 'Da' ? 'small-logo' : ''}" />
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
    gap: 5px 0px;
    width: 99%;
    box-sizing: border-box;
    justify-content: center;
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
    transition: opacity 0.5s ease;
  }

  .small-logo {
    transform: scale(0.5);
    position: absolute;
    top: -0%;
    left: -0%;
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

  .video-item:hover .overlay {
    display: block;
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
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 800px) {
    .video-grid {
      grid-template-columns: 1fr;
    }
  }
</style>