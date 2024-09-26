<script lang="ts">
    import { onMount } from 'svelte';
    import { collection, getDocs } from 'firebase/firestore';
    import { db } from './firebase.js';
    import Chart from 'chart.js/auto'; // Import Chart.js

    let chartCanvas: HTMLCanvasElement; // Reference to the canvas
    let chart: Chart | null = null; // Chart instance

    // Variables to hold the data
    let labels: string[] = []; // To hold time labels (dates)
    let visitData: number[] = []; // To hold visit counts

    onMount(async () => {
        await fetchStatistics(); // Fetch data when component mounts

        // Initialize the chart after fetching data
        const ctx = chartCanvas.getContext('2d');
        if (ctx) {
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels, // Use fetched labels
                    datasets: [{
                        label: 'Visits Over Time', // Label for the dataset
                        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Optional background color
                        borderColor: 'rgba(75, 192, 192, 1)', // Optional border color
                        data: visitData, // Use fetched visit data
                        fill: false, // Disable fill under the line
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Visits Over Time',
                        },
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day',
                                tooltipFormat: 'll', // Format for tooltip
                            },
                            title: {
                                display: true,
                                text: 'Date',
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Visits',
                            },
                        },
                    },
                },
            });
        }
    });

    async function fetchStatistics() {
        const userSnap = await getDocs(collection(db, 'users'));
        const visitCounts: Record<string, number> = {}; // To count visits per date

        const promises = userSnap.docs.map(async userDoc => {
            const visitsSnap = collection(db, 'users', userDoc.id, 'visits');
            const visits = await getDocs(visitsSnap);

            visits.forEach(visitDoc => {
                const data = visitDoc.data();
                const timestamp = data.timestamp.toDate(); // Convert Firebase timestamp to JS Date
                const date = timestamp.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

                // Increment the visit count for the date
                visitCounts[date] = (visitCounts[date] || 0) + 1;
            });
        });

        await Promise.all(promises); // Wait for all promises to resolve

        // Update labels and data arrays after processing all users
        labels = Object.keys(visitCounts); // Dates for the x-axis
        visitData = Object.values(visitCounts); // Number of visits for each date
    }
</script>

<canvas bind:this={chartCanvas} id="myChart"></canvas>
