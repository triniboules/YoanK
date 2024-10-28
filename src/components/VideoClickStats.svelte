<script lang="ts">
    import { onMount } from 'svelte';
    import { db } from './firebase.js';
    import { collection, getDocs } from 'firebase/firestore';

    interface Visit {
        id: string;
        timestamp: Date;
        lat: number | null;
        lon: number | null;
    }

    let visits: Visit[] = [];
    let loading = true;
    let errorMessage: string | null = null;

    async function fetchVisits(userId: string) {
        try {
            const visitsSnap = await getDocs(collection(db, 'users', userId, 'visits'));
            visits = visitsSnap.docs.map(doc => ({
                id: doc.id,
                timestamp: doc.data().timestamp.toDate(),
                lat: doc.data().lat || null,
                lon: doc.data().lon || null
            }));
        } catch (error) {
            console.error('Error fetching visits:', error);
            errorMessage = 'Failed to fetch visits. Please try again later.';
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchVisits(userId);
        } else {
            loading = false;
            errorMessage = 'No user ID found.';
        }
    });
</script>

<!-- UI Structure -->
<div class="visits-container">
    <h2>User Visit Records</h2>
    {#if loading}
        <p class="status-message">Loading visits...</p>
    {:else if errorMessage}
        <p class="status-message error">{errorMessage}</p>
    {:else if visits.length > 0}
        <ul class="visit-list">
            {#each visits as visit}
                <li class="visit-item">
                    <div>
                        <strong>Visit ID:</strong> {visit.id}
                    </div>
                    <div>
                        <strong>Time:</strong> {new Intl.DateTimeFormat('en-US', {
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: 'numeric', 
                            second: 'numeric'
                        }).format(visit.timestamp)}
                    </div>
                    {#if visit.lat !== null && visit.lon !== null}
                        <div>
                            <strong>Location:</strong> {visit.lat}, {visit.lon}
                        </div>
                    {/if}
                </li>
            {/each}
        </ul>
    {:else}
        <p class="status-message">No visits recorded.</p>
    {/if}
</div>

<!-- Styling -->
<style>
    .visits-container {
        background-color: #f9f9f957;
        display: flex;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    h2 {
        font-size: 24px;
        text-align: center;
        color: #2c3e50;
        margin-bottom: 20px;
    }

    .status-message {
        text-align: center;
        color: #666;
        font-size: 16px;
    }

    .status-message.error {
        color: #e74c3c;
    }

    .visit-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .visit-item {
        display: flex;
        background: white;
        border: 1px solid #ccc;
      
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }

    .visit-item div {
        
        color: #333;
    }

    strong {
        color: #2c3e50;
    }

    @media (max-width: 600px) {
        .visits-container {
            padding: 15px;
        }

        h2 {
            font-size: 20px;
        }

        .visit-item {
            padding: 10px;
        }
    }
</style>
