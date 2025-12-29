import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const products = [
    { 
      id: "1", 
      name: "Premium Apple Selection", 
      price: "$29.99", 
      description: "High quality organic apples sourced from local farms. Perfect for snacking or baking.",
      image: "Product Image 1",
      features: ["Organic certified", "Locally sourced", "Fresh picked", "Premium quality"]
    },
    { 
      id: "2", 
      name: "Artisan Cheese Collection", 
      price: "$39.99", 
      description: "Premium cheese collection featuring aged cheddar, gouda, and brie from artisan producers.",
      image: "Product Image 2",
      features: ["Artisan made", "Aged to perfection", "Rich flavor", "Multiple varieties"]
    },
    { 
      id: "3", 
      name: "Apple & Cheese Gift Box", 
      price: "$49.99", 
      description: "Exclusive combination of our finest apples and premium cheeses, perfect for gifting.",
      image: "Product Image 3",
      features: ["Gift ready", "Premium selection", "Perfect pairing", "Elegant packaging"]
    },
    { 
      id: "4", 
      name: "Limited Edition Bundle", 
      price: "$59.99", 
      description: "Limited edition seasonal bundle featuring rare apple varieties and exclusive cheese selections.",
      image: "Product Image 4",
      features: ["Limited edition", "Seasonal varieties", "Exclusive selection", "Collector's item"]
    },
  ];

  const product = products.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-8">
            <div className="aspect-square bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center rounded-lg">
              <span className="text-zinc-500 dark:text-zinc-400 text-lg">{product.image}</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-semibold text-black dark:text-zinc-50 mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-black dark:text-zinc-50 mb-6">
              {product.price}
            </p>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-zinc-600 dark:text-zinc-400">
                    <span className="w-2 h-2 bg-black dark:bg-zinc-50 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button className="flex-1 bg-black dark:bg-zinc-50 text-white dark:text-black py-3 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition">
                Add to Cart
              </button>
              <button className="px-6 py-3 border-2 border-black dark:border-zinc-50 text-black dark:text-zinc-50 rounded-lg font-medium hover:bg-black hover:text-white dark:hover:bg-zinc-50 dark:hover:text-black transition">
                ♥ Save
              </button>
            </div>

            {/* Back to Products */}
            <a
              href="/products"
              className="inline-block mt-6 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition"
            >
              ← Back to Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}