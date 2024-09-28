<script lang="ts">
    // Import necessary components
    import PolarAreaChart from './PolarAreaChart.svelte';
    import SiteClickStats from './SiteClickStats.svelte';
    import Visitchart from './Visitchart.svelte';
    import Globaluser from './Globaluser.svelte';

    // State for the currently selected tab
    let selectedTab = 1;

    // Function to change the selected tab
    function selectTab(tabNumber: number) {
        selectedTab = tabNumber;
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Russo+One&display=swap');

    /* Container styles */
    .container {
        display: flex;
        position: relative;
        font-family: 'Russo One', sans-serif;
        background-image: url('/image/titre.webp');
        border: 2px solid #8b7b5d;
        border-radius: 10px;
        width: 40vw;
        height: 80vh;
        margin: 0 auto;
        box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
        padding: 20px;
    }

    /* Header styles */
    .header {
        margin-bottom: 20px;
        text-align: center;
        color: #000;
        font-family: 'Press Start 2P', sans-serif;
    }

    /* Stats content area */
    .stats {
        flex-grow: 1;
        padding: 20px;
        background: rgba(117, 76, 30, 0.1);
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        margin-right: 20px;
        color: #000;
        overflow-y: auto;
    }

    /* Tab styles */
    .intercalaires {
        position: absolute;
        right: -40px;
        top: 0;
        display: flex;
        flex-direction: column;
        height: 100%;
        align-items: center;
    }

    .intercalaires button {
        margin: 10px 0;
        border-radius: 20px;
        border: 2px solid #8b7b5d;
        background-color: #472e00;
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        width: 60px;
        height: 150px;
        writing-mode: vertical-rl;
        text-align: center;
        transition: background-color 0.3s;
        font-family: 'Press Start 2P', sans-serif;
    }

    .intercalaires button.active {
        background-color: #a37b4c;
        color: black;
    }

    .intercalaires button:hover {
        background-color: #6e5c4e;
    }
</style>

<div class="container">
    <!-- Main stats section -->
    <div class="stats">
        <div class="header">
            <h2>Mission Briefing</h2>
        </div>

        <!-- Dynamic content based on selected tab -->
        <div class="content">
            {#if selectedTab === 1}
                <PolarAreaChart />
            {/if}
            {#if selectedTab === 2}
                <SiteClickStats />
            {/if}
            {#if selectedTab === 3}
                <Visitchart />
            {/if}
            {#if selectedTab === 4}
                <Globaluser />
            {/if}
        </div>
    </div>

    <!-- Tabs for switching content -->
    <div class="intercalaires">
        <button on:click={() => selectTab(1)} class:active={selectedTab === 1}>Chart</button>
        <button on:click={() => selectTab(2)} class:active={selectedTab === 2}>Site Stats</button>
        <button on:click={() => selectTab(3)} class:active={selectedTab === 3}>Visit Chart</button>
        <button on:click={() => selectTab(4)} class:active={selectedTab === 4}>Global Users</button>
    </div>
</div>
