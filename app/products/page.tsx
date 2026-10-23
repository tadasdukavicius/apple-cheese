"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "../../types/product"
import { fetchAPI } from "../../lib/api";
import { formatPrice } from "../../lib/format";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchAPI<Product[]>("products")
      .then(setProducts)
      .catch(console.error);
  }, []);

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
              <div className="relative h-48 bg-zinc-200 dark:bg-zinc-800">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
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
                    {formatPrice(product.price)}
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
