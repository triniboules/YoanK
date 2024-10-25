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

    let stars: Star[] = [];

    function generateStars() {
        const count = 100;
        for (let i = 0; i < count; i++) {
            stars.push({
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: `${Math.random() * 2 + 0.5}px`,
                animationDuration: `${Math.random() * 2 + 2}s`,
                translateX: `${(Math.random() - 0.5) * 20}vw`,
                translateY: `${(Math.random() - 0.5) * 20}vh`,
                opacity: `${Math.random() * 0.5 + 0.5}`,
            });
        }
    }

    onMount(() => {
        generateStars();
    });
</script>

<style>
.bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -1;
}

.star {
    position: absolute;
    background: white;
    border-radius: 50%;
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
    {#each stars as star}
        <div 
            class="star" 
            style="left: {star.left}%; top: {star.top}%; 
                   width: {star.size}; height: {star.size}; 
                   animation-duration: {star.animationDuration}; 
                   --translateX: {star.translateX}; 
                   --translateY: {star.translateY}; 
                   --star-opacity: {star.opacity};">
        </div>
    {/each}
</div>
