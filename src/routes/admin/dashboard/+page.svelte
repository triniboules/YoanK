<!-- Advanced Analytics Dashboard -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import type { AnalyticsData, PageMetrics, UserSession, DashboardFilters } from '$lib/types';
    import { db } from '$lib/firebase';
    import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
    import Chart from 'chart.js/auto';
    import 'leaflet/dist/leaflet.css';

    let loading = true;
    let error: string | null = null;
    let analyticsData: AnalyticsData | null = null;
    let activeUsers = 0;
    let map: any = null;
    let visitsChart: Chart | null = null;
    let deviceChart: Chart | null = null;
    let pageViewsChart: Chart | null = null;

    let filters: DashboardFilters = {
        dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            end: new Date()
        }
    };

    // Authentication check
    const PASSWORD = 'yoank-admin-2024'; // Secure admin password
    let authenticated = false;
    let password = '';

    async function authenticate() {
        if (password === PASSWORD) {
            authenticated = true;
            localStorage.setItem('dashboard_auth', 'true');
            await loadDashboardData();
        } else {
            error = 'Invalid password';
        }
    }

    onMount(async () => {
        if (!browser) return;
        
        // Check authentication
        if (localStorage.getItem('dashboard_auth') === 'true') {
            authenticated = true;
            await loadDashboardData();
        }
    });

    async function loadDashboardData() {
        if (!authenticated) return;
        
        try {
            loading = true;
            error = null;

            // Fetch visits
            const visitsQuery = query(
                collection(db, 'visits'),
                where('timestamp', '>=', Timestamp.fromDate(filters.dateRange.start)),
                where('timestamp', '<=', Timestamp.fromDate(filters.dateRange.end)),
                orderBy('timestamp', 'desc')
            );

            const visitsSnap = await getDocs(visitsQuery);
            const visits = visitsSnap.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                timestamp: doc.data().timestamp.toDate()
            }));

            // Process analytics data
            analyticsData = processAnalyticsData(visits);
            
            // Initialize visualizations
            await Promise.all([
                initializeMap(),
                initializeCharts()
            ]);

        } catch (err) {
            console.error('Error loading dashboard data:', err);
            error = 'Failed to load dashboard data';
        } finally {
            loading = false;
        }
    }

    function processAnalyticsData(visits: any[]): AnalyticsData {
        // Process visits into analytics data
        // This is a placeholder - implement full processing logic
        return {
            visits,
            totalVisits: visits.length,
            uniqueVisitors: new Set(visits.map(v => v.userId)).size,
            countries: new Map(),
            cities: new Map(),
            devices: new Map(),
            browsers: new Map(),
            pageMetrics: new Map(),
            timeMetrics: {
                averageSessionDuration: 0,
                bounceRate: 0,
                peakHours: new Map(),
                peakDays: new Map()
            },
            referrers: new Map(),
            trends: {
                dailyVisits: new Map(),
                weeklyVisits: new Map(),
                monthlyVisits: new Map()
            }
        };
    }

    async function initializeMap() {
        if (!browser || !analyticsData) return;

        const L = await import('leaflet');
        const mapElement = document.getElementById('visitorMap');
        
        if (mapElement && analyticsData.visits.length > 0) {
            if (map) map.remove();
            
            map = L.map('visitorMap').setView([20, 0], 2);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: ' OpenStreetMap contributors'
            }).addTo(map);

            // Add markers for visits with location data
            const markers = analyticsData.visits
                .filter(v => v.location?.lat && v.location?.lon)
                .map(visit => {
                    const marker = L.marker([visit.location!.lat, visit.location!.lon]);
                    marker.bindPopup(`
                        <div class="popup-content">
                            <p><strong>Date:</strong> ${visit.timestamp.toLocaleDateString()}</p>
                            <p><strong>Location:</strong> ${visit.location!.city}, ${visit.location!.country}</p>
                            ${visit.device ? `
                                <p><strong>Device:</strong> ${visit.device.type}</p>
                                <p><strong>Browser:</strong> ${visit.device.browser}</p>
                            ` : ''}
                        </div>
                    `);
                    return marker;
                });

            if (markers.length > 0) {
                const group = L.featureGroup(markers).addTo(map);
                map.fitBounds(group.getBounds(), { padding: [50, 50] });
            }
        }
    }

    function initializeCharts() {
        if (!browser || !analyticsData) return;

        // Visits over time chart
        const visitsCtx = document.getElementById('visitsChart') as HTMLCanvasElement;
        if (visitsCtx && visitsChart) visitsChart.destroy();
        if (visitsCtx) {
            visitsChart = new Chart(visitsCtx, {
                type: 'line',
                data: {
                    labels: Array.from(analyticsData.trends.dailyVisits.keys()),
                    datasets: [{
                        label: 'Daily Visits',
                        data: Array.from(analyticsData.trends.dailyVisits.values()),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Visits Over Time'
                        }
                    }
                }
            });
        }

        // Device distribution chart
        const deviceCtx = document.getElementById('deviceChart') as HTMLCanvasElement;
        if (deviceCtx && deviceChart) deviceChart.destroy();
        if (deviceCtx) {
            deviceChart = new Chart(deviceCtx, {
                type: 'doughnut',
                data: {
                    labels: Array.from(analyticsData.devices.keys()),
                    datasets: [{
                        data: Array.from(analyticsData.devices.values()),
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 206, 86)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Device Distribution'
                        }
                    }
                }
            });
        }
    }

    function cleanup() {
        if (browser) {
            if (map) {
                map.remove();
                map = null;
            }
            if (visitsChart) visitsChart.destroy();
            if (deviceChart) deviceChart.destroy();
            if (pageViewsChart) pageViewsChart.destroy();
        }
    }

    onMount(() => {
        return cleanup;
    });
