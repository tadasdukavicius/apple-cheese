'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const CATEGORY_OPTIONS = [
  { value: '', label: 'Visi' },
  { value: 'singles', label: 'Pavieniai' },
  { value: 'gift_sets', label: 'Dovanų rinkiniai' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Rekomenduojami' },
  { value: 'price_asc', label: 'Kaina: nuo mažiausios' },
  { value: 'price_desc', label: 'Kaina: nuo didžiausios' },
  { value: 'name', label: 'Pavadinimas' },
];

interface Props {
  q: string;
  category: string;
  sort: string;
}

function buildHref({ q, category, sort }: Props) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  if (sort && sort !== 'newest') params.set('sort', sort);
  const qs = params.toString();
  return qs ? `/products?${qs}` : '/products';
}

export default function ProductFilters({ q, category, sort }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(q);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    router.push(buildHref({ q: search.trim(), category, sort }));
  }

  return (
    <div className="border-b border-line pb-4">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <nav aria-label="Kategorijos" className="flex gap-6 text-sm">
          {CATEGORY_OPTIONS.map((o) => {
            const active = o.value === category;
            return (
              <Link
                key={o.value}
                href={buildHref({ q, category: o.value, sort })}
                aria-current={active ? 'true' : undefined}
                className={`pb-1 transition-colors hover:text-brand ${
                  active ? 'border-b border-ink font-medium text-ink' : 'text-muted'
                }`}
              >
                {o.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center gap-4">
          <form onSubmit={onSubmit} role="search" className="flex">
            <label htmlFor="product-search" className="sr-only">Ieškoti produktų</label>
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ieškoti..."
              className="input !w-40 !py-2 text-sm sm:!w-52"
            />
          </form>
          <div className="flex items-center gap-2">
            <label htmlFor="product-sort" className="text-sm text-muted">Rūšiuoti</label>
            <select
              id="product-sort"
              value={sort}
              onChange={(e) => router.push(buildHref({ q, category, sort: e.target.value }))}
              className="input !w-auto !py-2 text-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
