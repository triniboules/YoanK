<script lang="ts">
    import Background from '../../components/Background.svelte';
</script>

<button style="position: relative; width: 150px; height: 75px; border: none; background: transparent; padding: 0; overflow: hidden;">
    <Background />
    <span style="position: relative; z-index: 1; color: white;">Click Me</span>
</button>

<style>
    :root {
        --color-bg-1: transparent; /* Override the global background color */
    }
    
    button {
        cursor: pointer;
    }
</style>
