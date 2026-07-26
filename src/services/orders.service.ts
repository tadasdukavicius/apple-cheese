import { createClient } from '@supabase/supabase-js';

const createUserClient = (token: string) =>
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

interface ShippingAddress {
  street: string;
  houseNumber: string;
  flat?: string;
  city: string;
  postalCode: string;
  country: 'Lithuania';
}

export const createOrder = async (
  userId: string,
  token: string,
  phone: string,
  shippingAddress: ShippingAddress
) => {
  const db = createUserClient(token);

  const { data: cartItems, error: cartError } = await db
    .from('cart_items')
    .select('*, products (price)')
    .eq('user_id', userId);

  if (cartError) throw new Error(cartError.message);
  if (!cartItems || cartItems.length === 0) throw new Error('Cart is empty');

  const total = cartItems.reduce((sum: number, item: any) => {
    return sum + parseFloat(item.products.price) * item.quantity;
  }, 0);

  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      user_id: userId,
      total_price: total,
      status: 'pending',
      phone,
      shipping_address: shippingAddress,
    })
    .select()
    .single();

  if (orderError) throw new Error(orderError.message);

  const orderItems = cartItems.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price_at_purchase: parseFloat(item.products.price),
  }));

  const { error: itemsError } = await db.from('order_items').insert(orderItems);

  if (itemsError) throw new Error(itemsError.message);

  await db.from('cart_items').delete().eq('user_id', userId);

  return order;
};
