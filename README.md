# Obuolių sūris: API

Express + TypeScript REST API for an online shop selling **obuolių sūris** ("apple cheese"), a traditional Lithuanian confection of slow-cooked apples pressed into a block, in flavours such as classic, chilli, nuts, honey and cinnamon. Data and authentication are provided by Supabase (Postgres + Auth).

This repository is the **backend**. The Next.js storefront lives in [`apple-cheese`](https://github.com/tadasdukavicius/apple-cheese).

> **This is a portfolio project.** Payment is simulated and no orders are fulfilled.

## Features

- Product catalogue with search, category filter and sort. Products have size variants that carry the price.
- Per-user cart, order creation and order history, protected by Supabase Auth and Postgres row-level security.
- Atomic order creation in a single database transaction, with totals computed server-side.
- Payment behind a provider interface, with a fake provider for demos.
- Public contact endpoint with validation, a honeypot field and a strict rate limit.
- Consistent error responses with stable, machine-readable error codes.

## Tech stack

| Area | Choice |
| --- | --- |
| Runtime and language | Node.js 20+, TypeScript (strict) |
| Framework | Express 5 |
| Validation | zod |
| Security | helmet, CORS allow-list, express-rate-limit, request body size limit |
| Database and auth | Supabase (Postgres, Row Level Security, Auth) |
| Dev tooling | tsx (watch mode), `tsc` |

## Getting started

### Prerequisites

- Node.js 20 or newer
- A free [Supabase](https://supabase.com) project

### 1. Create the database

In the Supabase **SQL Editor**, run these files in order:

1. [`supabase/schema.sql`](./supabase/schema.sql): tables, row-level security policies and the SQL functions.
2. [`supabase/seed.sql`](./supabase/seed.sql): a sample catalogue (6 products, sizes and prices in EUR).

Upgrading from an older version of the schema? Run [`supabase/reset.sql`](./supabase/reset.sql) first. **It deletes all shop data** (auth users are not affected). To re-seed only the catalogue, run `delete from public.products;` and then `seed.sql` again.

### 2. Configure

```bash
cp .env.example .env
```

Fill in the values from **Project Settings → API** in Supabase. The server validates its configuration on startup and refuses to start with a clear message if anything is missing.

### 3. Run

```bash
npm install
npm run dev          # http://localhost:8008
```

Check it is up: `curl http://localhost:8008/api/health`

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | no | Port to listen on. Default `8008` |
| `NODE_ENV` | no | `development`, `test` or `production`. In development, unexpected 500 errors include a `details` field |
| `CORS_ORIGINS` | no | Comma-separated list of allowed browser origins. Default `http://localhost:3000`. Set this to your storefront URL in any deployment |
| `SUPABASE_URL` | yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | yes | Public key. Used together with the caller's JWT, so row-level security applies |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | **Secret** key. Bypasses row-level security. Used only for public product reads and token verification. Never expose it or commit it |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start with file watching (tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |
| `npm run typecheck` | Type-check without emitting |

## Endpoints

All routes are under `/api`. Authenticated routes need `Authorization: Bearer <Supabase access token>`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | no | Liveness check |
| GET | `/pricing` | no | Currency (EUR), flat shipping and tax rate |
| GET | `/products` | no | List products. Query: `q` (search), `category` (`singles`, `gift_sets`), `sort` (`newest`, `price_asc`, `price_desc`, `name`). Each product includes its size `variants`; price sorting uses the cheapest size |
| GET | `/products/:id` | no | Product detail with variants |
| POST | `/contact` | no | Contact form `{ name, email, subject, message }` (5 per 10 min per IP) |
| GET | `/cart` | yes | Cart items with their variant and product |
| POST | `/cart` | yes | Add `{ variantId, quantity }` (increments existing) |
| PATCH | `/cart/:variantId` | yes | Set `{ quantity }` |
| DELETE | `/cart/:variantId` | yes | Remove item |
| GET | `/orders` | yes | Your orders with items, newest first |
| GET | `/orders/:id` | yes | One of your orders |
| POST | `/orders` | yes | Create an order from the cart `{ phone, shippingAddress }` |
| POST | `/orders/:id/pay` | yes | Pay a pending order through the payment provider |

### Errors

Every error has the same shape:

```json
{ "error": { "code": "VALIDATION_FAILED", "message": "Neteisingi duomenys", "details": [{ "field": "id", "message": "Neteisingas UUID" }] } }
```

`message` is Lithuanian because it is shown to shoppers. `code` (see [`src/utils/AppError.ts`](./src/utils/AppError.ts)) is stable and machine-readable, so clients can switch on it. Server logs, startup configuration errors and SQL exceptions are in English.

## Project structure

```
src/
  app.ts, server.ts   Express app setup and entry point
  config/             Validated env, pricing rules, Supabase clients
  routes/             Route definitions
  controllers/        Thin request handlers
  services/           Business logic and database access
  schemas/            zod request schemas
  middleware/         Auth, validation, error handling
  payments/           PaymentProvider interface and fake provider
  types/, utils/      Shared types, AppError, database error mapping
supabase/
  schema.sql          Tables, RLS policies, functions
  seed.sql            Sample catalogue
  reset.sql           Destructive reset
```

## Design notes

- **Row Level Security.** Cart and order queries run with the caller's own JWT, so Postgres enforces ownership. The service-role key is used only for public product reads and token verification.
- **Variants.** A product is a flavour. Each purchasable size (for example 150 g or 300 g) is a row in `product_variants` and carries the price. Order items store a snapshot of the name, size, price and image at purchase time, so old orders stay correct if the catalogue changes.
- **Atomic orders.** `create_order()` (a SQL function) builds the order and its items and clears the cart in one transaction. Totals come from database prices. The client never sends amounts.
- **Pricing rules** live in [`src/config/pricing.ts`](./src/config/pricing.ts): EUR, 5.99 flat shipping and 21% VAT. The storefront reads them from `GET /pricing`, so there is a single source of truth.
- **Payments.** `src/payments/` defines a `PaymentProvider` interface and a fake provider that always approves. To add a real provider (Stripe, Paysera), implement `charge()` and swap it in `payments/index.ts`. Orders start as `pending`, and `mark_order_paid()` is the only write path for payment state.
- **Database errors never leak.** Supabase errors are mapped to fixed responses and logged on the server.

## Known limitations

- **Payment is simulated.** No real provider is integrated.
- **No automated tests or CI yet.**
- **VAT is added on top of the subtotal.** EU consumer prices usually include VAT.
- **One flat shipping rate and one destination country (Lithuania).** There is no stock tracking, discount codes, order cancellation, admin API or transactional email.
- **The contact form stores messages in the `contact_messages` table.** Nothing sends or reads them automatically.
- **Rate limiting is in memory per process.** It does not share state across multiple instances. Express `trust proxy` is also not configured, so behind a reverse proxy (as on most hosting platforms) all clients may share one rate-limit bucket until that is set.
- **The address schema accepts only the country value `Lietuva`.**
