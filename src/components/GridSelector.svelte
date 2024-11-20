<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';
    import { createEventDispatcher } from 'svelte';
    import type { Database } from '$lib/database.types';

    const dispatch = createEventDispatcher();
    
    type GridConfig = Database['public']['Tables']['grid_configurations']['Row'];
    
    let grids: GridConfig[] = [];
    let selectedGridId: string | null = null;
    let loading = true;
    let error: string | null = null;
    let message: { text: string; type: 'success' | 'error' } | null = null;

    async function loadGrids() {
        try {
            const { data, error: fetchError } = await supabase
                .from('grid_configurations')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            grids = data || [];
            loading = false;
        } catch (err) {
            console.error('Error loading grids:', err);
            error = err instanceof Error ? err.message : 'Failed to load grids';
            loading = false;
        }
    }

    function setMessage(text: string, type: 'success' | 'error') {
        message = { text, type };
        const timer = setTimeout(() => {
            message = null;
        }, 5000);
    }

    async function createDefaultGrid() {
        try {
            const userId = (await supabase.auth.getUser()).data.user?.id;
            if (!userId) throw new Error('User not authenticated');

            const { data: existingGrid, error: checkError } = await supabase
                .from('grid_configurations')
                .select('id')
                .eq('name', 'Default Grid')
                .eq('user_id', userId)
                .single();

            if (checkError && checkError.code !== 'PGRST116') throw checkError;
            if (existingGrid) {
                setMessage('Default grid already exists', 'error');
                return;
            }

            const { data: newGrid, error: createError } = await supabase
                .from('grid_configurations')
                .insert({
                    name: 'Default Grid',
                    description: 'Default video grid configuration',
                    is_active: true,
                    user_id: userId
                })
                .select()
                .single();

            if (createError) throw createError;

            grids = [...grids, newGrid];
            selectedGridId = newGrid.id;
            setMessage('Default grid created successfully', 'success');
            dispatch('gridCreated', newGrid);
        } catch (err) {
            console.error('Error creating default grid:', err);
            error = err instanceof Error ? err.message : 'Failed to create default grid';
        }
    }

    $: {
        if (selectedGridId !== null) {
            dispatch('gridSelected', selectedGridId);
        }
    }

    onMount(() => {
        loadGrids();
    });
</script>

<div class="grid-selector">
    {#if message}
        <div class="message {message.type}">
            {message.text}
        </div>
    {/if}

    {#if error}
        <div class="error">
            {error}
            <button on:click={() => { error = null; loadGrids(); }}>Retry</button>
        </div>
    {/if}

    <div class="controls">
        <select 
            bind:value={selectedGridId} 
            disabled={loading}
            aria-label="Select Grid Configuration"
        >
            <option value={null}>All Videos</option>
            {#each grids as grid}
                <option value={grid.id}>{grid.name}</option>
            {/each}
        </select>

        <button 
            on:click={createDefaultGrid}
            disabled={loading}
            class="create-default-btn"
        >
            Create Default Grid
        </button>
    </div>
</div>

<style>
    .grid-selector {
        margin: 1rem 0;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
    }

    .controls {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    select {
        flex: 1;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.3);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }

    .create-default-btn {
        padding: 0.5rem 1rem;
        background: #2a2a2a;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .create-default-btn:hover:not(:disabled) {
        background: #3a3a3a;
    }

    .create-default-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .message, .error {
        margin-bottom: 1rem;
        padding: 0.75rem;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .message.success {
        background: rgba(40, 167, 69, 0.2);
        color: #28a745;
    }

    .message.error, .error {
        background: rgba(220, 53, 69, 0.2);
        color: #dc3545;
    }

    .error button {
        background: #dc3545;
        color: white;
        border: none;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .controls {
            flex-direction: column;
        }

        select, .create-default-btn {
            width: 100%;
        }
    }
</style>
