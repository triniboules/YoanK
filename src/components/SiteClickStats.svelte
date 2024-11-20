<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { db } from '$lib/firebase';
  import { collection, getDocs } from 'firebase/firestore';
  import { fetchHeaderClicks } from './firebase';

  // Define props
  export let containerClass = '';
  export let loadingMessage = 'Loading statistics...';
  export let errorMessageClass = '';

  // Initialize state variables
  let uniqueVisitors = 0;
  let totalVisits = 0;
  let videoClicks = 0;
  let contactClicks = 0;
  let logoCenterClicks = 0;
  let logoLeftClicks = 0;
  let loading = true;
  let errorMessage: string | null = null;
  let mounted = false;

  // Define the Video type
  type Video = {
    id: string;
    name: string;
    clickCount: number;
  };

  let videos: Video[] = [];

  onMount(async () => {
    mounted = true;
    if (browser) {
      await loadStatistics();
    }
  });

  // Fetch all necessary statistics from Firestore
  async function loadStatistics() {
    if (!browser || !mounted) return;

    try {
      loading = true;
      errorMessage = null;

      // Fetch all data in parallel
      const [userSnap, videoClicksSnap, headerClicks] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'videos')),
        fetchHeaderClicks()
      ]);

      // Process users and visits
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

      // Process video clicks
      videos = videoClicksSnap.docs.map(doc => {
        const data = doc.data();
        const clicks = data.clicks?.length || 0;
        videoClicks += clicks;
        return {
          id: doc.id,
          name: data.name || 'Unnamed Video',
          clickCount: clicks
        };
      });

      // Set header clicks from the fetched data
      contactClicks = headerClicks.contactClicks;
      logoCenterClicks = headerClicks.logoCenterClicks;
      logoLeftClicks = headerClicks.logoLeftClicks;

    } catch (error) {
      console.error('Error loading statistics:', error);
      errorMessage = 'Failed to load statistics. Please try again later.';
    } finally {
      loading = false;
    }
  }
</script>

<div class={containerClass || ''}>
  {#if loading}
    <div class="loading-container">
      <p class="loading">{loadingMessage}</p>
    </div>
  {:else if errorMessage}
    <div class="error {errorMessageClass || ''}">
      {errorMessage}
    </div>
  {:else}
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-icon">👥</span>
        <span class="stat-value">{uniqueVisitors}</span>
        <span class="stat-label">Unique Visitors</span>
      </div>
      
      <div class="stat-card">
        <span class="stat-icon">🔄</span>
        <span class="stat-value">{totalVisits}</span>
        <span class="stat-label">Total Visits</span>
      </div>
      
      <div class="stat-card">
        <span class="stat-icon">📹</span>
        <span class="stat-value">{videoClicks}</span>
        <span class="stat-label">Video Interactions</span>
      </div>
      
      <div class="stat-card">
        <span class="stat-icon">📧</span>
        <span class="stat-value">{contactClicks}</span>
        <span class="stat-label">Contact Clicks</span>
      </div>
      
      <div class="stat-card">
        <span class="stat-icon">🎯</span>
        <span class="stat-value">{logoCenterClicks}</span>
        <span class="stat-label">Center Logo Clicks</span>
      </div>
      
      <div class="stat-card">
        <span class="stat-icon">🖼️</span>
        <span class="stat-value">{logoLeftClicks}</span>
        <span class="stat-label">Left Logo Clicks</span>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .stats-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 w-full max-w-6xl mx-auto;
  }

  .stat-card {
    @apply bg-black/20 backdrop-blur-md rounded-xl p-6 
           border border-white/10 shadow-xl transition-all duration-300
           flex flex-col items-center justify-center text-center;
  }

  .stat-card:hover {
    @apply bg-black/30 transform scale-[1.02] shadow-2xl;
  }

  .stat-value {
    @apply text-3xl font-bold text-white mb-2;
  }

  .stat-label {
    @apply text-white/70 text-sm uppercase tracking-wider;
  }

  .stat-icon {
    @apply text-2xl mb-3 text-white/90;
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

  .error {
    @apply text-red-400 bg-red-500/10 px-4 py-2 rounded-lg backdrop-blur-sm
           border border-red-500/20 shadow-lg text-center w-full max-w-md mx-auto;
  }
</style>
