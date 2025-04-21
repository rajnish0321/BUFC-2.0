import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallbacks to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://fcndolvwbsafrcqqwood.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbmRvbHZ3YnNhZnJjcXF3b29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjA2OTAsImV4cCI6MjA2MDM5NjY5MH0.N-8JkCyqX7_GqoT8HsVnWrYI8BkTDezmYnjqr5SSMlo";

// Log which configuration is being used
console.log('Using Supabase URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
