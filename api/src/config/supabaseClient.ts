import { createClient } from '@supabase/supabase-js';
import { ENV } from './env.js';

const authOptions = { auth: { persistSession: false, autoRefreshToken: false } };

/** Privileged client (bypasses RLS). Use only for public reads and token verification. */
export const supabase = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_SERVICE_ROLE_KEY,
  authOptions
);

/** Client acting as the signed-in user, so Row Level Security applies. */
export const createUserClient = (token: string) =>
  createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
    ...authOptions,
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
