import { supabase } from '../supabase';
import type { Database } from '../database.types';

type VideoInsert = Database['public']['Tables']['videos']['Insert'];

const defaultVideos: VideoInsert[] = [
    {
        name: "Myrtho & Derek",
        description: "Myrtho & Derek's video",
        source: "youtube",
        source_id: "oojG3E82yzQ",
        youtube_id: "oojG3E82yzQ",
        thumbnail: "/image/1.webp",
        position: 0,
        show_logo: false,
        logo_type: null
    },
    {
        name: "Claire & Martin",
        description: "Claire & Martin's video",
        source: "youtube",
        source_id: "I-h4WH3tVcc",
        youtube_id: "I-h4WH3tVcc",
        thumbnail: "/image/2.webp",
        position: 1,
        show_logo: false,
        logo_type: null
    },
    {
        name: "Nathalie & Christophe",
        description: "Nathalie & Christophe's video",
        source: "youtube",
        source_id: "gZJyI-PGTHI",
        youtube_id: "gZJyI-PGTHI",
        thumbnail: "/image/3.webp",
        position: 2,
        show_logo: false,
        logo_type: null
    },
    {
        name: "Les Nuits du Réal",
        description: "Les Nuits du Réal video",
        source: "youtube",
        source_id: "R2PnDV97Zrg",
        youtube_id: "R2PnDV97Zrg",
        thumbnail: "/image/4.webp",
        position: 3,
        show_logo: false,
        logo_type: null
    },
    {
        name: "La Lucarne d'Arianne",
        description: "La Lucarne d'Arianne video",
        source: "youtube",
        source_id: "3d6SlZscoeM",
        youtube_id: "3d6SlZscoeM",
        thumbnail: "/image/5.webp",
        position: 4,
        show_logo: false,
        logo_type: null
    },
    {
        name: "Litographie - Marko Zoric",
        description: "Litographie - Marko Zoric video",
        source: "youtube",
        source_id: "stdlTlbi_o0",
        youtube_id: "stdlTlbi_o0",
        thumbnail: "/image/6.webp",
        position: 5,
        show_logo: false,
        logo_type: null
    },
    {
        name: "Unlocked - Sophie Jarmouni",
        description: "Unlocked - Sophie Jarmouni video",
        source: "youtube",
        source_id: "YKA3anXENjQ",
        youtube_id: "YKA3anXENjQ",
        thumbnail: "/image/7.webp",
        position: 6,
        show_logo: false,
        logo_type: null
    },
    {
        name: "Rien qu'ça - GOHU",
        description: "Rien qu'ça - GOHU video",
        source: "youtube",
        source_id: "DSNs7fQifyM",
        youtube_id: "DSNs7fQifyM",
        thumbnail: "/image/8.webp",
        position: 7,
        show_logo: false,
        logo_type: null
    },
    {
        name: "Hold Up - Yautjaxx",
        description: "Hold Up - Yautjaxx video",
        source: "youtube",
        source_id: "lOygdbJni8A",
        youtube_id: "lOygdbJni8A",
        thumbnail: "/image/9.webp",
        position: 8,
        show_logo: false,
        logo_type: null
    }
];

export async function importDefaultVideos() {
    try {
        // Delete all existing videos first
        const { error: deleteError } = await supabase
            .from('videos')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except a non-existent ID

        if (deleteError) {
            console.error('Error deleting existing videos:', deleteError);
            return { success: false, error: 'Failed to delete existing videos' };
        }

        // Insert default videos
        const { error: insertError } = await supabase
            .from('videos')
            .insert(defaultVideos);

        if (insertError) {
            console.error('Error inserting default videos:', insertError);
            return { success: false, error: 'Failed to insert default videos' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error in importDefaultVideos:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}
