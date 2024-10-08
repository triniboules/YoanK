<script lang="ts">
    import { onMount } from 'svelte';
    import { db } from './firebase.js'; // Adjust the path to your Firebase configuration
    import { collection, getDocs } from 'firebase/firestore';
    import Chart from 'chart.js/auto'; // Import Chart.js for charts

    interface Visit {
        id: string;           // Document ID
        userId: string;      // User ID of the visit
        timestamp: Date;     // Visit timestamp
        lat: number | null;   // Latitude or null
        lon: number | null;   // Longitude or null
    }

    interface UserVisitCount {
        userId: string;      // User ID
        visitCount: number;  // Count of visits for the user
    }

    let visits: Visit[] = [];  // Store visits as an array of Visit objects
    let userVisitCounts: UserVisitCount[] = []; // Array to hold visit counts per user
    let loading = true;        // Loading state
    let errorMessage: string | null = null; // Error message state
    let map: L.Map | null = null; // Map variable to be initialized later
    let chart: Chart | null = null; // Chart variable to be initialized later

    // Function to fetch all visits for all users
    async function fetchAllVisits() {
        try {
            const usersSnap = await getDocs(collection(db, 'users'));

            let allVisits: Visit[] = [];
            userVisitCounts = []; // Initialize visit counts array

            for (const userDoc of usersSnap.docs) {
                const userId = userDoc.id;
                let visitCount = 0; // Initialize visit count for the user

                const visitsSnap = await getDocs(collection(db, 'users', userId, 'visits'));

                visitsSnap.docs.forEach(visitDoc => {
                    const data = visitDoc.data();
                    allVisits.push({
                        id: visitDoc.id,
                        userId: userId, // Reference to user ID
                        timestamp: data.timestamp.toDate(), // Convert Firestore timestamp to JS Date
                        lat: data.lat || null, // Extract lat
                        lon: data.lon || null  // Extract lon
                    });
                    visitCount++; // Increment visit count for the user
                });

                userVisitCounts.push({ userId, visitCount });
            }

            visits = allVisits; // Set the visits array
            drawChart(); // Draw the chart after visits are fetched
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

        if (typeof window !== 'undefined') {
            const L = await import('leaflet'); // Dynamically import Leaflet

            map = L.map('map').setView([51.505, -0.09], 13); // Default view can be changed

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            addMarkersToMap(); // Add markers after map initialization
        }
    });

    // Function to add markers to the map
    function addMarkersToMap() {
        import('leaflet').then(L => {
            if (map) { // Ensure map is not null
                const markers = visits
                    .filter(v => v.lat !== null && v.lon !== null) // Filter out visits with null coordinates
                    .map(v => {
                        const marker = L.marker([v.lat!, v.lon!]).addTo(map!);
                        marker.bindTooltip(`
                            <div class="tooltip-content">
                                <strong>User ID:</strong> ${v.userId}<br>
                                <strong>Date:</strong> ${v.timestamp.toLocaleDateString()} ${v.timestamp.toLocaleTimeString()}<br>
                                <strong>Visit Count:</strong> ${userVisitCounts.find(u => u.userId === v.userId)?.visitCount || 0}
                            </div>
                        `, { 
                            permanent: false, 
                            direction: 'right', 
                            className: 'custom-tooltip' 
                        });
                        return marker;
                    });

                if (markers.length > 0) {
                    const group = L.featureGroup(markers);
                    group.addTo(map!);
                    map!.fitBounds(group.getBounds());
                }
            }
        });
    }

    // Function to draw a chart showing user visit counts
    function drawChart() {
        const ctx = document.getElementById('visitChart') as HTMLCanvasElement;
        if (chart) chart.destroy(); // Destroy existing chart if it exists

        const labels = userVisitCounts.map(u => u.userId);
        const data = userVisitCounts.map(u => u.visitCount);

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Visits',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        });
    }
</script>

<style>
    /* Import Leaflet CSS */
    @import url('https://unpkg.com/leaflet/dist/leaflet.css');

    /* Import Chart.js CSS (optional) */
    @import url('https://cdn.jsdelivr.net/npm/chart.js/dist/chart.css');

    /* Style for the map */
    #map {
        height: 50vh; /* Set a height for the map */
        width: 50vw;   /* Set width to 100% for responsive design */
    }

    /* Style for the chart */
    .chart-container {
        width: 100%; /* Responsive width */
        max-width: 500px; /* Limit max width for better layout */
        margin: 20px auto; /* Center the chart */
    }

    /* Container styles */
    .container {
        padding: 20px;
        background: rgba(255, 255, 255, 0.7); /* Semi-transparent background for glass effect */
        border-radius: 10px; /* Rounded corners */
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Enhanced shadow */
        max-width: 80vw; /* Set max width to 80vw for better layout */
        margin: 20px auto; /* Centering the container */
        backdrop-filter: blur(10px); /* Apply blur effect for the glass container */
        border: 1px solid rgba(255, 255, 255, 0.5); /* Light border for better visibility */
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

    /* Loading message styles */
    .loading {
        text-align: center;
        font-size: 1.5rem;
        color: #555;
    }

    /* Error message styles */
    .error {
        color: red;
        text-align: center;
        font-weight: bold;
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
        <div class="chart-container">
            <canvas id="visitChart"></canvas> <!-- Canvas for Chart.js -->
        </div>
    {/if}
</div>
