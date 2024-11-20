<script lang="ts">
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';

    let message = '';
    let messageType: 'error' | 'success' | null = null;
    let isLoading = false;
    let isCreating = false;
    let lastCheckTime: string | null = null;

    interface DatabaseStatus {
        videos: boolean;
        grid_configurations: boolean;
        rls_enabled: boolean;
        videos_count: number;
        grid_configurations_count: number;
    }

    let databaseStatus: DatabaseStatus = {
        videos: false,
        grid_configurations: false,
        rls_enabled: false,
        videos_count: 0,
        grid_configurations_count: 0
    };

    onMount(async () => {
        await checkDatabaseStatus();
    });

    async function setupDatabase() {
        isCreating = true;
        try {
            const { data, error } = await supabase.rpc('setup_database');
            if (error) throw error;
            
            setMessage('Database setup completed successfully!', 'success');
            await checkDatabaseStatus();
        } catch (err) {
            console.error('Error setting up database:', err);
            setMessage(`Failed to setup database: ${err instanceof Error ? err.message : String(err)}`, 'error');
        } finally {
            isCreating = false;
        }
    }

    async function checkDatabaseStatus() {
        isLoading = true;
        try {
            const { data, error } = await supabase.rpc('check_database_setup');
            if (error) throw error;
            
            lastCheckTime = data.last_check_time;
            databaseStatus = {
                videos: data.videos_table_exists,
                grid_configurations: data.grid_configurations_table_exists,
                rls_enabled: data.rls_enabled_videos && data.rls_enabled_grid_configurations,
                videos_count: data.videos_count || 0,
                grid_configurations_count: data.grid_configurations_count || 0
            };
        } catch (err) {
            console.error('Error checking database status:', err);
            setMessage(`Failed to check database status: ${err instanceof Error ? err.message : String(err)}`, 'error');
        } finally {
            isLoading = false;
        }
    }

    function setMessage(text: string, type: 'error' | 'success') {
        message = text;
        messageType = type;
        setTimeout(() => {
            message = '';
            messageType = null;
        }, 5000);
    }
</script>

<div class="page-container">
    <nav class="top-nav">
        <div class="nav-content">
            <a href="/" class="nav-logo">
                <img src="/image/logo.webp" alt="Yoank Logo" class="nav-logo-img" />
            </a>
        </div>
    </nav>

    <main class="main-content">
        <div class="container">
            <h1>Database Setup</h1>
            
            {#if message}
                <div class="message {messageType}" role="alert">
                    {message}
                </div>
            {/if}

            <div class="setup-container">
                <div class="setup-header">
                    <h2>Database Status</h2>
                    <div class="button-group">
                        <button 
                            class="setup-button"
                            disabled={isCreating || (databaseStatus.videos && databaseStatus.grid_configurations)}
                            on:click={setupDatabase}
                        >
                            {#if isCreating}
                                <div class="spinner small"></div>
                            {:else}
                                {databaseStatus.videos && databaseStatus.grid_configurations ? 'Already Setup' : 'Setup Database'}
                            {/if}
                        </button>
                        <button 
                            class="refresh-button"
                            disabled={isLoading}
                            on:click={checkDatabaseStatus}
                        >
                            {#if isLoading}
                                <div class="spinner small"></div>
                            {:else}
                                ↻ Refresh Status
                            {/if}
                        </button>
                    </div>
                </div>

                <div class="status-list">
                    <div class="status-item">
                        <span class="status-label">Videos Table:</span>
                        <div class="status-info">
                            <div class="status-indicator {databaseStatus.videos ? 'success' : 'pending'}">
                                {databaseStatus.videos ? '✓ Created' : '• Not Created'}
                            </div>
                            {#if databaseStatus.videos}
                                <span class="status-count">({databaseStatus.videos_count} records)</span>
                            {/if}
                        </div>
                    </div>

                    <div class="status-item">
                        <span class="status-label">Grid Configurations Table:</span>
                        <div class="status-info">
                            <div class="status-indicator {databaseStatus.grid_configurations ? 'success' : 'pending'}">
                                {databaseStatus.grid_configurations ? '✓ Created' : '• Not Created'}
                            </div>
                            {#if databaseStatus.grid_configurations}
                                <span class="status-count">({databaseStatus.grid_configurations_count} records)</span>
                            {/if}
                        </div>
                    </div>

                    <div class="status-item">
                        <span class="status-label">Row Level Security:</span>
                        <div class="status-indicator {databaseStatus.rls_enabled ? 'success' : 'pending'}">
                            {databaseStatus.rls_enabled ? '✓ Enabled' : '• Not Enabled'}
                        </div>
                    </div>
                </div>

                {#if lastCheckTime}
                    <div class="last-check">
                        Last checked: {new Date(lastCheckTime).toLocaleString()}
                    </div>
                {/if}
            </div>
        </div>
    </main>
</div>

<style>
    .page-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .top-nav {
        background: #1a1a1a;
        padding: 1rem;
        border-bottom: 1px solid #2a2a2a;
    }

    .nav-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
    }

    .nav-logo {
        display: flex;
        align-items: center;
    }

    .nav-logo-img {
        height: 32px;
    }

    .main-content {
        flex: 1;
        padding: 2rem;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
    }

    h1 {
        margin: 0 0 2rem 0;
        color: #fff;
    }

    .setup-container {
        background: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 8px;
        padding: 1.5rem;
    }

    .setup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .button-group {
        display: flex;
        gap: 1rem;
    }

    .setup-button, .refresh-button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s;
    }

    .setup-button {
        background: #2563eb;
        color: white;
    }

    .setup-button:hover:not(:disabled) {
        background: #1d4ed8;
    }

    .refresh-button {
        background: #2a2a2a;
        color: #fff;
    }

    .refresh-button:hover:not(:disabled) {
        background: #3a3a3a;
    }

    .setup-button:disabled, .refresh-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .status-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .status-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: #2a2a2a;
        border-radius: 4px;
    }

    .status-label {
        font-weight: 500;
        color: #ccc;
    }

    .status-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .status-indicator {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: 500;
        min-width: 100px;
        text-align: center;
    }

    .status-indicator.success {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
    }

    .status-indicator.pending {
        background: rgba(255, 193, 7, 0.2);
        color: #ffc107;
    }

    .status-count {
        color: #888;
        font-size: 0.9rem;
    }

    .message {
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 4px;
        text-align: center;
    }

    .message.success {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
    }

    .message.error {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
    }

    .last-check {
        margin-top: 1rem;
        color: #888;
        font-size: 0.9rem;
        text-align: right;
    }

    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .spinner.small {
        width: 14px;
        height: 14px;
        border-width: 2px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>