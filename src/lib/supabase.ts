import { createClient } from '@supabase/supabase-js'

// Ensure we have default values to prevent runtime errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gaygfhoorpjqjeotdxmp.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Some features may not work correctly.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)