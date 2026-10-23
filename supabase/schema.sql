-- Apple & Cheese schema. Run in the Supabase SQL editor (or via the Supabase CLI), then run seed.sql.

create extension if not exists pgcrypto;

-- Tables ---------------------------------------------------------------------

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text not null default '',
  price       numeric(10,2) not null check (price >= 0),
  image_url   text not null default '',
  features    text[] not null default '{}',
  created_at  timestamptz not null default now()
);

create table if not exists public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity   integer not null check (quantity between 1 and 99),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id),
  status           text not null default 'pending'
                   check (status in ('pending', 'paid', 'shipped', 'cancelled')),
  currency         text not null default 'EUR',
  subtotal         numeric(10,2) not null,
  shipping_price   numeric(10,2) not null,
  tax_price        numeric(10,2) not null,
  total_price      numeric(10,2) not null,
  phone            text not null,
  shipping_address jsonb not null,
  created_at       timestamptz not null default now()
);

create table if not exists public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders(id) on delete cascade,
  product_id        uuid not null references public.products(id),
  quantity          integer not null check (quantity > 0),
  price_at_purchase numeric(10,2) not null
);

create index if not exists cart_items_user_idx  on public.cart_items(user_id);
create index if not exists orders_user_idx      on public.orders(user_id);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- Row Level Security ---------------------------------------------------------

alter table public.products    enable row level security;
alter table public.cart_items  enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

create policy "products are public"
  on public.products for select using (true);

create policy "users manage their own cart"
  on public.cart_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users read their own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "users read their own order items"
  on public.order_items for select
  using (exists (
    select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
  ));

-- Orders are written only through create_order() below (no insert policies).

-- Functions (security invoker: RLS applies as the calling user) --------------

create or replace function public.add_to_cart(p_product_id uuid, p_quantity integer)
returns public.cart_items
language plpgsql
security invoker
as $$
declare
  result public.cart_items;
begin
  insert into public.cart_items (user_id, product_id, quantity)
  values (auth.uid(), p_product_id, p_quantity)
  on conflict (user_id, product_id)
  do update set quantity = least(public.cart_items.quantity + excluded.quantity, 99)
  returning * into result;

  return result;
end;
$$;

-- Creates an order from the caller's cart atomically. Orders have no insert
-- policy, so this function runs as definer but only ever acts for auth.uid().
create or replace function public.create_order(
  p_phone            text,
  p_shipping_address jsonb,
  p_shipping_price   numeric,
  p_tax_rate         numeric
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user     uuid := auth.uid();
  v_subtotal numeric(10,2);
  v_tax      numeric(10,2);
  v_order    public.orders;
begin
  if v_user is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  select coalesce(sum(p.price * c.quantity), 0)
    into v_subtotal
    from cart_items c
    join products p on p.id = c.product_id
   where c.user_id = v_user;

  if v_subtotal = 0 then
    raise exception 'Cart is empty' using errcode = 'P0001';
  end if;

  v_tax := round(v_subtotal * p_tax_rate, 2);

  insert into orders (user_id, subtotal, shipping_price, tax_price, total_price, phone, shipping_address)
  values (v_user, v_subtotal, p_shipping_price, v_tax,
          v_subtotal + p_shipping_price + v_tax, p_phone, p_shipping_address)
  returning * into v_order;

  insert into order_items (order_id, product_id, quantity, price_at_purchase)
  select v_order.id, c.product_id, c.quantity, p.price
    from cart_items c
    join products p on p.id = c.product_id
   where c.user_id = v_user;

  delete from cart_items where user_id = v_user;

  return v_order;
end;
$$;

revoke all on function public.create_order(text, jsonb, numeric, numeric) from public, anon;
grant execute on function public.create_order(text, jsonb, numeric, numeric) to authenticated;
