<script>
	import Header from './Header.svelte';
	import VideoGrid from '../components/VideoGrid.svelte';
	import Entrance from '../components/Entrance.svelte'; // Import Entrance.svelte component

	let showEntrance = true; // Flag to control whether the entrance is shown

	// Function to handle entrance click and show main content
	const handleAccess = () => {
		showEntrance = false;
	};
</script>



{#if showEntrance}
	<!-- Display the Entrance screen initially -->
	<Entrance onAccess={handleAccess} />
{:else}
	<!-- After entrance, display the header and video grid -->
	<Header />
	<main>
		<VideoGrid />
	</main>
{/if}

<style>
	main {
		min-height: auto; /* Adjust for header height if needed */
		padding: 0;
		width: 100%;
		display: flex;
		justify-content: center;
	}
</style>
git commit -m "Initial commit"