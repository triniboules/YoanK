<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';
    import { browser } from '$app/environment';
    import type { Map, FeatureGroup } from 'leaflet';

    interface Visit {
        id: string;
        user_id: string;
        timestamp: Date;
        lat: number | null;
        lon: number | null;
        location: {
            city: string;
            country: string;
        } | null;
        device: {
            type: string;
            browser: string;
        } | null;
    }

    let visits: Visit[] = [];
    let loading = true;
    let errorMessage: string | null = null;
    let map: Map | null = null;
    let markerGroup: FeatureGroup | null = null;

    async function initializeDatabase() {
        try {
            // Check if visits table exists
            const { data } = await supabase
                .from('visits')
                .select('count')
                .single();

            if (!data) {
                // Create visits table
                await supabase.rpc('initialize_visits_table', {});
            }
        } catch (error) {
            console.error('Error initializing visits table:', error);
        }
    }

    async function fetchAllVisits() {
        if (!browser) return;
        
        try {
            const { data: visitsData, error } = await supabase
                .from('visits')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) throw error;

            visits = (visitsData || []).map(visit => ({
                ...visit,
                timestamp: new Date(visit.timestamp)
            }));
        } catch (error) {
            console.error('Error fetching visits:', error);
            errorMessage = 'Failed to fetch visits. Please try again later.';
        } finally {
            loading = false;
        }
    }

    onMount(async () => {
        if (!browser) return;

        try {
            await initializeDatabase();
            await fetchAllVisits();

            const L = await import('leaflet');
            const mapElement = document.getElementById('map');
            
            if (mapElement) {
                map = L.map('map').setView([20, 0], 2);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: ' OpenStreetMap contributors'
                }).addTo(map);

                markerGroup = L.featureGroup().addTo(map);

                // Add markers for visits with valid coordinates
                const validVisits = visits.filter(v => v.lat !== null && v.lon !== null);
                
                validVisits.forEach(visit => {
                    const marker = L.marker([visit.lat!, visit.lon!]);
                    
                    const locationInfo = visit.location 
                        ? `<br>Location: ${visit.location.city}, ${visit.location.country}` 
                        : '';
                    
                    const deviceInfo = visit.device 
                        ? `<br>Device: ${visit.device.type}<br>Browser: ${visit.device.browser}` 
                        : '';

                    marker.bindTooltip(`
                        <div>
                            <strong>Visit Details</strong><br>
                            Date: ${visit.timestamp.toLocaleDateString()}
                            ${locationInfo}
                            ${deviceInfo}
                        </div>
                    `);
                    
                    marker.addTo(markerGroup!);
                });

                if (validVisits.length > 0 && markerGroup) {
                    map.fitBounds(markerGroup.getBounds(), { padding: [50, 50] });
                }
            }
        } catch (error) {
            console.error('Error in component initialization:', error);
            errorMessage = 'Failed to initialize the map. Please try again later.';
        }
    });

    onMount(() => {
        return () => {
            if (map) {
                map.remove();
            }
        };
    });
</script>

<div class="container">
    {#if loading}
        <div class="loading">Loading visits data...</div>
    {:else if errorMessage}
        <div class="error">{errorMessage}</div>
    {:else}
        <div id="map"></div>
        <div class="stats">
            <h2>Visit Statistics</h2>
            <p>Total Visits: {visits.length}</p>
            <p>Unique Users: {new Set(visits.map(v => v.user_id)).size}</p>
            <p>Latest Visit: {visits.length > 0 ? visits[0].timestamp.toLocaleDateString() : 'No visits'}</p>
        </div>
    {/if}
</div>

<style>
    @import url('https://unpkg.com/leaflet/dist/leaflet.css');

    .container {
        position: relative;
        width: 100%;
        height: 100vh;
        background-color: #1a1a1a;
        color: #ffffff;
    }

    #map {
        width: 100%;
        height: 70%;
        background-color: #2a2a2a;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    .stats {
        padding: 20px;
        background-color: #2a2a2a;
        border-radius: 8px;
        margin-top: 20px;
    }

    .stats h2 {
        margin-top: 0;
        color: #ffffff;
    }

    .stats p {
        margin: 10px 0;
        color: #cccccc;
    }

    .loading, .error {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        background-color: #2a2a2a;
        border-radius: 8px;
        text-align: center;
    }

    .error {
        color: #ff6b6b;
    }

    :global(.leaflet-container) {
        background-color: #2a2a2a !important;
    }

    :global(.leaflet-tooltip) {
        background-color: #2a2a2a;
        color: #ffffff;
        border: 1px solid #3a3a3a;
    }

    :global(.leaflet-tooltip-top:before) {
        border-top-color: #3a3a3a;
    }
</style>
