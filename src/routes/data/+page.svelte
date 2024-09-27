<script lang="ts">
  import SiteClickStats from '../../components/SiteClickStats.svelte';
  import PolarAreaChart from '../../components/PolarAreaChart.svelte';
  import Visitchart from '../../components/Visitchart.svelte';
  import Globaluser from '../../components/Globaluser.svelte';
  import Matrix from '../../components/Matrix.svelte'; // Import Matrix component
</script>

<main class="main-container">
  <!-- Background Matrix Effect -->
  <div class="matrix-background">
    <Matrix /> <!-- Use Matrix component as background -->
  </div>

  <div class="content">
    <!-- Flex container for dynamic layout -->
    <div class="flex-container">
      <div class="glass-container">
        <PolarAreaChart />
      </div>
      <div class="glass-container">
        <SiteClickStats />
      </div>
      <div class="glass-container">
        <Visitchart />
      </div>
      <div class="glass-container">
        <Globaluser />
      </div>
    </div>
  </div>
</main>

<style>
  /* Main styles */
  .main-container {
    position: relative;
    height: 100vh; /* Full viewport height */
    overflow: hidden; /* Hide overflow */
  }

  /* Background Matrix Effect */
  .matrix-background {
    position: fixed; /* Fix the background to the viewport */
    top: 0;
    left: 0;
    width: 100vw; /* Full width */
    height: 100vh; /* Full height */
    z-index: 0; /* Set z-index to be behind content */
  }

  /* Content wrapper */
  .content {
    position: relative; /* Keep content above background */
    z-index: 1; /* Ensure content is above the background */
    padding: 3%;
    width: 80%; /* Full width */
    max-width: 90vw; /* Max width */
    margin: 0 auto; /* Center horizontally */
    background: rgba(255, 255, 255, 0); /* Slight background for readability */
    box-sizing: border-box; /* Ensure padding doesn't affect total width */
  }

  /* Flex container for dynamic layout */
  .flex-container {
    display: flex; /* Use Flexbox */
    flex-wrap: wrap; /* Allow wrapping of items */
    gap: 5px; /* Space between items */
    justify-content: auto; /* Align items to the start */
  }

  /* Styles for glass container */
  .glass-container {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding: 5px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    flex: 0 0 auto; /* Prevent automatic size growth */
    width: auto; /* Allow width to be determined by content */
    min-width: 200px; /* Optional: Minimum width for components */
  }

  /* Responsive adjustments */
  @media (max-width: 900px) {
    .glass-container {
      max-width: 100%; /* Full width on smaller screens */
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
    color: #333333;
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
  }
</style>
