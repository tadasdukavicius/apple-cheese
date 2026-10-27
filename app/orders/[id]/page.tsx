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
            ? 'Užsakymas nerastas.'
            : 'Nepavyko įkelti užsakymo.'
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
      setError(err instanceof Error ? err.message : 'Apmokėjimas nepavyko.');
    } finally {
      setPaying(false);
    }
  }

  if (error && !order) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-danger">{error}</p>
        <Link href="/orders" className="underline text-ink">Atgal į užsakymus</Link>
      </div>
    );
  }

  if (authLoading || !order) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted">Kraunamas užsakymas...</p>
      </div>
    );
  }

  const address = order.shipping_address;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <div className="space-y-6">
        {justPlaced && (
          <div role="status" className="border-l-2 border-brand pl-5">
            <h1 className="text-3xl text-ink md:text-4xl">Ačiū už jūsų užsakymą!</h1>
            <p className="mt-2 text-muted">
              {order.status === 'paid'
                ? "Gavome jūsų apmokėjimą ir ruošiame užsakymą siuntimui."
                : 'Jūsų užsakymas išsaugotas. Apmokėkite žemiau, kad jį patvirtintumėte.'}
            </p>
          </div>
        )}

        <div className="card p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-medium text-ink">
                Užsakymas Nr. {order.id.slice(0, 8).toUpperCase()}
              </h2>
              <p className="text-sm text-muted">{formatDate(order.created_at)}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <ul className="divide-y divide-line">
            {order.order_items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div className="relative w-14 h-14 bg-line rounded-sm overflow-hidden shrink-0">
                  {item.image_url && (
                    <Image src={item.image_url} alt={item.product_name} fill sizes="56px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-ink">{item.product_name}</p>
                  <p className="text-sm text-muted">
                    {item.variant_label} · {item.quantity} × {formatPrice(item.price_at_purchase)}
                  </p>
                </div>
                <span className="font-medium text-ink">
                  {formatPrice(item.quantity * item.price_at_purchase)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="border-t border-line mt-2 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Tarpinė suma</dt><dd className="text-ink">{formatPrice(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Pristatymas</dt><dd className="text-ink">{formatPrice(order.shipping_price)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">PVM</dt><dd className="text-ink">{formatPrice(order.tax_price)}</dd></div>
            <div className="flex justify-between text-base font-semibold pt-2 border-t border-line">
              <dt className="text-ink">Iš viso</dt><dd className="text-ink">{formatPrice(order.total_price)}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-8">
          <h3 className="font-semibold text-ink mb-3">Pristatymas</h3>
          <address className="not-italic text-muted text-sm leading-relaxed">
            {address.street} {address.houseNumber}{address.flat ? `-${address.flat}` : ''}<br />
            {address.postalCode} {address.city}<br />
            {address.country}<br />
            {order.phone}
          </address>
        </div>

        {order.status === 'pending' && (
          <div className="text-center space-y-3">
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              onClick={handlePay}
              disabled={paying}
              className="btn-primary px-8 py-3"
            >
              {paying ? 'Apdorojama...' : `Apmokėti ${formatPrice(order.total_price)}`}
            </button>
            <p className="text-xs text-muted">Demonstracinis režimas: tikras mokėjimas neatliekamas.</p>
          </div>
        )}

        <div className="text-center">
          <Link href="/orders" className="text-muted hover:text-brand transition">
            ← Visi užsakymai
          </Link>
        </div>
      </div>
    </div>
  );
}
