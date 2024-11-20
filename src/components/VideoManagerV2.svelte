<script lang="ts">
    import { onMount } from "svelte";
    import { 
        getDocs, collection, updateDoc, doc, deleteDoc, addDoc,
        createVideoGrid, fetchVideoGrids, updateVideoGrid, deleteVideoGrid,
        query, where
    } from "./firebase";
    import { db } from "./firebase";
    import { fade, slide } from 'svelte/transition';

    interface Video {
        id: string;
        description: string;
        name: string;
        logoType: string;
        position: number;
        showLogo: boolean;
        thumbnail: string;
        youtubeId: string;
        gridId: string;
    }

    interface VideoGrid {
        id: string;
        name: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
    }

    let videos: Video[] = [];
    let videoGrids: VideoGrid[] = [];
    let selectedGridId: string = '';
    let newGridName: string = '';
    let newGridDescription: string = '';
    let showNewGridForm: boolean = false;
    let draggedVideoId: string = '';
    let message = '';
    let messageType: 'error' | 'success' | null = null;
    let editVideoId: string = "";
    let editedVideo: Partial<Video> = {};
    let isCreateMode: boolean = false;
    let showSidebarHelp: boolean = false;

    const logoOptions = [
        { value: '', label: 'No Logo' },
        { value: 'Da', label: 'Logo Da' },
        { value: 'Yoann', label: 'Logo Yoann' }
    ];

    onMount(async () => {
        await loadVideoGrids();
    });

    const loadVideoGrids = async () => {
        try {
            videoGrids = await fetchVideoGrids();
            if (videoGrids.length > 0 && !selectedGridId) {
                await selectGrid(videoGrids[0].id);
            }
        } catch (error) {
            setMessage(`Failed to load video grids: ${(error as Error).message}`, 'error');
        }
    };

    const selectGrid = async (gridId: string) => {
        selectedGridId = gridId;
        await loadVideos(gridId);
    };

    const createNewGrid = async () => {
        if (!newGridName.trim()) {
            setMessage('Please enter a grid name', 'error');
            return;
        }

        try {
            const gridId = await createVideoGrid(newGridName, newGridDescription);
            await loadVideoGrids();
            selectGrid(gridId);
            newGridName = '';
            newGridDescription = '';
            showNewGridForm = false;
            setMessage('Grid created successfully!', 'success');
        } catch (error) {
            setMessage(`Failed to create grid: ${(error as Error).message}`, 'error');
        }
    };

    const loadVideos = async (gridId: string) => {
        try {
            const videosQuery = query(collection(db, "videos"), where("gridId", "==", gridId));
            const querySnapshot = await getDocs(videosQuery);
            videos = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    description: data.description || "",
                    name: data.name || "",
                    logoType: data.logoType || "",
                    position: typeof data.position === 'number' ? data.position : 0,
                    showLogo: typeof data.showLogo === 'boolean' ? data.showLogo : false,
                    thumbnail: data.thumbnail || "",
                    youtubeId: data.youtubeId || "",
                    gridId: data.gridId || gridId
                } as Video;
            });
            videos.sort((a, b) => a.position - b.position);
        } catch (error) {
            setMessage(`Failed to load videos: ${(error as Error).message}`, 'error');
        }
    };

    const handleClick = (id: string) => {
        if (editVideoId && editVideoId === id) {
            exitEditMode();
        } else {
            const video = videos.find(video => video.id === id);
            if (video) {
                enterEditMode(video);
            }
        }
    };

    const validateVideos = () => {
        return videos.every(video => {
            const hasValidId = typeof video.id === 'string' && video.id.trim() !== '';
            const hasValidPosition = typeof video.position === 'number' && Number.isInteger(video.position);
            return hasValidId && hasValidPosition;
        });
    };

    const handleDragStart = (e: DragEvent, id: string) => {
        draggedVideoId = id;
        e.dataTransfer!.setData("text/plain", id);
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent, targetId: string) => {
        e.preventDefault();
        if (draggedVideoId && draggedVideoId !== targetId) {
            const draggedIndex = videos.findIndex(video => video.id === draggedVideoId);
            const targetIndex = videos.findIndex(video => video.id === targetId);
            if (draggedIndex !== -1 && targetIndex !== -1) {
                [videos[draggedIndex], videos[targetIndex]] = [videos[targetIndex], videos[draggedIndex]];
                updatePositions();
            }
        }
        draggedVideoId = "";
    };

    const updatePositions = () => {
        videos.forEach((video, index) => {
            video.position = index;
        });
    };

    const saveAllChanges = async () => {
        if (!validateVideos()) {
            setMessage("Invalid video data. Please check the video list.", 'error');
            return;
        }

        try {
            const updates = videos.map(video => {
                const videoRef = doc(db, "videos", video.id);
                return updateDoc(videoRef, { position: video.position });
            });

            await Promise.all(updates);
            setMessage("All changes saved successfully!", 'success');
        } catch (error) {
            setMessage(`Failed to save changes: ${(error as Error).message}`, 'error');
        }
    };

    const setMessage = (text: string, type: 'error' | 'success') => {
        message = text;
        messageType = type;

        setTimeout(() => {
            message = '';
            messageType = null;
        }, 3000);
    };

    const enterEditMode = (video: Video) => {
        editVideoId = video.id;
        editedVideo = { ...video };
        isCreateMode = false; 
    };

    const createNewVideo = () => {
        if (!isCreateMode) {
            editVideoId = ""; 
            editedVideo = { id: "", description: "", name: "", logoType: "", position: 0, showLogo: false, thumbnail: "", youtubeId: "", gridId: selectedGridId }; 
            isCreateMode = true; 
        }
    };

    const saveEditedVideo = async () => {
        try {
            if (isCreateMode) {
                await addDoc(collection(db, "videos"), editedVideo as Video);
                setMessage("New video created successfully!", 'success');
            } else {
                const videoRef = doc(db, "videos", editVideoId!);
                await updateDoc(videoRef, {
                    ...editedVideo,
                    logoType: editedVideo.logoType || ''
                });
                const videoIndex = videos.findIndex(video => video.id === editVideoId);
                if (videoIndex !== -1) {
                    videos[videoIndex] = { ...videos[videoIndex], ...editedVideo };
                }
                setMessage("Video updated successfully!", 'success');
            }
            exitEditMode();
        } catch (error) {
            setMessage(`Failed to save video: ${(error as Error).message}`, 'error');
        }
    };

    const exitEditMode = () => {
        editVideoId = "";
        editedVideo = {};
        isCreateMode = false; 
    };

    const deleteVideo = async (id: string) => {
        const confirmDelete = confirm("Are you sure you want to delete this video?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "videos", id));
            videos = videos.filter(video => video.id !== id);
            setMessage("Video deleted successfully!", 'success');
            exitEditMode();
        } catch (error) {
            setMessage(`Failed to delete video: ${(error as Error).message}`, 'error');
        }
    };

    const getLogoPath = (logoType: string) => {
        if (logoType === "Da") return "/image/Da.webp";
        if (logoType === "Yoann") return "/image/logo.webp";
        return ""; 
    };

    const importFirstGrid = async () => {
        try {
            // First create a new grid
            const gridId = await createVideoGrid("Imported Grid", "Grid imported from backup");
            
            // Get videos from the old collection
            const oldVideosSnapshot = await getDocs(collection(db, "videos"));
            const oldVideos = oldVideosSnapshot.docs
                .map(doc => doc.data())
                .sort((a, b) => (a.position || 0) - (b.position || 0))
                .slice(0, 9); // Limit to 9 items
            
            // Add each video to the new grid
            for (let i = 0; i < oldVideos.length; i++) {
                const video = oldVideos[i];
                await addDoc(collection(db, "videos"), {
                    ...video,
                    gridId,
                    position: i,
                    showLogo: !!video.showLogo,
                    logoType: video.logoType || '',
                    description: video.description || '',
                    name: video.name || '',
                    thumbnail: video.thumbnail || '',
                    youtubeId: video.youtubeId || ''
                });
            }
            
            await loadVideoGrids();
            await selectGrid(gridId);
            setMessage("Successfully imported first 9 videos from backup!", 'success');
        } catch (error) {
            setMessage(`Failed to import videos: ${(error as Error).message}`, 'error');
        }
    };
