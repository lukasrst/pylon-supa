import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Dieser Client ist speziell für Client-Komponenten in Next.js optimiert
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);