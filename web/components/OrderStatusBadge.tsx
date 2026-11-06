import type { Order } from '../types/order';

const STYLES: Record<Order['status'], string> = {
  pending: 'border border-line text-ink',
  paid: 'bg-brand text-brand-ink',
  shipped: 'bg-brand text-brand-ink',
  cancelled: 'border border-line text-muted',
};

const LABELS: Record<Order['status'], string> = {
  pending: 'Laukiama apmokėjimo',
  paid: 'Apmokėta',
  shipped: 'Išsiųsta',
  cancelled: 'Atšaukta',
};

export default function OrderStatusBadge({ status }: { status: Order['status'] }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-sm text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
