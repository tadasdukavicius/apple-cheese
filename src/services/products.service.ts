import { supabase } from '../config/supabaseClient.js';
import { fromDbError } from '../utils/dbError.js';
import type { ProductQuery } from '../schemas/index.js';
import type { Product } from '../types/index.js';

const PRODUCT_SELECT = '*, variants:product_variants(*)';

const withSortedVariants = (product: Product): Product => ({
  ...product,
  variants: [...product.variants].sort((a, b) => a.sort_order - b.sort_order),
});

const startingPrice = (product: Product) =>
  product.variants.length ? Math.min(...product.variants.map((v) => v.price)) : Infinity;

export const getAllProducts = async (query: ProductQuery): Promise<Product[]> => {
  let builder = supabase.from('products').select(PRODUCT_SELECT);

  if (query.category) builder = builder.eq('category', query.category);
  if (query.q) {
    // Strip characters that have meaning in PostgREST filter syntax / LIKE patterns
    const term = query.q.replace(/[%_,()*\\]/g, ' ').trim();
    if (term) builder = builder.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const { data, error } = await builder.order('created_at', { ascending: true });
  if (error) throw fromDbError(error);

  const products = (data as Product[]).map(withSortedVariants);

  // Price lives on variants, so price sorting uses each product's cheapest size
  switch (query.sort) {
    case 'price_asc':
      return products.sort((a, b) => startingPrice(a) - startingPrice(b));
    case 'price_desc':
      return products.sort((a, b) => startingPrice(b) - startingPrice(a));
    case 'name':
      return products.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return products;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .single();

  if (error) throw fromDbError(error);
  return withSortedVariants(data as Product);
};
