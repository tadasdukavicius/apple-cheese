import { createUserClient } from '../config/supabaseClient.js';
import { fromDbError } from '../utils/dbError.js';
import type { CartItem } from '../types/index.js';

export const getCart = async (userId: string, token: string) => {
  const { data, error } = await createUserClient(token)
    .from('cart_items')
    .select('*, product_variants (*, products (id, name, image_url))')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw fromDbError(error);
  return data;
};

/** Adds to the existing quantity atomically (see add_to_cart in supabase/schema.sql). */
export const addToCart = async (variantId: string, quantity: number, token: string) => {
  const { data, error } = await createUserClient(token).rpc('add_to_cart', {
    p_variant_id: variantId,
    p_quantity: quantity,
  });

  if (error) throw fromDbError(error);
  return data as CartItem;
};

export const updateCartItemQuantity = async (
  userId: string,
  variantId: string,
  quantity: number,
  token: string
): Promise<CartItem> => {
  const { data, error } = await createUserClient(token)
    .from('cart_items')
    .update({ quantity })
    .eq('user_id', userId)
    .eq('variant_id', variantId)
    .select()
    .single();

  if (error) throw fromDbError(error);
  return data as CartItem;
};

export const removeFromCart = async (
  userId: string,
  variantId: string,
  token: string
): Promise<void> => {
  const { error } = await createUserClient(token)
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('variant_id', variantId);

  if (error) throw fromDbError(error);
};
