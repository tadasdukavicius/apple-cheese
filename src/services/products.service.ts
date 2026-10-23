import { supabase } from '../config/supabaseClient.js';
import { fromDbError } from '../utils/dbError.js';
import type { Product } from '../types/index.js';

export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw fromDbError(error);
  return data as Product[];
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

  if (error) throw fromDbError(error);
  return data as Product;
};
