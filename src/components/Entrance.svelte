<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { v4 as uuidv4 } from 'uuid';  
    import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
    import { db } from './firebase';  

    export let onAccess;

    let isTransitioningOut = false;
    let userId: string;

    // Check for localStorage for userId
    if (typeof window !== 'undefined') {
        userId = localStorage.getItem('userId') || uuidv4();
        localStorage.setItem('userId', userId);
    } else {
        userId = uuidv4();
    }

    // Function to store location in Firestore
    const storeLocation = async (lat: number, lon: number) => {
        const location = { lat, lon, timestamp: serverTimestamp() };
        try {
            await addDoc(collection(db, 'users', userId, 'locations'), location);
            console.log("Location stored:", location);
        } catch (error) {
            console.error("Error storing location:", error);
        }
    };

    // Function to store visits in Firestore
    const storeVisit = async (lat: number, lon: number) => {
        const visit = { timestamp: serverTimestamp(), lat, lon };
        try {
            await addDoc(collection(db, 'users', userId, 'visits'), visit);
            console.log("Visit stored:", visit);
        } catch (error) {
            console.error("Error storing visit:", error);
        }
    };

    // Function to store click count in Firestore
    const storeClickCount = async () => {
        const userClicksDoc = doc(db, 'users', userId);
        const docSnap = await getDoc(userClicksDoc);
        let clickCount = docSnap.exists() ? (docSnap.data().clickCount || 0) : 0;

        await setDoc(userClicksDoc, {
            clickCount: clickCount + 1,
            lastClicked: serverTimestamp()
        }, { merge: true });

        console.log("Click count updated:", clickCount + 1);
    };

    // Handle button click
    const handleClick = async () => {
        if (!isTransitioningOut) {
            isTransitioningOut = true; // Start transitioning out
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // Store location and visit concurrently
                    await Promise.all([
                        storeLocation(lat, lon),
                        storeVisit(lat, lon),
                        storeClickCount()
                    ]);
                    
                    onAccess();  // Call the external function to continue the workflow
                }, async (error) => {
                    console.error("Geolocation error:", error);
                    // Proceed without location
                    onAccess(); // Call onAccess even if geolocation fails
                });
            } else {
                console.error("Geolocation not supported.");
                onAccess(); // Call onAccess if geolocation is not supported
            }
        }
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
        background-color: rgba(0, 0, 0, 0);
        z-index: 9999;
        overflow: hidden;
        transition: opacity 1.5s ease-in-out;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(231, 8, 8, 0.7);
        clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
        z-index: 1;
        animation: fadeInOut 2s forwards, dynamicLighting 5s infinite ease-in-out;
    }

    @keyframes fadeInOut {
        from, to {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
    }

    @keyframes dynamicLighting {
        from {
            background-color: rgba(231, 8, 8, 0.7);
        }
        to {
            background-color: rgba(255, 255, 255, 0.7); /* White light effect */
        }
    }

    button {
        background: none;
        border: none;
        cursor: pointer;
        position: relative;
        outline: none;
        transition: opacity 1.5s ease, transform 1.5s ease;
    }

    img {
        max-width: 100%;
        transition: transform 3s ease, filter 2.5s ease, box-shadow 0.5s ease;
        transform: scale(0.5);
        filter: grayscale(100%) contrast(120%);
        box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.5);
        pointer-events: none; /* Prevent clicks on the image */
        opacity: 1;
    }

    .transitioning-out button {
        opacity: 0;
        transform: scale(1.1); /* Slightly enlarged during fade-out */
    }
</style>

<div class="entrance-container {isTransitioningOut ? 'transitioning-out' : ''}">
    <div class="overlay"></div>
    <button on:click={handleClick} aria-label="Yoann Kittery" in:fade={{ duration: 2500 }} tabindex="0">
        <img src="/image/entrance.svg" alt="Yoann Kittery" />
    </button>
</div>
