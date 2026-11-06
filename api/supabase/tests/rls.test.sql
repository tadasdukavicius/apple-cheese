-- Behavioural tests for the database: seed data, row-level security, and the SQL functions.
-- Run by scripts/db-test.sh after the stubs, migrations and seed have been applied.
-- Any failed assertion raises an exception and stops the run with a non-zero exit code.

\set ON_ERROR_STOP on
\set a '''aaaaaaaa-0000-4000-8000-000000000001'''
\set b '''bbbbbbbb-0000-4000-8000-000000000002'''

insert into auth.users (id, email) values (:a, 'a@test.lt'), (:b, 'b@test.lt');

create function public._assert(cond boolean, msg text) returns void language plpgsql as $$
begin
  if not coalesce(cond, false) then raise exception 'ASSERT FAILED: %', msg; end if;
end $$;

-- Runs a statement and returns its error message, or null when it succeeds.
create function public._error_of(stmt text) returns text language plpgsql as $$
begin
  execute stmt;
  return null;
exception when others then
  return sqlerrm;
end $$;

create table public._t (k text primary key, v uuid);

select public._assert((select count(*) from products) = 6, 'seed has 6 products');
select public._assert((select count(*) from product_variants) = 13, 'seed has 13 variants');

-- Anonymous visitors -----------------------------------------------------------
set role anon;
select public._assert((select count(*) from products) = 6, 'anon can read products');
select public._assert((select count(*) from product_variants) = 13, 'anon can read variants');
select public._assert((select count(*) from cart_items) = 0, 'anon sees no carts');
select public._assert(
  public._error_of($q$ select public.create_order('+370 600 00000', '{}'::jsonb, 5.99, 0.21) $q$) ilike '%permission denied%',
  'anon cannot call create_order');
reset role;

-- User A: cart ---------------------------------------------------------------------
select set_config('request.jwt.claim.sub', :a, false);
set role authenticated;

select public.add_to_cart((select v.id from product_variants v join products p on p.id = v.product_id
                            where p.name = 'Klasikinis obuolių sūris' and v.label = '300 g'), 2);
select public.add_to_cart((select v.id from product_variants v join products p on p.id = v.product_id
                            where p.name = 'Klasikinis obuolių sūris' and v.label = '300 g'), 2);
select public._assert((select quantity from cart_items) = 4, 'add_to_cart increments an existing item');

select public.add_to_cart((select v.id from product_variants v join products p on p.id = v.product_id
                            where p.name = 'Klasikinis obuolių sūris' and v.label = '300 g'), 99);
select public._assert((select quantity from cart_items) = 99, 'add_to_cart caps quantity at 99');

update cart_items set quantity = 2;
select public.add_to_cart((select v.id from product_variants v join products p on p.id = v.product_id
                            where p.name = 'Obuolių sūris su čili' and v.label = '150 g'), 1);
select public._assert((select count(*) from cart_items) = 2, 'A has two cart lines');
select public._assert(
  public._error_of($q$ insert into cart_items (user_id, variant_id, quantity)
                        select auth.uid(), id, 0 from product_variants limit 1 $q$) is not null,
  'quantity 0 is rejected');
reset role;

-- User B cannot see or touch A's cart ------------------------------------------
select set_config('request.jwt.claim.sub', :b, false);
set role authenticated;
select public._assert((select count(*) from cart_items) = 0, 'B cannot see A cart');
select public._assert(
  public._error_of($q$ select public.create_order('+370 600 00001', '{}'::jsonb, 5.99, 0.21) $q$) ilike '%cart is empty%',
  'create_order fails on an empty cart');
reset role;

-- User A: order ----------------------------------------------------------------------
select set_config('request.jwt.claim.sub', :a, false);
set role authenticated;
insert into public._t
select 'order', id from public.create_order(
  '+370 600 00000',
  '{"street":"Gedimino pr.","houseNumber":"12","city":"Vilnius","postalCode":"LT-01103","country":"Lietuva"}'::jsonb,
  5.99, 0.21);
reset role;

-- 2 x 10.50 + 1 x 6.50 = 27.50; VAT 21% = 5.78; total = 27.50 + 5.99 + 5.78 = 39.27
select public._assert((select subtotal from orders) = 27.50, 'order subtotal is computed from DB prices');
select public._assert((select tax_price from orders) = 5.78, 'order VAT is rounded to cents');
select public._assert((select total_price from orders) = 39.27, 'order total = subtotal + shipping + VAT');
select public._assert((select status from orders) = 'pending', 'new order is pending');
select public._assert((select count(*) from order_items) = 2, 'order has two items');
select public._assert(
  (select price_at_purchase from order_items where product_name = 'Klasikinis obuolių sūris' and variant_label = '300 g') = 10.50,
  'order items snapshot name, size and price');
select public._assert((select count(*) from cart_items) = 0, 'cart is cleared by create_order');

-- Orders are private to their owner and only writable through the functions ---
set role authenticated;
select public._assert((select count(*) from orders) = 1, 'A sees their own order');
select public._assert((select count(*) from order_items) = 2, 'A sees their own order items');
select public._assert(
  public._error_of($q$ insert into orders (user_id, subtotal, shipping_price, tax_price, total_price, phone, shipping_address)
                        values (auth.uid(), 1, 1, 1, 1, 'x', '{}') $q$) is not null,
  'direct inserts into orders are denied');
update orders set status = 'paid', total_price = 0;
reset role;
select public._assert((select status from orders) = 'pending' and (select total_price from orders) = 39.27,
  'direct updates to orders have no effect');

select set_config('request.jwt.claim.sub', :b, false);
set role authenticated;
select public._assert((select count(*) from orders) = 0, 'B cannot see A orders');
select public._assert((select count(*) from order_items) = 0, 'B cannot see A order items');
select public._assert(
  public._error_of(format($q$ select public.mark_order_paid(%L, 'x') $q$, (select v from public._t where k = 'order'))) ilike '%not payable%',
  'B cannot pay A order');
reset role;

-- Payment state ------------------------------------------------------------------------
select set_config('request.jwt.claim.sub', :a, false);
set role authenticated;
select public.mark_order_paid((select v from public._t where k = 'order'), 'fake_ref_1');
reset role;
select public._assert((select status from orders) = 'paid' and (select payment_reference from orders) = 'fake_ref_1',
  'owner can mark a pending order as paid');
select public._assert((select paid_at from orders) is not null, 'paid_at is set');

set role authenticated;
select public._assert(
  public._error_of(format($q$ select public.mark_order_paid(%L, 'fake_ref_2') $q$, (select v from public._t where k = 'order'))) ilike '%not payable%',
  'an order cannot be paid twice');
reset role;

-- Contact messages are not readable through the public API --------------------------
insert into contact_messages (name, email, subject, message) values ('Test', 't@test.lt', 'Hi', 'Hello there, this is a test.');
set role anon;
select public._assert((select count(*) from contact_messages) = 0, 'anon cannot read contact messages');
reset role;
set role authenticated;
select public._assert((select count(*) from contact_messages) = 0, 'authenticated users cannot read contact messages');
reset role;

\echo 'All database tests passed'
