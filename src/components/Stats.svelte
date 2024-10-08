<script lang="ts">
    // Firebase import
    import { db, doc, getDoc } from './firebase.js'; 

    export let onAccess: () => void; // Function to call when access is granted

    let targetName = "";
    let passwordInput = "";
    let correctPassword = "";
    let showSecret = false;

    // Firebase password check function
    async function checkPassword() {
        const docRef = doc(db, "users", targetName); // Use the entered name as the document ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            correctPassword = docSnap.data().password;
            if (passwordInput === correctPassword) {
                showSecret = true;
                if (onAccess) {
                    onAccess(); // Notify parent if access is granted
                }
            } else {
                alert("Incorrect password. Try again.");
                showSecret = false;
            }
        } else {
            console.log("No such user!");
        }
    }
</script>

<style>
    .login-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: 'Russo One', sans-serif;
    }

    .input-field {
        margin: 10px 0;
        padding: 10px;
        font-size: 16px;
        width: 250px;
        border: 1px solid #aaa;
        border-radius: 5px;
    }

    .login-button {
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
    }

    .secret-info {
        margin-top: 20px;
        padding: 20px;
        background-color: #f4f4f4;
        border-radius: 5px;
        text-align: center;
        font-size: 18px;
        color: #333;
    }
</style>

<div class="login-container">
    <!-- Login form -->
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

    <button on:click={checkPassword} class="login-button">Submit</button>

    <!-- Display secret info if access is granted -->
    {#if showSecret}
        <div class="secret-info">
            <p><strong>Access Granted:</strong></p>
            <p>Target: {targetName}</p>
            <p>Mission: Secure the target and proceed with caution.</p>
        </div>
    {/if}
</div>
