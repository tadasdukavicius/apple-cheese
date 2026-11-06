// A small stateful stand-in for the Express API and Supabase Auth, used only by the end-to-end tests.
// It follows the real API's contract (see apple-cheese-express/README.md) but keeps everything in memory.
import http from 'node:http';

const PORT = Number(process.env.MOCK_PORT || 8110);
const TOKEN = 'mock-access-token';
const PASSWORD = 'slaptazodis123';
const SHIPPING = 5.99;
const TAX_RATE = 0.21;

const id = (n, i = 0) => `${String(n).padStart(8, '0')}-0000-4000-8000-${String(i).padStart(12, '0')}`;

const make = (n, name, category, image, description, sizes) => ({
  id: id(n),
  name,
  description,
  image_url: image,
  category,
  features: ['Be pieno produktų', 'Lėtai džiovintas'],
  created_at: '2026-01-01T00:00:00Z',
  variants: sizes.map(([label, weight_g, price], i) => ({
    id: id(n, i + 1), product_id: id(n), label, weight_g, price, sort_order: i + 1,
  })),
});

const PRODUCTS = [
  make(1, 'Klasikinis obuolių sūris', 'singles', '/images/products/classic.jpg', 'Tradicinis lietuviškas obuolių sūris: lėtai troškinti obuoliai.', [['150 g', 150, 5.9], ['300 g', 300, 10.5], ['600 g', 600, 19]]),
  make(2, 'Obuolių sūris su čili', 'singles', '/images/products/chilli.jpg', 'Saldūs obuoliai su čili pipirų aštrumu.', [['150 g', 150, 6.5], ['300 g', 300, 11.5]]),
  make(3, 'Riešutinis obuolių sūris', 'singles', '/images/products/nuts.jpg', 'Su graikiniais ir lazdyno riešutais.', [['150 g', 150, 7.2], ['300 g', 300, 12.9]]),
  make(4, 'Medumi saldintas obuolių sūris', 'singles', '/images/products/honey.jpg', 'Saldintas medumi, o ne cukrumi.', [['150 g', 150, 6.9], ['300 g', 300, 12.2]]),
  make(5, 'Cinamoninis obuolių sūris', 'singles', '/images/products/cinnamon.jpg', 'Su šilta cinamono gaida.', [['150 g', 150, 6.2], ['300 g', 300, 11]]),
  make(6, 'Degustacinė dovanų dėžutė', 'gift_sets', '/images/products/gift-box.jpg', 'Visi penki skoniai vienoje dėžutėje.', [['5 × 100 g', 500, 26.9], ['5 × 200 g', 1000, 48]]),
];
const allVariants = PRODUCTS.flatMap((p) => p.variants.map((v) => ({ ...v, product: p })));

let cart, orders, contactMessages;
const reset = () => { cart = []; orders = []; contactMessages = []; };
reset();

const round2 = (n) => Math.round(n * 100) / 100;

const cartView = () =>
  cart.map((c) => {
    const v = allVariants.find((x) => x.id === c.variant_id);
    return {
      id: `cart-${c.variant_id}`, variant_id: c.variant_id, quantity: c.quantity,
      product_variants: { id: v.id, label: v.label, weight_g: v.weight_g, price: v.price,
        products: { id: v.product.id, name: v.product.name, image_url: v.product.image_url } },
    };
  });

const send = (res, status, body) => {
  res.statusCode = status;
  if (body === undefined) return res.end();
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
};
const fail = (res, status, code, message, details) => send(res, status, { error: { code, message, ...(details ? { details } : {}) } });

const readBody = (req) => new Promise((resolve) => {
  let raw = '';
  req.on('data', (d) => (raw += d));
  req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); } });
});

const session = (email) => ({
  access_token: TOKEN, token_type: 'bearer', expires_in: 3600, refresh_token: 'mock-refresh',
  user: { id: 'user-1', aud: 'authenticated', role: 'authenticated', email, created_at: '2026-01-15T10:00:00Z', app_metadata: {}, user_metadata: {} },
});

