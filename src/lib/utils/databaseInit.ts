import { supabase } from '../supabaseClient';
import type { Database } from '../database.types';

export async function initializeDatabase() {
    try {
        // Step 1: Check and create tables if they don't exist
        await createTablesIfNotExist();
        
        // Step 2: Create default grid if none exists
        await createDefaultGridIfNeeded();
        
        // Step 3: Ensure all required columns exist
        await ensureColumns();

        return true;
    } catch (error) {
        console.error('Database initialization failed:', error);
        return false;
    }
}

async function createTablesIfNotExist() {
    // Check if videos table exists
    const { count: videosCount, error: videosError } = await supabase
        .from('videos')
        .select('count')
        .single();

    if (videosError) {
        // Create videos table
        await supabase.rpc('create_videos_table');
    }

    // Check if grid_configurations table exists
    const { count: gridsCount, error: gridsError } = await supabase
        .from('grid_configurations')
        .select('count')
        .single();

    if (gridsError) {
        // Create grid_configurations table
        await supabase.rpc('create_grid_configurations_table');
    }

    // Check if users table exists
    const { count: usersCount, error: usersError } = await supabase
        .from('users')
        .select('count')
        .single();

    if (usersError) {
        // Create users table
        await supabase.rpc('create_users_table');
    }
}

async function createDefaultGridIfNeeded() {
    const { data: grids, error: gridError } = await supabase
        .from('grid_configurations')
        .select('*');

    if (!gridError && (!grids || grids.length === 0)) {
        await supabase
            .from('grid_configurations')
            .insert({
                name: 'Default Grid',
                description: 'Initial grid configuration',
                is_active: true
            });
    }
}

async function ensureColumns() {
    // Check for missing columns and add them if needed
    const { data: columns, error } = await supabase
        .rpc('get_table_columns', { table_name: 'videos' });

    if (!error && columns) {
        // Check for missing columns in videos table
        const requiredColumns = [
            'source',
            'source_id',
            'youtube_id',
            'thumbnail',
            'show_logo',
            'logo_type',
            'click_count'
        ];

        for (const column of requiredColumns) {
            if (!columns.includes(column)) {
                await supabase.rpc('add_column_to_videos', {
                    column_name: column,
                    column_type: getColumnType(column)
                });
            }
        }
    }
}

function getColumnType(columnName: string): string {
    switch (columnName) {
        case 'source':
            return 'text';
        case 'source_id':
            return 'text';
        case 'youtube_id':
            return 'text';
        case 'thumbnail':
            return 'text';
        case 'show_logo':
            return 'boolean';
        case 'logo_type':
            return 'text';
        case 'click_count':
            return 'integer';
        default:
            return 'text';
    }
}

export async function resetDatabase() {
    try {
        // Delete all data from tables
        await supabase.from('videos').delete().neq('id', '0');
        await supabase.from('grid_configurations').delete().neq('id', '0');
        
        // Recreate default data
        await createDefaultGridIfNeeded();
        
        return true;
    } catch (error) {
        console.error('Database reset failed:', error);
        return false;
    }
}

export async function checkDatabaseHealth(): Promise<{
    healthy: boolean;
    tables: { name: string; exists: boolean; rowCount: number }[];
    missingColumns: { table: string; columns: string[] }[];
}> {
    const health = {
        healthy: true,
        tables: [] as { name: string; exists: boolean; rowCount: number }[],
        missingColumns: [] as { table: string; columns: string[] }[]
    };

    try {
        // Check each table
        const tables = ['videos', 'grid_configurations', 'users'];
        for (const table of tables) {
            const { count, error } = await supabase
                .from(table)
                .select('count')
                .single();

            health.tables.push({
                name: table,
                exists: !error,
                rowCount: count || 0
            });

            if (error) health.healthy = false;
        }

        // Check columns
        const { data: columns } = await supabase
            .rpc('get_table_columns', { table_name: 'videos' });

        const requiredColumns = [
            'id', 'name', 'description', 'source', 'source_id',
            'youtube_id', 'thumbnail', 'show_logo', 'logo_type',
            'click_count', 'created_at', 'updated_at'
        ];

        const missingColumns = requiredColumns.filter(col => !columns?.includes(col));
        if (missingColumns.length > 0) {
            health.missingColumns.push({
                table: 'videos',
                columns: missingColumns
            });
            health.healthy = false;
        }

        return health;
    } catch (error) {
        console.error('Health check failed:', error);
        health.healthy = false;
        return health;
    }
}
