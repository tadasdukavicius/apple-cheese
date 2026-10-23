import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-3">Page not found</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          We couldn&apos;t find what you were looking for.
        </p>
        <Link
          href="/products"
          className="inline-block bg-black dark:bg-zinc-50 text-white dark:text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}
