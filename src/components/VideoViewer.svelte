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
    <button class="close-btn" on:click={close} aria-label="Close video viewer">X</button>
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
      background: rgba(0, 0, 0, 0.61);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      overflow: hidden; /* Prevent scrolling */
    }
  
    .video-container {
      position: relative;
      background: rgba(202, 183, 176, 0.404);

      border-radius: 15px;
      width: 100%;
      max-width: 70%;
      /* Add padding to avoid content overlapping with the close button */
     padding-left: 10px;
     padding-right: 10px;
     padding-top: 10px;
     padding-bottom: 10px;
    }
  
    .video-frame {
      width: 100%;
      height: 60vh;
      border: 0;
    }
  

  
    .close-btn {
      position: absolute;
      top: 0rem;
      right: 1rem;
      background: rgb(0, 0, 0);
      color: white;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      border-radius: 50%;
      font-size: 1.5rem;
      z-index: 1001; /* Ensure button is above other content */
      transform: translate(-650%, 250%);
    }
  </style>
  