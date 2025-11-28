import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Construct Supabase URL from project ID
const SUPABASE_URL = `https://${projectId}.supabase.co`;
const SUPABASE_ANON_KEY = publicAnonKey;

// Log successful configuration
console.log('✅ Supabase client initialized');
console.log(`📡 Project: ${projectId}`);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
