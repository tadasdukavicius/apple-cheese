'use client';

import { useState } from 'react';
import { formatPrice } from '../lib/format';
import type { ProductVariant } from '../types/product';
import AddToCartButton from './AddToCartButton';

export default function ProductPurchase({ variants, productId }: { variants: ProductVariant[]; productId: string }) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id);
  const selected = variants.find((v) => v.id === selectedId);

  if (!selected) return <p className="text-muted">Šiuo metu nėra.</p>;

  return (
    <div>
      <p className="text-3xl font-medium text-ink" aria-live="polite">
        {formatPrice(selected.price)}
      </p>

      <fieldset className="mt-8">
        <legend className="label">
          Dydis: <span className="font-normal text-muted">{selected.label}</span>
        </legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {variants.map((v) => {
            const active = v.id === selectedId;
            return (
              <label
                key={v.id}
                className={`cursor-pointer rounded-sm border px-4 py-3 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
                  active ? 'border-ink bg-card ring-1 ring-ink' : 'border-line hover:border-ink/60'
                }`}
              >
                <input
                  type="radio"
                  name={`size-${productId}`}
                  value={v.id}
                  checked={active}
                  onChange={() => setSelectedId(v.id)}
                  className="sr-only"
                />
                <span className="block font-medium text-ink">{v.label}</span>
                <span className="block text-muted">{formatPrice(v.price)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <AddToCartButton variantId={selected.id} />
      </div>
    </div>
  );
}
