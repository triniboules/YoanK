<script lang="ts">
    import { db, doc, getDoc } from '../../components/firebase';
    import VideoManager from '../../components/VideoManager.svelte';
    import GlobalUser from '../../components/Globaluser.svelte';
    import PolarAreaChart from '../../components/PolarAreaChart.svelte';
    import SiteClickStats from '../../components/SiteClickStats.svelte';
    import Background from '../../components/Background.svelte';

    let activeComponent: string | null = null;
    let showWelcome = true;
    let userAuthenticated = false; 
    let showLoginError = false; 
    let usernameInput = '';
    let passwordInput = '';

    const verifyPassword = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', 'Triniboules'));
            if (userDoc.exists()) {
                const storedPassword = userDoc.data()?.password;
                if (passwordInput === storedPassword) {
                    userAuthenticated = true;
                    showLoginError = false;
                    showWelcome = false;
                } else {
                    showLoginError = true;
                }
            } else {
                showLoginError = true;
            }
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
            showLoginError = true; 
        }
    };

    const handleSubmit = () => {
        verifyPassword();
    };

    const showComponent = (component: string) => {
        if (userAuthenticated) {
            activeComponent = component;
        } else {
            showLoginError = true; 
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
        --overlay-background: rgba(255, 255, 255, 0); 
    }

    .background {
        
        padding: 20px; 
        
        display: flex;
        flex-direction: column; 
        align-items: center; 
        position: relative; 
        background-color: var(--overlay-background); 
        overflow: hidden; /* Added to hide overflowing content */
    }

    .glass-container {
        backdrop-filter: blur(10px); 
        border-radius: 12px; 
     
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        position: relative; 
        z-index: 1; 
        background-color: rgba(255, 255, 255, 0.911); 
    }

    .header {
        font-size: 2rem; 
       
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
        width: 80%;
        height: 70px; 
        position: relative; 
        top: 0; 
        left: 10%; 
        gap: 10px;
        background: rgba(255, 255, 255, 0); 
        border-bottom: 1px solid #ccc; 
        z-index: 1000; 
    }

    .button {
        background: linear-gradient(135deg, #6e94bd54, #4890dda8); 
        border: none;
        border-radius: 10px; 
        padding: 12px 15px; 
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease; 
        font-size: 1rem; 
        color: white; 
        font-weight: bold;
        text-transform: uppercase; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
        position: relative;
        overflow: hidden;
    }
    

    /* Media query for extra small screens */
    @media (max-width: 680px) {
    

        .button {
            font-size: 0.65rem;
        }
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