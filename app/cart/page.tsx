'use client';

import Image from 'next/image';
import Link from 'next/link';
import DeliveryNote from '../../components/DeliveryNote';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { formatPrice } from '../../lib/format';
import { calculateTotals, usePricing } from '../../lib/pricing';

const stepperButton =
  'flex h-9 w-9 items-center justify-center border border-line text-ink transition-colors hover:border-ink';

export default function CartPage() {
  const { session, loading: authLoading } = useRequireAuth();
  const { items, subtotal, loading, error, refresh, updateQuantity, removeItem } = useCart();
  const pricing = usePricing();
  const { toast } = useToast();

  async function run(action: () => Promise<void>) {
    try {
      await action();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Nepavyko atnaujinti krepšelio.', 'error');
    }
  }

  const { shipping, tax, total } = calculateTotals(subtotal, items.length, pricing);

  if (authLoading || !session || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted">Kraunamas krepšelis...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="text-4xl text-ink md:text-5xl">Pirkinių krepšelis</h1>

      {error && items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="mb-4 text-ink">{error}</p>
          <button onClick={() => refresh().catch(() => {})} className="btn-secondary">
            Bandyti dar kartą
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="mb-4 text-muted">Jūsų krepšelis tuščias</p>
          <Link href="/products" className="btn-primary px-8 py-4">Peržiūrėti produktus</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_22rem]">
          <section aria-label="Krepšelio prekės">
            <ul className="border-t border-line">
              {items.map((item) => {
                const v = item.product_variants;
                const label = `${v.products.name} (${v.label})`;
                return (
                  <li key={item.id} className="grid grid-cols-[5rem_1fr] gap-x-4 gap-y-3 border-b border-line py-5 sm:grid-cols-[6rem_1fr_auto]">
                    {/* Decorative duplicate of the product-name link, so it is hidden from assistive tech and the tab order */}
                    <Link href={`/products/${v.products.id}`} aria-hidden="true" tabIndex={-1} className="relative row-span-2 aspect-square bg-line sm:row-span-1">
                      <Image src={v.products.image_url} alt="" fill sizes="96px" className="object-cover" />
                    </Link>

                    <div>
                      <Link href={`/products/${v.products.id}`} className="font-display text-xl leading-snug text-ink hover:underline hover:underline-offset-4">
                        {v.products.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted">
                        {v.label} · {formatPrice(v.price)} / vnt.
                      </p>
                      <button
                        onClick={() => run(() => removeItem(item.variant_id))}
                        aria-label={`Pašalinti: ${label}`}
                        className="mt-2 text-sm text-muted underline underline-offset-4 transition-colors hover:text-danger"
                      >
                        Pašalinti
                      </button>
                    </div>

                    <div className="col-start-2 flex items-center justify-between gap-6 sm:col-start-3 sm:flex-col sm:items-end sm:justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            run(() =>
                              item.quantity > 1
                                ? updateQuantity(item.variant_id, item.quantity - 1)
                                : removeItem(item.variant_id)
                            )
                          }
                          aria-label={`Sumažinti kiekį: ${label}`}
                          className={stepperButton}
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-ink" aria-live="polite">{item.quantity}</span>
                        <button
                          onClick={() => run(() => updateQuantity(item.variant_id, Math.min(item.quantity + 1, 99)))}
                          aria-label={`Padidinti kiekį: ${label}`}
                          className={stepperButton}
                        >
                          +
                        </button>
                      </div>
                      <span className="font-medium text-ink">{formatPrice(v.price * item.quantity)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Link href="/products" className="mt-6 inline-block text-sm text-ink underline underline-offset-4 hover:text-brand">
              ← Tęsti apsipirkimą
            </Link>
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h2 className="text-2xl text-ink">Užsakymo suvestinė</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Tarpinė suma</dt><dd className="text-ink">{formatPrice(subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Pristatymas</dt><dd className="text-ink">{formatPrice(shipping)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">PVM</dt><dd className="text-ink">{formatPrice(tax)}</dd></div>
                <div className="flex justify-between border-t border-line pt-4 text-base">
                  <dt className="font-medium text-ink">Iš viso</dt>
                  <dd className="text-xl font-medium text-ink">{formatPrice(total)}</dd>
                </div>
              </dl>
              <Link href="/checkout" className="btn-primary mt-6 w-full py-4">Pereiti prie apmokėjimo</Link>
            </div>
            <div className="mt-6">
              <DeliveryNote shipping={pricing.shipping} />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
