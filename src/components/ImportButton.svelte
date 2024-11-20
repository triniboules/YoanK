<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Database } from '$lib/database.types';
    import { importDefaultVideos } from '$lib/utils/importDefaultVideos';
    
    const dispatch = createEventDispatcher<{
        videoImported: void;
    }>();
    
    let importing = false;
    let importStatus: 'idle' | 'success' | 'error' = 'idle';
    let error: string | null = null;
    
    async function handleImport() {
        importing = true;
        importStatus = 'idle';
        error = null;
        
        try {
            const result = await importDefaultVideos();
            if (!result.success) {
                throw new Error(result.error);
            }
            importStatus = 'success';
            dispatch('videoImported');
        } catch (err) {
            console.error('Import failed:', err);
            importStatus = 'error';
            error = err instanceof Error ? err.message : 'Failed to import videos';
        } finally {
            importing = false;
            // Reset success message after 3 seconds
            if (importStatus === 'success') {
                setTimeout(() => {
                    importStatus = 'idle';
                }, 3000);
            }
        }
    }
</script>

<div class="import-container">
    <button 
        on:click={handleImport} 
        disabled={importing}
        class:success={importStatus === 'success'}
        class:error={importStatus === 'error'}
        class="import-button"
    >
        {#if importing}
            <span class="loading"></span>
            Importing Default Videos...
        {:else if importStatus === 'success'}
            ✓ Videos & Grid Created!
        {:else if importStatus === 'error'}
            ✗ Import Failed
        {:else}
            Import Default Videos & Create Grid
        {/if}
    </button>
    
    {#if error}
        <p class="error-message">{error}</p>
    {/if}
</div>

<style>
    .import-container {
        margin: 1rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }
    
    .import-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: 500;
        color: white;
        background-color: #2563eb;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .import-button:hover:not(:disabled) {
        background-color: #1d4ed8;
    }
    
    .import-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .import-button.success {
        background-color: #059669;
    }
    
    .import-button.error {
        background-color: #dc2626;
    }
    
    .loading {
        width: 1rem;
        height: 1rem;
        border: 2px solid #ffffff;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    .error-message {
        color: #dc2626;
        font-size: 0.875rem;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
