import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gaygfhoorpjqjeotdxmp.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseAnonKey) {
  console.warn('Missing Supabase anon key. Some features may not work correctly.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)