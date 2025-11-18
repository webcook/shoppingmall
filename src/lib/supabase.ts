import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uwxxvsbkksmlpkfiukto.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3eHh2c2Jra3NtbHBrZml1a3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTk0MTcsImV4cCI6MjA3OTAzNTQxN30.r5WO-XwOpclOR9lfuDS-5rNh9xBWmXEKH1R47SE7OsA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