const server = http.createServer(async (req, res) => {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', '*');
  res.setHeader('access-control-allow-methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return send(res, 204);

  const url = new URL(req.url, 'http://mock');
  const path = url.pathname;
  const body = ['POST', 'PATCH'].includes(req.method) ? await readBody(req) : {};

  // --- test helpers -------------------------------------------------------------------
  if (path === '/__reset') { reset(); return send(res, 200, { ok: true }); }
  if (path === '/__contact') return send(res, 200, contactMessages);

  // --- Supabase Auth ---------------------------------------------------------------
  if (path === '/auth/v1/token') {
    if (body.password === PASSWORD) return send(res, 200, session(body.email));
    return send(res, 400, { code: 'invalid_credentials', error_code: 'invalid_credentials', msg: 'Invalid login credentials', message: 'Invalid login credentials' });
  }
  if (path === '/auth/v1/signup') {
    if (body.email === 'existing@example.lt') return send(res, 422, { code: 'user_already_exists', msg: 'User already registered' });
    return send(res, 200, session(body.email));
  }
  if (path === '/auth/v1/logout') return send(res, 204);
  if (path === '/auth/v1/user') return send(res, 200, session('jonas@example.lt').user);

  // --- API -----------------------------------------------------------------------------
  if (!path.startsWith('/api/')) return fail(res, 404, 'NOT_FOUND', 'Nerasta');
  const route = path.slice(5);

  if (route === 'health') return send(res, 200, { status: 'ok' });
  if (route === 'pricing') return send(res, 200, { currency: 'EUR', shipping: SHIPPING, taxRate: TAX_RATE });

  if (route === 'products') {
    let list = [...PRODUCTS];
    const c = url.searchParams.get('category'); if (c) list = list.filter((p) => p.category === c);
    const q = url.searchParams.get('q')?.toLowerCase(); if (q) list = list.filter((p) => (p.name + p.description).toLowerCase().includes(q));
    const from = (p) => Math.min(...p.variants.map((v) => v.price));
    const sort = url.searchParams.get('sort');
    if (sort === 'price_asc') list.sort((a, b) => from(a) - from(b));
    if (sort === 'price_desc') list.sort((a, b) => from(b) - from(a));
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'lt'));
    return send(res, 200, list);
  }
  const productMatch = route.match(/^products\/(.+)$/);
  if (productMatch) {
    const p = PRODUCTS.find((x) => x.id === productMatch[1]);
    return p ? send(res, 200, p) : fail(res, 404, 'NOT_FOUND', 'Nerasta');
  }

  if (route === 'contact' && req.method === 'POST') {
    if (!body.name || !body.email || !body.subject || !body.message) return fail(res, 400, 'VALIDATION_FAILED', 'Neteisingi duomenys');
    contactMessages.push(body);
    return send(res, 201, { ok: true });
  }

  // everything below needs a signed-in user
  if (req.headers.authorization !== `Bearer ${TOKEN}`) return fail(res, 401, 'UNAUTHORIZED', 'Reikia prisijungti');

  if (route === 'cart' && req.method === 'GET') return send(res, 200, cartView());
  if (route === 'cart' && req.method === 'POST') {
    if (!allVariants.some((v) => v.id === body.variantId)) return fail(res, 400, 'VALIDATION_FAILED', 'Neteisingi duomenys');
    const existing = cart.find((c) => c.variant_id === body.variantId);
    if (existing) existing.quantity = Math.min(existing.quantity + (body.quantity ?? 1), 99);
    else cart.push({ variant_id: body.variantId, quantity: body.quantity ?? 1 });
    return send(res, 201, { ok: true });
  }
  const cartMatch = route.match(/^cart\/(.+)$/);
  if (cartMatch && req.method === 'PATCH') {
    const item = cart.find((c) => c.variant_id === cartMatch[1]);
    if (!item) return fail(res, 404, 'NOT_FOUND', 'Nerasta');
    item.quantity = body.quantity;
    return send(res, 200, item);
  }
  if (cartMatch && req.method === 'DELETE') { cart = cart.filter((c) => c.variant_id !== cartMatch[1]); return send(res, 204); }

  if (route === 'orders' && req.method === 'GET') return send(res, 200, [...orders].reverse());
  if (route === 'orders' && req.method === 'POST') {
    const a = body.shippingAddress ?? {};
    if (!/^\+?[0-9 ()-]{6,20}$/.test(body.phone ?? '') || a.country !== 'Lietuva' || !a.street || !a.city) {
      return fail(res, 400, 'VALIDATION_FAILED', 'Neteisingi duomenys');
    }
    if (cart.length === 0) return fail(res, 400, 'CART_EMPTY', 'Krepšelis tuščias');
    const items = cartView().map((c, i) => ({
      id: `oi-${orders.length}-${i}`, product_name: c.product_variants.products.name, variant_label: c.product_variants.label,
      image_url: c.product_variants.products.image_url, quantity: c.quantity, price_at_purchase: c.product_variants.price,
    }));
    const subtotal = round2(items.reduce((s, i) => s + i.quantity * i.price_at_purchase, 0));
    const tax = round2(subtotal * TAX_RATE);
    const order = {
      id: id(900 + orders.length, 1), status: 'pending', currency: 'EUR', subtotal, shipping_price: SHIPPING, tax_price: tax,
      total_price: round2(subtotal + SHIPPING + tax), phone: body.phone, shipping_address: a,
      created_at: new Date().toISOString(), order_items: items,
    };
    orders.push(order);
    cart = [];
    return send(res, 201, order);
  }
  const orderMatch = route.match(/^orders\/([^/]+)(\/pay)?$/);
  if (orderMatch) {
    const order = orders.find((o) => o.id === orderMatch[1]);
    if (!order) return fail(res, 404, 'NOT_FOUND', 'Nerasta');
    if (orderMatch[2] && req.method === 'POST') {
      if (order.status !== 'pending') return fail(res, 400, 'ORDER_NOT_PAYABLE', 'Užsakymas nelaukia apmokėjimo');
      order.status = 'paid';
      return send(res, 200, order);
    }
    return send(res, 200, order);
  }

  return fail(res, 404, 'NOT_FOUND', 'Nerasta');
});

server.listen(PORT, () => console.log(`Mock API listening on http://localhost:${PORT}`));
