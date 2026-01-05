import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white dark:bg-zinc-900 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-black dark:text-zinc-50">
          Apple & Cheese
        </Link>
        <div className="flex gap-6">
          <Link
            href="/"
            className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
          >
            Products
          </Link>
          <Link
            href="/about"
            className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
          >
            Contact
          </Link>
          <Link
            href="/cart"
            className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
          >
            Cart
          </Link>
          <Link
            href="/login"
            className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}