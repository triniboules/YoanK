<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from './firebase.js';
  import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';

  // Define props
  export let containerClass: string | undefined = '';
  export let loadingMessage: string = 'Loading statistics...';
  export let errorMessageClass: string | undefined;

  // Initialize state variables
  let uniqueVisitors = 0;
  let totalVisits = 0;
  let videoClicks = 0;
  let contactClicks = 0;
  let logoCenterClicks = 0;
  let logoLeftClicks = 0;
  let loading = true;  // Loading state
  let errorMessage: string | null = null;  // Error message state

  // Define the Video type
  type Video = {
    id: string;
    name: string;
    clickCount: number;
  };

  let videos: Video[] = []; // Explicitly typed videos array

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

      // Fetch videos for additional statistics
      await fetchVideos();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      errorMessage = 'Failed to load statistics. Please try again later.';
    } finally {
      loading = false;
    }
  }

  // Fetch video data from Firestore
  async function fetchVideos() {
    try {
      const videoSnap = await getDocs(collection(db, 'videos'));
      videos = videoSnap.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || "",
        clickCount: doc.data().clickCount || 0,
      })) as Video[]; // Cast to Video[]
    } catch (error) {
      console.error('Error fetching videos:', error);
      errorMessage = 'Failed to load video statistics.';
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
<div class="{containerClass} stats-container">
  {#if loading}
    <div class="loading-container glass-container p-4 rounded-lg shadow-lg mb-4">
      <p class="loading">{loadingMessage}</p>
      <div class="loader"></div> <!-- Adding a loader -->
    </div>
  {:else if errorMessage}
    <p class="{errorMessageClass}">{errorMessage}</p>
  {:else}
    <div class="stats-grid glass-container p-4 rounded-lg shadow-lg mb-4">
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
      <!-- Display additional video statistics -->
      <div class="video-stats">
        <h3 class="video-stats-header">Video Statistics</h3>
        {#each videos as video (video.id)}
          <div class="video-stat-item">
            <span class="video-name">{video.name}</span>
            <strong class="video-clicks">Clicks: {video.clickCount}</strong>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .stats-container {
    max-width: 75vw;
    margin: auto;
    padding: 20px;
    backdrop-filter: blur(10px);
    background-color: #f9fafb34; /* Semi-transparent background */
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    font-family: 'Arial', sans-serif;
    color: #333;
  }

  .glass-container {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.85); /* Glass effect */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px; /* Spacing between elements */
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
  }

  .loading {
    text-align: center;
    font-size: 1.8rem;
    color: #555;
  }

  .loader {
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 5px solid #007BFF;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-top: 10px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
    gap: 15px; /* Increased gap for better separation */
    box-sizing: border-box;
  }

  .stat-item {
    background: white;
    padding: 20px; /* Increased padding for better clickability */
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .stat-item:hover {
    transform: scale(1.02); /* Slight hover effect */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  .stat-item span {
    display: block;
    color: #333; /* Darker text color for better readability */
    font-size: 16px; /* Increased font size */
    margin-bottom: 5px;
    font-weight: bold; /* Bold text */
  }

  .stat-item strong {
    font-size: 22px; /* Increased font size for emphasis */
    color: #2c3e50; /* Darker shade for strong emphasis */
  }

  .video-stats {
    grid-column: span 3; /* Take full width */
    margin-top: 20px;
    background: white;
    padding: 15px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .video-stats-header {
    color: #333; /* Dark color for header text */
    font-size: 20px; /* Increased font size for visibility */
    margin-bottom: 10px; /* Margin for spacing */
  }

  .video-stat-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }

  .video-stat-item:last-child {
    border-bottom: none; /* Remove border for last item */
  }

  .video-name {
    font-weight: bold; /* Emphasis on video name */
  }

  .video-clicks {
    color: #3498db; /* Blue for clicks count */
  }
</style>
