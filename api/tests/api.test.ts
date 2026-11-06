import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AUTH, resetSupabaseMock, signInAs, supabaseState } from './helpers/supabase.js';

// The factory runs lazily, so it can use the same helper module instance as the tests below.
vi.mock('../src/config/supabaseClient.js', async () => (await import('./helpers/supabase.js')).supabaseMockModule());

const { default: app } = await import('../src/app.js');

const VARIANT_ID = '22222222-2222-4222-8222-222222222222';
const ORDER_ID = '33333333-3333-4333-8333-333333333333';
const USER_ID = '11111111-1111-4111-8111-111111111111';

const validOrder = {
  phone: '+370 600 00000',
  shippingAddress: { street: 'Gedimino pr.', houseNumber: '12', city: 'Vilnius', postalCode: 'LT-01103', country: 'Lietuva' },
};

beforeEach(() => {
  resetSupabaseMock();
  signInAs(USER_ID);
});

describe('meta endpoints', () => {
  it('reports health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('exposes pricing as the single source of truth', async () => {
    const res = await request(app).get('/api/pricing');
    expect(res.body).toEqual({ currency: 'EUR', shipping: 5.99, taxRate: 0.21 });
  });

  it('sends security headers and no X-Powered-By', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});

describe('error responses', () => {
  it('returns a coded 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nope');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('returns BAD_REQUEST for malformed JSON', async () => {
    const res = await request(app).post('/api/cart').set(AUTH).set('Content-Type', 'application/json').send('{bad');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('rejects oversized bodies', async () => {
    const res = await request(app).post('/api/cart').set(AUTH).send({ variantId: 'x'.repeat(20_000) });
    expect(res.status).toBe(413);
  });

  it('does not leak database error text', async () => {
    supabaseState.results.products = {
      data: null,
      error: { code: 'XX000', message: 'relation "secret_table" exploded at 10.0.0.5' },
    };
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
    expect(JSON.stringify(res.body)).not.toContain('secret_table');
  });
});

describe('products', () => {
  const product = (name: string, prices: number[]) => ({
    id: name,
    name,
    description: '',
    image_url: '/x.jpg',
    category: 'singles',
    features: [],
    created_at: '2026-01-01',
    variants: prices.map((price, i) => ({ id: `${name}-${i}`, product_id: name, label: `${i}`, weight_g: 1, price, sort_order: 10 - i })),
  });

  it('validates the id format', async () => {
    const res = await request(app).get('/api/products/abc');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_FAILED');
    expect(res.body.error.details[0].field).toBe('id');
  });

  it('rejects unknown categories and sorts', async () => {
    expect((await request(app).get('/api/products?category=bogus')).status).toBe(400);
    expect((await request(app).get('/api/products?sort=bogus')).status).toBe(400);
  });

  it('sorts variants by sort_order and products by their cheapest size', async () => {
    supabaseState.results.products = { data: [product('Brangus', [30, 40]), product('Pigus', [5, 50])], error: null };
    const res = await request(app).get('/api/products?sort=price_asc');
    expect(res.body.map((p: { name: string }) => p.name)).toEqual(['Pigus', 'Brangus']);
    expect(res.body[0].variants.map((v: { sort_order: number }) => v.sort_order)).toEqual([9, 10]);
    const desc = await request(app).get('/api/products?sort=price_desc');
    expect(desc.body.map((p: { name: string }) => p.name)).toEqual(['Brangus', 'Pigus']);
  });

  it('strips filter-syntax characters from search terms', async () => {
    supabaseState.results.products = { data: [], error: null };
    await request(app).get('/api/products').query({ q: 'a%,b_(c)*' });
    const orCall = supabaseState.calls.find(([, method]) => method === 'or');
    expect(orCall?.[2][0]).toBe('name.ilike.%a b c%,description.ilike.%a b c%');
  });

  it('maps a missing product to 404', async () => {
    supabaseState.results.products = { data: null, error: { code: 'PGRST116', message: 'no rows' } };
    const res = await request(app).get(`/api/products/${VARIANT_ID}`);
    expect(res.status).toBe(404);
  });
});

describe('authentication', () => {
  it('requires a token', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('rejects an invalid token', async () => {
    const res = await request(app).get('/api/cart').set('Authorization', 'Bearer nope');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_TOKEN');
  });

  it('only accepts the Bearer scheme', async () => {
    const res = await request(app).get('/api/cart').set('Authorization', 'valid-token');
    expect(res.status).toBe(401);
  });
});

describe('cart', () => {
  it('validates the add-to-cart body', async () => {
    const bodies = [{}, { variantId: 'nope' }, { variantId: VARIANT_ID, quantity: 0 }, { variantId: VARIANT_ID, quantity: 100 }, { variantId: VARIANT_ID, quantity: 1.5 }];
    for (const body of bodies) {
      const res = await request(app).post('/api/cart').set(AUTH).send(body);
      expect(res.status, JSON.stringify(body)).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_FAILED');
    }
  });

  it('adds through the add_to_cart function and defaults quantity to 1', async () => {
    supabaseState.rpc.mockResolvedValue({ data: { id: 'c1', quantity: 1 }, error: null });
    const res = await request(app).post('/api/cart').set(AUTH).send({ variantId: VARIANT_ID });
    expect(res.status).toBe(201);
    expect(supabaseState.rpc).toHaveBeenCalledWith('add_to_cart', { p_variant_id: VARIANT_ID, p_quantity: 1 });
  });

  it('scopes updates to the authenticated user', async () => {
    supabaseState.results.cart_items = { data: { id: 'c1', quantity: 3 }, error: null };
    const res = await request(app).patch(`/api/cart/${VARIANT_ID}`).set(AUTH).send({ quantity: 3 });
    expect(res.status).toBe(200);
    const eqs = supabaseState.calls.filter(([, m]) => m === 'eq').map(([, , a]) => a);
    expect(eqs).toContainEqual(['user_id', USER_ID]);
    expect(eqs).toContainEqual(['variant_id', VARIANT_ID]);
  });

  it('deletes with 204', async () => {
    supabaseState.results.cart_items = { data: null, error: null };
    const res = await request(app).delete(`/api/cart/${VARIANT_ID}`).set(AUTH);
    expect(res.status).toBe(204);
  });
});

describe('orders', () => {
  it('validates phone and address, and only accepts Lithuania', async () => {
    const bad = [
      { ...validOrder, phone: 'abc' },
      { ...validOrder, shippingAddress: { ...validOrder.shippingAddress, country: 'Latvija' } },
      { ...validOrder, shippingAddress: { ...validOrder.shippingAddress, street: '' } },
      { phone: validOrder.phone },
    ];
    for (const body of bad) {
      const res = await request(app).post('/api/orders').set(AUTH).send(body);
      expect(res.status, JSON.stringify(body)).toBe(400);
    }
  });

  it('creates orders with server-side pricing and ignores client-supplied amounts', async () => {
    supabaseState.rpc.mockResolvedValue({ data: { id: ORDER_ID, status: 'pending' }, error: null });
    const res = await request(app).post('/api/orders').set(AUTH).send({ ...validOrder, total: 0.01, subtotal: 0.01 });
    expect(res.status).toBe(201);
    expect(supabaseState.rpc).toHaveBeenCalledWith('create_order', {
      p_phone: validOrder.phone,
      p_shipping_address: validOrder.shippingAddress,
      p_shipping_price: 5.99,
      p_tax_rate: 0.21,
    });
  });

  it('turns an empty cart into a coded 400 with a Lithuanian message', async () => {
    supabaseState.rpc.mockResolvedValue({ data: null, error: { code: 'P0001', message: 'Cart is empty' } });
    const res = await request(app).post('/api/orders').set(AUTH).send(validOrder);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatchObject({ code: 'CART_EMPTY', message: 'Krepšelis tuščias' });
  });

  it('pays a pending order and records the provider reference', async () => {
    supabaseState.results.orders = { data: { id: ORDER_ID, status: 'pending', total_price: 39.27 }, error: null };
    supabaseState.rpc.mockResolvedValue({ data: { id: ORDER_ID, status: 'paid' }, error: null });
    const res = await request(app).post(`/api/orders/${ORDER_ID}/pay`).set(AUTH);
    expect(res.status).toBe(200);
    expect(supabaseState.rpc).toHaveBeenCalledWith('mark_order_paid', {
      p_order_id: ORDER_ID,
      p_reference: expect.stringMatching(/^fake_/),
    });
  });

  it('refuses to pay an order that is not pending, without charging', async () => {
    supabaseState.results.orders = { data: { id: ORDER_ID, status: 'paid', total_price: 39.27 }, error: null };
    const res = await request(app).post(`/api/orders/${ORDER_ID}/pay`).set(AUTH);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('ORDER_NOT_PAYABLE');
    expect(supabaseState.rpc).not.toHaveBeenCalled();
  });

  it("returns 404 for someone else's order (row-level security hides it)", async () => {
    supabaseState.results.orders = { data: null, error: { code: 'PGRST116', message: 'no rows' } };
    const res = await request(app).get(`/api/orders/${ORDER_ID}`).set(AUTH);
    expect(res.status).toBe(404);
  });
});
