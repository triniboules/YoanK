import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types'

const supabaseUrl = 'https://eipimijegvcgesqbkrmm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcGltaWplZ3ZjZ2VzcWJrcm1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMTYwMTcsImV4cCI6MjA0NzU5MjAxN30.MDzEU0EvW4MDnz4PPivH-p_BNeLEoNzqNF5k_Wt8tSA';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
    db: {
        schema: 'public'
    }
})

export interface Video {
    id: string
    name: string
    description: string
    youtubeId: string
    thumbnail: string
    showLogo: boolean
    logoType: string
    position: number
    gridId: string | null
    created_at?: string
    updated_at?: string
}

export interface VideoGrid {
    id: string
    name: string
    description: string
    created_at: string
    updated_at: string
}

/**
 * Creates a new video grid
 */
export async function createVideoGrid(name: string, description: string = '') {
    const { data, error } = await supabase
        .from('video_grids')
        .insert([{ name, description }])
        .select()
        .single()
    
    if (error) throw error
    return data.id
}

/**
 * Updates a video grid's metadata
 */
export async function updateVideoGrid(gridId: string, updates: Partial<VideoGrid>) {
    const { error } = await supabase
        .from('video_grids')
        .update(updates)
        .eq('id', gridId)
    
    if (error) throw error
}

/**
 * Fetches all video grids
 */
export async function fetchVideoGrids() {
    const { data, error } = await supabase
        .from('video_grids')
        .select('*')
        .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
}

/**
 * Deletes a video grid (preserves videos)
 */
export async function deleteVideoGrid(gridId: string) {
    // First update all videos to remove grid reference
    const { error: updateError } = await supabase
        .from('videos')
        .update({ gridId: null })
        .eq('gridId', gridId)
    
    if (updateError) throw updateError

    // Then delete the grid
    const { error } = await supabase
        .from('video_grids')
        .delete()
        .eq('id', gridId)
    
    if (error) throw error
}

/**
 * Fetches videos for a specific grid
 */
export async function fetchGridVideos(gridId: string) {
    const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('gridId', gridId)
        .order('position')
    
    if (error) throw error
    return data
}

/**
 * Fetches all videos not assigned to any grid
 */
export async function fetchOrphanedVideos() {
    const { data, error } = await supabase
        .from('videos')
        .select('*')
        .is('gridId', null)
        .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
}

/**
 * Updates video positions in a grid
 */
export async function updateVideoPositions(updates: Array<{ id: string, position: number }>) {
    const { error } = await supabase.from('videos').upsert(
        updates.map(({ id, position }) => ({
            id,
            position,
            updated_at: new Date().toISOString()
        }))
    )
    
    if (error) throw error
}

/**
 * Creates a new video
 */
export async function createVideo(videoData: Omit<Video, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
        .from('videos')
        .insert([videoData])
        .select()
        .single()
    
    if (error) throw error
    return data.id
}

/**
 * Updates a video
 */
export async function updateVideo(videoId: string, updates: Partial<Video>) {
    const { error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', videoId)
    
    if (error) throw error
}

/**
 * Deletes a video
 */
export async function deleteVideo(videoId: string) {
    const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId)
    
    if (error) throw error
}

/**
 * Records a video click
 */
export async function recordVideoClick(videoId: string, userId: string = 'anonymous') {
    const { error } = await supabase
        .from('video_clicks')
        .insert([{
            videoId,
            userId,
            clicked_at: new Date().toISOString()
        }])
    
    if (error) throw error
}

/**
 * Records a header click
 */
export async function recordHeaderClick(type: 'contact' | 'logoCenter' | 'logoLeft', userId: string) {
    const { error } = await supabase
        .from('header_clicks')
        .insert([{
            type,
            userId,
            clicked_at: new Date().toISOString()
        }])
    
    if (error) throw error
}

/**
 * Fetches header click statistics
 */
export async function fetchHeaderClicks() {
    const { data, error } = await supabase
        .from('header_clicks')
        .select('type, count(*)')
        .group('type')
    
    if (error) throw error
    
    const clicks = data.reduce((acc, { type, count }) => {
        acc[`${type}Clicks`] = count
        return acc
    }, {
        contactClicks: 0,
        logoCenterClicks: 0,
        logoLeftClicks: 0
    })
    
    return clicks
}
