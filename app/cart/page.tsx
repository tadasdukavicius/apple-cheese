'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { formatPrice } from '../../lib/format';
import { calculateTotals, usePricing } from '../../lib/pricing';

export default function CartPage() {
  const { session, loading: authLoading } = useRequireAuth();
  const { items, subtotal, loading, updateQuantity, removeItem } = useCart();
  const pricing = usePricing();
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<void>) {
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update your cart.');
    }
  }

  const { shipping, tax, total } = calculateTotals(subtotal, items.length, pricing);

  if (authLoading || !session || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-8">Shopping Cart</h1>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 mb-8">
          {items.length > 0 ? (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden">
                      <Image
                        src={item.products.image_url}
                        alt={item.products.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/products/${item.product_id}`} className="font-semibold text-black dark:text-zinc-50 hover:underline">
                        {item.products.name}
                      </Link>
                      <p className="text-zinc-600 dark:text-zinc-400">{formatPrice(item.products.price)} each</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          run(() =>
                            item.quantity > 1
                              ? updateQuantity(item.product_id, item.quantity - 1)
                              : removeItem(item.product_id)
                          )
                        }
                        aria-label={`Decrease quantity of ${item.products.name}`}
                        className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-600 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        -
                      </button>
                      <span className="text-black dark:text-zinc-50 w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => run(() => updateQuantity(item.product_id, Math.min(item.quantity + 1, 99)))}
                        aria-label={`Increase quantity of ${item.products.name}`}
                        className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-600 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-black dark:text-zinc-50 w-20 text-right">
                      {formatPrice(item.products.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => run(() => removeItem(item.product_id))}
                      className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition text-lg leading-none"
                      aria-label={`Remove ${item.products.name}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">Your cart is empty</p>
              <Link href="/products" className="text-black dark:text-zinc-50 font-medium underline">
                Browse products
              </Link>
            </div>
          )}

          {error && <p className="mt-6 text-sm text-red-600 dark:text-red-400">{error}</p>}

          {items.length > 0 && (
            <div className="flex justify-center mt-8">
              <Link href="/products" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span className="text-zinc-700 dark:text-zinc-300">Subtotal:</span>
            <span className="text-black dark:text-zinc-50">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-zinc-700 dark:text-zinc-300">Shipping:</span>
            <span className="text-black dark:text-zinc-50">{formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between mb-4 border-b border-zinc-200 dark:border-zinc-700 pb-4">
            <span className="text-zinc-700 dark:text-zinc-300">VAT:</span>
            <span className="text-black dark:text-zinc-50">{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-black dark:text-zinc-50">Total:</span>
            <span className="text-black dark:text-zinc-50">{formatPrice(total)}</span>
          </div>
          {items.length > 0 ? (
            <Link
              href="/checkout"
              className="w-full mt-6 bg-black dark:bg-zinc-50 text-white dark:text-black py-2 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition inline-block text-center"
            >
              Proceed to Checkout
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
