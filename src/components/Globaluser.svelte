<script lang="ts">
    import { onMount } from 'svelte';
    import { db } from './firebase.js'; 
    import { collection, getDocs } from 'firebase/firestore';
   

    interface Visit {
        id: string;           
        userId: string;      
        timestamp: Date;     
        lat: number | null;   
        lon: number | null;   
    }

    let visits: Visit[] = [];  
    let loading = true;        
    let errorMessage: string | null = null; 
    let map: L.Map | null = null; 

    async function fetchAllVisits() {
        try {
            const usersSnap = await getDocs(collection(db, 'users'));

            let allVisits: Visit[] = [];

            for (const userDoc of usersSnap.docs) {
                const userId = userDoc.id;
                const visitsSnap = await getDocs(collection(db, 'users', userId, 'visits'));

                visitsSnap.docs.forEach(visitDoc => {
                    const data = visitDoc.data();
                    allVisits.push({
                        id: visitDoc.id,
                        userId: userId,
                        timestamp: data.timestamp.toDate(),
                        lat: data.lat || null,
                        lon: data.lon || null
                    });
                });
            }

            visits = allVisits; 
        } catch (error) {
            console.error('Error fetching visits:', error);
            errorMessage = 'Failed to fetch visits. Please try again later.'; 
        } finally {
            loading = false; 
        }
    }

    onMount(async () => {
        await fetchAllVisits(); 

        if (typeof window !== 'undefined') {
            const L = await import('leaflet'); 

            map = L.map('map').setView([51.505, -0.09], 13); 

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 25,
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        }
    });

    $: if (!loading && visits.length > 0) {
        import('leaflet').then(L => {
            if (map !== null) {
                const markers = visits
                    .filter(v => v.lat !== null && v.lon !== null)
                    .map(v => {
                        const marker = L.marker([v.lat!, v.lon!]).addTo(map!); 
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
                        return marker; 
                    });

                if (markers.length > 0) {
                    const group = L.featureGroup(markers); 
                    group.addTo(map!); 

                    map!.fitBounds(group.getBounds(), { padding: [20, 20] }); 
                }
            }
        });
    }
</script>

<style>
    @import url('https://unpkg.com/leaflet/dist/leaflet.css');

    /* Container styles */
    .container {
        position: relative; /* Set position relative to place the map above */
        max-width: 100vw; 
        padding: 20px;
        background-color: white;
        border-radius: 10px; 
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); 
    }

    /* Title styles */
    .title {
        font-size: 2rem; 
        text-align: center; 
        color: #2c3e50; 
        margin-bottom: 20px; 
        text-transform: uppercase; 
        letter-spacing: 1px; 
    }

    #map {
        display: block; /* Change to block */
        height: 70vh; /* Increased height to 70vh */
        min-width: 70vw; 
        margin: 0; /* Remove bottom margin */
    }

    .loading, .error {
        text-align: center;
        font-size: 1.5rem;
        color: red;
        margin-top: 20px;
    }
</style>



<div class="container">
    <h1 class="title">User Visit Locations</h1>
    
    {#if loading}
        <p class="loading">Loading visits...</p>
    {:else if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else}
        <div id="map"></div> 
    {/if}
</div>
