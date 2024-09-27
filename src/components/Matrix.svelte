<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    let canvas: HTMLCanvasElement | null = null;
    let context: CanvasRenderingContext2D | null = null;
    
    const characters = 'アァカサタナハマヤャラワガザダバパABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 16;
    const baseDropSpeed = 1; // Base drop speed
    let columns: number = 5; // Initialized to 0
    let drops: number[] = []; // Initialize empty drops array

    function draw() {
        if (context) {
            context.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Black background with transparency
            context.fillRect(0, 0, canvas!.width, canvas!.height);
            
            context.fillStyle = '#0F0'; // Green color for characters
            context.font = `${fontSize}px monospace`;

            for (let x = 0; x < drops.length; x++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                context.fillText(text, x * fontSize, drops[x] * fontSize);
                // Reset drop position if it goes beyond canvas height
                if (drops[x] * fontSize > canvas!.height && Math.random() > 0.975) {
                    drops[x] = 0; 
                }
                drops[x] += baseDropSpeed; // Use a constant drop speed
            }
        }
    }

    function resize() {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Recalculate the number of columns based on width
            columns = Math.floor(window.innerWidth / fontSize);
            drops = Array(columns).fill(1); // Reinitialize drops array
        }
    }

    onMount(() => {
        // Check if we are in the browser environment
        if (typeof window !== 'undefined') {
            canvas = document.querySelector('canvas') as HTMLCanvasElement;
            if (canvas) {
                context = canvas.getContext('2d'); // Initialize context
                resize(); // Set canvas size on mount
                const animate = () => {
                    draw();
                    requestAnimationFrame(animate); // Use requestAnimationFrame for smoother animation
                };
                animate();
                window.addEventListener('resize', resize); // Resize canvas on window resize
            }
        }
    });

    onDestroy(() => {
        // Cleanup event listener if it was added
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', resize); // Cleanup event listener
        }
    });
</script>

<canvas></canvas>

<style>
    canvas {
        display: block;
        width: 100vw;
        height: 100vh;
        background-color: black; /* Optional, as the canvas will fill black */
    }
</style>
