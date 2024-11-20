<script lang="ts">
    import { onMount } from 'svelte';
    import { db } from '../components/firebase.js';
    import { collection, getDocs } from 'firebase/firestore';
    import Chart from 'chart.js/auto';
    import SiteClickStats from './SiteClickStats.svelte';
    import VideoClickStats from './VideoClickStats.svelte';
    import 'leaflet/dist/leaflet.css';

    interface Visit {
        id: string;
        userId: string;
        timestamp: Date;
        lat: number | null;
        lon: number | null;
    }

    interface UserVisitCount {
        userId: string;
        visitCount: number;
    }

    let visits: Visit[] = [];
    let userVisitCounts: UserVisitCount[] = [];
    let loading = true;
    let errorMessage: string | null = null;
    let map: any = null;
    let chart: Chart | null = null;
    let activeTab = 'overview';

    // Function to fetch all visits for all users
    async function fetchAllVisits() {
        try {
            const usersSnap = await getDocs(collection(db, 'users'));

            let allVisits: Visit[] = [];
            userVisitCounts = [];

            for (const userDoc of usersSnap.docs) {
                const userId = userDoc.id;
                let visitCount = 0;

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
                    visitCount++;
                });

                userVisitCounts.push({ userId, visitCount });
            }

            visits = allVisits;
            drawChart();
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
                maxZoom: 19,
                attribution: 'OpenStreetMap contributors'
            }).addTo(map);

            addMarkersToMap();
        }
    });

    function addMarkersToMap() {
        import('leaflet').then(L => {
            if (map) {
                const markers = visits
                    .filter(v => v.lat !== null && v.lon !== null)
                    .map(v => {
                        const marker = L.marker([v.lat!, v.lon!]).addTo(map);
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
                    group.addTo(map);
                    map.fitBounds(group.getBounds());
                }
            }
        });
    }

    function drawChart() {
        const ctx = document.getElementById('visitChart') as HTMLCanvasElement;
        if (chart) chart.destroy();

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

<div class="dashboard">
    <div class="tabs">
        <button 
            class="tab-button {activeTab === 'overview' ? 'active' : ''}" 
            on:click={() => activeTab = 'overview'}
        >
            Overview
        </button>
        <button 
            class="tab-button {activeTab === 'locations' ? 'active' : ''}" 
            on:click={() => activeTab = 'locations'}
        >
            Locations
        </button>
        <button 
            class="tab-button {activeTab === 'videos' ? 'active' : ''}" 
            on:click={() => activeTab = 'videos'}
        >
            Video Stats
        </button>
    </div>

    <div class="content">
        {#if loading}
            <div class="loading">Loading analytics...</div>
        {:else if errorMessage}
            <div class="error">{errorMessage}</div>
        {:else}
            {#if activeTab === 'overview'}
                <div class="overview-section">
                    <SiteClickStats 
                        containerClass="stats-container" 
                        errorMessageClass="error-message"
                    />
                </div>
            {:else if activeTab === 'locations'}
                <div class="locations-section">
                    <div id="map"></div>
                    <div class="chart-container">
                        <canvas id="visitChart"></canvas>
                    </div>
                </div>
            {:else if activeTab === 'videos'}
                <div class="videos-section">
                    <VideoClickStats />
                </div>
            {/if}
        {/if}
    </div>
</div>

<style>
    .dashboard {
        padding: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-width: 90vw;
        margin: 20px auto;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 10px;
    }

    .tab-button {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .tab-button:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .tab-button.active {
        background: rgba(255, 255, 255, 0.3);
        font-weight: bold;
    }

    .content {
        min-height: 500px;
    }

    #map {
        height: 400px;
        width: 100%;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    .chart-container {
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 8px;
        margin-top: 20px;
    }

    .loading {
        text-align: center;
        font-size: 1.2rem;
        color: rgba(255, 255, 255, 0.8);
        padding: 40px;
    }

    .error {
        color: #ff4444;
        text-align: center;
        background: rgba(255, 68, 68, 0.1);
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
    }

    .overview-section,
    .locations-section,
    .videos-section {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 20px;
    }

    @media (max-width: 768px) {
        .dashboard {
            max-width: 95vw;
            padding: 10px;
        }

        .tabs {
            flex-wrap: wrap;
        }

        .tab-button {
            flex: 1 1 auto;
            text-align: center;
            padding: 8px 12px;
            font-size: 0.9rem;
        }

        #map {
            height: 300px;
        }
    }
</style>
