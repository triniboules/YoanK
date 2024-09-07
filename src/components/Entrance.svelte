<script>
	import { fade } from 'svelte/transition'; // Import the fade transition
	export let onAccess;
	let isVisible = false; // Control when the image and button should fade in
  
	// Wait for a short delay before making the image visible
	setTimeout(() => {
	  isVisible = true;
	}, 500); // Adjust the delay if needed (500ms in this case)
  </script>
  
  <style>
	.entrance-container {
	  position: fixed;
	  top: 0;
	  left: 0;
	  width: 100vw;
	  height: 100vh;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  background-color: black; /* Start with a fully black screen */
	  z-index: 9999; /* Ensure it is above everything else */
	}
  
	button {
	  background: none;
	  border: none;
	  padding: 0;
	  cursor: pointer;
	}
  
	img {
	  max-width: 50%;
	}
  </style>
  
  <div class="entrance-container">
	{#if isVisible}
	  <button on:click={onAccess} aria-label="Click to enter" in:fade={{ duration: 1500 }}>
		<!-- Fade in the image and button -->
		<img src="/src/lib/image/Entrance.png" alt="Click to enter" />
	  </button>
	{/if}
  </div>
  