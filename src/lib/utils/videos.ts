import { supabase } from '$lib/supabaseClient';

export interface Video {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    source: string;
    source_id: string;
    thumbnail: string;
    position: number;
    user_id: string;
}

export const fetchVideos = async (): Promise<Video[]> => {
    try {
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .order('position')
            .range(0, 8);  // Get first 9 videos (0-8)

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching videos: ", error);
        return [];
    }
};

export const updateVideoPosition = async (videoId: string, newPosition: number): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('videos')
            .update({ position: newPosition })
            .eq('id', videoId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Error updating video position: ", error);
        return false;
    }
};

export const createVideo = async (video: Omit<Video, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Video | null> => {
    try {
        const { data, error } = await supabase
            .from('videos')
            .insert([{
                ...video,
                source: video.source || 'youtube',
                source_id: video.source_id || video.source_id // YouTube ID
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error creating video: ", error);
        return null;
    }
};

export const updateVideo = async (id: string, video: Partial<Video>): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('videos')
            .update(video)
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Error updating video: ", error);
        return false;
    }
};

export const deleteVideo = async (id: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('videos')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Error deleting video: ", error);
        return false;
    }
};

export const subscribeToVideos = (callback: (payload: any) => void) => {
    const channel = supabase.channel('videos-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'videos' },
            callback
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};