</script>

<style>
    .dashboard {
        padding: 20px;
        max-width: 100vw;
        min-height: 100vh;
        background: #1a1a1a;
        color: #fff;
    }

    .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 20px;
    }

    .login-form {
        background: rgba(255, 255, 255, 0.1);
        padding: 2rem;
        border-radius: 10px;
        backdrop-filter: blur(10px);
        width: 100%;
        max-width: 400px;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }

    .card {
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 10px;
        backdrop-filter: blur(10px);
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
    }

    .stat-card {
        background: rgba(255, 255, 255, 0.05);
        padding: 15px;
        border-radius: 8px;
        text-align: center;
    }

    .stat-value {
        font-size: 2rem;
        font-weight: bold;
        margin: 10px 0;
    }

    .stat-label {
        color: #888;
        font-size: 0.9rem;
    }

    #visitorMap {
        height: 400px;
        border-radius: 10px;
        margin-bottom: 20px;
    }

    .chart-container {
        position: relative;
        height: 300px;
    }

    .filters {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    input, select {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 8px 12px;
        border-radius: 5px;
        color: white;
    }

    button {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
    }

    button:hover {
        background: #45a049;
    }

    .error {
        background: rgba(255, 0, 0, 0.1);
        color: #ff4444;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 15px;
    }

    .loading {
        text-align: center;
        padding: 20px;
        font-size: 1.2rem;
        color: #888;
    }

    @media (max-width: 768px) {
        .grid {
            grid-template-columns: 1fr;
        }

        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        #visitorMap {
            height: 300px;
        }
    }
</style>

{#if !authenticated}
    <div class="login-container">
        <div class="login-form">
            <h2>Dashboard Login</h2>
            {#if error}
                <div class="error">{error}</div>
            {/if}
            <input
                type="password"
                bind:value={password}
                placeholder="Enter password"
                on:keydown={(e) => e.key === 'Enter' && authenticate()}
            />
            <button on:click={authenticate}>Login</button>
        </div>
    </div>
{:else}
    <div class="dashboard">
        <h1>Analytics Dashboard</h1>
        
        <div class="filters">
            <input 
                type="date" 
                bind:value={filters.dateRange.start} 
                on:change={loadDashboardData}
            />
            <input 
                type="date" 
                bind:value={filters.dateRange.end} 
                on:change={loadDashboardData}
            />
        </div>

        {#if loading}
            <div class="loading">Loading dashboard data...</div>
        {:else if error}
            <div class="error">{error}</div>
        {:else if analyticsData}
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">{analyticsData.totalVisits}</div>
                    <div class="stat-label">Total Visits</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{analyticsData.uniqueVisitors}</div>
                    <div class="stat-label">Unique Visitors</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{activeUsers}</div>
                    <div class="stat-label">Active Users</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{analyticsData.countries.size}</div>
                    <div class="stat-label">Countries</div>
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <h3>Visitor Locations</h3>
                    <div id="visitorMap"></div>
                </div>

                <div class="card">
                    <h3>Visits Over Time</h3>
                    <div class="chart-container">
                        <canvas id="visitsChart"></canvas>
                    </div>
                </div>

                <div class="card">
                    <h3>Device Distribution</h3>
                    <div class="chart-container">
                        <canvas id="deviceChart"></canvas>
                    </div>
                </div>

                <div class="card">
                    <h3>Top Pages</h3>
                    <div class="chart-container">
                        <canvas id="pageViewsChart"></canvas>
                    </div>
                </div>
            </div>
        {/if}
    </div>
{/if}
