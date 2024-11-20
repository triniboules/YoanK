import { supabase } from '../supabase'
import type { Database } from '../database.types'

type Video = Database['public']['Tables']['videos']['Row']
type GridConfig = Database['public']['Tables']['grid_configurations']['Row']

// Video Operations
export async function getAllVideos(): Promise<Video[]> {
    const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function createVideo(video: {
  name: string;
  description: string;
  youtubeId: string;
  sourceId: string;
  source: string;
  thumbnail: string;
  showLogo: boolean;
  logoType: string;
}): Promise<Video> {
  try {
    const now = new Date().toISOString();
    const newVideo = {
      ...video,
      created_at: now,
      updated_at: now,
      click_count: 0
    };

    const { data, error } = await supabase
      .from('videos')
      .insert([newVideo])
      .select()
      .single();

    if (error) {
      console.error('Error creating video:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from video creation');
    }

    return data;
  } catch (err) {
    console.error('Failed to create video:', err);
    throw new Error(err instanceof Error ? err.message : 'Failed to create video');
  }
}

export async function updateVideo(id: string, updates: Partial<Video>) {
    const { error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', id)
    
    if (error) throw error
}

export async function deleteVideo(id: string) {
    const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id)
    
    if (error) throw error
}

// Grid Configuration Operations
export async function getGridConfigs(): Promise<GridConfig[]> {
    const { data, error } = await supabase
        .from('grid_configurations')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function createGridConfig(name: string, description: string = ''): Promise<string> {
    const now = new Date().toISOString();
    const newGrid = {
        name,
        description: description || '',  // Ensure description is never null
        video_order: [] as string[],    // Initialize as empty array
        created_at: now,
        updated_at: now
    };

    try {
        const { data, error } = await supabase
            .from('grid_configurations')
            .insert([newGrid])
            .select('id')
            .single();
        
        if (error) {
            console.error('Supabase error creating grid:', error);
            throw new Error(error.message);
        }
        
        if (!data) {
            throw new Error('No data returned from grid creation');
        }
        
        return data.id;
    } catch (err) {
        console.error('Failed to create grid configuration:', err);
        throw new Error(err instanceof Error ? err.message : 'Failed to create grid configuration');
    }
}

export async function updateGridConfig(id: string, updates: Partial<GridConfig>) {
    const { error } = await supabase
        .from('grid_configurations')
        .update(updates)
        .eq('id', id)
    
    if (error) throw error
}

export async function deleteGridConfig(id: string) {
    const { error } = await supabase
        .from('grid_configurations')
        .delete()
        .eq('id', id)
    
    if (error) throw error
}

// Grid Video Operations
export async function addVideoToGrid(gridId: string, videoId: string, position: number) {
    const { error } = await supabase
        .from('grid_videos')
        .insert([{
            grid_id: gridId,
            video_id: videoId,
            position
        }])
    
    if (error) throw error
}

export async function removeVideoFromGrid(gridId: string, videoId: string) {
    const { error } = await supabase
        .from('grid_videos')
        .delete()
        .match({ grid_id: gridId, video_id: videoId })
    
    if (error) throw error
}

export async function updateVideoPosition(gridId: string, videoId: string, newPosition: number) {
    const { error } = await supabase
        .from('grid_videos')
        .update({ position: newPosition })
        .match({ grid_id: gridId, video_id: videoId })
    
    if (error) throw error
}

export async function getGridVideos(gridId: string) {
    const { data, error } = await supabase
        .from('grid_videos')
        .select(`
            video_id,
            position,
            videos (*)
        `)
        .eq('grid_id', gridId)
        .order('position')
    
    if (error) throw error
    return data?.map(item => ({
        ...item.videos,
        position: item.position
    })) || []
}

// Analytics Operations
export async function recordVideoClick(videoId: string, userId: string = 'anonymous') {
    const [clickError, updateError] = await Promise.all([
        // Record the click
        supabase
            .from('video_clicks')
            .insert([{
                video_id: videoId,
                user_id: userId
            }]),
        // Increment the click count
        supabase
            .from('videos')
            .update({ click_count: supabase.sql`click_count + 1` })
            .eq('id', videoId)
    ]).then(([clickResult, updateResult]) => [clickResult.error, updateResult.error])

    if (clickError) throw clickError
    if (updateError) throw updateError
}

export async function recordHeaderClick(type: 'contact' | 'logoCenter' | 'logoLeft', userId: string = 'anonymous') {
    const { error } = await supabase
        .from('header_clicks')
        .insert([{
            click_type: type,
            user_id: userId
        }])
    
    if (error) throw error
}
