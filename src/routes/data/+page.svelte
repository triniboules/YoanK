<script lang="ts">
    import Stats from "../../components/Stats.svelte";
    import Stats1 from "../../components/Stats1.svelte";
    import { onMount } from 'svelte';

    let currentComponent = 'Stats'; // Initially set to Stats

    // Function to handle access granted from Stats
    function handleAccess() {
        currentComponent = 'Stats1'; // Change to Stats1 when access is granted
    }

    // Listen for the componentChange event
    onMount(() => {
        // Add any required setup here
    });
</script>

{#if currentComponent === 'Stats'}
    <Stats onAccess={handleAccess} />
{:else if currentComponent === 'Stats1'}
    <Stats1 />
{/if}
