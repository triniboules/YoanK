<script>
	import { fade, scale } from 'svelte/transition'; // Import the scale transition
	export let onAccess;
	let isVisible = false;
	let isScaling = false; // Control scaling state
  
	setTimeout(() => {
	  isVisible = true;
	}, 500);
  
	const handleClick = () => {
		isScaling = true;
		setTimeout(onAccess, 800); // Delay the onAccess call to match the animation duration
	};
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
	  background-color: black;
	  z-index: 9999;
	  overflow: hidden; /* Ensure content doesn't overflow */
	}
  
	button {
	  background: none;
	  border: none;
	  padding: 0;
	  cursor: pointer;
	  position: relative;
	}
  
	img {
	  max-width: 50%;
	  transition: transform 1.5s ease; /* Smooth scale transition */
	  transform: scale(1);
	}
  
	.scaling img {
	  transform: scale(1.1); /* Scale up the image */
	}
</style>

<div class="entrance-container {isScaling ? 'scaling' : ''}">
	{#if isVisible}
	  <button on:click={handleClick} aria-label="Yoann Kittery" in:fade={{ duration: 1500 }}>
		<img src="/image/entrance.webp" alt="Yoann Kittery" />
	  </button>
	{/if}
</div>
