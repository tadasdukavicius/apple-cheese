# Apple & Cheese API

Express + TypeScript API for the Apple & Cheese shop, backed by Supabase (Postgres + Auth).
The Next.js frontend lives in the sibling `apple-cheese` repo.

## Setup

1. Create a Supabase project and run [`supabase/schema.sql`](./supabase/schema.sql), then [`supabase/seed.sql`](./supabase/seed.sql) in the SQL editor.
2. `cp .env.example .env` and fill in the Supabase URL and keys. The server refuses to start if the configuration is invalid.
3. Install and run:

```bash
npm install
npm run dev        # http://localhost:8008
npm run build && npm start
npm run typecheck
```

## Endpoints

All routes are under `/api`. Authenticated routes need `Authorization: Bearer <Supabase access token>`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | no | Liveness check |
| GET | `/pricing` | no | Currency (EUR), flat shipping and tax rate |
| GET | `/products` | no | List products |
| GET | `/products/:id` | no | Product detail |
| GET | `/cart` | yes | Cart items with products |
| POST | `/cart` | yes | Add `{ productId, quantity }` (increments existing) |
| PATCH | `/cart/:productId` | yes | Set `{ quantity }` |
| DELETE | `/cart/:productId` | yes | Remove item |
| POST | `/orders` | yes | Create order from cart `{ phone, shippingAddress }` |

Errors use one shape: `{ "error": { "message": "...", "details": [...] } }`.

## Design notes

- **Row Level Security:** cart and order queries run with the caller's JWT, so Postgres enforces ownership. The service-role key is used only for public product reads and token verification.
- **Atomic orders:** `create_order()` (SQL function) builds the order, its items and clears the cart in one transaction. Totals are computed from database prices; the client never sends amounts.
- **Pricing rules** live in [`src/config/pricing.ts`](./src/config/pricing.ts) (EUR, 5.99 shipping, 21% VAT).
- **Payments:** not integrated yet. Orders are created with status `pending`.
