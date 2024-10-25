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

        // Ensure `sizeRanges` meets `[number, number]` typing for each element
        sizeRanges = sizeRanges.map(([min, max]): [number, number] => [min * minFactor, max * minFactor]);
    }

    function generateStars(count: number, speedFactor: number, sizeRange: [number, number], opacityRange: [number, number]): Star[] {
        const stars: Star[] = [];
        for (let i = 0; i < count; i++) {
            const left = Math.random() * 100;
            const top = Math.random() * 100;

            const directionX = (left - 50) * speedFactor;
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

    onMount(() => {
        baseStarsPerLayer = [100, 50, 30, 70, 20, 10, 5];
        calculateStarParameters();

        layers = baseStarsPerLayer.map((count, index) => {
            return generateStars(count, speedFactors[index], sizeRanges[index], [0.5, 1]);
        });
    });
</script>

<style>
    .bg {
        background-color: black;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 10px;
        overflow: hidden;
        z-index: -1;
    }

    .star {
        border-radius: 50%;
        background: white;
        position: absolute;
        opacity: var(--star-opacity);
        animation: fly-by linear infinite;
        transform-origin: center;
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
