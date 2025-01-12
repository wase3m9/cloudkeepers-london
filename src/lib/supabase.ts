import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gaygfhoorpjqjeotdxmp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdheWdmaG9vcnBqcWplb3RkeG1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2ODcwNjAsImV4cCI6MjA1MjI2MzA2MH0.SEsKhWvM7zpq3Diz_sr-fIgNPtyTsEdhtBFuOP4FAnI'

if (!supabaseAnonKey) {
  console.warn('Missing Supabase anon key. Some features may not work correctly.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)