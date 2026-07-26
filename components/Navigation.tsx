'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, loading, signOut } = useAuth();

  return (
    <nav className="bg-white dark:bg-zinc-900 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-black dark:text-zinc-50">
          Apple & Cheese
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition">
            Home
          </Link>
          <Link href="/products" className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition">
            Products
          </Link>
          <Link href="/about" className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition">
            About
          </Link>
          <Link href="/contact" className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition">
            Contact
          </Link>
          <Link href="/cart" className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition">
            Cart
          </Link>
          {!loading && (
            user ? (
              <>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</span>
                <button
                  onClick={signOut}
                  className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition">
                Login
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
