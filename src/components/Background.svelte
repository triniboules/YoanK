<script lang="ts">
    import { onMount } from 'svelte';

    interface Star {
        left: number; // X position in vw
        top: number; // Y position in vh
        size: string; // Size in px
        animationDuration: string; // Animation duration
        translateX: string; // X-axis movement
        translateY: string; // Y-axis movement
        opacity: string; // Opacity for depth effect
    }

    let baseStarsPerLayer: number[] = [];
    let speedFactors: number[] = [];
    let sizeRanges: [number, number][] = [];

    function calculateStarParameters() {
        // Base dimensions for a default size (e.g., 1920x1080)
        const baseWidth = 1920;
        const baseHeight = 1080;

        // Get the current viewport size
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Calculate scaling factors based on the viewport size
        const widthFactor = vw / baseWidth;
        const heightFactor = vh / baseHeight;
        const minFactor = Math.min(widthFactor, heightFactor);

        // Adjust parameters based on the smallest scaling factor
        baseStarsPerLayer = baseStarsPerLayer.map(count => Math.round(count * minFactor));
        speedFactors = [1, 1.5, 2, 0.5, 2.5, 3, 0].map(factor => factor * minFactor);
        sizeRanges = [
            [0.5 * minFactor, 1.5 * minFactor],
            [1 * minFactor, 2 * minFactor],
            [1.5 * minFactor, 3 * minFactor],
            [0.5 * minFactor, 1 * minFactor],
            [0.5 * minFactor, 1.5 * minFactor],
            [0.5 * minFactor, 2 * minFactor],
            [1 * minFactor, 3 * minFactor]
        ];
    }

    function generateStars(count: number, speedFactor: number, sizeRange: [number, number], opacityRange: [number, number]): Star[] {
        const stars: Star[] = [];
        for (let i = 0; i < count; i++) {
            const left = Math.random() * 100; // Position in percentage
            const top = Math.random() * 100;

            // Calculate the direction based on the center (50, 50)
            const directionX = (left - 50) * speedFactor; // Outward direction
            const directionY = (top - 50) * speedFactor; // Outward direction

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

    onMount(() => {
        // Set initial base values
        baseStarsPerLayer = [100, 50, 30, 70, 20, 10, 5];

        // Calculate star parameters based on the viewport size
        calculateStarParameters();

        // Generate the star layers
        layers = baseStarsPerLayer.map((count, index) => {
            return generateStars(count, speedFactors[index], sizeRanges[index], [0.5, 1]); // Use a fixed opacity range
        });
    });
</script>

<style>
    .bg {
        background-color: black; /* Solid black background */
        height: 100%; /* Use parent's height */
        width: 100%; /* Use parent's width */
        position: absolute; /* Position absolute to fit parent */
        top: 0;
        left: 0;
        display: flex; /* Flexbox to align stars */
        flex-wrap: wrap; /* Allow stars to wrap */
        justify-content: center; /* Center the stars */
        align-items: center; /* Center the stars vertically */
        gap: 10px; /* 10px gap between stars */
        overflow: hidden; /* Prevent overflow */
        z-index: -1; /* Behind everything */
    }

    .star {
        border-radius: 50%;
        background: white; /* White stars */
        position: absolute;
        opacity: var(--star-opacity);
        animation: fly-by linear infinite; /* Apply animation */
        transform-origin: center; /* For scaling effect */
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

<div class="bg">
    {#each layers as layer}
        {#each layer as star}
            <div 
                class="star" 
                style="left: {star.left}vw; top: {star.top}vh; 
                       height: {star.size}; width: {star.size}; 
                       animation-duration: {star.animationDuration}; 
                       --translateX: {star.translateX}; 
                       --translateY: {star.translateY}; 
                       --star-opacity: {star.opacity};">
            </div>
        {/each}
    {/each}
</div>
