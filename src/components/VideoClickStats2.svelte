<script lang="ts">
    import { onMount } from 'svelte';
    import { db } from './firebase';
    import { collection, getDocs } from 'firebase/firestore';

    interface Video {
        id: number;
        name: string;
        youtubeId: string;
        thumbnail: string;
        description: string;
        showLogo: boolean;
    }
  
    interface ClickStats {
        userId: string;
        timestamp: Date;
    }

    // Hardcoded video data
    let videos: Video[] = [
        { id: 1, name: 'Myrto & Derek', youtubeId: 'oojG3E82yzQ', thumbnail: '/image/1.webp', description: 'Myrto & Derek\nOpérateur Caméra', showLogo: true },
        { id: 2, name: 'Claire et Martin', youtubeId: 'I-h4WH3tVcc', thumbnail: '/image/2.webp', description: 'Claire et Martin\nOpérateur Caméra', showLogo: true },
        { id: 3, name: 'Nathalie & Christophe', youtubeId: 'gZJyI-PGTHI', thumbnail: '/image/3.webp', description: 'Nathalie & Christophe\nOpérateur Caméra', showLogo: true },
        { id: 4, name: 'Les Nuits du Réal', youtubeId: 'R2PnDV97Zrg', thumbnail: '/image/4.webp', description: 'Les Nuits du Réal\nOpérateur Caméra', showLogo: true },
        { id: 5, name: "La Lucarne d'Arianne", youtubeId: '3d6SlZscoeM', thumbnail: '/image/5.webp', description: "La Lucarne d'Arianne\nRéalisation\nPrise de son\nOpérateur Caméra", showLogo: true },
        { id: 6, name: 'Litographie - Marko Zoric', youtubeId: 'stdlTlbi_o0', thumbnail: '/image/6.webp', description: 'Litographie - Marko Zoric\nRéalisation\nMontage', showLogo: true },
        { id: 7, name: 'Unlocked - Sophie Jarmouni', youtubeId: 'YKA3anXENjQ', thumbnail: '/image/7.webp', description: 'Unlocked - Sophie Jarmouni\nAssistant Caméra\nFocus puller', showLogo: false },
        { id: 8, name: "Rien qu'ça - GOHU", youtubeId: 'DSNs7fQifyM', thumbnail: '/image/8.webp', description: "Rien qu'ça - GOHU\nRéalisation\nPrise de vue\nMontage", showLogo: true },
        { id: 9, name: 'Hold Up - Yautjaxx', youtubeId: 'lOygdbJni8A', thumbnail: '/image/9.webp', description: 'Hold Up - Yautjaxx\nOpérateur Caméra\nPrise de vue', showLogo: true },
    ];

    let videoStats: { id: number, clickCount: number, clicks: ClickStats[] }[] = [];
    let loading: boolean = true;

    onMount(async () => {
        await fetchVideoClickStats();
    });

    async function fetchVideoClickStats() {
        try {
            const querySnapshot = await getDocs(collection(db, "videos"));
            videoStats = querySnapshot.docs.map(doc => ({
                id: parseInt(doc.id), 
                clickCount: doc.data().clicks?.length || 0,
                clicks: (doc.data().clicks || []).map((click: any) => ({
                    userId: click.userId,
                    timestamp: click.timestamp.toDate()
                }))
            }));
            loading = false;
        } catch (error) {
            console.error("Error fetching video click stats: ", error);
            loading = false;
        }
    }

    // Function to get video name by ID
    function getVideoName(id: number): string {
        const video = videos.find(video => video.id === id);
        return video ? video.name : "Unknown Video";
    }
</script>

<main class="stats-container">
    {#if loading}
        <p class="loading">Loading video stats...</p>
    {:else}
        <div class="video-stats">
            <h2 class="stats-title">Statistics Overview</h2>
            <div class="stats-columns">
                {#each videoStats as video}
                    <div class="video-item">
                        <span class="video-name">{getVideoName(video.id)}</span>
                        <span class="click-count">{video.clickCount} clicks</span>
                        <ul class="click-list">
                            {#each video.clicks as click, index}
                                <li class="click-item">
                                    User: {click.userId}, Time: {new Date(click.timestamp).toLocaleString()}
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</main>

<style>
    /* Overall container */
    .stats-container {
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        max-width: 1200px;
        margin: 0 auto;
    }

    /* Title styling */
    .stats-title {
        font-size: 2rem;
        color: #34495e;
        margin-bottom: 15px;
        text-align: center;
    }

    /* Flex layout for video stats */
    .stats-columns {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    /* Each video stat block */
    .video-item {
        background-color: #f9f9f957;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        flex: 1 1 calc(33.333% - 10px);
        max-width: calc(33.333% - 10px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    /* Video name styling with blue color */
    .video-name {
        font-size: 1.2rem;
        font-weight: bold;
        color: #2980b9; /* Blue color */
    }

    /* Click count styling with orange color */
    .click-count {
        font-size: 1.1rem;
        font-weight: bold;
        color: #e67e22; /* Orange color */
        margin-top: 5px;
    }

    /* Click details list */
    .click-list {
        margin-top: 10px;
        list-style: none;
        padding: 0;
    }

    /* Individual click details */
    .click-item {
        font-size: 0.9rem;
        color: #7f8c8d; /* Light grey */
        margin-bottom: 5px;
    }

    /* Loading state */
    .loading {
        text-align: center;
        color: #7f8c8d;
        font-size: 1.2rem;
        padding: 20px;
    }

    /* Media queries for responsiveness */
    @media (max-width: 768px) {
        .video-item {
            flex: 1 1 calc(50% - 10px);
            max-width: calc(50% - 10px);
        }
    }

    @media (max-width: 480px) {
        .video-item {
            flex: 1 1 100%;
            max-width: 100%;
        }
    }
</style>
