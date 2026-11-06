'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Field from '../../components/Field';
import { useCart } from '../../context/CartContext';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { postAPI } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import { calculateTotals, usePricing } from '../../lib/pricing';
import { checkoutSchema, type CheckoutFormValues } from '../../lib/schemas';
import type { Order } from '../../types/order';

export default function CheckoutPage() {
  const { session, user, loading: authLoading } = useRequireAuth();
  const { items: cartItems, subtotal, loading: loadingCart, refresh } = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutSchema) });

  const pricing = usePricing();
  const { shipping, tax, total } = calculateTotals(subtotal, cartItems.length, pricing);

  async function onSubmit(values: CheckoutFormValues) {
    if (!session) return;
    if (cartItems.length === 0) {
      setError('Jūsų krepšelis tuščias.');
      return;
    }
    setError(null);

    const { phone, flat, ...address } = values;
    let orderId: string | null = null;
    try {
      const order = await postAPI<Order>(
        'orders',
        { phone, shippingAddress: { ...address, flat: flat || undefined, country: 'Lietuva' } },
        session.access_token
      );
      orderId = order.id;
      // The order exists now; if payment fails the user can retry from the order page.
      await postAPI(`orders/${order.id}/pay`, {}, session.access_token);
    } catch (err) {
      if (!orderId) {
        setError(err instanceof Error ? err.message : 'Įvyko klaida. Bandykite dar kartą.');
        return;
      }
    }

    await refresh().catch(console.error);
    router.push(`/orders/${orderId}?placed=1`);
  }

  if (authLoading || !session || loadingCart) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted">Kraunama...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <div>
        <h1 className="text-4xl md:text-5xl font-medium text-ink mb-8">Užsakymo pateikimas</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="card p-6">
                <h2 className="text-xl font-medium text-ink mb-6">Kontaktai</h2>
                <Field id="checkout-email" label="El. paštas">
                  {(p) => <input {...p} type="email" value={user?.email ?? ''} readOnly className={`${p.className} cursor-not-allowed bg-surface text-muted`} />}
                </Field>
              </section>

              <section className="card p-6">
                <h2 className="text-xl font-medium text-ink mb-6">Pristatymo adresas</h2>
                <div className="space-y-6">
                  <Field id="country" label="Šalis">
                    {(p) => <input {...p} type="text" value="Lietuva" readOnly className={`${p.className} cursor-not-allowed bg-surface text-muted`} />}
                  </Field>
                  <Field id="street" label="Gatvė" error={errors.street?.message}>
                    {(p) => <input {...p} type="text" autoComplete="address-line1" placeholder="Gatvės pavadinimas" {...register('street')} />}
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field id="houseNumber" label="Namo numeris" error={errors.houseNumber?.message}>
                      {(p) => <input {...p} type="text" placeholder="pvz., 12" {...register('houseNumber')} />}
                    </Field>
                    <Field id="flat" label={<>Butas <span className="text-muted">(nebūtina)</span></>} error={errors.flat?.message}>
                      {(p) => <input {...p} type="text" placeholder="pvz., 4A" {...register('flat')} />}
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field id="city" label="Miestas" error={errors.city?.message}>
                      {(p) => <input {...p} type="text" autoComplete="address-level2" placeholder="pvz., Vilnius" {...register('city')} />}
                    </Field>
                    <Field id="postalCode" label="Pašto kodas" error={errors.postalCode?.message}>
                      {(p) => <input {...p} type="text" autoComplete="postal-code" placeholder="pvz., LT-01100" {...register('postalCode')} />}
                    </Field>
                  </div>
                  <Field id="phone" label="Telefono numeris" error={errors.phone?.message}>
                    {(p) => <input {...p} type="tel" autoComplete="tel" placeholder="+370 600 00000" {...register('phone')} />}
                  </Field>
                </div>
              </section>
            </div>

            <aside className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-xl font-medium text-ink mb-6">Užsakymo suvestinė</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.length === 0 ? (
                    <p className="text-muted text-sm">Jūsų krepšelis tuščias.</p>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <p className="text-sm font-medium text-ink">{item.product_variants.products.name}</p>
                          <p className="text-sm text-muted">{item.product_variants.label} · Kiekis: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium text-ink">
                          {formatPrice(item.product_variants.price * item.quantity)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <dl className="border-t border-line pt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-muted">Tarpinė suma</dt><dd className="text-ink">{formatPrice(subtotal)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">Pristatymas</dt><dd className="text-ink">{formatPrice(shipping)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">PVM</dt><dd className="text-ink">{formatPrice(tax)}</dd></div>
                  <div className="flex justify-between text-base font-semibold border-t border-line pt-3">
                    <dt className="text-ink">Iš viso</dt><dd className="text-ink">{formatPrice(total)}</dd>
                  </div>
                </dl>

                {error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}

                <button type="submit" disabled={isSubmitting || cartItems.length === 0} className="btn-primary w-full mt-6 py-3">
                  {isSubmitting ? 'Pateikiama...' : 'Pateikti užsakymą'}
                </button>
                <p className="text-xs text-muted text-center mt-3">Demonstracinis režimas: tikras mokėjimas neatliekamas.</p>
              </div>
            </aside>
          </div>
        </form>

        <div className="mt-8 text-center">
          <Link href="/cart" className="text-muted hover:text-brand transition">← Atgal į krepšelį</Link>
        </div>
      </div>
    </div>
  );
}
