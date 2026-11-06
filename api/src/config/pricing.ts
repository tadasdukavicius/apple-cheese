import type { Pricing } from '../types/index.js';

/** Single source of truth for pricing rules; the order RPC receives these values. */
export const PRICING: Pricing = {
  currency: 'EUR',
  shipping: 5.99,
  taxRate: 0.21,
};
