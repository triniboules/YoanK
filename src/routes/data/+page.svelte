<script lang="ts">
    import { db, doc, getDoc } from '../../components/firebase';
    import VideoManager from '../../components/VideoManager.svelte';

    import GlobalUser from '../../components/Globaluser.svelte';
    import PolarAreaChart from '../../components/PolarAreaChart.svelte';
    import SiteClickStats from '../../components/SiteClickStats.svelte';
    import Background from '../../components/Background2.svelte';

    let activeComponent: string | null = null;
    let showWelcome = true;
    let userAuthenticated = false; 
    let showLoginError = false; // Display login error if password is wrong
    let usernameInput = ''; // Store the username the user types
    let passwordInput = ''; // Store the password the user types

    // Fetch the password from Firestore and verify it
    const verifyPassword = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', 'Triniboules')); // Get the user document
            if (userDoc.exists()) {
                const storedPassword = userDoc.data()?.password; // Get the password from user document
                if (passwordInput === storedPassword) {
                    userAuthenticated = true;
                    showLoginError = false; // Hide error if password is correct
                    showWelcome = false; // Hide the welcome message after successful login
                } else {
                    showLoginError = true; // Show error if password is wrong
                }
            } else {
                showLoginError = true; // Show error if the user doesn't exist
            }
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
            showLoginError = true; // Handle fetch error
        }
    };

    // Handle the form submission
    const handleSubmit = () => {
        verifyPassword(); // Verify the password when the user submits the form
    };

    // Allow users to show the selected component only after authentication
    const showComponent = (component: string) => {
        if (userAuthenticated) {
            activeComponent = component;
        } else {
            showLoginError = true; // Notify the user they need to log in
        }
    };
</script>
<Background />
<style>
    /* Local Styles */
    :root {
        --primary-color: #007BFF; 
        --success-color: #28a745; 
        --error-color: #dc3545; 
        --text-color: #333333; 
        --overlay-background: rgba(255, 255, 255, 0); /* Transparent overlay for better visibility */
    }

    .background {
        min-height: 100vh;
        padding: 20px; 
        margin-top: 70px; /* Leave space for the header */
        display: flex;
        flex-direction: column; 
        align-items: center; /* Center align items */
        position: relative; /* Position relative to place other elements */
        background-color: var(--overlay-background); /* Use the overlay background */
    }

    .glass-container {
        backdrop-filter: blur(10px); 
        border-radius: 12px; 
        width: calc(66.67vh * 0.9); /* Maintain proportion */
        margin-bottom: 20px; 
        padding: 30px; 
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        position: relative; /* Relative to overlap background */
        z-index: 1; /* Ensure it appears above the background */
        background-color: rgba(255, 255, 255, 0.911); /* Semi-transparent background for glass effect */
    }

    .header {
        font-size: 2rem; 
        margin-bottom: 20px;
        text-align: justify; 
        color: var(--text-color);
    }

    .error-message {
        color: var(--error-color); 
    }

    input {
        width: 100%; 
        padding: 10px; 
        margin: 5px 0; 
        border: 1px solid #ccc; 
        border-radius: 5px; 
    }

    .button-grid {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly; 
        align-items: center;
        width: 100%;
        height: 70px; 
        position: fixed; 
        top: 0; 
        left: 0; 
        gap: 10px;
        background: rgba(255, 255, 255, 0); 
       
        border-bottom: 1px solid #ccc; 
        z-index: 1000; 
    }

    .button {
        background: linear-gradient(135deg, #007BFF, #0056b3); 
        border: none;
        border-radius: 10px; 
        padding: 12px 15px; 
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease; 
        font-size: 16px; 
        color: white; 
        font-weight: bold;
        text-transform: uppercase; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
        position: relative;
        overflow: hidden;
    }

    .button:hover {
        background: linear-gradient(135deg, #0056b3, #003f88); 
        transform: translateY(-2px); 
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); 
    }
</style>


<div class="button-grid glass-container">
    {#if userAuthenticated}
        <button class="button" on:click={() => showComponent('VideoManager')}>Video Manager</button>
        <button class="button" on:click={() => showComponent('GlobalUser')}>Global User</button>
        <button class="button" on:click={() => showComponent('PolarAreaChart')}>Polar Area Chart</button>
        <button class="button" on:click={() => showComponent('SiteClickStats')}>Site Click Stats</button>
    {/if}
</div>


<div class="background">
    {#if showLoginError || !userAuthenticated}
        <div class="glass-container">
            {#if showLoginError}
                <h2 class="error-message">Access Denied. Please log in to access components.</h2>
            {/if}
            {#if !userAuthenticated}
                <h2 class="header">Enter Your Credentials</h2>
                <input type="text" bind:value={usernameInput} placeholder="Username" />
                <input type="password" bind:value={passwordInput} placeholder="Password" />
                <button class="button" on:click={handleSubmit}>Submit</button>
            {/if}
        </div>
    {/if}

    <!-- Dynamic Component Rendering -->
    {#if userAuthenticated && activeComponent}
        {#if activeComponent === 'VideoManager'}
            <VideoManager />
        {:else if activeComponent === 'GlobalUser'}
            <GlobalUser />
        {:else if activeComponent === 'PolarAreaChart'}
            <PolarAreaChart />
        {:else if activeComponent === 'SiteClickStats'}
            <SiteClickStats />
        {/if}
    {/if}
</div>
