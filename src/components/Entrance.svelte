<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { v4 as uuidv4 } from 'uuid';  
    import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
    import { db } from './firebase';  

    export let onAccess;

    let isVisible = true;
    let isTransitioningOut = false;

    // Check for localStorage for userId
    let userId: string;

    if (typeof window !== 'undefined') {
        userId = localStorage.getItem('userId') || uuidv4();
        localStorage.setItem('userId', userId);
    } else {
        userId = uuidv4();
    }

    // Function to store location in Firestore
    const storeLocation = async (lat: number, lon: number) => {
        const location = {
            lat: lat,
            lon: lon,
            timestamp: serverTimestamp()
        };
        // Save location in Firestore
        try {
            await addDoc(collection(db, 'users', userId, 'locations'), location);
            console.log("Location stored:", location);
        } catch (error) {
            console.error("Error storing location:", error);
        }
    };

    // Function to store visits in Firestore with geolocation
    const storeVisit = async (lat: number, lon: number) => {
        const visit = {
            timestamp: serverTimestamp(),  // Use server timestamp for consistency
            lat: lat,                      // Store latitude
            lon: lon                       // Store longitude
        };
        try {
            await addDoc(collection(db, 'users', userId, 'visits'), visit); // Save visit details in Firestore
            console.log("Visit stored:", visit);
        } catch (error) {
            console.error("Error storing visit:", error);
        }
    };

    // Function to store click count in Firestore
    const storeClickCount = async () => {
        const userClicksDoc = doc(db, 'users', userId); // Reference to the user's document

        // Fetch the current click count
        const docSnap = await getDoc(userClicksDoc);
        let clickCount = 0;

        if (docSnap.exists()) {
            // Document exists, get the current click count
            clickCount = docSnap.data().clickCount || 0;
        }

        // Update the click count
        await setDoc(userClicksDoc, {
            clickCount: clickCount + 1,
            lastClicked: serverTimestamp() // Optional: store the last click timestamp
        }, { merge: true }); // Use merge to avoid overwriting other fields

        console.log("Click count updated:", clickCount + 1);
    };

    // Handle button click
    const handleClick = async () => {
        if (!isTransitioningOut) {
            isTransitioningOut = true;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const lat = position.coords.latitude;  // Get latitude
                    const lon = position.coords.longitude; // Get longitude

                    // Store both location and visit details
                    await storeLocation(lat, lon);  // Store location details
                    await storeVisit(lat, lon);      // Save visit with lat and lon
                    await storeClickCount();          // Update click count

                    onAccess();  // Call the external function to continue the workflow
                    isTransitioningOut = false; // Reset transition state
                }, (error) => {
                    console.error("Geolocation error:", error); // Handle errors
                    isTransitioningOut = false; // Reset transition state
                });
            } else {
                console.error("Geolocation not supported."); // Handle unsupported geolocation
                isTransitioningOut = false; // Reset transition state
            }
        }
    };

    onMount(() => {
        // Actions after the component mounts
    });
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
		max-width: 50%;
		transition: transform 1.5s ease, filter 0.5s ease, box-shadow 0.5s ease;
		transform: scale(1);
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
    <button on:click={handleClick} aria-label="Yoann Kittery" in:fade={{ duration: 1500 }} tabindex="0">
        <img src="/image/entrance.svg" alt="Yoann Kittery" />
    </button>
</div>

