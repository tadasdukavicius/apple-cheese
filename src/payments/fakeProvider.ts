import { randomUUID } from 'node:crypto';
import type { PaymentProvider } from './provider.js';

/** Always approves. Lets the full order flow work without a real payment provider. */
export const fakePaymentProvider: PaymentProvider = {
  async charge() {
    return { success: true, reference: `fake_${randomUUID()}` };
  },
};
