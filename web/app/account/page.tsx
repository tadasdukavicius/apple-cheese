'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { formatDateLong } from '../../lib/date';

export default function AccountPage() {
  const { user, loading, signOut } = useRequireAuth();
  const router = useRouter();

  if (loading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted">Kraunama...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="text-4xl text-ink md:text-5xl">Paskyra</h1>

      <dl className="mt-10 divide-y divide-line border-y border-line">
        <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
          <dt className="text-muted">El. paštas</dt>
          <dd className="break-all text-ink">{user.email}</dd>
        </div>
        <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
          <dt className="text-muted">Narys nuo</dt>
          <dd className="text-ink">{formatDateLong(user.created_at)}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Link href="/orders" className="btn-primary px-8 py-4">Peržiūrėti užsakymus</Link>
        <button
          onClick={async () => {
            await signOut();
            router.push('/');
          }}
          className="text-sm text-ink underline underline-offset-4 hover:text-brand"
        >
          Atsijungti
        </button>
      </div>
    </div>
  );
}
