'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import OrderStatusBadge from '../../../components/OrderStatusBadge';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { ApiError, fetchAPI, postAPI } from '../../../lib/api';
import { formatDate } from '../../../lib/date';
import { formatPrice } from '../../../lib/format';
import type { Order } from '../../../types/order';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { session, loading: authLoading } = useRequireAuth();
  const justPlaced = useSearchParams().get('placed') === '1';
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const token = session?.access_token;

  useEffect(() => {
    if (!token) return;
    fetchAPI<Order>(`orders/${id}`, token)
      .then(setOrder)
      .catch((err) =>
        setError(
          err instanceof ApiError && (err.status === 404 || err.status === 400)
            ? 'Order not found.'
            : 'Could not load this order.'
        )
      );
  }, [id, token]);

  async function handlePay() {
    if (!token) return;
    setPaying(true);
    setError(null);
    try {
      await postAPI(`orders/${id}/pay`, {}, token);
      setOrder(await fetchAPI<Order>(`orders/${id}`, token));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed.');
    } finally {
      setPaying(false);
    }
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Link href="/orders" className="underline text-black dark:text-zinc-50">Back to orders</Link>
      </div>
    );
  }

  if (authLoading || !order) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400">Loading order...</p>
      </div>
    );
  }

  const address = order.shipping_address;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 pt-20">
      <div className="max-w-3xl mx-auto space-y-6">
        {justPlaced && (
          <div role="status" className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">&#10003;</div>
            <h1 className="text-xl font-semibold text-black dark:text-zinc-50">Thank you for your order!</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
              {order.status === 'paid'
                ? "We've received your payment and will get your order ready for delivery."
                : 'Your order is saved. Complete the payment below to confirm it.'}
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{formatDate(order.created_at)}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <ul className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {order.order_items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div className="relative w-14 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                  {item.products && (
                    <Image src={item.products.image_url} alt={item.products.name} fill sizes="56px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-black dark:text-zinc-50">{item.products?.name ?? 'Product'}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {item.quantity} × {formatPrice(item.price_at_purchase)}
                  </p>
                </div>
                <span className="font-medium text-black dark:text-zinc-50">
                  {formatPrice(item.quantity * item.price_at_purchase)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="border-t border-zinc-200 dark:border-zinc-700 mt-2 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-zinc-600 dark:text-zinc-400">Subtotal</dt><dd className="text-black dark:text-zinc-50">{formatPrice(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-600 dark:text-zinc-400">Shipping</dt><dd className="text-black dark:text-zinc-50">{formatPrice(order.shipping_price)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-600 dark:text-zinc-400">VAT</dt><dd className="text-black dark:text-zinc-50">{formatPrice(order.tax_price)}</dd></div>
            <div className="flex justify-between text-base font-semibold pt-2 border-t border-zinc-200 dark:border-zinc-700">
              <dt className="text-black dark:text-zinc-50">Total</dt><dd className="text-black dark:text-zinc-50">{formatPrice(order.total_price)}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
          <h3 className="font-semibold text-black dark:text-zinc-50 mb-3">Delivery</h3>
          <address className="not-italic text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            {address.street} {address.houseNumber}{address.flat ? `-${address.flat}` : ''}<br />
            {address.postalCode} {address.city}<br />
            {address.country}<br />
            {order.phone}
          </address>
        </div>

        {order.status === 'pending' && (
          <div className="text-center space-y-3">
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <button
              onClick={handlePay}
              disabled={paying}
              className="bg-black dark:bg-zinc-50 text-white dark:text-black px-8 py-3 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition disabled:opacity-50"
            >
              {paying ? 'Processing...' : `Pay ${formatPrice(order.total_price)}`}
            </button>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Demo mode: no real payment is taken.</p>
          </div>
        )}

        <div className="text-center">
          <Link href="/orders" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition">
            ← All orders
          </Link>
        </div>
      </div>
    </div>
  );
}
