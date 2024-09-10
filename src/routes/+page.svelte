<script lang="ts">
	import { SvelteComponent } from 'svelte';
	import Entrance from '../components/Entrance.svelte';
  
	let showEntrance = true;

	// Keywords for SEO: Yoann Kittery, content creator, videographer, video production, weddings, corporate films
	let headerComponent: typeof SvelteComponent | null = null;
	let videoGridComponent: typeof SvelteComponent | null = null;

	const handleAccess = () => {
		// Yoann Kittery - Professional content creator and videographer for weddings, events, and businesses
		showEntrance = false;
	};

	const preloadComponents = async () => {
		try {
			const [HeaderModule, VideoGridModule] = await Promise.all([
				// Lazy load Header (Yoann Kittery videographer, video creator, business content creator)
				import('./Header.svelte'),
				// Lazy load VideoGrid (Yoann Kittery weddings video production, music video creator)
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
	<!-- Entrance page showcasing Yoann Kittery as a content creator and videographer -->
	<Entrance onAccess={handleAccess} />
{:else}
	{#if headerComponent && videoGridComponent}
		<!-- Header for Yoann Kittery - content creator, weddings videographer, corporate films, event cinematographer -->
		<svelte:component this={headerComponent} />
		<main>
			<!-- Video grid showcasing Yoann Kittery services: weddings video creation, music video production, commercial video content, corporate event videography -->
			<svelte:component this={videoGridComponent} />
			<footer>
				<p>Crafted by <a href="mailto:ksylvestre1@hotmail.com">Sylvestre</a> &copy; {new Date().getFullYear()}</p>
			</footer>
		</main>
	{/if}
{/if}

<!-- SEO and content keywords for better search ranking -->
<!-- 
Yoann Kittery, Yoann Kittery content creator, Yoann Kittery videographer, Yoann Kittery video production, 
Yoann Kittery weddings, weddings camera operator, weddings videographer, weddings video creation, weddings montage, 
video editing for weddings, wedding films, wedding video production, wedding cinematography, event videographer, 
event video production, corporate video creation, business video production, business content creator, music video creator, 
music video production, music video editor, creative video editor, commercial videography, corporate films, content creator for businesses, 
cinematic wedding films, professional video editing, video editing services, event video montage, camera operator for weddings, 
commercial video content, video production services, corporate event videographer, music video director, professional video creation, 
freelance videographer, wedding filmmaker, shooting music videos, video editor for events, cinematographer for weddings
-->
