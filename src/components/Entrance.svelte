<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { v4 as uuidv4 } from 'uuid';  
    import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
    import { db } from './firebase';  

    export let onAccess;

    let isTransitioningOut = false;
    let isLoaded = false;
    let userId: string;

    onMount(() => {
        isLoaded = true;
        if (typeof window !== 'undefined') {
            userId = localStorage.getItem('userId') || uuidv4();
            localStorage.setItem('userId', userId);
        } else {
            userId = uuidv4();
        }
    });

    async function storeAnalytics(data: any) {
        try {
            const analyticsData = {
                ...data,
                timestamp: serverTimestamp(),
                userAgent: navigator.userAgent,
                screenSize: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                referrer: document.referrer
            };

            await addDoc(collection(db, 'analytics'), {
                userId,
                ...analyticsData
            });

            console.log("Analytics stored:", analyticsData);
        } catch (error) {
            console.error("Error storing analytics:", error);
        }
    }

    async function storeLocationUsingIpApi() {
        try {
            const response = await fetch('https://ip-api.com/json');
            const data = await response.json();
            
            await storeAnalytics({
                type: 'location',
                location: {
                    lat: data.lat,
                    lon: data.lon,
                    country: data.country,
                    city: data.city
                }
            });
        } catch (error) {
            console.error("Error storing location:", error);
        }
    }

    // Handle button click
    const handleClick = async () => {
        if (!isTransitioningOut) {
            isTransitioningOut = true;

            // Store analytics data
            await Promise.all([
                storeAnalytics({ type: 'entrance_click' }),
                storeLocationUsingIpApi()
            ]);

            // Delay the transition slightly for better animation
            setTimeout(() => {
                onAccess();
            }, 800);
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        (e.currentTarget as HTMLElement).style.setProperty('--x', `${x}%`);
        (e.currentTarget as HTMLElement).style.setProperty('--y', `${y}%`);
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
        background-color: #000;
        z-index: 9999;
        overflow: hidden;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            45deg,
            rgba(231, 8, 8, 0.7),
            rgba(231, 8, 8, 0.4)
        );
        mask: linear-gradient(
            to bottom,
            transparent 30%,
            black 70%
        );
        -webkit-mask: linear-gradient(
            to bottom,
            transparent 30%,
            black 70%
        );
        animation: pulseOverlay 4s infinite ease-in-out;
    }

    @keyframes pulseOverlay {
        0%, 100% {
            opacity: 0.7;
            transform: scale(1);
        }
        50% {
            opacity: 0.5;
            transform: scale(1.05);
        }
    }

    .entrance-content {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    button {
        background: none;
        border: none;
        cursor: pointer;
        position: relative;
        outline: none;
        padding: 0;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    button::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 110%;
        height: 110%;
        background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 70%
        );
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.5s ease;
        pointer-events: none;
    }

    button:hover::after {
        transform: translate(-50%, -50%) scale(1);
    }

    .logo-container {
        position: relative;
        width: 700px;
        height: 700px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @media (max-width: 768px) {
        .logo-container {
            width: 90vw;
            height: 90vw;
            max-width: 500px;
            max-height: 500px;
        }

        .enter-text {
            font-size: 1.2rem;
            bottom: -45px;
        }
    }

    @media (max-width: 480px) {
        .logo-container {
            width: 85vw;
            height: 85vw;
        }

        .enter-text {
            font-size: 1rem;
            bottom: -35px;
        }
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        filter: contrast(120%) brightness(1.1);
        transform: scale(0.95);
    }

    .loaded img {
        transform: scale(1);
    }

    button:hover .logo-container {
        transform: scale(1.03);
    }

    .transitioning-out button {
        opacity: 0;
        transform: scale(1.1) translateY(-20px);
    }

    .transitioning-out .overlay {
        animation: fadeOutOverlay 0.8s forwards ease-in-out;
    }

    @keyframes fadeOutOverlay {
        to {
            opacity: 0;
            transform: scale(1.1);
        }
    }

    /* Add subtle ambient animation */
    .ambient-light {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
            circle at var(--x, 50%) var(--y, 50%),
            rgba(255, 255, 255, 0.1) 0%,
            transparent 60%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }

    .entrance-container:hover .ambient-light {
        opacity: 1;
    }

    .enter-text {
        position: absolute;
        bottom: -60px;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(255, 255, 255, 0.8);
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        font-weight: 500;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        opacity: 0;
        transition: all 0.5s ease;
        text-shadow: 0 0 10px rgba(231, 8, 8, 0.3);
    }

    .entrance-container:hover .enter-text {
        opacity: 1;
        transform: translateX(-50%) translateY(-10px);
    }

    @keyframes pulseText {
        0%, 100% {
            opacity: 0.8;
        }
        50% {
            opacity: 0.4;
        }
    }

    .enter-text::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(231, 8, 8, 0.5),
            transparent
        );
        transform: scaleX(0);
        transition: transform 0.5s ease;
    }

    .entrance-container:hover .enter-text::after {
        transform: scaleX(1);
    }
</style>

<div 
    class="entrance-container {isTransitioningOut ? 'transitioning-out' : ''} {isLoaded ? 'loaded' : ''}"
    role="button"
    tabindex="0"
    aria-label="Enter site"
    on:mousemove={handleMouseMove}
    on:click={handleClick}
    on:keydown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
        }
    }}
    in:fade={{ duration: 1000 }}
>
    <div class="overlay"></div>
    <div class="ambient-light"></div>
    <div class="entrance-content" in:scale={{ duration: 1000, delay: 300, start: 0.95 }}>
        <button 
            aria-label="Enter Yoann Kittery's portfolio"
        >
            <div class="logo-container">
                <img src="/image/entrance.svg" alt="Yoann Kittery Logo" />
                <div class="enter-text">
                    Entrer
                </div>
            </div>
        </button>
    </div>
</div>
