import { createClient } from '@supabase/supabase-js';
import { CartItem } from '../types/cart.types';

const createUserClient = (token: string) =>
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number,
  token: string
): Promise<CartItem[]> => {
  const { data, error } = await createUserClient(token)
    .from('cart_items')
    .upsert(
      { user_id: userId, product_id: productId, quantity },
      { onConflict: 'user_id,product_id' }
    )
    .select();

  if (error) throw new Error(error.message);

  return data as CartItem[];
};

export const getCart = async (userId: string, token: string) => {
  const { data, error } = await createUserClient(token)
    .from('cart_items')
    .select(`*, products (*)`)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  return data;
};

export const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  quantity: number,
  token: string
): Promise<CartItem> => {
  const { data, error } = await createUserClient(token)
    .from('cart_items')
    .update({ quantity })
    .eq('user_id', userId)
    .eq('product_id', productId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data as CartItem;
};

export const removeFromCart = async (
  userId: string,
  productId: string,
  token: string
): Promise<void> => {
  const { error } = await createUserClient(token)
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw new Error(error.message);
};
