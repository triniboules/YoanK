<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from './firebase'; // Adjust the path to your firebase.js file
  import { collection, getDocs } from 'firebase/firestore';
  import { PolarArea } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
  } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, ArcElement, RadialLinearScale);

  interface Video {
    id: string; // ID from Firebase
    name: string;
    youtubeId: string;
    thumbnail: string;
    description: string;
    showLogo: boolean;
  }

  interface ClickStats {
    userId: string;
    timestamp: Date;
  }

  interface VideoStats {
    id: string; // ID from Firebase
    clickCount: number;
    clicks: ClickStats[];
    description: string; // Description from Firebase
    thumbnail: string;   // Thumbnail from Firebase
  }

  let videos: Video[] = [];
  let videoStats: VideoStats[] = [];
  let loading: boolean = true;

  onMount(async () => {
    await fetchVideos();
    await fetchVideoClickStats();
    loading = false; // Set loading to false after fetching both datasets
  });

  async function fetchVideos() {
    try {
      const querySnapshot = await getDocs(collection(db, "videos"));
      videos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || "", // Fetching the name
        youtubeId: doc.data().youtubeId || "",
        thumbnail: doc.data().thumbnail || "",
        description: doc.data().description || "",
        showLogo: doc.data().showLogo || false,
      }));
    } catch (error) {
      console.error("Error fetching videos: ", error);
    }
  }

  async function fetchVideoClickStats() {
    try {
      const querySnapshot = await getDocs(collection(db, "videos"));
      videoStats = querySnapshot.docs.map(doc => ({
        id: doc.id,
        clickCount: doc.data().clickCount || 0,
        clicks: doc.data().clicks || [],
        description: doc.data().description || "",
        thumbnail: doc.data().thumbnail || "",
      }));
    } catch (error) {
      console.error("Error fetching video click stats: ", error);
    }
  }

  // Chart data preparation
  $: chartData = {
    labels: videoStats.map(video => videos.find(v => v.id === video.id)?.name || "Unknown Video"),
    datasets: [
      {
        label: 'Click Counts',
        data: videoStats.map(video => video.clickCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
</script>

<main class="stats-container">
  {#if loading}
    <div class="loading-container">
      <div class="glass-container p-4 rounded-lg shadow-lg mb-4">
        <p class="loading">Loading video stats...</p>
        <div class="loader"></div> <!-- Adding a loader -->
      </div>
    </div>
  {:else}
    <div class="flex flex-col md:flex-row justify-between items-center space-x-4 md:space-x-0">
      <div class="chart-container glass-container w-full md:w-2/3 p-4 rounded-lg shadow-lg mb-4">
        <PolarArea data={chartData} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const label = tooltipItem.label || '';
                  const value = tooltipItem.raw || 0;
                  return `${label}: ${value} clicks`;
                },
              },
            },
            legend: {
              display: true,
              position: 'top',
            },
          },
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart',
          },
        }} height={null} width={null} />
      </div>
      <div class="video-info-container glass-container w-full md:w-1/3 p-4 rounded-lg shadow-lg mb-4">
        
        <ul class="video-list">
          {#each videos as video (video.id)}
            <li class="video-item">
              <img src={video.thumbnail} alt={video.name} class="video-thumbnail" />
              <div class="video-details">
                <h3 class="video-name">{video.name}</h3>
                <p class="video-description">{video.description}</p>
                {#each videoStats as stats (stats.id)}
                  {#if stats.id === video.id}
                    <p class="click-count">Clicks: {stats.clickCount}</p> <!-- Displaying click count -->
                  {/if}
                {/each}
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
</main>

<style lang="css">
  .stats-container {
    max-width: 85vw;
    margin: auto;
    padding: 20px;
    backdrop-filter: blur(10px);
    background-color: #f9fafb34;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
    color: #333;
  }

  .glass-container {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.85);
    padding: 20px;
    border-radius: 8px;
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

  .chart-container,
  .video-info-container {
    margin: 20px;
    height: 75vh;
  }

  .video-info-container {

    overflow-y: auto;
  }


  .video-list {
    margin-left: auto;
    list-style-type: none;
    padding:20px;
  }

  .video-item {
    display: flex;
    align-items: center;
    background-color: #f3f4f6;
    padding: 10px;
    margin-left: auto;
    margin-bottom: 10px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .video-item:hover {
    background-color: #e5e7eb;
  }

  .video-thumbnail {
    width: 200px;
    height: auto;
    border-radius: 5px;
    margin-right: 10px;
  }

  .video-name {
    font-weight: 600;
    margin: 0;
  }

  .video-description {
    font-size: 0.9rem;
    color: #6b7280;
  }

  .click-count {
    font-size: 0.9rem;
    color: #ff4757; /* Change color for visibility */
    font-weight: bold;
  }
</style>
