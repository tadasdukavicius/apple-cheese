import { afterEach, describe, expect, it, vi } from 'vitest';
import { translateAuthError } from '../../lib/authErrors';
import { formatDate, formatDateLong } from '../../lib/date';
import { formatPrice } from '../../lib/format';
import { calculateTotals } from '../../lib/pricingShared';
import { safeRedirect } from '../../lib/safeRedirect';
import { checkoutSchema, contactSchema } from '../../lib/schemas';
import { startingPrice, type Product } from '../../types/product';

// Intl uses a non-breaking space between the number and the euro sign
const plain = (s: string) => s.replace(/\s/g, ' ');

describe('formatPrice', () => {
  it('uses Lithuanian number formatting with the euro sign', () => {
    expect(plain(formatPrice(5.9))).toBe('5,90 €');
    expect(plain(formatPrice(1234.5))).toBe('1 234,50 €');
    expect(plain(formatPrice(0))).toBe('0,00 €');
  });
});

describe('dates', () => {
  it('formats in Lithuanian', () => {
    expect(formatDateLong('2026-10-27T10:30:00Z')).toMatch(/2026/);
    expect(formatDate('2026-10-27T10:30:00Z')).toMatch(/2026-10-27/);
  });
});

describe('calculateTotals', () => {
  const pricing = { currency: 'EUR' as const, shipping: 5.99, taxRate: 0.21 };

  it('adds shipping and VAT to the subtotal (matches the SQL: 27.50 → 39.27)', () => {
    const t = calculateTotals(27.5, 2, pricing);
    expect(t.subtotal).toBe(27.5);
    expect(t.shipping).toBe(5.99);
    expect(t.tax).toBe(5.78);
    expect(t.total).toBeCloseTo(39.27, 2);
  });

  it('charges no shipping for an empty cart', () => {
    expect(calculateTotals(0, 0, pricing)).toEqual({ subtotal: 0, shipping: 0, tax: 0, total: 0 });
  });
});

describe('startingPrice', () => {
  const product = (prices: number[]) => ({ variants: prices.map((price) => ({ price })) }) as unknown as Product;

  it('is the cheapest size', () => expect(startingPrice(product([19, 5.9, 10.5]))).toBe(5.9));
  it('is 0 when there are no sizes', () => expect(startingPrice(product([]))).toBe(0));
});

describe('safeRedirect', () => {
  it.each([
    ['/cart', '/cart'],
    ['/products/abc?x=1', '/products/abc?x=1'],
    [null, '/products'],
    ['https://evil.example', '/products'],
    ['//evil.example', '/products'],
    ['/\\evil.example', '/products'],
    ['javascript:alert(1)', '/products'],
  ])('%s → %s', (input, expected) => {
    expect(safeRedirect(input)).toBe(expected);
  });
});

describe('translateAuthError', () => {
  it.each([
    ['Invalid login credentials', 'Neteisingas el. paštas arba slaptažodis.'],
    ['User already registered', 'Vartotojas su tokiu el. paštu jau egzistuoja.'],
    ['Email not confirmed', 'El. paštas dar nepatvirtintas. Patikrinkite savo pašto dėžutę.'],
    ['Password should be at least 6 characters', 'Slaptažodis per trumpas (bent 6 simboliai).'],
  ])('translates "%s"', (input, expected) => expect(translateAuthError(input)).toBe(expected));

  it('falls back to a generic Lithuanian message and never shows raw English', () => {
    expect(translateAuthError('some unexpected backend text')).toBe('Įvyko klaida. Bandykite dar kartą.');
  });

  it('returns null when there is no error', () => {
    expect(translateAuthError(null)).toBeNull();
    expect(translateAuthError(undefined)).toBeNull();
  });
});

describe('contactSchema', () => {
  const valid = { name: 'Jonas', email: 'jonas@example.lt', subject: 'Klausimas', message: 'Ar turite sūrio be cukraus?' };

  it('accepts valid input', () => expect(contactSchema.safeParse(valid).success).toBe(true));

  it('reports Lithuanian messages per field', () => {
    const result = contactSchema.safeParse({ name: 'J', email: 'x', subject: '', message: 'short' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const byField = Object.fromEntries(result.error.issues.map((i) => [i.path[0], i.message]));
      expect(byField).toEqual({
        name: 'Įveskite savo vardą',
        email: 'Įveskite teisingą el. pašto adresą',
        subject: 'Įveskite temą',
        message: 'Žinutė turi būti bent 10 simbolių',
      });
    }
  });

  it('rejects a filled honeypot', () => {
    expect(contactSchema.safeParse({ ...valid, website: 'http://spam' }).success).toBe(false);
  });
});

describe('checkoutSchema', () => {
  const valid = { street: 'Gedimino pr.', houseNumber: '12', city: 'Vilnius', postalCode: 'LT-01103', phone: '+370 600 00000' };

  it('accepts a valid address and an optional flat', () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true);
    expect(checkoutSchema.safeParse({ ...valid, flat: '4A' }).success).toBe(true);
  });

  it.each(['abc', '123', '+370', '1'.repeat(30)])('rejects phone "%s"', (phone) => {
    expect(checkoutSchema.safeParse({ ...valid, phone }).success).toBe(false);
  });
});

describe('config', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('normalises the API URL to exactly one trailing slash', async () => {
    for (const raw of ['http://x.test/api', 'http://x.test/api/', 'http://x.test/api///']) {
      vi.stubEnv('NEXT_PUBLIC_API_URL', raw);
      vi.resetModules();
      expect((await import('../../lib/config')).API_BASE_URL).toBe('http://x.test/api/');
    }
  });

  it('fails with a helpful message when Supabase settings are missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.resetModules();
    await expect(import('../../lib/config')).rejects.toThrow(/NEXT_PUBLIC_SUPABASE_URL.*\.env\.example/);
  });
});
