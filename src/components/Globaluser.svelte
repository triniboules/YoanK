<script lang="ts">
    import { onMount } from 'svelte';
    import { db } from './firebase.js'; // Adjust the path to your Firebase configuration
    import { collection, getDocs } from 'firebase/firestore';

    interface Visit {
        id: string;           // Document ID
        userId: string;      // User ID of the visit
        timestamp: Date;     // Visit timestamp
        lat: number | null;   // Latitude or null
        lon: number | null;   // Longitude or null
    }

    let visits: Visit[] = [];  // Store visits as an array of Visit objects
    let loading = true;        // Loading state
    let errorMessage: string | null = null; // Error message state
    let map: L.Map | null = null; // Map variable to be initialized later

    
    // Function to fetch all visits for all users
    async function fetchAllVisits() {
        try {
            // Step 1: Fetch all users from the 'users' collection
            const usersSnap = await getDocs(collection(db, 'users'));

            let allVisits: Visit[] = [];

            // Step 2: Loop through each user document
            for (const userDoc of usersSnap.docs) {
                const userId = userDoc.id;

                // Step 3: Fetch visits for each user
                const visitsSnap = await getDocs(collection(db, 'users', userId, 'visits'));

                // Step 4: Extract visit data and push to allVisits array
                visitsSnap.docs.forEach(visitDoc => {
                    const data = visitDoc.data();
                    allVisits.push({
                        id: visitDoc.id,
                        userId: userId, // Reference to user ID
                        timestamp: data.timestamp.toDate(), // Convert Firestore timestamp to JS Date
                        lat: data.lat || null, // Extract lat
                        lon: data.lon || null  // Extract lon
                    });
                });
            }

            visits = allVisits; // Set the visits array
        } catch (error) {
            console.error('Error fetching visits:', error);
            errorMessage = 'Failed to fetch visits. Please try again later.'; // Set error message
        } finally {
            loading = false; // Set loading to false after fetching
        }
    }

    // Initialize map and fetch visits on component mount
    onMount(async () => {
        await fetchAllVisits(); // Fetch all visits for all users

        // Load Leaflet only in the browser
        if (typeof window !== 'undefined') {
            const L = await import('leaflet'); // Dynamically import Leaflet

            // Initialize the map
            map = L.map('map').setView([51.505, -0.09], 13); // Default view can be changed

            // Load OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        }
    });

    // Reactive statement to add markers to the map once visits are loaded
    $: if (!loading && visits.length > 0) {
    import('leaflet').then(L => {
        if (map !== null) { // Ensure map is not null before proceeding
            // Create markers from visits and add them to the feature group
            const markers = visits
                .filter(v => v.lat !== null && v.lon !== null) // Filter out visits with null coordinates
                .map(v => {
                    const marker = L.marker([v.lat!, v.lon!]).addTo(map!); // 'map!' asserts that map is not null
                    // Create a tooltip with userId and timestamp
                    marker.bindTooltip(`
                        <div class="tooltip-content">
                            <strong>User ID:</strong> ${v.userId}<br>
                            <strong>Date:</strong> ${v.timestamp.toLocaleDateString()} ${v.timestamp.toLocaleTimeString()}
                        </div>
                    `, { 
                        permanent: false, 
                        direction: 'right', 
                        className: 'custom-tooltip' 
                    });
                    return marker; // Return the marker
                });

            if (markers.length > 0) {
                const group = L.featureGroup(markers); // Create a feature group from the markers
                group.addTo(map!); // Use map with the non-null assertion (!)

                // Fit map bounds to the markers
                map!.fitBounds(group.getBounds()); // 'map!' ensures it's not null
            }
        }
    });
}

</script>

<style>
    /* Import Leaflet CSS */
    @import url('https://unpkg.com/leaflet/dist/leaflet.css');

    /* Style for the map */
    #map {
        height: 400px; /* Set a height for the map */
        width: 100%;   /* Set width to 100% for responsive design */
    }

    /* Container styles */
    .container {
        padding: 20px;
        background: #ffffff; /* White background for content */
        border-radius: 10px; /* Rounded corners */
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Enhanced shadow */
        max-width: 90%; /* Increased max width for better layout */
        margin: 20px auto; /* Centering the container */
    }

    /* Title styles */
    .title {
        font-size: 2rem; /* Larger heading */
        text-align: center; /* Center align title */
        color: #2c3e50; /* Darker color for better contrast */
        margin-bottom: 20px; /* Space below heading */
        text-transform: uppercase; /* Uppercase letters */
        letter-spacing: 1px; /* Spacing between letters */
    }

    /* Error message styles */
    .error {
        color: red;
        text-align: center;
    }
</style>

<div class="container">
    <h1 class="title">User Visit Locations</h1>
    
    <!-- Display loading state or error message -->
    {#if loading}
        <p class="loading">Loading visits...</p>
    {:else if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else}
        <div id="map"></div> <!-- Only show map if visits are loaded -->
    {/if}
</div>
