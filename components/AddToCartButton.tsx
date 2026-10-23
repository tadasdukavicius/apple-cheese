'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../lib/api';

interface AddToCartButtonProps {
  productId: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const { session } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAddToCart() {
    if (!session) {
      router.push('/login');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
      await postAPI('cart', { productId, quantity: 1 }, session.access_token);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
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
