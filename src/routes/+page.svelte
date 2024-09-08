<script lang="ts">
	import { SvelteComponent } from 'svelte';
	import Entrance from '../components/Entrance.svelte';
  
	let showEntrance = true;
  
	let headerComponent: typeof SvelteComponent | null = null;
	let videoGridComponent: typeof SvelteComponent | null = null;
  
	const handleAccess = () => {
		showEntrance = false;
	};
  
	const preloadComponents = async () => {
		try {
			const [HeaderModule, VideoGridModule] = await Promise.all([
				import('./Header.svelte'),
				import('../components/VideoGrid.svelte')
			]);
  
			headerComponent = HeaderModule.default as typeof SvelteComponent;
			videoGridComponent = VideoGridModule.default as typeof SvelteComponent;
		} catch (error) {
			console.error('Failed to preload components', error);
		}
	};
  
	preloadComponents();
  </script>
  
  {#if showEntrance}
	  <Entrance onAccess={handleAccess} />
  {:else}
	  {#if headerComponent && videoGridComponent}
		  <svelte:component this={headerComponent} />
		  <main>
			  <svelte:component this={videoGridComponent} />
			  <footer>
				  <p>Crafted by <a href="mailto:ksylvestre1@hotmail.com">Sylvestre</a> &copy; {new Date().getFullYear()}</p>
			  </footer>
		  </main>
	  {/if}
  {/if}
  