import { supabase } from '../config/supabaseClient';
import { CartItem } from '../types/cart.types';

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<CartItem[]> => {
  const { data, error } = await supabase
    .from('cart_items')
    .upsert(
      {
        user_id: userId,
        product_id: productId,
        quantity
      },
      { onConflict: 'user_id,product_id' }
    )
    .select();

  if (error) throw new Error(error.message);

  return data as CartItem[];
};

export const getCart = async (userId: string) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      products (*)
    `)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  return data;
};