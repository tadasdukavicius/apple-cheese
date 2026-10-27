'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { safeRedirect } from '../lib/safeRedirect';

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
    else if (needsConfirmation) setNotice('Paskyra sukurta! Patvirtinkite el. paštą (patikrinkite savo pašto dėžutę) ir prisijunkite.');
    else router.push(safeRedirect(next));
  }

  const otherHref = `${isLogin ? '/signup' : '/login'}${next ? `?next=${encodeURIComponent(next)}` : ''}`;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-14">
      <div className="w-full max-w-md card p-8">
        <h1 className="text-3xl font-medium text-ink mb-6">
          {isLogin ? 'Prisijungimas' : 'Sukurti paskyrą'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="label">
              El. paštas
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
              placeholder="Įveskite el. paštą"
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Slaptažodis
            </label>
            <input
              type="password"
              id="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isLogin ? undefined : 6}
              className="input"
              placeholder={isLogin ? 'Įveskite slaptažodį' : 'Bent 6 simboliai'}
            />
          </div>
          {error && <p role="alert" className="text-danger text-sm">{error}</p>}
          {notice && <p role="status" className="text-success text-sm">{notice}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Palaukite...' : isLogin ? 'Prisijungti' : 'Registruotis'}
          </button>
        </form>
        <p className="text-center text-muted mt-4">
          {isLogin ? 'Neturite paskyros? ' : 'Jau turite paskyrą? '}
          <Link href={otherHref} className="text-brand font-medium hover:underline">
            {isLogin ? 'Registruokitės' : 'Prisijunkite'}
          </Link>
        </p>
      </div>
    </div>
  );
}