</script>

<style>
    .container {
        display: flex;
        min-height: 100vh;
        background: rgba(0, 0, 0, 0.05);
    }

    .sidebar {
        width: 300px;
        background: rgba(0, 0, 0, 0.8);
        padding: 20px;
        color: white;
        backdrop-filter: blur(10px);
        border-right: 1px solid rgba(255, 255, 255, 0.1);
    }

    .main-content {
        flex: 1;
        padding: 20px;
    }

    .grid-list {
        margin-top: 20px;
    }

    .grid-item {
        padding: 10px;
        margin: 5px 0;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .grid-item:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .grid-item.selected {
        background: var(--primary-color);
    }

    .new-grid-form {
        margin-top: 20px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }

    .help-text {
        font-size: 0.9em;
        color: #aaa;
        margin-top: 5px;
        font-style: italic;
    }

    .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .help-icon {
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
    }

    .help-icon:hover {
        opacity: 1;
    }

    .help-panel {
        margin-top: 15px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        font-size: 0.9em;
        line-height: 1.4;
    }

    .video-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .empty-state {
        text-align: center;
        padding: 40px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        margin-top: 20px;
    }

    .tooltip {
        position: relative;
        display: inline-block;
    }

    .tooltip:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        padding: 5px 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 4px;
        font-size: 0.8em;
        white-space: nowrap;
        z-index: 1000;
    }

    :root {
        --primary-color: #007BFF;
        --success-color: #28a745;
        --error-color: #dc3545;
    }

    .container {
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
    }

    .video-item {
        background: rgba(0, 0, 0, 0.7);
        border-radius: 8px;
        padding: 15px;
        cursor: move;
        position: relative;
        backdrop-filter: blur(10px);
        transition: transform 0.2s;
    }

    .video-item:hover {
        transform: translateY(-2px);
    }

    .video-item.selected {
        border: 2px solid var(--primary-color);
    }

    .video-thumbnail {
        width: 100%;
        aspect-ratio: 16/9;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 10px;
    }

    .video-logo {
        position: absolute;
        top: 25px;
        right: 25px;
        width: 40px;
        height: 40px;
        object-fit: contain;
    }

    .video-details {
        margin-top: 10px;
    }

    .video-name {
        font-weight: bold;
        margin-bottom: 5px;
        font-size: 1.1em;
    }

    .video-description {
        font-size: 0.9em;
        color: #ccc;
        margin-bottom: 10px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .edit-form {
        background: rgba(0, 0, 0, 0.8);
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
        backdrop-filter: blur(10px);
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        color: #fff;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
        width: 100%;
        padding: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    .button-group {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }

    .add-video-button,
    .save-button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
    }

    .add-video-button:hover,
    .save-button:hover {
        background: #0056b3;
    }

    .delete-button {
        background: var(--error-color);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .delete-button:hover {
        background: #bd2130;
    }

    .message {
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0;
        text-align: center;
    }

    .success {
        background: var(--success-color);
        color: white;
    }

    .error {
        background: var(--error-color);
        color: white;
    }

    .checkbox-group {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .checkbox-group input[type="checkbox"] {
        width: auto;
    }

    .import-button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 15px;
        font-weight: bold;
        transition: background-color 0.2s;
    }

    .import-button:hover {
        background: #0056b3;
    }
</style>

<div class="container">
    <div class="sidebar">
        <div class="sidebar-header">
            <h2>Video Grids</h2>
            <span 
                class="help-icon" 
                on:click={() => showSidebarHelp = !showSidebarHelp}
                role="button"
                tabindex="0"
            >ℹ️</span>
        </div>

        {#if showSidebarHelp}
            <div class="help-panel" transition:slide>
                <p>📝 Create multiple grids of 9 videos each</p>
                <p>🔄 Switch between grids easily</p>
                <p>📋 Organize your videos by theme or project</p>
                <p>💾 All changes are saved automatically</p>
            </div>
        {/if}

        <button class="add-video-button" on:click={() => showNewGridForm = !showNewGridForm}>
            {showNewGridForm ? 'Cancel' : 'Create New Grid'}
        </button>

        {#if showNewGridForm}
            <div class="new-grid-form" transition:slide>
                <div class="form-group">
                    <label for="gridName">Grid Name</label>
                    <input 
                        type="text" 
                        id="gridName"
                        bind:value={newGridName}
                        placeholder="e.g., Wedding Videos 2023"
                    />
                    <p class="help-text">Give your grid a memorable name</p>
                </div>
                <div class="form-group">
                    <label for="gridDescription">Description (optional)</label>
                    <textarea 
                        id="gridDescription"
                        bind:value={newGridDescription}
                        placeholder="Brief description of this video collection"
                        rows="3"
                    ></textarea>
                </div>
                <button class="save-button" on:click={createNewGrid}>Create Grid</button>
            </div>
        {/if}

        <div class="grid-list">
            {#each videoGrids as grid (grid.id)}
                <div 
                    class="grid-item"
                    class:selected={selectedGridId === grid.id}
                    on:click={() => selectGrid(grid.id)}
                    role="button"
                    tabindex="0"
                >
                    <div class="grid-item-header">
                        <strong>{grid.name}</strong>
                        <span class="tooltip" data-tooltip="Last updated {grid.updatedAt.toLocaleDateString()}">
                            {videos.filter(v => v.gridId === grid.id).length}/9 videos
                        </span>
                    </div>
                    {#if grid.description}
                        <p class="grid-description">{grid.description}</p>
                    {/if}
                </div>
            {/each}
        </div>
    </div>

    <div class="main-content">
        {#if selectedGridId}
            <h2>{videoGrids.find(g => g.id === selectedGridId)?.name || 'Video Grid'}</h2>
            {#if message}
                <div class="message {messageType}" transition:fade>{message}</div>
            {/if}

            <div class="video-grid">
                {#each videos as video (video.id)}
                    <div class="video-item"
                         draggable="true"
                         on:dragstart={e => handleDragStart(e, video.id)}
                         on:dragover={handleDragOver}
                         on:drop={e => handleDrop(e, video.id)}
                         class:selected={editVideoId === video.id}
                         role="button"
                         tabindex="0"
                         on:click={() => handleClick(video.id)}
                         on:keydown={e => e.key === 'Enter' && handleClick(video.id)}>
                        <img src={video.thumbnail} alt={video.description} class="video-thumbnail" />
                        {#if video.showLogo}
                            <img src={getLogoPath(video.logoType)} alt={video.logoType} class="video-logo" />
                        {/if}
                        <div class="video-details">
                            <div class="video-name">{video.name}</div>
                            <div class="video-description">{video.description}</div>
                        </div>
                    </div>
                {/each}
            </div>

            {#if editVideoId || isCreateMode}
                <div class="edit-form">
                    <h3>{isCreateMode ? "Create New Video" : "Edit Video"}</h3>
                    <div class="form-group">
                        <label for="name">Name:</label>
                        <input type="text" id="name" bind:value={editedVideo.name} aria-label="Name" placeholder="Name" required />
                    </div>
                    <div class="form-group">
                        <label for="description">Description:</label>
                        <textarea id="description" bind:value={editedVideo.description} aria-label="Description" placeholder="Description" required />
                    </div>
                    <div class="form-group">
                        <label for="thumbnail">Thumbnail URL:</label>
                        <input type="text" id="thumbnail" bind:value={editedVideo.thumbnail} aria-label="Thumbnail URL" placeholder="Thumbnail URL" required />
                    </div>
                    <div class="form-group">
                        <label for="youtubeId">YouTube ID:</label>
                        <input type="text" id="youtubeId" bind:value={editedVideo.youtubeId} aria-label="YouTube ID" placeholder="YouTube ID" required />
                    </div>
                    <div class="form-group">
                        <label for="logoType">Logo Type:</label>
                        <select id="logoType" bind:value={editedVideo.logoType}>
                            {#each logoOptions as { value, label }}
                                <option value={value}>{label}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="showLogo" bind:checked={editedVideo.showLogo} />
                        <label for="showLogo">Show Logo</label>
                    </div>
                    <div class="button-group">
                        <button on:click={saveEditedVideo}>Save Changes</button>
                        {#if isCreateMode && editVideoId}
                            <button on:click={() => exitEditMode()}>Cancel</button>
                        {/if}
                    </div>
                    {#if editVideoId}
                        <button class="delete-button" on:click={() => deleteVideo(editVideoId)}>Delete Video</button>
                    {/if}
                </div>
            {/if}

            <button class="add-video-button" on:click={createNewVideo}>Add Video</button>
            <button class="save-button" on:click={saveAllChanges}>Save All Changes</button>
        {:else}
            <div class="empty-state">
                <h3>Select or Create a Grid</h3>
                <p>Choose a grid from the sidebar or create a new one to get started.</p>
                <button class="import-button" on:click={importFirstGrid}>
                    Import Backup Grid
                </button>
            </div>
        {/if}
    </div>
</div>