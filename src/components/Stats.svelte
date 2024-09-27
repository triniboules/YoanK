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
                    onAccess(); // Call the onAccess function to notify parent that access is granted
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
    /* Container styles */
    .container {
        display: flex;
        padding: 20px;
        font-family: 'Bank Gothic', sans-serif; /* Use the font */
        background-color: #d0c4a100; /* Background color */
        border: 2px solid #8b7b5d; /* Border style */
        border-radius: 10px; /* Rounded corners */
        width: 80vw; /* 80% of viewport width */
        height: 80vh; /* 80% of viewport height */
        margin: auto; /* Center the container */
        box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2); /* Shadow for depth */
        background-image: url('/image/titre.webp');
        background-size: 256px 256px; /* Background image size */
        background-repeat: repeat; /* Repeat background image */
    }

    /* Header styles */
    .header {
        margin-bottom: 20px; /* Space below the header */
        text-align: center; /* Center header text */
        color: rgba(0, 0, 0, 0.733); /* Header text color */
    }

    /* Stats content area */
    .stats {
        flex-grow: 1; /* Allow stats section to grow */
        padding: 20px; /* Space inside stats */
        background: rgba(117, 76, 30, 0.253); /* Semi-transparent white */
        border-radius: 10px; /* Rounded corners */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Shadow effect */
        margin-right: 20px; /* Space between stats and menu */
    }

    /* Tabs menu styles */
    .menu {
        display: flex; /* Align buttons in a column */
        flex-direction: column; /* Column layout for tabs */
        justify-content: start; /* Align tabs at the start */
        width: 200px; /* Fixed width for the menu */
    }

    button {
        margin: 5px 0; /* Space between buttons */
        padding: 10px; /* Padding for buttons */
        border-radius: 5px; /* Rounded button corners */
        border: none; /* No border */
        background-color: #8b7b5d; /* Button background color */
        color: white; /* Button text color */
        cursor: pointer; /* Pointer cursor for buttons */
        transition: background-color 0.3s; /* Transition for background color */
    }

    /* Active button styles */
    .active {
        background-color: #b9a68e00; /* Different shade for active button */
        color: black; /* Active button text color */
    }

    button:hover {
        background-color: #6e5c4e; /* Darker color on hover */
    }

    /* Input styles for target identification */
    .input-field {
        width: calc(100% - 20px); /* Full width with padding */
        padding: 10px; /* Padding for input fields */
        border: 1px solid #cccccc10; /* Border style */
        border-radius: 5px; /* Rounded corners */
        margin-bottom: 10px; /* Space below input fields */
    }

    /* Secret info styles */
    .secret-info {
        margin-top: 20px; /* Space above secret info */
        padding: 10px; /* Padding for secret info */
        background-color: #f0f0f021; /* Background color for secret info */
        border-radius: 5px; /* Rounded corners */
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

    <!-- Menu with dynamic tabs -->
    <div class="menu">
        <button on:click={() => selectTab(1)} class:active={selectedTab === 1}>Stats 1</button>
        <button on:click={() => selectTab(2)} class:active={selectedTab === 2}>Stats 2</button>
        <button on:click={() => selectTab(3)} class:active={selectedTab === 3}>Stats 3</button>
        <button on:click={() => selectTab(4)} class:active={selectedTab === 4}>Stats 4</button>
    </div>
</div>
