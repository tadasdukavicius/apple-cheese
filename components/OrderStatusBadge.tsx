import type { Order } from '../types/order';

const STYLES: Record<Order['status'], string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  cancelled: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
};

const LABELS: Record<Order['status'], string> = {
  pending: 'Awaiting payment',
  paid: 'Paid',
  shipped: 'Shipped',
  cancelled: 'Cancelled',
};

export default function OrderStatusBadge({ status }: { status: Order['status'] }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
