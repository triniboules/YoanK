<script lang="ts">
    import { db, doc, getDoc } from '../../components/firebase'; // Adjust the path based on your structure
    import VideoManager from '../../components/VideoManager.svelte';
    import GlobalUser from '../../components/AnalyticsDashboard.svelte';
    import PolarAreaChart from '../../components/PolarAreaChart.svelte';
    import SiteClickStats from '../../components/SiteClickStats.svelte';

    let activeComponent: string | null = null;
    let showWelcome = true;
    let userAuthenticated = false; // Track if the user is authenticated
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

    const showComponent = (component: string) => {
        if (userAuthenticated) {
            activeComponent = component;
            showWelcome = false;
        } else {
            showLoginError = true;
        }
    };

    // Handle the form submission
    const handleSubmit = () => {
        verifyPassword(); // Verify the password when the user submits the form
    };
</script>

<style>
    /* Color Variables */
    :root {
        --primary-color: #007BFF; 
        --success-color: #28a745; 
        --error-color: #dc3545; 
        --background-color: #f0f0f0; /* Lighter background */
        --text-color: #333333; 
        --highlight-color: #ffcc00; 
        --button-background: #007BFF; 
        --button-hover-background: #0056b3; 
        --button-text-color: #ffffff; 
    }



    .background {
        background-color: var(--background-color);
        min-height: 100vh;
        display: flex;
        flex-direction: column; /* Stack elements vertically */
        justify-content: flex-start; /* Align items to the start */
        align-items: center; 
        padding: 20px; 
    }

    .glass-container {
        backdrop-filter: blur(10px); 
        border-radius: 12px; 
        width: 80vw; 
        margin-bottom: 20px; 
        padding: 30px; 
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
    }

    .header {
        display: flex; 
        flex-direction: row; 
        gap: 20px; 
        width: 100%; 
        justify-content: center; 
        margin-bottom: 20px; /* Space below the header */
    }

    .button {
    background: linear-gradient(135deg, #007BFF, #0056b3); /* Gradient background for depth */
    border: none;
    border-radius: 50px; /* Rounded edges for a modern look */
    padding: 12px 30px; /* Adjusted padding for balance */
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease; /* Smooth transitions */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px; /* Slightly smaller font size */
    color: white; /* White text for contrast */
    font-weight: bold;
    text-transform: uppercase; /* Uppercase for emphasis */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Smaller, softer shadow */
    position: relative;
    overflow: hidden;
}

.button:hover {
    background: linear-gradient(135deg, #0056b3, #003f88); /* Darker gradient on hover */
    transform: translateY(-2px); /* Slight lift effect */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Enhanced shadow on hover */
}

.button:active {
    transform: translateY(0); /* Reset on active */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Reduced shadow on click */
}

.button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background: rgba(255, 255, 255, 0.15); /* Light overlay */
    transition: all 0.75s ease;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    z-index: 0; /* Behind button text */
}

.button:hover::before {
    transform: translate(-50%, -50%) scale(1); /* Scale effect on hover */
}

.button span {
    position: relative;
    z-index: 1; /* Bring text above overlay */
}





    .component-container {

        display: flex;
    }

    .welcome-screen {
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        align-items: center; 
        height: 80vh; 
        width: 100%; 
        max-width: 600px; 
        margin: 0 auto; 
    }

    .button-grid {
        display: grid; 
        grid-template-columns: repeat(2, 1fr); 
        gap: 20px; 
        width: 100%; 
        max-width: 90vw; 
        margin: 0 auto; 
        justify-items: center; 
    }

    h2 {
        color: var(--text-color); 
        font-size: 2rem; 
        margin-bottom: 24px; 
        text-align: center; 
    }

    input {
        width: 100%; 
        padding: 10px; 
        margin: 10px 0; 
        border: 1px solid #ccc; 
        border-radius: 5px; 
    }

    .error-message {
        color: var(--error-color); 
        margin-top: 10px; 
    }
</style>

<div class="background">
    <!-- Access Denied message -->
    {#if showLoginError}
        <div class="glass-container">
            <h2 class="error-message">Access Denied. Incorrect username or password.</h2>
        </div>
    {/if}

    <!-- Login form -->
    {#if !userAuthenticated}
        <div class="glass-container">
            <h2>Enter Your Credentials</h2>
            <input
                type="text"
                bind:value={usernameInput}
                placeholder="Enter username"
            />
            <input
                type="password"
                bind:value={passwordInput}
                placeholder="Enter password"
            />
            <button class="button" on:click={handleSubmit}>Submit</button>
        </div>
    {/if}

    <!-- Welcome Screen -->
    {#if showWelcome && userAuthenticated}
        <div class="welcome-screen">
            <h2>Welcome! Choose a Component</h2>
            <div class="button-grid glass-container">
                <button class="button" on:click={() => showComponent('VideoManager')}>Video Manager</button>
                <button class="button" on:click={() => showComponent('GlobalUser')}>Global User</button>
                <button class="button" on:click={() => showComponent('PolarAreaChart')}>Analytics Dashboard</button>
                <button class="button" on:click={() => showComponent('SiteClickStats')}>Site Click Stats</button>
            </div>
        </div>
    {/if}

    <!-- Header with buttons when a component is active -->
    {#if !showWelcome && userAuthenticated}
        <div class="header">
            <button class="button" on:click={() => showComponent('VideoManager')}>Video Manager</button>
            <button class="button" on:click={() => showComponent('GlobalUser')}>Global User</button>
            <button class="button" on:click={() => showComponent('PolarAreaChart')}>Analytics Dashboard</button>
            <button class="button" on:click={() => showComponent('SiteClickStats')}>Site Click Stats</button>
        </div>
    {/if}

    <!-- Active Component Display -->
    <div class="component-container">
        {#if activeComponent === 'VideoManager'}
            <VideoManager />
        {:else if activeComponent === 'GlobalUser'}
            <GlobalUser />
        {:else if activeComponent === 'PolarAreaChart'}
            <PolarAreaChart />
        {:else if activeComponent === 'SiteClickStats'}
            <SiteClickStats />
        {/if}
    </div>
</div>
