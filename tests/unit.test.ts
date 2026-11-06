import { PostgrestError } from '@supabase/supabase-js';
import { describe, expect, it } from 'vitest';
import { PRICING } from '../src/config/pricing.js';
import { fakePaymentProvider } from '../src/payments/fakeProvider.js';
import { addToCartSchema, createOrderSchema, productQuerySchema } from '../src/schemas/index.js';
import { AppError } from '../src/utils/AppError.js';
import { fromDbError } from '../src/utils/dbError.js';

const pg = (code: string, message = 'm') => new PostgrestError({ message, details: '', hint: '', code });

describe('fromDbError', () => {
  it.each([
    ['PGRST116', 404, 'NOT_FOUND'],
    ['22P02', 400, 'INVALID_ID'],
    ['23503', 400, 'REFERENCE_NOT_FOUND'],
    ['28000', 401, 'UNAUTHORIZED'],
    ['XX000', 500, 'INTERNAL_ERROR'],
  ])('maps %s to %i %s', (code, status, appCode) => {
    const err = fromDbError(pg(code));
    expect(err).toBeInstanceOf(AppError);
    expect([err.status, err.code]).toEqual([status, appCode]);
  });

  it('distinguishes the order function errors raised by the SQL', () => {
    expect(fromDbError(pg('P0001', 'Cart is empty')).code).toBe('CART_EMPTY');
    expect(fromDbError(pg('P0001', 'Order not found or not payable')).code).toBe('ORDER_NOT_PAYABLE');
  });

  it('never exposes the raw database message', () => {
    expect(fromDbError(pg('XX000', 'password for user postgres')).message).not.toContain('password');
  });
});

describe('schemas', () => {
  it('defaults quantity and rejects invalid quantities', () => {
    const id = '22222222-2222-4222-8222-222222222222';
    expect(addToCartSchema.parse({ variantId: id }).quantity).toBe(1);
    expect(addToCartSchema.safeParse({ variantId: id, quantity: 99 }).success).toBe(true);
    expect(addToCartSchema.safeParse({ variantId: id, quantity: 100 }).success).toBe(false);
  });

  it('defaults product sorting to newest', () => {
    expect(productQuerySchema.parse({}).sort).toBe('newest');
  });

  it('trims address fields and treats flat as optional', () => {
    const parsed = createOrderSchema.parse({
      phone: ' +370 600 00000 ',
      shippingAddress: { street: ' Gedimino pr. ', houseNumber: '1', city: 'Vilnius', postalCode: 'LT-01103', country: 'Lietuva' },
    });
    expect(parsed.phone).toBe('+370 600 00000');
    expect(parsed.shippingAddress.street).toBe('Gedimino pr.');
    expect(parsed.shippingAddress.flat).toBeUndefined();
  });
});

describe('pricing and payments', () => {
  it('keeps pricing rules in one place', () => {
    expect(PRICING).toEqual({ currency: 'EUR', shipping: 5.99, taxRate: 0.21 });
  });

  it('fake provider approves with a unique reference', async () => {
    const request = { orderId: 'o', amount: 10, currency: 'EUR' as const };
    const a = await fakePaymentProvider.charge(request);
    const b = await fakePaymentProvider.charge(request);
    expect(a.success && b.success).toBe(true);
    if (a.success && b.success) expect(a.reference).not.toBe(b.reference);
  });
});
