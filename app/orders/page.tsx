'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { fetchAPI } from '../../lib/api';
import { formatDate } from '../../lib/date';
import { formatPrice } from '../../lib/format';
import type { Order } from '../../types/order';

export default function OrdersPage() {
  const { session, loading: authLoading } = useRequireAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = session?.access_token;

  useEffect(() => {
    if (!token) return;
    fetchAPI<Order[]>('orders', token)
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load orders.'));
  }, [token]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-8">Your Orders</h1>

        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

        {!error && (authLoading || !orders) && (
          <p className="text-zinc-500 dark:text-zinc-400">Loading orders...</p>
        )}

        {orders && orders.length === 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">You haven&apos;t placed any orders yet.</p>
            <Link href="/products" className="text-black dark:text-zinc-50 font-medium underline">
              Start shopping
            </Link>
          </div>
        )}

        <ul className="space-y-4">
          {orders?.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="block bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold text-black dark:text-zinc-50">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{formatDate(order.created_at)}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                      {order.order_items.reduce((n, i) => n + i.quantity, 0)} items
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <OrderStatusBadge status={order.status} />
                    <p className="font-semibold text-black dark:text-zinc-50">{formatPrice(order.total_price)}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
