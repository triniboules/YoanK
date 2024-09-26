<script lang="ts">
  import VideoClickStats from '../../components/VideoClickStats.svelte';
  import SiteClickStats from '../../components/SiteClickStats.svelte';
  import VideoClickStats2 from '../../components/VideoClickStats2.svelte';
  import PolarAreaChart from '../../components/PolarAreaChart.svelte';
  import Visitchart from '../../components/Visitchart.svelte';
  import Globaluser from '../../components/Globaluser.svelte';
</script>

<main class="first-column">
  <video class="background-video" autoplay loop muted>
    <source src="https://www.gordonmac.com/wp-content/uploads/storm-1.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <div class="content">

    <div class="grid">
      <!-- Three columns layout -->
      <div class="first-column">
        <SiteClickStats />
      </div>
      <div class="first-column">
        <PolarAreaChart />
      </div>
      
      <!-- Two components stacked in the third column -->
      <div class="stack-container">
        <div class="glass-container">
          <Visitchart />
        </div>
        <div class="glass-container">
          <Globaluser />
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  /* Main container */


  /* Background video styles */
  .background-video {
    position: fixed; /* Fixed position to cover the entire viewport */
    top: 0;
    left: 0;
    width: 100vw; /* Full width */
    height: 100vh; /* Full height */
    object-fit: cover; /* Cover to maintain aspect ratio */
    z-index: -1; /* Send the video behind other content */
    flex-basis: auto; /* Permet la colonne de s'adapter au contenu */
  flex-grow: 0; /* Empêche la colonne de grandir plus que nécessaire */
  flex-shrink: 1; /* Permet la colonne de diminuer si nécessaire */
  }

  /* Content wrapper */
  .content {
    position: flex; /* Keep content above video */
    z-index: 1; /* Ensure content is above the video */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    height: 100%; /* Full height to center content */
    max-width: 100vw; /* Max width to 80% of viewport */
    margin: 0 auto; /* Center horizontally */
    background: rgba(255, 255, 255, 0); /* Slight background for readability */
    box-sizing: border-box; /* Ensure padding doesn't affect total width */
    flex-basis: auto; /* Permet la colonne de s'adapter au contenu */
  flex-grow: 0; /* Empêche la colonne de grandir plus que nécessaire */
  flex-shrink: 1; /* Permet la colonne de diminuer si nécessaire */
  }

  /* Title styles */


  /* Grid layout for 3 columns */
  .grid {
  display: grid;
  grid-template-columns: auto;
  gap: 20px;
  width: 100%;
  height: auto;
  max-width: 100%;
  flex-basis: auto; /* Permet la colonne de s'adapter au contenu */
  flex-grow: 0; /* Empêche la colonne de grandir plus que nécessaire */
  flex-shrink: 1; /* Permet la colonne de diminuer si nécessaire */
}

.first-column {
  flex-basis: auto; /* Permet la colonne de s'adapter au contenu */
  flex-grow: 0; /* Empêche la colonne de grandir plus que nécessaire */
  flex-shrink: 1; /* Permet la colonne de diminuer si nécessaire */
  
}

  /* Glass container styles */
  .glass-container {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

  
    flex-basis: auto; /* Permet la colonne de s'adapter au contenu */
  flex-grow: 0; /* Empêche la colonne de grandir plus que nécessaire */
  flex-shrink: 1; /* Permet la colonne de diminuer si nécessaire */
  }

  /* Stack two containers in the third column */
  .stack-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
      flex-basis: auto; /* Permet la colonne de s'adapter au contenu */
  flex-grow: 0; /* Empêche la colonne de grandir plus que nécessaire */
  flex-shrink: 1; /* Permet la colonne de diminuer si nécessaire */
  }

  /* Responsive adjustments */
  @media (max-width: 900px) {
    /* On smaller screens, switch to single-column layout */
    .grid {
      grid-template-columns: 1fr; /* Single column */
    }

    .stack-container {
      flex-direction: column; /* Stacks in a single column on smaller screens */
    }
  }

  /* Hover effect */
  .glass-container:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
  }

  /* Body styles */
  :global(body) {
    background-color: transparent; /* Ensure the body background is transparent */
    color: #33333300;
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
  }

  /* Ensure the global background color doesn't interfere */
  :global(:root) {
    --color-bg-0: transparent; /* Override global background color */
    --color-bg-1: transparent; /* Override global background color */
    --color-bg-2: transparent; /* Override global background color */
  }
</style>
