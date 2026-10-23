'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { postAPI } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import { calculateTotals, usePricing } from '../../lib/pricing';
import type { Order } from '../../types/order';

const inputClass =
  'w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-400';

const labelClass = 'block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2';

export default function CheckoutPage() {
  const { session, user, loading: authLoading } = useRequireAuth();
  const { items: cartItems, subtotal, loading: loadingCart, refresh } = useCart();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [flat, setFlat] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  const pricing = usePricing();
  const { shipping, tax, total } = calculateTotals(subtotal, cartItems.length, pricing);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!session) return;
    if (cartItems.length === 0) { setError('Your cart is empty.'); return; }

    setSubmitting(true);
    setError(null);

    let orderId: string | null = null;
    try {
      const order = await postAPI<Order>(
        'orders',
        {
          phone,
          shippingAddress: {
            street,
            houseNumber,
            flat: flat || undefined,
            city,
            postalCode,
            country: 'Lithuania',
          },
        },
        session.access_token
      );
      orderId = order.id;
      // The order exists now; if payment fails the user can retry from the order page.
      await postAPI(`orders/${order.id}/pay`, {}, session.access_token);
    } catch (err) {
      if (!orderId) {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
    }

    await refresh().catch(console.error);
    router.push(`/orders/${orderId}?placed=1`);
  }

  if (authLoading || !session || loadingCart) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-8">

              {/* Contact */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-6">Contact</h2>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={user?.email ?? ''}
                    readOnly
                    className={`${inputClass} opacity-60 cursor-not-allowed`}
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-6">Shipping Address</h2>
                <div className="space-y-4">

                  {/* Country — fixed */}
                  <div>
                    <label className={labelClass}>Country</label>
                    <input
                      type="text"
                      value="Lithuania"
                      readOnly
                      className={`${inputClass} opacity-60 cursor-not-allowed`}
                    />
                  </div>

                  {/* Street */}
                  <div>
                    <label className={labelClass}>Street</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      placeholder="Street name"
                      className={inputClass}
                    />
                  </div>

                  {/* House number + flat */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>House Number</label>
                      <input
                        type="text"
                        required
                        value={houseNumber}
                        onChange={e => setHouseNumber(e.target.value)}
                        placeholder="e.g. 12"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Flat <span className="text-zinc-400">(optional)</span></label>
                      <input
                        type="text"
                        value={flat}
                        onChange={e => setFlat(e.target.value)}
                        placeholder="e.g. 4A"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* City + postal code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="e.g. Vilnius"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Postal Code</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={e => setPostalCode(e.target.value)}
                        placeholder="e.g. LT-01100"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+370 600 00000"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.length === 0 ? (
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">Your cart is empty.</p>
                  ) : (
                    cartItems.map(item => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <p className="text-sm font-medium text-black dark:text-zinc-50">{item.products.name}</p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium text-black dark:text-zinc-50">
                          {formatPrice(item.products.price * item.quantity)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Subtotal</span>
                    <span className="text-black dark:text-zinc-50">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Shipping</span>
                    <span className="text-black dark:text-zinc-50">{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">VAT</span>
                    <span className="text-black dark:text-zinc-50">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold border-t border-zinc-200 dark:border-zinc-700 pt-3">
                    <span className="text-black dark:text-zinc-50">Total</span>
                    <span className="text-black dark:text-zinc-50">{formatPrice(total)}</span>
                  </div>
                </div>

                {error && (
                  <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || cartItems.length === 0}
                  className="w-full mt-6 bg-black dark:bg-zinc-50 text-white dark:text-black py-3 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition disabled:opacity-50"
                >
                  {submitting ? 'Placing order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-8 text-center">
          <Link href="/cart" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition">
            ← Return to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
