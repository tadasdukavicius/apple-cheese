import { useEffect, useState } from 'react';
import { fetchAPI } from './api';

export interface Pricing {
  currency: 'EUR';
  shipping: number;
  taxRate: number;
}

// Used until /pricing responds; the API is the source of truth.
const DEFAULT_PRICING: Pricing = { currency: 'EUR', shipping: 5.99, taxRate: 0.21 };

export function usePricing(): Pricing {
  const [pricing, setPricing] = useState<Pricing>(DEFAULT_PRICING);

  useEffect(() => {
    fetchAPI<Pricing>('pricing').then(setPricing).catch(() => {});
  }, []);

  return pricing;
}

export function calculateTotals(subtotal: number, itemCount: number, pricing: Pricing) {
  const shipping = itemCount > 0 ? pricing.shipping : 0;
  const tax = Math.round(subtotal * pricing.taxRate * 100) / 100;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}
