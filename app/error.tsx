'use client';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-3">Something went wrong</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          We couldn&apos;t load this page. Please check your connection and try again.
        </p>
        <button
          onClick={reset}
          className="bg-black dark:bg-zinc-50 text-white dark:text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
