# Obuolių sūris: storefront

A full-stack e-commerce portfolio project: an online shop for **obuolių sūris** ("apple cheese"), a traditional Lithuanian confection of slow-cooked apples pressed into a sliceable block. Despite the name it contains no dairy. The shop sells it in several flavours (classic, chilli, nuts, honey, cinnamon) and in several sizes, plus a tasting gift box.

This repository is the **Next.js storefront**. The REST API lives in a separate repository: [`apple-cheese-express`](https://github.com/tadasdukavicius/apple-cheese-express).

> **This is a demonstration shop.** Payment is simulated and no orders are fulfilled. The interface is Lithuanian only, because it is designed for the Lithuanian market.

## Features

- **Catalogue:** server-rendered product list with search, category filter and sort. Prices are shown as "from" the cheapest size.
- **Product pages:** size selector with a live price, delivery and returns summary, per-product page titles and social previews.
- **Cart:** persistent per-user cart with optimistic quantity updates (rolled back if the request fails), item count in the header, and a retry state when loading fails.
- **Checkout:** validated address and phone form (react-hook-form + zod), order summary with shipping and VAT, order confirmation page and order history.
- **Accounts:** email and password sign-up and sign-in with Supabase Auth, protected pages that return you to where you were, and Lithuanian translations of the common auth errors.
- **Contact form:** validated, with a honeypot field, posting to a rate-limited API endpoint.
- **Content pages:** story, delivery and returns, FAQ, image credits.
- **SEO and sharing:** `sitemap.xml`, `robots.txt`, generated Open Graph image, `noindex` on private pages.
- **Accessibility:** skip link, visible focus styles, labelled form controls with linked error messages, `aria-current` navigation, respects `prefers-reduced-motion`.
- **Design:** warm ivory and ink palette with one forest-green accent, Newsreader (serif) for headings and Geist for text, with a mobile-first layout (checked at 375px and desktop widths).

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 with design tokens in `app/globals.css` |
| Forms and validation | react-hook-form, zod |
| Auth and database client | Supabase (`@supabase/supabase-js`) |
| Backend | [Express API](https://github.com/tadasdukavicius/apple-cheese-express) |
| Fonts | Newsreader and Geist via `next/font` (with the `latin-ext` subset for Lithuanian letters) |

## Architecture

```
Browser ──► Next.js storefront ──► Express API ──► Supabase (Postgres + RLS)
   │         (server-rendered         (validation,        ▲
   │          catalogue pages)         pricing, orders)   │
   └───────────── sign-in / sign-up (Supabase Auth) ──────┘
```

- Catalogue pages are rendered on the server by calling the API. The home page is revalidated every 60 seconds.
- Sign-in happens directly against Supabase Auth in the browser. The resulting access token is sent to the API as a bearer token for cart and order requests.
- The API never trusts amounts from the client. Totals are calculated in the database from current prices. The storefront only displays them.

## Getting started

### Prerequisites

- Node.js 20 or newer
- A free [Supabase](https://supabase.com) project
- The API running locally (see its README), which also contains the SQL for the database

### 1. Set up the backend

Follow the setup steps in the [API repository](https://github.com/tadasdukavicius/apple-cheese-express): run `supabase/schema.sql` and `supabase/seed.sql` in your Supabase project, configure its `.env`, and start it with `npm run dev` (it listens on port 8008).

### 2. Configure the storefront

```bash
cp .env.example .env
```

Fill in the values from your Supabase project (**Project Settings → API**).

### 3. Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

In Supabase, under **Authentication → Providers → Email**, you can turn off "Confirm email" while developing, so new accounts can sign in immediately.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | yes | Base URL of the API **including** `/api/` and the trailing slash, e.g. `http://localhost:8008/api/` |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | The public (anon or publishable) key. It is safe to expose because row-level security protects the data |
| `NEXT_PUBLIC_SITE_URL` | no | Public URL of the site, used for the sitemap and social previews. Defaults to `http://localhost:3000` |

Never put the Supabase **service-role / secret** key in this project. It belongs only in the API.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Project structure

```
app/            Routes (App Router): home, products, cart, checkout, orders, account, info pages
components/     UI building blocks (Navigation, Footer, ProductCard, ProductPurchase, forms, ...)
context/        Auth, cart and toast providers
hooks/          useRequireAuth (redirects signed-out users to /login)
lib/            API client, price/date formatting, validation schemas, pricing helpers, site constants
types/          Shared TypeScript types for products, cart items and orders
public/images/  Product and hero photographs
```

## Design decisions

- **Server-rendered catalogue, client-side cart.** Product pages are fetched on the server for fast first paint and good link previews. Cart and checkout are client components because they depend on the signed-in user.
- **One API client** (`lib/api.ts`) with a typed error class, so every page handles failures the same way, including network errors.
- **Cart state is keyed to the access token**, so a different or signed-out user can never briefly see a previous user's cart.
- **Design tokens, not one-off colours.** Colours, fonts and common component classes (`btn-primary`, `input`, `card`) are defined once in `app/globals.css`.

## Known limitations

This is a portfolio project, and these are deliberate or known gaps:

- **Payment is simulated.** The API has a payment-provider interface and a fake provider that always succeeds. No real payment provider is integrated.
- **No automated tests or CI yet.**
- **Sample content.** Contact details, delivery times, FAQ answers and the returns policy are placeholders and should be replaced before any real use.
- **VAT is added on top of the subtotal** at 21%. In practice, EU consumer prices usually include VAT.
- **Lithuania only, flat shipping.** There is one shipping rate and one destination country. There is no stock tracking, discount codes, order cancellation or admin area, and no order emails.
- **The cart needs an account.** Guests cannot add items.
- **Lithuanian only.** There is no language switcher.
- **A missing product shows the 404 page but responds with HTTP 200.** This is a side effect of streaming a route that has a loading state.
- **Some product photos are placeholders:** the classic, nuts and gift-box photos show real apple cheese, while the chilli, honey and cinnamon photos show the ingredients.

## Image credits

Photographs come from Wikimedia Commons under Creative Commons licences. Authors and licences are listed on the in-app [credits page](app/credits/page.tsx) (data in `lib/imageCredits.json`).
