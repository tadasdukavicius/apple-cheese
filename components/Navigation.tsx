'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const linkClass =
  'text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition';

export default function Navigation() {
  const { user, loading, signOut } = useAuth();
  const { count } = useCart();

  return (
    <nav className="bg-white dark:bg-zinc-900 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-black dark:text-zinc-50">
          Apple & Cheese
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/" className={linkClass}>Home</Link>
          <Link href="/products" className={linkClass}>Products</Link>
          <Link href="/about" className={linkClass}>About</Link>
          <Link href="/contact" className={linkClass}>Contact</Link>
          <Link href="/cart" className={`${linkClass} flex items-center gap-2`}>
            Cart
            {count > 0 && (
              <span
                aria-label={`${count} items in cart`}
                className="min-w-5 h-5 px-1.5 rounded-full bg-black dark:bg-zinc-50 text-white dark:text-black text-xs font-semibold flex items-center justify-center"
              >
                {count}
              </span>
            )}
          </Link>
          {!loading && (
            user ? (
              <>
                <Link href="/orders" className={linkClass}>Orders</Link>
                <Link href="/account" className="text-sm text-zinc-500 dark:text-zinc-400 hover:underline">
                  {user.email}
                </Link>
                <button onClick={signOut} className={linkClass}>Sign Out</button>
              </>
            ) : (
              <Link href="/login" className={linkClass}>Login</Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
