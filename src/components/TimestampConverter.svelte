<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import { db, Timestamp } from './firebase.js'; // Adjust this path as necessary
    import { collection, getDocs } from 'firebase/firestore';
  
    let myChart: Chart | null = null;
    let canvas: HTMLCanvasElement;
    let labels: string[] = []; // Labels for the X-axis
    let datasets: { label: string, data: number[] }[] = []; // Dataset for each category
    let timeFrame: 'day' | 'week' | 'month' | 'year' = 'week'; // Default time frame
    let logMessages: string[] = []; // Log messages for debugging
  
    onMount(async () => {
      try {
        await fetchClickData(); 
      } catch (error) {
        console.error('Error fetching data:', error);
        return;
      }
      
      createChart();
    });
  
    function log(message: string) {
      const timestamp = new Date().toLocaleTimeString();
      logMessages.push(`[${timestamp}] ${message}`); // Log messages
    }
  
    async function fetchClickData() {
      try {
        const collectionsToFetch = ['header', 'contact', 'logoCenter', 'logoLeft', 'users', 'videos'];
        const clickMap: Map<string, Map<string, number[]>> = new Map(); // Map to store arrays of clicks
  
        for (const collectionName of collectionsToFetch) {
          const clicksRef = collection(db, collectionName);
          const querySnapshot = await getDocs(clicksRef);
  
          querySnapshot.forEach(doc => {
            const data = doc.data();
  
            // Aggregate clicks for header and related collections
            if (['header', 'contact', 'logoCenter', 'logoLeft'].includes(collectionName) && data.clicks) {
              data.clicks.forEach((click: { timestamp: Timestamp }) => {
                const date = new Date(click.timestamp.toMillis());
                const key = getTimeFrameKey(date);
                aggregateClicks(clickMap, key, collectionName);
              });
            }
  
            // Aggregate user clicks
            if (collectionName === 'users') {
              const userClickCount = data.clickCount || 0;
              const lastClickedDate = data.lastClicked ? new Date(data.lastClicked.toMillis()) : null;
              if (lastClickedDate) {
                const key = getTimeFrameKey(lastClickedDate);
                aggregateClicks(clickMap, key, 'UserClicks', userClickCount);
              }
            }
  
            // Aggregate video clicks
            if (collectionName === 'videos' && data.clicks) {
              data.clicks.forEach((click: { timestamp: Timestamp }) => {
                const date = new Date(click.timestamp.toMillis());
                const key = getTimeFrameKey(date);
                aggregateClicks(clickMap, key, 'VideoClicks');
              });
            }
          });
        }
  
        prepareChartData(clickMap);
      } catch (error) {
        log('Error fetching data:',);
      }
    }
  
    function aggregateClicks(clickMap: Map<string, Map<string, number[]>>, key: string, category: string, increment: number = 1) {
      if (!clickMap.has(key)) {
        clickMap.set(key, new Map());
      }
      const collectionMap = clickMap.get(key)!;
      if (!collectionMap.has(category)) {
        collectionMap.set(category, []);
      }
      const counts = collectionMap.get(category)!;
      counts.push(increment); // Store each click as an individual entry
    }
  
    function prepareChartData(clickMap: Map<string, Map<string, number[]>>) {
      labels = []; // Clear existing labels
      datasets = []; // Clear existing datasets
  
      // Prepare labels based on time frame
      const keys = Array.from(clickMap.keys()).sort(); // Sort the keys to maintain order
      labels = keys;
  
      // Create datasets for each category
      const categories = ['header', 'contact', 'logoCenter', 'logoLeft', 'UserClicks', 'VideoClicks'];
      categories.forEach(category => {
        const dataset = {
          label: category,
          data: keys.map(key => {
            const counts = clickMap.get(key)?.get(category) || [];
            return counts.length; // Return count of clicks for that period
          }),
        };
        datasets.push(dataset);
      });
  
      myChart.data.labels = labels; // Update the labels
      myChart.data.datasets = datasets; // Update the datasets
  
      createChart(); // Recreate the chart with new data
    }
  
    function getTimeFrameKey(date: Date): string {
      switch (timeFrame) {
        case 'day':
          return date.toISOString().split('T')[0]; // YYYY-MM-DD
        case 'week':
          const firstDayOfWeek = new Date(date);
          firstDayOfWeek.setDate(date.getDate() - date.getDay());
          return `${firstDayOfWeek.toISOString().split('T')[0]}`; // Use first day of the week
        case 'month':
          return `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-MM
        case 'year':
          return date.getFullYear().toString(); // YYYY
        default:
          return '';
      }
    }
  
    function createChart() {
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          log('Failed to get canvas context');
          return;
        }
  
        if (myChart) {
          myChart.destroy(); // Destroy previous chart instance
        }
  
        myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels.length ? labels : ['No Data Available'],
            datasets: datasets.length ? datasets : [{ label: 'No Data', data: [0] }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: { display: true, text: `Time (${timeFrame})` },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: timeFrame === 'year' ? 12 : (timeFrame === 'month' ? 30 : (timeFrame === 'week' ? 7 : 7)),
                }
              },
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Click Count' },
              }
            },
            plugins: {
              legend: { display: true },
              title: { display: true, text: 'Click Counts Over Time' },
              tooltip: { enabled: true },
            }
          }
        });
        log('Chart created successfully.');
      } catch (error) {
        log('Error creating chart:', );
      }
    }
  
    function setTimeFrame(selectedTimeFrame: 'day' | 'week' | 'month' | 'year') {
      timeFrame = selectedTimeFrame; 
      fetchClickData().then(createChart); // Re-fetch data and recreate the chart
    }
  
    // Clear the selected time frame
    function clearTimeFrame() {
      timeFrame = 'day'; 
      fetchClickData().then(createChart);
    }
  </script>
  
  <style>
    .chart-container {
      width: 100%; /* Ensure it fills the container */
      height: 100%; /* Ensure it fills the container */
      background-color: rgba(255, 255, 255, 0.884);
      border-radius: 10px;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    
    canvas {
      width: 100% !important; /* Ensure canvas takes full width */
      height: 100% !important; /* Ensure canvas takes full height */
    }
  
    .controls {
      color: black;
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 10px;
    }
  </style>
  

  
  
  <div class="controls">
    <select on:change="{(e) => setTimeFrame(e.target.value)}">
      <option value="day">Last 7 Days</option>
      <option value="week">Last Week</option>
      <option value="month">Last Month</option>
      <option value="year">Last Year</option>
    </select>
    <button on:click={clearTimeFrame}>Clear Time Frame</button>
  </div>
  
  <div class="chart-container">
    <canvas bind:this={canvas}></canvas> <!-- Bind the canvas for Chart.js -->
    <div class="log">
      {#each logMessages as message}
        <div>{message}</div>
      {/each}
    </div>
  </div>