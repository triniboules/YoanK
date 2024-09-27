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
    
    // Register Chart.js components
    ChartJS.register(Title, Tooltip, Legend, ArcElement, RadialLinearScale);
    
    interface Video {
      id: number;
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
      id: number;
      clickCount: number;
      clicks: ClickStats[];
    }
    
    let videos: Video[] = [
      { id: 1, name: 'Myrto & Derek', youtubeId: 'oojG3E82yzQ', thumbnail: '/image/1.webp', description: 'Myrto & Derek\nOpérateur Caméra', showLogo: true },
      { id: 2, name: 'Claire et Martin', youtubeId: 'I-h4WH3tVcc', thumbnail: '/image/2.webp', description: 'Claire et Martin\nOpérateur Caméra', showLogo: true },
      { id: 3, name: 'Nathalie & Christophe', youtubeId: 'gZJyI-PGTHI', thumbnail: '/image/3.webp', description: 'Nathalie & Christophe\nOpérateur Caméra', showLogo: true },
      { id: 4, name: 'Les Nuits du Réal', youtubeId: 'R2PnDV97Zrg', thumbnail: '/image/4.webp', description: 'Les Nuits du Réal\nOpérateur Caméra', showLogo: true },
      { id: 5, name: 'La Lucarne d\'Arianne', youtubeId: '3d6SlZscoeM', thumbnail: '/image/5.webp', description: 'La Lucarne d\'Arianne\nRéalisation\nPrise de son\nOpérateur Caméra', showLogo: true },
      { id: 6, name: 'Litographie - Marko Zoric', youtubeId: 'stdlTlbi_o0', thumbnail: '/image/6.webp', description: 'Litographie - Marko Zoric\nRéalisation\nMontage', showLogo: true },
      { id: 7, name: 'Unlocked - Sophie Jarmouni', youtubeId: 'YKA3anXENjQ', thumbnail: '/image/7.webp', description: 'Unlocked - Sophie Jarmouni\nAssistant Caméra\nFocus puller', showLogo: false },
      { id: 8, name: 'Rien qu\'ça - GOHU', youtubeId: 'DSNs7fQifyM', thumbnail: '/image/8.webp', description: 'Rien qu\'ça - GOHU\nRéalisation\nPrise de vue\nMontage', showLogo: true },
      { id: 9, name: 'Hold Up - Yautjaxx', youtubeId: 'lOygdbJni8A', thumbnail: '/image/9.webp', description: 'Hold Up - Yautjaxx\nOpérateur Caméra\nPrise de vue', showLogo: true },
    ];
    
    let videoStats: VideoStats[] = [];
    let loading: boolean = true;
    
    // Fetch video click statistics on component mount
    onMount(async () => {
      await fetchVideoClickStats();
    });
    
    async function fetchVideoClickStats() {
      try {
        const querySnapshot = await getDocs(collection(db, "videos")); // Adjust the collection name if necessary
        videoStats = querySnapshot.docs.map(doc => ({
          id: parseInt(doc.id.split('-')[1]), // Extract ID from document ID format "video-{id}"
          clickCount: doc.data().clickCount || 0,
          clicks: doc.data().clicks || []
        }));
        loading = false;
      } catch (error) {
        console.error("Error fetching video click stats: ", error);
        loading = false;
      }
    }
    
    // Prepare the data for the Polar Area chart
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
      <p class="loading">Loading video stats...</p>
    {:else}
      <div class="flex-container">
        <div class="chart-container">
       
          <PolarArea data={chartData} options={{
            responsive: true,
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
                display: false, // Hide the legend on the chart
              },
            },
            animation: {
              duration: 1000,
              easing: 'easeInOutQuart',
            },
          }} />
        </div>
        <div class="legend-container">
          <h3>Legend</h3>
          <ul class="click-list">
            {#each chartData.labels as label, index}
              <li class="click-item" style="color: {chartData.datasets[0].borderColor[index]}">
                <span class="video-name">{label}</span>: <span class="click-count">{chartData.datasets[0].data[index]} clicks</span>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    {/if}
  </main>
  
  <style>
    .stats-container {
      max-width: 1200px; /* Limit the maximum width */
      margin: auto; /* Center the container */
      padding: 20px; /* Padding around the container */
      background: #ffffff; /* Light background for the stats */
      border-radius: 8px; /* Rounded corners */
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
      margin-bottom: auto;
    }
  
    .flex-container {
      display: flex;
      flex-wrap: wrap; /* Allow items to wrap on smaller screens */
      justify-content: space-between; /* Space items evenly */
      align-items: flex-start; /* Align items to the top */
      gap: 20px; /* Space between chart and legend */
      margin-bottom: auto;
    }
  
    .chart-container {
      flex: 2 1 60%; /* Chart takes two columns, but shrinks to 60% of container */
    }
  
    .legend-container {
      flex: 1 1 30%; /* Legend takes one column, but shrinks to 30% of container */
      max-width: 300px; /* Max width for the legend */
      padding: 10px; /* Add padding to the legend */
      background: #ffffff31; /* White background for the legend */
      border: 1px solid #ddd; /* Light border for the legend */
      border-radius: 5px; /* Rounded corners for the legend */
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Subtle shadow for legend */
    }
  

    .loading {
      text-align: center; /* Center the loading message */
      font-size: 1.2rem; /* Loading message size */
      color: #666; /* Color for the loading message */
    }
  
    .click-list {
      list-style: none; /* Remove default list styling */
      padding: 0; /* Remove padding */
    }
  
    .click-item {
      padding: 5px 0; /* Padding around items */
      font-size: 1rem; /* Font size for items */
      display: flex; /* Flex for item layout */
      justify-content: space-between; /* Space between video name and click count */
      align-items: center; /* Align items */
    }
  
    .video-name {
      font-weight: bold; /* Make video name bold */
    }
  
    .click-count {
      color: #666; /* Color for the click count */
    }
  
    @media (max-width: 768px) {
      .flex-container {
        flex-direction: column; /* Stack items on smaller screens */
      }
  
      .chart-container, .legend-container {
        flex: 1 1 100%; /* Take full width on smaller screens */
      }
    }
  </style>
  