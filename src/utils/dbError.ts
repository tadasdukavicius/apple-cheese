import type { PostgrestError } from '@supabase/supabase-js';
import { AppError } from './AppError.js';

/** Maps a Supabase error to an AppError without leaking internals to clients. */
export const fromDbError = (error: PostgrestError): AppError => {
  switch (error.code) {
    case 'PGRST116':
      return AppError.notFound();
    case '22P02':
      return AppError.badRequest('INVALID_ID', 'Neteisingas identifikatorius');
    case '23503':
      return AppError.badRequest('REFERENCE_NOT_FOUND', 'Susijęs įrašas neegzistuoja');
    case '28000':
      return AppError.unauthorized();
    case 'P0001':
      // Raised on purpose by create_order() / mark_order_paid() in supabase/schema.sql.
      // The SQL messages are English (internal); shoppers get the Lithuanian text below.
      if (/cart is empty/i.test(error.message)) {
        return AppError.badRequest('CART_EMPTY', 'Krepšelis tuščias');
      }
      return AppError.badRequest('ORDER_NOT_PAYABLE', 'Užsakymas nerastas arba jo negalima apmokėti');
    default:
      console.error('Database error:', error);
      return new AppError(500, 'INTERNAL_ERROR', 'Vidinė serverio klaida');
  }
};
