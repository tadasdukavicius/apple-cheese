import { fetchAPI } from './api';
import { DEFAULT_PRICING, type Pricing } from './pricingShared';

export async function getPricing(): Promise<Pricing> {
  try {
    return await fetchAPI<Pricing>('pricing');
  } catch {
    return DEFAULT_PRICING;
  }
}
