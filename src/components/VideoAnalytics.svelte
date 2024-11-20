<!-- VideoAnalytics.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '../lib/firebase';
  import { collection, getDocs } from 'firebase/firestore';

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
  let maxClicks = 0;
  let totalClicks = 0;

  onMount(async () => {
    await fetchVideos();
    await fetchVideoClickStats();
    loading = false;
  });

  async function fetchVideos() {
    try {
      const querySnapshot = await getDocs(collection(db, "videos"));
      videos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Video));
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  }

  async function fetchVideoClickStats() {
    try {
      const querySnapshot = await getDocs(collection(db, "videoStats"));
      videoStats = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as VideoStats));

      // Calculate maxClicks and totalClicks
      maxClicks = Math.max(...videoStats.map(stat => stat.clickCount));
      totalClicks = videoStats.reduce((sum, stat) => sum + stat.clickCount, 0);
    } catch (error) {
      console.error("Error fetching video stats:", error);
    }
  }

  function getProgressWidth(clicks: number): string {
    return `${(clicks / maxClicks) * 100}%`;
  }

  function getPercentage(clicks: number): string {
    return `${((clicks / totalClicks) * 100).toFixed(1)}%`;
  }

  function formatDate(timestamp: any): string {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
</script>

<style lang="postcss">
  .analytics-container {
    @apply w-full max-w-4xl mx-auto p-4;
  }

  .video-stats-grid {
    @apply grid gap-4;
  }

  .video-card {
    @apply bg-black/20 backdrop-blur-md rounded-xl overflow-hidden
           border border-white/10 shadow-xl transition-all duration-300;
  }

  .video-card:hover {
    @apply bg-black/30 transform scale-[1.01] shadow-2xl;
  }

  .video-header {
    @apply flex items-center gap-4 p-4;
  }

  .thumbnail {
    @apply w-24 h-16 rounded-lg object-cover;
  }

  .video-info {
    @apply flex-1;
  }

  .video-title {
    @apply text-white font-medium text-lg mb-1;
  }

  .video-description {
    @apply text-white/70 text-sm line-clamp-2;
  }

  .stats-section {
    @apply p-4 pt-0;
  }

  .progress-container {
    @apply relative h-8 bg-black/20 rounded-lg overflow-hidden;
  }

  .progress-bar {
    @apply absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500/70 to-purple-500/70
           transition-all duration-500 ease-out;
  }

  .stats-row {
    @apply flex justify-between items-center mt-2 text-sm text-white/80;
  }

  .click-count {
    @apply font-medium text-white;
  }

  .percentage {
    @apply text-white/90;
  }

  .loading-container {
    @apply w-full flex items-center justify-center p-8;
  }

  .loading {
    @apply text-white/80 text-lg font-medium flex items-center gap-2;
  }

  .loading::after {
    content: "";
    @apply w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin;
  }

  .total-stats {
    @apply bg-black/30 backdrop-blur-md rounded-xl p-4 mb-4
           border border-white/10 shadow-xl;
  }

  .total-title {
    @apply text-white/90 text-xl font-medium mb-2;
  }

  .total-info {
    @apply text-white/70 text-sm;
  }
</style>

<div class="analytics-container">
  {#if loading}
    <div class="loading-container">
      <p class="loading">Loading video analytics...</p>
    </div>
  {:else}
    <div class="total-stats">
      <h2 class="total-title">Video Engagement Overview</h2>
      <p class="total-info">
        Total Interactions: <strong>{totalClicks}</strong> clicks across {videoStats.length} videos
      </p>
    </div>

    <div class="video-stats-grid">
      {#each videoStats as stat (stat.id)}
        {@const video = videos.find(v => v.id === stat.id)}
        {#if video}
          <div class="video-card">
            <div class="video-header">
              <img 
                src={video.thumbnail} 
                alt={video.name}
                class="thumbnail"
              />
              <div class="video-info">
                <h3 class="video-title">{video.name}</h3>
                <p class="video-description">{video.description}</p>
              </div>
            </div>
            
            <div class="stats-section">
              <div class="progress-container">
                <div 
                  class="progress-bar" 
                  style="width: {getProgressWidth(stat.clickCount)}"
                ></div>
              </div>
              <div class="stats-row">
                <span class="click-count">{stat.clickCount} clicks</span>
                <span class="percentage">{getPercentage(stat.clickCount)} of total engagement</span>
              </div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>
