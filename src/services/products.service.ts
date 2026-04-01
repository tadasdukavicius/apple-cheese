import { supabase } from '../config/supabaseClient';

export const getAllProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');

  if (error) throw new Error(error.message);
  return data;
};

export const getProductById = async (id: any) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};