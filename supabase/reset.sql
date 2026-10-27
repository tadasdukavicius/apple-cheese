-- DESTRUCTIVE: removes every shop table and function so schema.sql can be run from scratch.
-- Use this when upgrading from an older schema. Auth users are not affected.

drop function if exists public.add_to_cart(uuid, integer);
drop function if exists public.create_order(text, jsonb, numeric, numeric);
drop function if exists public.mark_order_paid(uuid, text);

drop table if exists
  public.contact_messages,
  public.order_items,
  public.orders,
  public.cart_items,
  public.product_variants,
  public.products
cascade;
