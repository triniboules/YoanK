<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let selectedVideo: { youtubeId: string; name: string; description: string };
  const dispatch = createEventDispatcher();

  const close = () => {
    dispatch('close');
  };

  // Function to get the embed URL from the YouTube video ID
  function getEmbedUrl(youtubeId: string): string {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }
</script>

<div class="modal">
<button class="close-btn" on:click={close} aria-label="Close video viewer">
  <img src="/image/X.webp" alt="Close" class="close-icon" />
</button>
<div class="video-container">
  <iframe
    src={getEmbedUrl(selectedVideo.youtubeId)}
    frameborder="0"
    allowfullscreen
    class="video-frame"
    title={`Video: ${selectedVideo.name}`}
  ></iframe>
</div>
</div>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85); /* Match the darker background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: hidden; /* Prevent scrolling */
}

.video-container {
  position: relative;
  background: rgba(202, 183, 176, 0.123);
  border-radius: 8px;
  width: 100%;
  max-width: 70%;
  padding: 10px;
  box-sizing: border-box; /* Ensure padding is included in width and height calculations */
}

.video-frame {
  width: 100%;
  height: 60vh;
  border: 0;
}

.close-btn {
  position: absolute;
  top: 15%;
  right: 13%;
  background: none; /* Transparent background */
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 1001; /* Ensure button is above other content */
}

.close-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.close-btn:hover .close-icon {
  opacity: 0.8;
}
</style>
