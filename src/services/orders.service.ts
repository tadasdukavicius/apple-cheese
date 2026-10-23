import { createUserClient } from '../config/supabaseClient.js';
import { PRICING } from '../config/pricing.js';
import { fromDbError } from '../utils/dbError.js';
import type { CreateOrderInput } from '../schemas/index.js';

/**
 * Creates the order, its items and clears the cart in a single transaction
 * (see create_order in supabase/schema.sql). Totals are computed in the database
 * from current product prices; the client never supplies amounts.
 */
export const createOrder = async (token: string, input: CreateOrderInput) => {
  const { data, error } = await createUserClient(token).rpc('create_order', {
    p_phone: input.phone,
    p_shipping_address: input.shippingAddress,
    p_shipping_price: PRICING.shipping,
    p_tax_rate: PRICING.taxRate,
  });

  if (error) throw fromDbError(error);
  return data;
};
