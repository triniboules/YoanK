<script lang="ts">
    import { onMount } from 'svelte';

    interface Star {
        left: number;
        top: number;
        size: string;
        animationDuration: string;
        translateX: string;
        translateY: string;
        opacity: string;
    }

    let baseStarsPerLayer: number[] = [];
    let speedFactors: number[] = [];
    let sizeRanges: [number, number][] = [
        [0.5, 1.5],
        [1, 2],
        [1.5, 3],
        [0.5, 1],
        [0.5, 1.5],
        [0.5, 2],
        [1, 3]
    ];

    let overlayOpacity: number;

    function calculateStarParameters() {
        const baseWidth = 1920;
        const baseHeight = 1080;

        const parentWidth = window.innerWidth;
        const parentHeight = window.innerHeight;

        const widthFactor = parentWidth / baseWidth;
        const heightFactor = parentHeight / baseHeight;
        const minFactor = Math.min(widthFactor, heightFactor);

        baseStarsPerLayer = baseStarsPerLayer.map(count => Math.round(count * minFactor));
        speedFactors = [1, 1.5, 2, 0.5, 2.5, 3, 0].map(factor => factor * minFactor);

        sizeRanges = sizeRanges.map(([min, max]): [number, number] => [min * minFactor, max * minFactor]);
    }

    function generateStars(count: number, speedFactor: number, sizeRange: [number, number], opacityRange: [number, number]): Star[] {
        const stars: Star[] = [];
        for (let i = 0; i < count; i++) {
            const left = Math.random() * 100;
            const top = Math.random() * 100;

            const directionX = (left - 50) * speedFactor; // For moving stars
            const directionY = (top - 50) * speedFactor;

            const initialSize = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];

            stars.push({
                left,
                top,
                size: `${initialSize}px`,
                animationDuration: `${(Math.random() * 2 + 2) / speedFactor}s`,
                translateX: `${directionX}vw`,
                translateY: `${directionY}vh`,
                opacity: `${Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0]}`,
            });
        }
        return stars;
    }

    let layers: Star[][] = [];
    let overlayLayers: Star[][] = [];

    onMount(() => {
        baseStarsPerLayer = [100, 50, 30, 70, 20, 10, 5];
        calculateStarParameters();

        // Generate the moving stars for the zoom effect
        layers = baseStarsPerLayer.map((count, index) => {
            return generateStars(count, speedFactors[index], sizeRanges[index], [0.5, 1]);
        });

        // Generate overlay stars with different parameters for visual depth
        overlayLayers = baseStarsPerLayer.map((count, index) => {
            return generateStars(count, speedFactors[index] * 0.5, sizeRanges[index], [0.2, 0.5]); // Slower overlay stars
        });

        // Set a random overlay opacity between 0.4 and 0.8
        overlayOpacity =  1; // Generates a value between 0.4 and 0.8
    });
</script>

<style>
    * {
        margin: 0;
        padding: 0;
        overflow: hidden; /* Prevent overflow */
    }

    .background-container {
        position: absolute;
        width: 100vw;  /* Use viewport width */
        height: 100vh; /* Use viewport height */
        overflow: hidden; /* Prevent overflow */
        z-index: 0; /* Layer behind the stars */
    }

    .bg {
        background-image: url('https://cdn.eso.org/images/screen/eso0932a.jpg');
        background-size: cover; /* Cover the entire viewport */
        background-position: center; /* Center the background image */
        height: 100vh; /* Set to full viewport height */
        width: 100vw; /* Set to full viewport width */
        position: fixed; /* Fix position to cover the viewport */
        top: 0;
        left: 0;
        z-index: -2; /* Ensure background is behind overlay */
        overflow: hidden; /* Prevent overflow */
    }

    .dark-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1; /* Ensure it's behind the stars */
        transition: background 5s; /* Smooth transition for changes */
        overflow: hidden; /* Prevent overflow */
    }

    .star {
        border-radius: 50%;
        background: white;
        position: absolute;
        animation: fly-by linear infinite;
        transform-origin: center;
        overflow: hidden; /* Prevent overflow */
    }

    @keyframes fly-by {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
        }
        100% {
            transform: translate(var(--translateX), var(--translateY)) scale(2);
            opacity: 0.2;
        }
    }
</style>

<div class="background-container">
    <div class="bg"></div>
    <div class="dark-overlay" style="background: radial-gradient(circle, rgba(0, 0, 0, {overlayOpacity}) 0%, rgba(0, 0, 0, 0) 70%);"></div>
    <div class="stars-container">
        {#each layers as layer}
            {#each layer as star}
                <div 
                    class="star" 
                    style="left: {star.left}vw; top: {star.top}vh; 
                        height: {star.size}; width: {star.size}; 
                        animation-duration: {star.animationDuration}; 
                        --translateX: {star.translateX}; 
                        --translateY: {star.translateY}; 
                        opacity: {star.opacity};">
                </div>
            {/each}
        {/each}
        {#each overlayLayers as overlayLayer}
            {#each overlayLayer as star}
                <div 
                    class="star" 
                    style="left: {star.left}vw; top: {star.top}vh; 
                        height: {star.size}; width: {star.size}; 
                        animation-duration: {star.animationDuration}; 
                        --translateX: {star.translateX}; 
                        --translateY: {star.translateY}; 
                        opacity: {star.opacity};">
                </div>
            {/each}
        {/each}
    </div>
</div>
