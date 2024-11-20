export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type VideoSourceType = 'youtube' | 'vimeo' | 'local';
export type LogoType = 'Da' | 'Yoann';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          password: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          password: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          password?: string
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          name: string
          description: string | null
          source: VideoSourceType
          source_id: string
          youtube_id: string | null
          thumbnail: string
          show_logo: boolean
          logo_type: LogoType | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          source?: VideoSourceType
          source_id: string
          youtube_id?: string | null
          thumbnail: string
          show_logo?: boolean
          logo_type?: LogoType | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          source?: VideoSourceType
          source_id?: string
          youtube_id?: string | null
          thumbnail?: string
          show_logo?: boolean
          logo_type?: LogoType | null
          created_at?: string
          updated_at?: string
        }
      }
      grid_configurations: {
        Row: {
          id: string
          name: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      grid_videos: {
        Row: {
          id: string
          grid_id: string
          video_id: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          grid_id: string
          video_id: string
          position: number
          created_at?: string
        }
        Update: {
          id?: string
          grid_id?: string
          video_id?: string
          position?: number
          created_at?: string
        }
      }
      video_clicks: {
        Row: {
          id: string
          video_id: string
          user_id: string
          clicked_at: string
        }
        Insert: {
          id?: string
          video_id: string
          user_id: string
          clicked_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          user_id?: string
          clicked_at?: string
        }
      }
    }
    Functions: {
      increment_video_click: {
        Args: {
          video_uuid: string
        }
        Returns: void
      }
    }
    Enums: {
      video_source_type: VideoSourceType
      logo_type: LogoType
    }
  }
}
