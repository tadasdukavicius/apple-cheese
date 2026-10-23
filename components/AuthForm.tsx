'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { safeRedirect } from '../lib/safeRedirect';

const inputClass =
  'w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-400';

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get('next');
  const isLogin = mode === 'login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    if (isLogin) {
      const { error: authError } = await signIn(email, password);
      setLoading(false);
      if (authError) setError(authError);
      else router.push(safeRedirect(next));
      return;
    }

    const { error: authError, needsConfirmation } = await signUp(email, password);
    setLoading(false);
    if (authError) setError(authError);
    else if (needsConfirmation) setNotice('Account created! Check your email to confirm your address, then sign in.');
    else router.push(safeRedirect(next));
  }

  const otherHref = `${isLogin ? '/signup' : '/login'}${next ? `?next=${encodeURIComponent(next)}` : ''}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black pb-40">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-6">
          {isLogin ? 'Login' : 'Create account'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isLogin ? undefined : 6}
              className={inputClass}
              placeholder={isLogin ? 'Enter your password' : 'At least 6 characters'}
            />
          </div>
          {error && <p role="alert" className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
          {notice && <p role="status" className="text-green-700 dark:text-green-400 text-sm">{notice}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-zinc-50 text-white dark:text-black py-2 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mt-4">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link href={otherHref} className="text-black dark:text-zinc-50 font-medium">
            {isLogin ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  );
}
