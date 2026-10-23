export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: 'EUR';
}

export type PaymentResult =
  | { success: true; reference: string }
  | { success: false; reason: string };

/** Implement this for a real provider (Stripe, Paysera, ...) and swap it in payments/index.ts. */
export interface PaymentProvider {
  charge(request: PaymentRequest): Promise<PaymentResult>;
}
