<script lang="ts">
    import { onMount } from 'svelte';
    import { db } from './firebase.js';
    import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';

    // Initialize state variables
    let uniqueVisitors = 0;
    let totalVisits = 0;
    let videoClicks = 0;
    let contactClicks = 0;
    let logoCenterClicks = 0;
    let logoLeftClicks = 0;

    let loading = true;  // Loading state
    let errorMessage: string | null = null;  // Error message state

    // Fetch all necessary statistics from Firestore
    async function fetchStatistics() {
        try {
            const userSnap = await getDocs(collection(db, 'users'));
            const videoClicksSnap = await getDocs(collection(db, 'videos'));
            const headerSnap = await getDocs(collection(db, 'header'));

            const uniqueUserIds = new Set<string>();
            const visitsPromises: Promise<void>[] = [];

            userSnap.forEach(userDoc => {
                uniqueUserIds.add(userDoc.id);
                const visitsSnap = collection(db, 'users', userDoc.id, 'visits');

                visitsPromises.push(
                    getDocs(visitsSnap).then(visitsSnap => {
                        totalVisits += visitsSnap.size;
                    })
                );
            });

            await Promise.all(visitsPromises);
            uniqueVisitors = uniqueUserIds.size;

            videoClicks = sumField(videoClicksSnap.docs, 'clickCount');

            headerSnap.docs.forEach(doc => {
                switch (doc.id) {
                    case 'contact':
                        contactClicks = doc.data().clicks?.length || 0;
                        break;
                    case 'logoCenter':
                        logoCenterClicks = doc.data().clicks?.length || 0;
                        break;
                    case 'logoLeft':
                        logoLeftClicks = doc.data().clicks?.length || 0;
                        break;
                }
            });
        } catch (error) {
            console.error('Error fetching statistics:', error);
            errorMessage = 'Failed to load statistics. Please try again later.';
        } finally {
            loading = false;
        }
    }

    // Helper function to sum a specific field across documents
    function sumField(docs: QueryDocumentSnapshot<any>[], field: string): number {
        return docs.reduce((acc, doc) => acc + (doc.data()[field] || 0), 0);
    }

    // Fetch statistics when component is mounted
    onMount(() => {
        fetchStatistics();
    });
</script>

<!-- UI Structure -->
<div class="statistics-container">
    <h2>Website Statistics</h2>
    {#if loading}
        <p class="status-message">Loading statistics...</p>
    {:else if errorMessage}
        <p class="status-message error">{errorMessage}</p>
    {:else}
        <div class="stats-grid">
            <div class="stat-item">
                <span>Unique Visitors:</span>
                <strong>{uniqueVisitors}</strong>
            </div>
            <div class="stat-item">
                <span>Total Visits:</span>
                <strong>{totalVisits}</strong>
            </div>
            <div class="stat-item">
                <span>Video Clicks:</span>
                <strong>{videoClicks}</strong>
            </div>
            <div class="stat-item">
                <span>Contact Clicks:</span>
                <strong>{contactClicks}</strong>
            </div>
            <div class="stat-item">
                <span>Logo Center Clicks:</span>
                <strong>{logoCenterClicks}</strong>
            </div>
            <div class="stat-item">
                <span>Logo Left Clicks:</span>
                <strong>{logoLeftClicks}</strong>
            </div>
        </div>
    {/if}
</div>

<!-- Styles -->
<style>
    .statistics-container {
        padding: 20px;
        background-color: #f9f9f957;
        border-radius: 8px;
        max-width: auto;
        margin: 0 auto;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    h2 {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 20px;
        font-size: 24px;
    }

    .status-message {
        text-align: center;
        font-size: 16px;
        color: #666;
    }

    .status-message.error {
        color: #e74c3c;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
    }

    .stat-item {
        background: white;
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 4px;
        text-align: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }

    .stat-item span {
        display: block;
        color: #2c3e50;
        font-size: 14px;
        margin-bottom: 5px;
    }

    .stat-item strong {
        font-size: 18px;
        color: #333;
    }

    @media (max-width: 600px) {
        .statistics-container {
            padding: 15px;
        }

        h2 {
            font-size: 20px;
        }

        .stat-item {
            padding: 10px;
        }
    }
</style>
