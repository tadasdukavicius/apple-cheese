# Obuolių sūris

A full-stack e-commerce portfolio project: an online shop for **obuolių sūris** ("apple cheese"), a traditional Lithuanian confection of slow-cooked apples. The interface is in Lithuanian, prices are in EUR, and payment is simulated.

| Folder | What it is | Stack |
| --- | --- | --- |
| [`web/`](web) | Storefront (start here for the UI, screenshots and design decisions) | Next.js, React, TypeScript, Tailwind |
| [`api/`](api) | REST API and database schema | Express, TypeScript, Supabase (Postgres) |

[![Web CI](https://github.com/tadasdukavicius/apple-cheese/actions/workflows/web.yml/badge.svg)](https://github.com/tadasdukavicius/apple-cheese/actions/workflows/web.yml)
[![API CI](https://github.com/tadasdukavicius/apple-cheese/actions/workflows/api.yml/badge.svg)](https://github.com/tadasdukavicius/apple-cheese/actions/workflows/api.yml)

## Run it locally

1. Create a free Supabase project and follow [`api/README.md`](api/README.md) to set up the database and `api/.env`.
2. Configure the storefront as described in [`web/README.md`](web/README.md) (`web/.env`).
3. From the repository root:

```bash
npm run install:all
npm run dev        # API on :8008, storefront on :3000
```

Each app can also be started on its own with `npm run dev` inside its folder. `npm test` runs the unit tests of both.
