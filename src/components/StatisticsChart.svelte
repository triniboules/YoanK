<script lang="ts">
    import { onMount } from 'svelte';
    import { collection, getDocs } from 'firebase/firestore';
    import { db } from './firebase.js';
    import Chart from 'chart.js/auto';

    let chart: Chart | null = null;
    let labels: string[] = [];
    let visitData: number[] = [];

    onMount(async () => {
        try {
            await fetchStatistics();
            if (labels.length > 0 && visitData.length > 0) {
                initializeChart();
            } else {
                console.log("No data available for chart."); // Debugging message
            }
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    });

    async function fetchStatistics() {
        const userSnap = await getDocs(collection(db, 'users'));
        const visitCounts: Record<string, number> = {};

        for (const userDoc of userSnap.docs) {
            const visitsSnap = collection(db, 'users', userDoc.id, 'visits');
            const visits = await getDocs(visitsSnap);

            visits.forEach(visitDoc => {
                const data = visitDoc.data();
                const timestamp = data.timestamp.toDate(); // Convert Firebase timestamp to JS Date
                const date = timestamp.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
                visitCounts[date] = (visitCounts[date] || 0) + 1; // Increment the visit count for the date
            });
        }

        labels = Object.keys(visitCounts); // Dates for the x-axis
        visitData = Object.values(visitCounts); // Number of visits for each date

        console.log("Labels:", labels); // Debugging
        console.log("Visit Data:", visitData); // Debugging
    }

    function initializeChart() {
        const canvas: HTMLCanvasElement | null = document.getElementById('myChart') as HTMLCanvasElement;
        if (canvas && labels.length > 0 && visitData.length > 0) {
            chart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Visits Over Time',
                        data: visitData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: (tooltipItem) => {
                                    return `Date: ${tooltipItem.label}, Visits: ${tooltipItem.raw}`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day',
                                tooltipFormat: 'll',
                            },
                            title: {
                                display: true,
                                text: 'Date',
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Visits',
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                            },
                        },
                    },
                },
            });
        } else {
            console.log("Canvas is null or data is empty"); // Debugging message
        }
    }
</script>

<style lang="css">
    .chart-container {
        padding: 20px;
        background-color: white; /* White background for the container */
        border-radius: 10px; /* Rounded corners */
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    }

    canvas {
        width: 100%;
        height: auto; /* Maintains aspect ratio */
        max-width: 800px; /* Optional: Set a maximum width if needed */
    }
</style>

<div class="chart-container">
    <canvas id="myChart"></canvas>
</div>
