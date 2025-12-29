export default function ProductsPage() {
  const products = [
    { id: "1", name: "Premium Apple Selection", price: "$29.99", description: "High quality organic apples" },
    { id: "2", name: "Artisan Cheese Collection", price: "$39.99", description: "Premium cheese collection" },
    { id: "3", name: "Apple & Cheese Gift Box", price: "$49.99", description: "Exclusive combination gift box" },
    { id: "4", name: "Limited Edition Bundle", price: "$59.99", description: "Limited edition seasonal bundle" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-12">
          Products
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-48 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                <span className="text-zinc-500 dark:text-zinc-400">Product Image</span>
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2">
                  {product.name}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-black dark:text-zinc-50">
                    {product.price}
                  </span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/products/${product.id}`}
                    className="flex-1 bg-black dark:bg-zinc-50 text-white dark:text-black py-2 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition text-center"
                  >
                    View Details
                  </a>
                  <button className="px-4 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-zinc-50 py-2 rounded-lg font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 transition">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
