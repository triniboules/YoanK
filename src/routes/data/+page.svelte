<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { supabase } from '../../lib/supabaseClient';
    import VideoManager from '../../components/VideoManager.svelte';
    import PolarAreaChart from '../../components/PolarAreaChart.svelte';
    import SiteClickStats from '../../components/SiteClickStats.svelte';
    import Background from '../../components/Background.svelte';
    import ImportButton from '../../components/ImportButton.svelte';
    import type { Database } from '../../lib/database.types';
    import { importDefaultVideos } from '../../lib/utils/importDefaultVideos';

    type Video = Database['public']['Tables']['videos']['Row'];

    let activeComponent: string | null = null;
    let showWelcome = true;
    let userAuthenticated = false; 
    let showLoginError = false; 
    let usernameInput = '';
    let passwordInput = '';
    let mounted = false;
    let videos: Video[] = [];
    let loading = true;
    let currentGridId: string | null = null;

    onMount(async () => {
        mounted = true;
        await loadVideos();
    });

    async function loadVideos() {
        try {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            videos = data || [];
        } catch (error) {
            console.error('Error loading videos:', error);
        } finally {
            loading = false;
        }
    }

    const validCredentials = {
        triniboules: 'soulvestre'
    };

    const verifyPassword = () => {
        if (!browser || !mounted) return;
        
        if (validCredentials[usernameInput.toLowerCase()] === passwordInput) {
            userAuthenticated = true;
            showLoginError = false;
            showWelcome = false;
        } else {
            showLoginError = true;
        }
    };

    const handleSubmit = () => {
        verifyPassword();
    };

    const showComponent = (component: string) => {
        activeComponent = component;
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleVideoImported = () => {
        loadVideos();
    };

    const handleGridCreated = (event: CustomEvent<{ gridId: string }>) => {
        currentGridId = event.detail.gridId;
        // You can use this gridId to update your grid display or do other operations
    };

    async function handleImportDefaultVideos() {
        loading = true;
        try {
            const result = await importDefaultVideos();
            if (!result.success) {
                throw result.error;
            }
            await loadVideos();
            currentGridId = result.gridId;
        } catch (err) {
            console.error('Failed to import default videos:', err);
        } finally {
            loading = false;
        }
    }
</script>

{#if showLoginError || !userAuthenticated}
    <div class="login-form-wrapper">
        {#if showLoginError}
            <div class="error-message">
                Invalid credentials. Please try again.
            </div>
        {/if}
        <div class="login-form">
            <input
                type="text"
                placeholder="Username"
                bind:value={usernameInput}
                on:keypress={handleKeyPress}
            />
            <input
                type="password"
                placeholder="Password"
                bind:value={passwordInput}
                on:keypress={handleKeyPress}
            />
            <button on:click={handleSubmit}>
                Login
            </button>
        </div>
    </div>
{:else}
    <div class="app-container">
        <nav class="sidebar">
            <button
                class:active={activeComponent === 'videos'}
                on:click={() => showComponent('videos')}
            >
                Video Manager
            </button>
            <button
                class:active={activeComponent === 'stats'}
                on:click={() => showComponent('stats')}
            >
                Statistics
            </button>
            <button
                class:active={activeComponent === 'import'}
                on:click={() => showComponent('import')}
            >
                Import Videos
            </button>
        </nav>

        <div class="content">
            {#if activeComponent === 'videos'}
                <VideoManager {videos} on:videoUpdated={loadVideos} />
            {:else if activeComponent === 'stats'}
                {#if videos.length > 0}
                    <div class="stats-container">
                        <PolarAreaChart {videos} />
                        <SiteClickStats {videos} />
                    </div>
                {:else}
                    <p>No videos available for statistics.</p>
                {/if}
            {:else if activeComponent === 'import'}
                <div class="import-container">
                    <button 
                        on:click={handleImportDefaultVideos} 
                        disabled={loading}
                    >
                        {loading ? 'Importing...' : 'Import Default Videos & Create Grid'}
                    </button>
                </div>
            {:else}
                <div class="welcome">
                    <h1>Welcome to Video Management</h1>
                    <p>Select an option from the sidebar to get started.</p>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        width: 100vw;
        background: #1a1a1a;
    }

    .login-form-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        width: 100vw;
        background: #1a1a1a;
        padding: 2rem;
    }

    .login-form {
        background: #2a2a2a;
        padding: 2rem;
        border-radius: 8px;
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    input {
        padding: 0.5rem;
        border: 1px solid #444;
        border-radius: 4px;
        background: #333;
        color: #fff;
        width: 100%;
    }

    button {
        padding: 0.5rem 1rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
    }

    button:hover {
        background: #0056b3;
    }

    .error-message {
        color: #ff4444;
        margin-bottom: 1rem;
        text-align: center;
    }

    .app-container {
        display: flex;
        width: 100vw;
        min-height: 100vh;
        background: #1a1a1a;
    }

    .sidebar {
        width: 200px;
        padding: 1rem;
        background: #2a2a2a;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .sidebar button {
        text-align: left;
        background: transparent;
        padding: 0.5rem;
    }

    .sidebar button.active {
        background: #007bff;
    }

    .content {
        flex: 1;
        padding: 1rem;
        width: 100%;
    }

    .stats-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
    }

    .welcome {
        text-align: center;
        padding: 2rem;
    }

    h1 {
        color: #fff;
        margin-bottom: 1rem;
    }

    p {
        color: #888;
    }
</style>