import Link from 'next/link';
import { formatPrice } from '../lib/format';

export default function DeliveryNote({ shipping }: { shipping: number }) {
  return (
    <dl className="space-y-3 border-t border-line pt-6 text-sm">
      <div className="flex gap-4">
        <dt className="w-24 shrink-0 text-muted">Pristatymas</dt>
        <dd className="text-ink">
          Visoje Lietuvoje, {formatPrice(shipping)}. Pristatome per 1–3 darbo dienas.
        </dd>
      </div>
      <div className="flex gap-4">
        <dt className="w-24 shrink-0 text-muted">Pakuotė</dt>
        <dd className="text-ink">Kruopščiai supakuota, kad atkeliautų nepažeista.</dd>
      </div>
      <div className="flex gap-4">
        <dt className="w-24 shrink-0 text-muted">Grąžinimas</dt>
        <dd className="text-ink">
          Pažeistą prekę pakeisime ar grąžinsime pinigus.{' '}
          <Link href="/delivery" className="underline underline-offset-4 hover:text-brand">
            Daugiau
          </Link>
        </dd>
      </div>
    </dl>
  );
}
