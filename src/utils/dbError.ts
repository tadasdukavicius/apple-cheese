import type { PostgrestError } from '@supabase/supabase-js';
import { AppError } from './AppError.js';

/** Maps a Supabase error to an AppError without leaking internals to clients. */
export const fromDbError = (error: PostgrestError): AppError => {
  if (error.code === 'PGRST116') return AppError.notFound();
  if (error.code === '22P02') return AppError.badRequest('Invalid identifier');
  if (error.code === '23503') return AppError.badRequest('Referenced record does not exist');
  if (error.code === 'P0001') return AppError.badRequest(error.message);
  console.error('Database error:', error);
  return new AppError(500, 'Internal Server Error');
};
