<script lang="ts">
    import { onMount } from 'svelte';
    import { db } from './firebase'; // Adjust the path to your firebase.js file
    import { collection, getDocs } from 'firebase/firestore';
    import { Line } from 'svelte-chartjs';
    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        Filler,
        TimeScale,
    } from 'chart.js';

    // Register Chart.js components
    ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler, TimeScale);

    interface Visit {
        id: string;           // Document ID
        timestamp: Date;     // Visit timestamp
        lat: number | null;   // Latitude or null
        lon: number | null;   // Longitude or null
    }

    let visits: Visit[] = []; // Store visits
    let loading: boolean = true;
    let errorMessage: string | null = null;
    let selectedTimeFrame: 'day' | 'week' | 'month' | 'year' = 'day'; // Selected timeframe

    async function fetchVisits(userId: string) {
        try {
            const visitsSnap = await getDocs(collection(db, 'users', userId, 'visits'));
            visits = visitsSnap.docs.map(doc => ({
                id: doc.id,
                timestamp: doc.data().timestamp.toDate(), // Convert Firestore timestamp to JavaScript Date
                lat: doc.data().lat || null,              // Latitude (or null if not available)
                lon: doc.data().lon || null               // Longitude (or null if not available)
            }));
        } catch (error) {
            console.error('Error fetching visits:', error);
            errorMessage = 'Failed to fetch visits. Please try again later.';
        } finally {
            loading = false; // Set loading to false after fetching is done
        }
    }

    onMount(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchVisits(userId);
        } else {
            loading = false; // If no userId is found, set loading to false
            errorMessage = 'No user ID found.';
        }
    });

    // Prepare data for the Line chart based on the selected timeframe
    $: chartData = (() => {
        if (loading || errorMessage) return { labels: [], datasets: [] };

        const groupedVisits: Record<string, number> = {};
        const timeFormat = selectedTimeFrame === 'day' ? 'hour' :
                          selectedTimeFrame === 'week' ? 'day' :
                          selectedTimeFrame === 'month' ? 'day' :
                          'month'; // year as the final fallback

        visits.forEach(visit => {
            const date = new Date(visit.timestamp);
            let key: string;

            if (selectedTimeFrame === 'day') {
                key = date.toISOString().split('T')[0] + ' ' + date.getHours(); // Combine date and hour for daily view
            } else if (selectedTimeFrame === 'week') {
                key = date.toISOString().split('T')[0]; // Use date for weekly view
            } else if (selectedTimeFrame === 'month') {
                key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; // YYYY-MM-DD for monthly view
            } else { // year
                key = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-MM for yearly view
            }

            groupedVisits[key] = (groupedVisits[key] || 0) + 1; // Count visits per hour/day
        });

        // Convert groupedVisits into arrays for labels and data
        const labels = Object.keys(groupedVisits).sort(); // Sort the keys to maintain chronological order
        const data = labels.map(label => groupedVisits[label]);

        return {
            labels,
            datasets: [
                {
                    label: 'Number of Visits',
                    data,
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4, // Smooth the line
                },
            ],
        };
    })();
</script>

<main class="stats-container">
    {#if loading}
        <p class="loading">Loading visits...</p>
    {:else if errorMessage}
        <p>{errorMessage}</p>
    {:else}
        <h2 class="stats-title">User Visits - {selectedTimeFrame.charAt(0).toUpperCase() + selectedTimeFrame.slice(1)}</h2>
        <div>
            <button on:click={() => selectedTimeFrame = 'day'}>Day</button>
            <button on:click={() => selectedTimeFrame = 'week'}>Week</button>
            <button on:click={() => selectedTimeFrame = 'month'}>Month</button>
            <button on:click={() => selectedTimeFrame = 'year'}>Year</button>
        </div>
        <div class="chart-container">
            <Line data={chartData} options={{
                responsive: true,
                scales: {
                    x: {
                        type: 'category', // Use category scale for discrete time intervals
                        title: {
                            display: true,
                            text: selectedTimeFrame.charAt(0).toUpperCase() + selectedTimeFrame.slice(1),
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Visits',
                        },
                        beginAtZero: true,
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                const label = tooltipItem.dataset.label || '';
                                const value = tooltipItem.raw || 0;
                                return `${label}: ${value} visits`;
                            },
                        },
                    },
                    legend: {
                        display: true,
                    },
                },
            }} />
        </div>
    {/if}
</main>

<style>
    .stats-container {
        max-width: 1200px;
        margin: auto;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .stats-title {
        margin-bottom: 10px;
        font-size: 1.5rem;
        color: #34495e;
        text-align: left;
    }

    .loading {
        text-align: center;
        font-size: 1.2rem;
        color: #666;
    }

    .chart-container {
        margin-top: 20px; /* Space above the chart */
    }

    button {
        margin: 5px;
        padding: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background-color: #007bff;
        color: white;
        font-size: 1rem;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>
