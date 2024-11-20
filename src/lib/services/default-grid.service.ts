import { supabase } from '$lib/supabase';

interface Video {
    name: string;
    description: string;
    source_id: string;
    thumbnail?: string;
    position: number;
    show_logo: boolean;
    logo_type: 'Da' | 'Yoann' | null;
    category: 'wedding' | 'other';
}

const DEFAULT_VIDEOS: Video[] = [
    // Weddings
    {
        name: "Myrto & Derek",
        description: "Wedding Highlights",
        source_id: "oojG3E82yzQ",
        position: 0,
        show_logo: true,
        logo_type: "Yoann",
        category: "wedding"
    },
    {
        name: "Claire & Martin",
        description: "Wedding Celebration",
        source_id: "I-h4WH3tVcc",
        position: 1,
        show_logo: true,
        logo_type: "Yoann",
        category: "wedding"
    },
    {
        name: "Nathalie & Christophe",
        description: "Wedding Day",
        source_id: "gZJyI-PGTHI",
        position: 2,
        show_logo: true,
        logo_type: "Yoann",
        category: "wedding"
    },
    // Others
    {
        name: "Les Nuits du Réal",
        description: "Documentary",
        source_id: "R2PnDV97Zrg",
        position: 3,
        show_logo: true,
        logo_type: "Yoann",
        category: "other"
    },
    {
        name: "La Lucarne d'Arianne",
        description: "Art Film",
        source_id: "3d6SlZscoeM",
        position: 4,
        show_logo: true,
        logo_type: "Yoann",
        category: "other"
    },
    {
        name: "Litographie - Marko Zoric",
        description: "Art Documentary",
        source_id: "stdlTlbi_o0",
        position: 5,
        show_logo: true,
        logo_type: "Yoann",
        category: "other"
    },
    {
        name: "Unlocked - Sophie Jarmouni",
        description: "Music Video",
        source_id: "YKA3anXENjQ",
        position: 6,
        show_logo: true,
        logo_type: "Da",
        category: "other"
    },
    {
        name: "Rien qu'ça - GOHU",
        description: "Music Video",
        source_id: "DSNs7fQifyM",
        position: 7,
        show_logo: true,
        logo_type: "Da",
        category: "other"
    },
    {
        name: "Hold Up - Yautjaxx",
        description: "Music Video",
        source_id: "lOygdbJni8A",
        position: 8,
        show_logo: true,
        logo_type: "Da",
        category: "other"
    }
];

export async function createDefaultGrid() {
    try {
        // 1. Create two grid configurations: Weddings and Others
        const { data: weddingGridData, error: weddingGridError } = await supabase
            .from('grid_configurations')
            .insert({
                name: 'Wedding Collection',
                description: 'Beautiful wedding video highlights',
                is_active: true
            })
            .select()
            .single();

        if (weddingGridError) throw weddingGridError;

        const { data: othersGridData, error: othersGridError } = await supabase
            .from('grid_configurations')
            .insert({
                name: 'Other Productions',
                description: 'Music videos, documentaries, and art films',
                is_active: true
            })
            .select()
            .single();

        if (othersGridError) throw othersGridError;

        // 2. Insert all videos
        const videoPromises = DEFAULT_VIDEOS.map(async (video) => {
            const { data: videoData, error: videoError } = await supabase
                .from('videos')
                .insert({
                    name: video.name,
                    description: video.description,
                    source: 'youtube',
                    source_id: video.source_id,
                    thumbnail: `https://img.youtube.com/vi/${video.source_id}/maxresdefault.jpg`,
                    show_logo: video.show_logo,
                    logo_type: video.logo_type,
                    click_count: 0
                })
                .select()
                .single();

            if (videoError) throw videoError;
            return { ...videoData, category: video.category, position: video.position };
        });

        const videos = await Promise.all(videoPromises);

        // 3. Create grid_videos relationships with positions
        const gridVideoPromises = videos.map((video) => {
            const gridId = video.category === 'wedding' ? weddingGridData.id : othersGridData.id;
            return supabase
                .from('grid_videos')
                .insert({
                    grid_id: gridId,
                    video_id: video.id,
                    position: video.position
                });
        });

        await Promise.all(gridVideoPromises);

        return {
            success: true,
            message: 'Default grids created successfully',
            grids: {
                wedding: weddingGridData.id,
                others: othersGridData.id
            }
        };
    } catch (error) {
        console.error('Error creating default grids:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create default grids',
            grids: null
        };
    }
}
