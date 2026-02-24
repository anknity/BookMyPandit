import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return url.startsWith('http://') || url.startsWith('https://');
    } catch {
        return false;
    }
}

let supabase: SupabaseClient;

if (!isValidUrl(supabaseUrl) || !supabaseKey || supabaseKey.includes('your_')) {
    console.warn('⚠️ Supabase credentials not configured or invalid.');
    console.warn('  Set SUPABASE_URL (must be a valid URL) and SUPABASE_SERVICE_ROLE_KEY in .env');
    console.warn('  The server will start but database calls will fail.');
    // Create a dummy client — all calls will fail gracefully
    supabase = createClient(
        'https://placeholder.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MjAxNTk5OTk5OX0.placeholder'
    );
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };
