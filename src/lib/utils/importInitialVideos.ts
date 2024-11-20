import { supabase } from '$lib/supabaseClient';
import type { Database } from '$lib/database.types';

type VideoSourceType = Database['public']['Enums']['video_source_type'];

interface VideoData {
    name: string;
    url: string;
    section?: string;
    featured?: boolean;
}

const initialVideos: VideoData[] = [
    // Section Mariage
    {
        name: "Myrto & Derek",
        url: "https://youtu.be/oojG3E82yzQ",
        section: "Mariage",
        featured: true
    },
    {
        name: "Claire et Martin",
        url: "https://youtu.be/I-h4WH3tVcc",
        section: "Mariage"
    },
    {
        name: "Nathalie & Christophe",
        url: "https://youtu.be/gZJyI-PGTHI",
        section: "Mariage"
    },
    {
        name: "Charlotte et Maxime",
        url: "https://youtu.be/fCUWhh7yJls",
        section: "Mariage"
    },
    {
        name: "Nadeem et Cecile",
        url: "https://youtu.be/5J1SnYQnqLE",
        section: "Mariage"
    },
    {
        name: "Justine et Sylvain",
        url: "https://youtu.be/XNDaFRkSCjg",
        section: "Mariage"
    },
    // Litographie
    {
        name: "Litographie MARKO ZORIC",
        url: "https://youtu.be/stdlTlbi_o0",
        section: "Art"
    },
    {
        name: "La lucarne d'ariane c'est quoi",
        url: "https://youtu.be/3d6SlZscoeM",
        section: "Art"
    },
    {
        name: "Interview Agnés Gaudin",
        url: "https://youtu.be/2gHgkSrQF-A",
        section: "Art"
    },
    // Music
    {
        name: "Rien qu'ça - GOHU",
        url: "https://youtu.be/DSNs7fQifyM",
        section: "Music"
    },
    {
        name: "Hold Up - Yautjaxx",
        url: "https://youtu.be/lOygdbJni8A",
        section: "Music"
    },
    // Court Métrages
    {
        name: "UNLOCKED - Sophie Jarmouni",
        url: "https://youtu.be/YKA3anXENjQ",
        section: "Court Métrages"
    }
];

function getYoutubeId(url: string): string {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
}

export async function importInitialVideos() {
    try {
        // First, check if we already have videos
        const { data: existingVideos } = await supabase
            .from('videos')
            .select('id')
            .limit(1);

        if (existingVideos && existingVideos.length > 0) {
            console.log('Videos already exist in the database');
            return false;
        }

        // Import videos
        for (const video of initialVideos) {
            const sourceId = getYoutubeId(video.url);
            if (!sourceId) continue;

            const { data, error } = await supabase
                .from('videos')
                .insert({
                    name: video.name,
                    description: video.section || '',
                    source: 'youtube' as VideoSourceType,
                    source_id: sourceId,
                    youtube_id: sourceId, // For backward compatibility
                    thumbnail: `https://img.youtube.com/vi/${sourceId}/maxresdefault.jpg`,
                    show_logo: video.featured || false,
                    logo_type: video.featured ? 'Da' : null,
                    click_count: 0
                });

            if (error) {
                console.error(`Error importing video ${video.name}:`, error);
            }
        }

        // Create initial grid configuration
        const { data: gridConfig, error: gridError } = await supabase
            .from('grid_configurations')
            .insert({
                name: 'Default Grid',
                description: 'Initial grid configuration',
                is_active: true
            })
            .select()
            .single();

        if (gridError) {
            console.error('Error creating grid configuration:', gridError);
            return false;
        }

        // Get all videos
        const { data: videos } = await supabase
            .from('videos')
            .select('id');

        if (videos) {
            // Add videos to grid
            const gridVideos = videos.map((video, index) => ({
                grid_id: gridConfig.id,
                video_id: video.id,
                position: index
            }));

            const { error: gridVideoError } = await supabase
                .from('grid_videos')
                .insert(gridVideos);

            if (gridVideoError) {
                console.error('Error adding videos to grid:', gridVideoError);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error('Error in importInitialVideos:', error);
        return false;
    }
}
