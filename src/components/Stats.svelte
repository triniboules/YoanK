<script lang="ts">
    // Import Firebase functions and Firestore instance from firebase.js
    import { db, doc, getDoc } from './firebase.js'; // Adjust the path if necessary

    // Define the type for the onAccess prop
    export let onAccess: () => void; // Type for the function to call when access is granted
    export let agent = "James Bond";
    export let mission = "Arkangelsk";
    export let part = "Dam";
    let selectedTab = 1;

    let targetName = "";
    let passwordInput = "";
    let correctPassword = ""; // Variable to store the correct password from Firestore
    let showSecret = false; // Control for showing secret content

    function selectTab(tabNumber: number) {
        selectedTab = tabNumber;
    }

    async function checkPassword() {
        const docRef = doc(db, "users", "Triniboules");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            correctPassword = docSnap.data().password; // Get the password from Firestore
            if (passwordInput === correctPassword) {
                showSecret = true;
                if (onAccess) {
                    onAccess(); // Notify parent that access is granted
                }
            } else {
                alert("Incorrect password. Try again.");
                showSecret = false;
            }
        } else {
            console.log("No such document!");
        }
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Russo+One&display=swap');

    /* Container styles */
    .container {
        display: flex;
        position: relative;
        font-family: 'Russo One', sans-serif; /* Use the font */
        background-image: url('/image/titre.webp');
        border: 2px solid #8b7b5d; /* Border style */
        border-radius: 10px; /* Rounded corners */
        width: 40vw; /* 80% of viewport width */
        height: 80vh; /* 80% of viewport height */
        margin: 0 auto; /* Center the container */
        box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2); /* Shadow for depth */
        padding: 20px;
    }

    /* Header styles */
    .header {
        margin-bottom: 20px; /* Space below the header */
        text-align: center; /* Center header text */
        color: #000; /* Black text */
        font-family: 'Press Start 2P', sans-serif;
    }

    /* Stats content area */
    .stats {
        flex-grow: 1; /* Allow stats section to grow */
        padding: 20px; /* Space inside stats */
        background: rgba(117, 76, 30, 0.1); /* Light background for content */
        border-radius: 10px; /* Rounded corners */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow effect */
        margin-right: 20px; /* Space between stats and menu */
        color: #000; /* Black text */
        overflow-y: auto; /* Scroll content if needed */
    }

    /* Intercalaires as tabs on the right */
    .intercalaires {
        position: absolute;
        right: -40px; /* Position intercalaires outside container */
        top: 0;
        display: flex;
        flex-direction: column;
        height: 100%; /* Full height of the container */
        justify-content: flex-start;
        align-items: center;
    }

    /* Intercalaire button style */
    .intercalaires button {
        margin: 10px 0;
        padding: 0px;
        border-radius: 20px; /* Rounded on the left side */
        border: 2px solid #8b7b5d;
        background-color: #472e00;
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        transition: background-color 0.3s;
        width: 60px; /* Adjust width for tab look */
        writing-mode: vertical-rl; /* Rotate the text */
        height: 150px; /* Set height to fit rotated text */
        text-align: center; /* Center text inside button */
        font-family: 'Press Start 2P', sans-serif;
     
    }

    .intercalaires button.active {
        background-color: #a37b4c;
        color: black;
    }

    .intercalaires button:hover {
        background-color: #6e5c4e;
    }

    /* Input styles for target identification */
    .input-field {
        width: calc(100% - 20px); /* Full width with padding */
        padding: 10px; /* Padding for input fields */
        border: 1px solid #cccccc;
        border-radius: 5px; /* Rounded corners */
        margin-bottom: 10px; /* Space below input fields */
        background-color: #f5f5f5;
        color: #000; /* Black text */
    }

    /* Secret info styles */
    .secret-info {
        margin-top: 20px; /* Space above secret info */
        padding: 10px; /* Padding for secret info */
        background-color: #f0f0f0; /* Background color for secret info */
        border-radius: 5px; /* Rounded corners */
        color: #000; /* Black text */
    }
</style>

<div class="container">
    <!-- Main stats section -->
    <div class="stats">
        <div class="header">
            <h2>Mission Briefing</h2>
            <p><strong>Agent:</strong> {agent}</p>
            <p><strong>Mission:</strong> {mission}</p>
            <p><strong>Part:</strong> {part}</p>
        </div>

        <!-- Dynamic content based on selected tab -->
        <div class="content">
            {#if selectedTab === 1}
                <p><strong>Time:</strong> 10:08</p>
                <p><strong>Accuracy:</strong> 56.1%</p>
                <p><strong>Weapon of choice:</strong> KF7 Soviet</p>
            {/if}
            {#if selectedTab === 2}
                <p><strong>Shot total:</strong> 253</p>
                <p><strong>Head hits:</strong> 25 (10%)</p>
                <p><strong>Body hits:</strong> 150 (60%)</p>
                <p><strong>Weapon used:</strong> PP7 Silenced</p>
            {/if}
            {#if selectedTab === 3}
            
                <p><strong>Enemies eliminated:</strong> 45</p>
                <p><strong>Critical hits:</strong> 5 (11%)</p>
                <p><strong>Stealth success:</strong> 90%</p>
                <p><strong>Weapon used:</strong> Sniper Rifle</p>
            {/if}
            {#if selectedTab === 4}
                <p><strong>Target ("Cible") Identification:</strong></p>

                <input
                    type="text"
                    placeholder="Enter target name"
                    bind:value={targetName}
                    class="input-field"
                />

                <input
                    type="password"
                    placeholder="Enter password"
                    bind:value={passwordInput}
                    class="input-field"
                />

                <div style="display: flex; justify-content: center; margin-top: 10px;">
                    <button on:click={checkPassword}>Submit</button>
                </div>

                <!-- Show secret information only if password is correct -->
                {#if showSecret}
                    <div class="secret-info">
                        <p><strong>Access Granted:</strong></p>
                        <p>Target: {targetName}</p>
                        <p>Objective: Neutralize the target quietly.</p>
                    </div>
                {/if}
            {/if}
        </div>
    </div>

    <!-- Intercalaires as tabs on the right -->
    <div class="intercalaires">

        <button on:click={() => selectTab(1)} class:active={selectedTab === 1}>Stats 1</button>
        <button on:click={() => selectTab(2)} class:active={selectedTab === 2}>Stats 2</button>
        <button on:click={() => selectTab(3)} class:active={selectedTab === 3}>Stats 3</button>
        <button on:click={() => selectTab(4)} class:active={selectedTab === 4}>Stats 4</button>
    </div>
</div>
