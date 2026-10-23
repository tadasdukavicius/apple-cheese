export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="h-9 w-40 bg-zinc-200 dark:bg-zinc-800 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-zinc-200 dark:bg-zinc-800" />
              <div className="p-6 space-y-3">
                <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-8 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
