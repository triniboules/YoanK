import { supabase } from '$lib/supabaseClient';
import type { Database } from '$lib/database.types';

type Video = Database['public']['Tables']['videos']['Row'];
type GridConfig = Database['public']['Tables']['grid_configurations']['Row'];
type GridVideo = Database['public']['Tables']['grid_videos']['Row'];

export async function setupDatabase() {
    try {
        // Step 1: Create necessary tables
        await createTables();
        
        // Step 2: Create enums if they don't exist
        await createEnums();
        
        // Step 3: Add necessary columns
        await addColumns();

        return { success: true };
    } catch (error) {
        console.error('Database setup failed:', error);
        return { success: false, error };
    }
}

async function createTables() {
    // Create videos table
    await supabase.rpc('execute_sql', {
        sql_query: `
            CREATE TABLE IF NOT EXISTS videos (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) NOT NULL,
                description TEXT,
                source VARCHAR(50) NOT NULL,
                source_id VARCHAR(255) NOT NULL,
                youtube_id VARCHAR(50),
                thumbnail VARCHAR(255),
                show_logo BOOLEAN DEFAULT false,
                logo_type VARCHAR(50),
                click_count INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `
    });

    // Create grid_configurations table
    await supabase.rpc('execute_sql', {
        sql_query: `
            CREATE TABLE IF NOT EXISTS grid_configurations (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) NOT NULL,
                description TEXT,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `
    });

    // Create grid_videos table
    await supabase.rpc('execute_sql', {
        sql_query: `
            CREATE TABLE IF NOT EXISTS grid_videos (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                grid_id UUID REFERENCES grid_configurations(id) ON DELETE CASCADE,
                video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
                position INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(grid_id, position)
            );
        `
    });
}

async function createEnums() {
    await supabase.rpc('execute_sql', {
        sql_query: `
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'video_source_type') THEN
                    CREATE TYPE video_source_type AS ENUM ('youtube', 'vimeo', 'local');
                END IF;
                
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'logo_type') THEN
                    CREATE TYPE logo_type AS ENUM ('Da', 'Yoann');
                END IF;
            END
            $$;
        `
    });
}

async function addColumns() {
    // Add any missing columns or modify existing ones
    await supabase.rpc('execute_sql', {
        sql_query: `
            DO $$
            BEGIN
                -- Add columns to videos table if they don't exist
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'videos' AND column_name = 'click_count') THEN
                    ALTER TABLE videos ADD COLUMN click_count INTEGER DEFAULT 0;
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'videos' AND column_name = 'show_logo') THEN
                    ALTER TABLE videos ADD COLUMN show_logo BOOLEAN DEFAULT false;
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'videos' AND column_name = 'logo_type') THEN
                    ALTER TABLE videos ADD COLUMN logo_type logo_type;
                END IF;

                -- Add any other necessary columns here
            END
            $$;
        `
    });
}

export async function checkDatabaseSetup(): Promise<{
    success: boolean;
    tables: { name: string; exists: boolean }[];
    enums: { name: string; exists: boolean }[];
}> {
    const tables = ['videos', 'grid_configurations', 'grid_videos'];
    const enums = ['video_source_type', 'logo_type'];
    
    const tableResults = await Promise.all(
        tables.map(async (table) => {
            const { count, error } = await supabase
                .from(table)
                .select('count')
                .limit(1);
            
            return {
                name: table,
                exists: !error
            };
        })
    );

    const enumResults = await Promise.all(
        enums.map(async (enum_name) => {
            const { data, error } = await supabase.rpc('check_enum_exists', {
                enum_name
            });
            
            return {
                name: enum_name,
                exists: data && !error
            };
        })
    );

    const success = tableResults.every(t => t.exists) && enumResults.every(e => e.exists);

    return {
        success,
        tables: tableResults,
        enums: enumResults
    };
}
