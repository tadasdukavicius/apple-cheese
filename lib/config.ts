// NEXT_PUBLIC_* variables are inlined at build time, so each must be referenced literally.
const isProd = process.env.NODE_ENV === 'production';

function required(name: string, value: string | undefined, devDefault?: string): string {
  if (value) return value;
  if (!isProd && devDefault) return devDefault;
  throw new Error(
    `Missing environment variable ${name}. Copy .env.example to .env and fill it in (see README, "Environment variables").`
  );
}

/** API base URL, always ending in a single slash, so both "…/api" and "…/api/" work. */
export const API_BASE_URL =
  required('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL, 'http://localhost:8008/api').replace(/\/+$/, '') + '/';

export const SUPABASE_URL = required('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL);
export const SUPABASE_ANON_KEY = required('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
