import { useEffect, useState } from 'react';
import { fetchAPI } from './api';
import { DEFAULT_PRICING, type Pricing } from './pricingShared';

export { calculateTotals, type Pricing } from './pricingShared';

/** Client hook. Server components should use getPricing() from lib/serverPricing. */
export function usePricing(): Pricing {
  const [pricing, setPricing] = useState<Pricing>(DEFAULT_PRICING);

  useEffect(() => {
    fetchAPI<Pricing>('pricing').then(setPricing).catch(() => {});
  }, []);

  return pricing;
}
