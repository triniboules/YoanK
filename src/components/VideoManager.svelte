<script lang="ts">
    import { onMount } from "svelte";
    import { getDocs, collection, updateDoc, doc, deleteDoc, addDoc } from "firebase/firestore"; // Import addDoc
    import { db } from "./firebase";

    interface Video {
        id: string;
        description: string;
        name: string;
        logoType: string;
        position: number;
        showLogo: boolean;
        thumbnail: string;
        youtubeId: string;
    }

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

    const logoOptions = [
        { value: '', label: 'No Logo' },
        { value: 'Da', label: 'Logo Da' },
        { value: 'Yoann', label: 'Logo Yoann' }
    ];

    let videos: Video[] = [];
    let draggedVideoId: string = '';
    let message = '';
    let messageType: 'error' | 'success' | null = null;
    let editVideoId: string = "";
    let editedVideo: Partial<Video> = {};
    let isCreateMode: boolean = false; // State variable to track create mode

    onMount(async () => {
        await loadVideos();
    });

    const loadVideos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "videos"));
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
                } as Video;
            });
            videos.sort((a, b) => a.position - b.position);
        } catch (error) {
            setMessage(`Failed to load videos: ${(error as Error).message}`, 'error');
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
        isCreateMode = false; // Reset to edit mode
    };

    const createNewVideo = () => {
        if (!isCreateMode) {
            editVideoId = ""; // Clear the current video ID
            editedVideo = { id: "", description: "", name: "", logoType: "", position: 0, showLogo: false, thumbnail: "", youtubeId: "" }; // Initialize a new empty video object
            isCreateMode = true; // Switch to create mode
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
        isCreateMode = false; // Reset to edit mode
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
        return ""; // No logo
    };
</script>

<style>
    :root {
        --primary-color: #007BFF;
        --success-color: #28a745;
        --error-color: #dc3545;
        --background-color: #f9f9f900;
        --text-color: #333;
        --highlight-color: #ffcc00;
        --hover-text-color: #007bff;
    }
    
 
    
    .container {
        max-width: 100vw;
        margin: 0px auto; /* Added margin for spacing */
        padding: 10px;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
        font-family: 'Lato', sans-serif;
        font-size: 1.8rem; /* Increased font size for better readability */
        text-align: center;
        color: var(--text-color);
        margin-bottom: 24px;
        background-color: #f9f9f9;
        padding: 10px; /* Added padding for better touch targets */
        border-radius: 8px; /* Rounded corners for visual appeal */
    }
    
    h2:hover {
        color: var(--hover-text-color);
    }
    
    h2::after {
        content: '';
        display: block;
        height: 2px; /* Increased thickness for better visibility */
        width: 50%;
        margin: 10px auto; /* Spacing around the line */
        background-color: currentColor;
    }
    
    .video-grid {
        margin-top: -10vh;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(30vw, 1fr)); /* Responsive columns */
        gap: 20px;
        scale: 80%;
        transition: transform 0.3s ease-in-out;
    }
    
    .video-item {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .video-item:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }
    
    .video-item img {
        width: 100%;
        height: auto;
        border-radius: 10px;
        transition: transform 0.3s ease-in-out;
    }
    
    .logo {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease-in-out;
    }
    
    .logo img {
        width: auto;
        height: 40px;
    }
    
    .video-item:hover .logo img {
        transform: scale(1.1); /* Subtle scaling on hover */
    }
    
    .overlay {
        position: absolute;
        bottom: 0;
        left: 50%;
        right: 0;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 12px;
        border-radius: 8px;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
    
    .video-item:hover .overlay {
        opacity: 1;
    }
    
    .description {
        margin: 0;
        font-size: 1rem;
        line-height: 1.4em; /* Increased line height for better readability */
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
    
    .edit-video-text {
        color: var(--highlight-color); /* Use highlight color for better visibility */
        font-weight: bold; /* Emphasize the text */
    }
  
    .edit-container {
        width: 100%;
        max-width: 800px;
        margin: 30px auto;
        padding: 20px;
        background: rgba(255, 255, 255, 0.9); /* Light background for edit container */
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        position: relative; /* Position for children elements */
    }
  
    .edit-container input,
    .edit-container select {
        width: 100%;
        padding: 10px;
        margin: 5px 0;
        border-radius: 5px;
        border: 1px solid #ccc; /* Clarity border */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        color: black; /* Text color */
        background: rgba(255, 255, 255, 0.8); /* Background for inputs */
    }
  
    .edit-container button {
        padding: 12px 25px; /* Adjusted padding */
        margin-top: 15px; /* Adjusted margin */
        border: none;
        border-radius: 5px;
        background-color: var(--primary-color); /* Primary color */
        color: white; /* Keep button text color white */
        cursor: pointer;
        transition: background-color 0.3s;
    }
  
    .edit-container button:hover {
        background-color: var(--hover-text-color); /* Darken the button on hover */
    }
  
    .message {
        margin: 10px 0;
        padding: 10px;
        border-radius: 5px;
        display: inline-block;
        background-color: rgba(255, 255, 255, 0.9); /* Light background for messages */
        color: var(--text-color); /* Text color */
    }
  
    .add-video-button,
    .save-button {
        display: block; /* Center button */
        margin: 20px auto; /* Center horizontally */
        padding: 10px 20px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
        transition: background-color 0.3s;
    }
  
    .add-video-button:hover,
    .save-button:hover {
        background-color: var(--hover-text-color); /* Darken on hover */
    }
  
    .success {
        background-color: var(--success-color);
        color: white;
    }
  
    .error {
        background-color: var(--error-color);
        color: white;
    }
    </style>
    

<div class="container">
    <h2>Draggable Video List</h2>
    {#if message}
        <div class="message {messageType}">{message}</div>
    {/if}
    <div class="video-grid">
        {#each videos as video (video.id)}
            <div class="video-item"
                 draggable="true"
                 on:dragstart={e => handleDragStart(e, video.id)}
                 on:dragover={handleDragOver}
                 on:drop={e => handleDrop(e, video.id)}
                 role="button"
                 tabindex="0"
                 on:click={() => handleClick(video.id)}
                 on:keydown={e => e.key === 'Enter' && handleClick(video.id)}>
                <img src={video.thumbnail} alt={video.description} />
                <div class="logo">
                    {#if video.showLogo}
                        <img src={getLogoPath(video.logoType)} alt={video.logoType} class="small-logo" />
                    {/if}
                </div>
                <div class="overlay">
                    <p class="description">{video.description}</p>
                </div>
            </div>
        {/each}
    </div>

    {#if editVideoId || isCreateMode}
     <div class="edit-container">
         <h3>{isCreateMode ? "Create New Video" : "Edit Video"}</h3>
         <input type="text" bind:value={editedVideo.name} aria-label="Name" placeholder="Name" required />
         <input type="text" bind:value={editedVideo.description} aria-label="Description" placeholder="Description" required />
         <input type="text" bind:value={editedVideo.thumbnail} aria-label="Thumbnail URL" placeholder="Thumbnail URL" required />
         <input type="text" bind:value={editedVideo.youtubeId} aria-label="YouTube ID" placeholder="YouTube ID" required />
         <select bind:value={editedVideo.logoType}>
             {#each logoOptions as { value, label }}
                 <option value={value}>{label}</option>
             {/each}
         </select>
         <label>
             <input type="checkbox" bind:checked={editedVideo.showLogo} />
             Show Logo
         </label>
         <button on:click={saveEditedVideo}>Save Changes</button>
         {#if isCreateMode && editVideoId}
             <button on:click={() => exitEditMode()}>Cancel</button>
         {/if}

         <!-- Add the delete button here -->
         {#if editVideoId}
             <button class="deleteVideo" on:click={() => deleteVideo(editVideoId)}>Delete Video</button>
         {/if}
     </div>
    {/if}

    <button class="add-video-button" on:click={createNewVideo}>Add Video</button>
    <button class="save-button" on:click={saveAllChanges}>Save All Changes</button>
</div>