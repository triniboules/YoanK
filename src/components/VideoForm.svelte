<script lang="ts">
  import { createVideo } from '../lib/services/video.service';
  import type { Database } from '../lib/database.types';

  type Video = Database['public']['Tables']['videos']['Row'];

  export let onVideoCreated: (video: Video) => void;
  export let onCancel: () => void;

  let name = '';
  let description = '';
  let sourceId = '';
  let thumbnail = '';
  let showLogo = false;
  let logoType = 'Da';
  let source = 'youtube';
  let error: string | null = null;
  let isLoading = false;

  const videoSources = [
    { id: 'youtube', name: 'YouTube' },
    { id: 'vimeo', name: 'Vimeo' },
    { id: 'local', name: 'Local File' },
    // Add more sources as needed
  ];

  const validateForm = () => {
    if (!name.trim()) return 'Name is required';
    if (!sourceId.trim()) return 'Video ID is required';
    if (!thumbnail.trim()) return 'Thumbnail URL is required';
    return null;
  };

  const handleSubmit = async () => {
    try {
      const validationError = validateForm();
      if (validationError) {
        error = validationError;
        return;
      }

      isLoading = true;
      error = null;

      const newVideo = await createVideo({
        name: name.trim(),
        description: description.trim(),
        youtubeId: source === 'youtube' ? sourceId.trim() : '',
        sourceId: sourceId.trim(),
        source,
        thumbnail: thumbnail.trim(),
        showLogo,
        logoType
      });

      onVideoCreated(newVideo);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create video';
      console.error('Error creating video:', err);
    } finally {
      isLoading = false;
    }
  };
</script>

<form class="video-form" on:submit|preventDefault={handleSubmit}>
  <h2>Add New Video</h2>

  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}

  <div class="form-group">
    <label for="source">Video Source</label>
    <select
      id="source"
      bind:value={source}
      disabled={isLoading}
    >
      {#each videoSources as videoSource}
        <option value={videoSource.id}>{videoSource.name}</option>
      {/each}
    </select>
  </div>

  <div class="form-group">
    <label for="name">Video Name *</label>
    <input
      type="text"
      id="name"
      bind:value={name}
      placeholder="Enter video name"
      disabled={isLoading}
      required
    />
  </div>

  <div class="form-group">
    <label for="description">Description</label>
    <textarea
      id="description"
      bind:value={description}
      placeholder="Enter video description"
      disabled={isLoading}
      rows="3"
    ></textarea>
  </div>

  <div class="form-group">
    <label for="sourceId">
      {#if source === 'youtube'}
        YouTube Video ID *
      {:else if source === 'vimeo'}
        Vimeo Video ID *
      {:else}
        Video URL *
      {/if}
    </label>
    <input
      type="text"
      id="sourceId"
      bind:value={sourceId}
      placeholder={source === 'youtube' ? 'e.g., dQw4w9WgXcQ' : 'Enter video ID or URL'}
      disabled={isLoading}
      required
    />
  </div>

  <div class="form-group">
    <label for="thumbnail">Thumbnail URL *</label>
    <input
      type="text"
      id="thumbnail"
      bind:value={thumbnail}
      placeholder="Enter thumbnail URL"
      disabled={isLoading}
      required
    />
  </div>

  <div class="form-group">
    <label class="checkbox-label">
      <input
        type="checkbox"
        bind:checked={showLogo}
        disabled={isLoading}
      />
      Show Logo
    </label>
  </div>

  {#if showLogo}
    <div class="form-group">
      <label for="logoType">Logo Type</label>
      <select
        id="logoType"
        bind:value={logoType}
        disabled={isLoading}
      >
        <option value="Da">Da</option>
        <option value="Yoann">Yoann</option>
      </select>
    </div>
  {/if}

  <div class="form-actions">
    <button
      type="button"
      class="cancel-button"
      on:click={onCancel}
      disabled={isLoading}
    >
      Cancel
    </button>
    <button
      type="submit"
      class="submit-button"
      disabled={isLoading}
    >
      {isLoading ? 'Adding...' : 'Add Video'}
    </button>
  </div>
</form>

<style>
  .video-form {
    background: #1a1a1a;
    padding: 2rem;
    border-radius: 8px;
    max-width: 600px;
    margin: 0 auto;
  }

  h2 {
    margin: 0 0 1.5rem 0;
    color: #ffffff;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #ffffff;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  input[type="text"],
  textarea,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #333;
    border-radius: 4px;
    background: #2a2a2a;
    color: #ffffff;
    font-size: 1rem;
  }

  input[type="text"]:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: #666;
  }

  input[type="checkbox"] {
    width: 1.2rem;
    height: 1.2rem;
    margin: 0;
  }

  .error-message {
    background: rgba(255, 0, 0, 0.1);
    color: #ff6b6b;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1.5rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .submit-button {
    background: #4a9eff;
    color: #ffffff;
  }

  .submit-button:hover:not(:disabled) {
    background: #3d8be6;
  }

  .cancel-button {
    background: #333;
    color: #ffffff;
  }

  .cancel-button:hover:not(:disabled) {
    background: #444;
  }

  @media (max-width: 768px) {
    .video-form {
      padding: 1.5rem;
      margin: 1rem;
    }
  }
</style>
