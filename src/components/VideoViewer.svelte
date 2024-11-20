<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Database } from '$lib/database.types';

  type Video = Database['public']['Tables']['videos']['Row'];
  export let selectedVideo: Video;
  export let onClose: () => void;

  const dispatch = createEventDispatcher();

  const close = () => {
    dispatch('close');
    onClose();
  };
</script>

<svelte:window on:keydown={(event) => {
  if (event.key === 'Escape') {
    close();
  }
}}/>

<div 
  class="modal" 
  on:click|self={() => dispatch('close')}
>
  <div class="video-container">
    {#if selectedVideo.source === 'youtube'}
      <iframe
        title="YouTube video"
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/{selectedVideo.source_id}?autoplay=1"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    {:else if selectedVideo.source === 'vimeo'}
      <iframe
        title="Vimeo video"
        width="100%"
        height="100%"
        src="https://player.vimeo.com/video/{selectedVideo.source_id}?autoplay=1"
        frameborder="0"
        allow="autoplay; fullscreen"
        allowfullscreen
      ></iframe>
    {:else}
      <video controls autoplay>
        <source src={selectedVideo.source_id} type="video/mp4">
        Your browser does not support the video tag.
      </video>
    {/if}
  </div>
</div>

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .video-container {
    width: 90vw;
    height: 90vh;
    max-width: 1600px;
    position: relative;
  }

  iframe, video {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
