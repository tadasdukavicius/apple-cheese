import { createUserClient } from '../config/supabaseClient.js';
import { PRICING } from '../config/pricing.js';
import { paymentProvider } from '../payments/index.js';
import { AppError } from '../utils/AppError.js';
import { fromDbError } from '../utils/dbError.js';
import type { CreateOrderInput } from '../schemas/index.js';
import type { Order } from '../types/index.js';

const ORDER_SELECT = '*, order_items (id, product_name, variant_label, image_url, quantity, price_at_purchase)';

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
  return data as Order;
};

export const listOrders = async (userId: string, token: string) => {
  const { data, error } = await createUserClient(token)
    .from('orders')
    .select(ORDER_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw fromDbError(error);
  return data;
};

export const getOrder = async (id: string, userId: string, token: string) => {
  const { data, error } = await createUserClient(token)
    .from('orders')
    .select(ORDER_SELECT)
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw fromDbError(error);
  return data;
};

/** Charges the order through the payment provider, then records it as paid. */
export const payOrder = async (id: string, userId: string, token: string) => {
  const order = await getOrder(id, userId, token);
  if (order.status !== 'pending') throw AppError.badRequest('ORDER_NOT_PAYABLE', 'Užsakymas nelaukia apmokėjimo');

  const result = await paymentProvider.charge({
    orderId: order.id,
    amount: Number(order.total_price),
    currency: PRICING.currency,
  });
  if (!result.success) throw new AppError(402, 'PAYMENT_FAILED', `Apmokėjimas nepavyko: ${result.reason}`);

  const { data, error } = await createUserClient(token).rpc('mark_order_paid', {
    p_order_id: id,
    p_reference: result.reference,
  });

  if (error) throw fromDbError(error);
  return data as Order;
};
