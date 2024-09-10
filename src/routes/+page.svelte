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

<head>
	<title>Yoann Kittery - Content Creator, Videographer & Video Production Specialist</title>
	<meta name="description" content="Yoann Kittery is a professional content creator specializing in video production for weddings, music videos, corporate events, and more. Discover high-quality video editing, cinematography, and creative video solutions." />
	<meta name="keywords" content="Yoann Kittery, Yoann Kittery content creator, Yoann Kittery videographer, Yoann Kittery video production, weddings camera operator, weddings videographer, weddings video creation, weddings montage, video editing for weddings, wedding films, wedding video production, wedding cinematography, event videographer, event video production, corporate video creation, business video production, business content creator, music video creator, music video production, music video editor, creative video editor, commercial videography, corporate films, content creator for businesses, cinematic wedding films, professional video editing, video editing services, event video montage, camera operator for weddings, commercial video content, video production services, corporate event videographer, music video director, professional video creation, freelance videographer, wedding filmmaker, shooting music videos, video editor for events, cinematographer for weddings" />
	<meta name="robots" content="index, follow" />
</head>

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
