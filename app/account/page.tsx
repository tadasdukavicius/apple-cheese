'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '../../hooks/useRequireAuth';

export default function AccountPage() {
  const { user, loading, signOut } = useRequireAuth();
  const router = useRouter();

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 pt-20">
      <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-6">Account</h1>
        <dl className="space-y-4 mb-8">
          <div>
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Email</dt>
            <dd className="text-black dark:text-zinc-50">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Member since</dt>
            <dd className="text-black dark:text-zinc-50">
              {new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date(user.created_at))}
            </dd>
          </div>
        </dl>
        <div className="flex gap-4">
          <Link
            href="/orders"
            className="bg-black dark:bg-zinc-50 text-white dark:text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
          >
            View orders
          </Link>
          <button
            onClick={async () => {
              await signOut();
              router.push('/');
            }}
            className="border border-zinc-300 dark:border-zinc-600 text-black dark:text-zinc-50 px-6 py-2 rounded-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
