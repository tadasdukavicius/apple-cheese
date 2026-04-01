import 'dotenv/config';

export const ENV = {
  PORT: process.env.PORT || 8008,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: 'https://vctrvpjvmggkrxctuspc.supabase.com',
  SUPABASE_SERVICE_ROLE_KEY: 'REDACTED'
};