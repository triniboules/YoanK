<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
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
    id: string;
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
    id: string;
    clickCount: number;
    clicks: ClickStats[];
    description: string;
    thumbnail: string;
  }

  let videos: Video[] = [];
  let videoStats: VideoStats[] = [];
  let loading: boolean = true;

  onMount(async () => {
    await fetchVideoStats();
    loading = false;
  });

  async function fetchVideoStats() {
    try {
      const querySnapshot = await getDocs(collection(db, "videos"));
      const processedVideos = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          youtubeId: data.youtubeId || "",
          thumbnail: data.thumbnail || "",
          description: data.description || "",
          showLogo: data.showLogo || false,
          clickCount: data.clickCount || 0,
          clicks: data.clicks || []
        };
      });
      
      videos = processedVideos;
      videoStats = processedVideos.map(({ id, clickCount, clicks, description, thumbnail }) => ({
        id,
        clickCount,
        clicks,
        description,
        thumbnail
      }));
    } catch (error) {
      console.error("Error fetching video stats: ", error);
    }
  }

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
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
</script>

<style lang="postcss">
  .stats-container {
    @apply w-full h-full flex flex-col items-center justify-center p-4;
  }

  .chart-container {
    @apply w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-xl p-8 shadow-xl 
           border border-white/20 transition-all duration-300;
    height: 600px;
  }

  .chart-container:hover {
    @apply bg-white/100 transform scale-[1.01] shadow-2xl;
  }

  .loading-container {
    @apply w-full h-64 flex items-center justify-center;
  }

  .loading {
    @apply text-black/80 text-lg font-medium flex items-center gap-2;
  }

  .loading::after {
    content: "";
    @apply w-4 h-4 border-2 border-black/20 border-t-black/80 rounded-full animate-spin;
  }

  .chart-title {
    @apply text-black/90 text-xl font-medium mb-4 text-center;
  }
</style>

<main class="stats-container">
  {#if loading}
    <div class="chart-container">
      <div class="loading-container">
        <p class="loading">Loading video statistics</p>
      </div>
    </div>
  {:else}
    <div class="chart-container">
      <h2 class="chart-title">Video Engagement Distribution</h2>
      <PolarArea
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: 'rgba(0, 0, 0, 0.8)',
                padding: 20,
                font: {
                  size: 14
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              titleFont: {
                size: 14
              },
              bodyFont: {
                size: 13
              }
            }
          },
          scales: {
            r: {
              ticks: {
                color: 'rgba(0, 0, 0, 0.7)',
                backdropColor: 'transparent',
                font: {
                  size: 12
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              angleLines: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          }
        }}
      />
    </div>
  {/if}
</main>