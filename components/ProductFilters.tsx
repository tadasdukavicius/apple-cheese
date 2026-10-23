'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export const CATEGORY_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'apples', label: 'Apples' },
  { value: 'cheese', label: 'Cheese' },
  { value: 'gifts', label: 'Gifts' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Featured' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name' },
];

interface Props {
  q: string;
  category: string;
  sort: string;
}

const inputClass =
  'px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-400';

export default function ProductFilters({ q, category, sort }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(q);

  function navigate(next: Partial<Props>) {
    const merged = { q: search, category, sort, ...next };
    const params = new URLSearchParams();
    if (merged.q) params.set('q', merged.q);
    if (merged.category) params.set('category', merged.category);
    if (merged.sort && merged.sort !== 'newest') params.set('sort', merged.sort);
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : '/products');
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    navigate({ q: search.trim() });
  }

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <form onSubmit={onSubmit} role="search" className="flex gap-2 flex-1 max-w-md">
          <label htmlFor="product-search" className="sr-only">Search products</label>
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className={`${inputClass} flex-1`}
          />
          <button
            type="submit"
            className="bg-black dark:bg-zinc-50 text-white dark:text-black px-4 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
          >
            Search
          </button>
        </form>
        <div className="flex items-center gap-2">
          <label htmlFor="product-sort" className="text-sm text-zinc-600 dark:text-zinc-400">Sort by</label>
          <select
            id="product-sort"
            value={sort}
            onChange={(e) => navigate({ sort: e.target.value })}
            className={inputClass}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by category">
        {CATEGORY_OPTIONS.map((o) => {
          const active = o.value === category;
          return (
            <button
              key={o.value}
              onClick={() => navigate({ category: o.value })}
              aria-pressed={active}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                active
                  ? 'bg-black text-white dark:bg-zinc-50 dark:text-black border-transparent'
                  : 'border-zinc-300 dark:border-zinc-600 text-black dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
