import { supabase } from '../config/supabaseClient.js';
import { fromDbError } from '../utils/dbError.js';
import type { ContactInput } from '../schemas/index.js';

export const saveContactMessage = async ({ name, email, subject, message }: ContactInput) => {
  const { error } = await supabase.from('contact_messages').insert({ name, email, subject, message });
  if (error) throw fromDbError(error);
};
