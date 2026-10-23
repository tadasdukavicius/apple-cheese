'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface AddToCartButtonProps {
  productId: string;
  /** "compact" renders a small "+" button for product cards. */
  variant?: 'full' | 'compact';
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function AddToCartButton({ productId, variant = 'full' }: AddToCartButtonProps) {
  const { session } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAddToCart() {
    if (!session) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
      await addItem(productId, 1);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={status === 'loading'}
        aria-label="Add to cart"
        title={status === 'error' ? errorMessage ?? 'Error' : 'Add to cart'}
        className="px-4 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-zinc-50 py-2 rounded-lg font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 transition disabled:opacity-50"
      >
        {status === 'success' ? '✓' : status === 'error' ? '!' : '+'}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 flex-1">
      <button
        onClick={handleAddToCart}
        disabled={status === 'loading'}
        className="w-full bg-black dark:bg-zinc-50 text-white dark:text-black py-3 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition disabled:opacity-50"
      >
        {status === 'loading' ? 'Adding...' : status === 'success' ? 'Added!' : 'Add to Cart'}
      </button>
      {status === 'error' && errorMessage && (
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
