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
      .catch((err) => setError(err instanceof Error ? err.message : 'Nepavyko įkelti užsakymų.'));
  }, [token]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <div>
        <h1 className="text-4xl md:text-5xl font-medium text-ink mb-8">Jūsų užsakymai</h1>

        {error && <p className="text-danger">{error}</p>}

        {!error && (authLoading || !orders) && (
          <p className="text-muted">Kraunami užsakymai...</p>
        )}

        {orders && orders.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-muted mb-4">Dar neturite užsakymų.</p>
            <Link href="/products" className="text-ink font-medium underline">
              Pradėti apsipirkti
            </Link>
          </div>
        )}

        <ul className="space-y-4">
          {orders?.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="block card p-6  transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold text-ink">
                      Užsakymas Nr. {order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-muted">{formatDate(order.created_at)}</p>
                    <p className="text-sm text-muted mt-2">
                      Prekių: {order.order_items.reduce((n, i) => n + i.quantity, 0)}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <OrderStatusBadge status={order.status} />
                    <p className="font-semibold text-ink">{formatPrice(order.total_price)}</p>
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
