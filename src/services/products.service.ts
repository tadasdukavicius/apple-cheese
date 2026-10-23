import { supabase } from '../config/supabaseClient.js';
import { fromDbError } from '../utils/dbError.js';
import type { ProductQuery } from '../schemas/index.js';
import type { Product } from '../types/index.js';

const SORTS = {
  newest: { column: 'created_at', ascending: true },
  price_asc: { column: 'price', ascending: true },
  price_desc: { column: 'price', ascending: false },
  name: { column: 'name', ascending: true },
} as const;

export const getAllProducts = async (query: ProductQuery): Promise<Product[]> => {
  let builder = supabase.from('products').select('*');

  if (query.category) builder = builder.eq('category', query.category);
  if (query.q) {
    // Strip characters that have meaning in PostgREST filter syntax / LIKE patterns
    const term = query.q.replace(/[%_,()*\\]/g, ' ').trim();
    if (term) builder = builder.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const sort = SORTS[query.sort];
  const { data, error } = await builder.order(sort.column, { ascending: sort.ascending });

  if (error) throw fromDbError(error);
  return data as Product[];
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

  if (error) throw fromDbError(error);
  return data as Product;
};
