'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

type Status = 'idle' | 'loading' | 'success';

export default function AddToCartButton({ variantId }: { variantId: string }) {
  const { session, loading: authLoading } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>('idle');

  async function handleAddToCart() {
    if (!session) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setStatus('loading');
    try {
      await addItem(variantId, 1);
      setStatus('success');
      toast('Prekė įdėta į krepšelį');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setStatus('idle');
      toast(err instanceof Error ? err.message : 'Įvyko klaida. Bandykite dar kartą.', 'error');
    }
  }

  return (
    <div>
      <button onClick={handleAddToCart} disabled={status === 'loading'} className="btn-primary w-full py-4">
        {status === 'loading' ? 'Dedama...' : status === 'success' ? 'Įdėta į krepšelį' : 'Į krepšelį'}
      </button>
      {!authLoading && !session && (
        <p className="mt-3 text-sm text-muted">
          Norėdami pirkti, <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="underline underline-offset-4 hover:text-brand">prisijunkite</Link>.
        </p>
      )}
    </div>
  );
}
