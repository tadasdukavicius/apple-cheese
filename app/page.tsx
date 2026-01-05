import Link from 'next/link';

export default async function Home() {
  const res = await fetch(`http://localhost:8008/api/health`);
  const data = await res.json()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Main Content */}
      <main className="flex items-center justify-center py-32 px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-semibold text-black dark:text-zinc-50 mb-6">
            Welcome to Apple & Cheese {data.status}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            Browse our selection of premium products and start shopping today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="bg-black dark:bg-zinc-50 text-white dark:text-black px-8 py-3 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
            >
              Shop Now
            </Link>
            <a
              href="/login"
              className="border-2 border-black dark:border-zinc-50 text-black dark:text-zinc-50 px-8 py-3 rounded-lg font-medium hover:bg-black hover:text-white dark:hover:bg-zinc-50 dark:hover:text-black transition"
            >
              Sign In
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
