import { supabase } from '../config/supabaseClient';

export const createOrder = async (userId: string) => {
  const { data: cartItems, error: cartError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId);

  if (cartError) throw new Error(cartError.message);

  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cart is empty');
  }

  let total = 0;

  for (const item of cartItems) {
    const { data: product } = await supabase
      .from('products')
      .select('price')
      .eq('id', item.product_id)
      .single();

    total += product.price * item.quantity;
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total_price: total,
      status: 'pending'
    })
    .select()
    .single();

  if (orderError) throw new Error(orderError.message);

  for (const item of cartItems) {
    const { data: product } = await supabase
      .from('products')
      .select('price')
      .eq('id', item.product_id)
      .single();

    await supabase.from('order_items').insert({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: product.price
    });
  }

  await supabase.from('cart_items').delete().eq('user_id', userId);

  return order;
};