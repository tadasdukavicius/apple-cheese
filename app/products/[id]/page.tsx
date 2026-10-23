import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link"
import Image from "next/image";
import { Product } from "../../../types/product"
import { fetchAPI, ApiError } from "../../../lib/api";
import { formatPrice } from "../../../lib/format";
import AddToCartButton from "../../../components/AddToCartButton";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const getProduct = cache((id: string) =>
  fetchAPI<Product>(`products/${id}`).catch((err) => {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) return null;
    throw err;
  })
);

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product not found | Apple & Cheese" };
  return { title: `${product.name} | Apple & Cheese`, description: product.description };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-8">
            <div className="relative aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-semibold text-black dark:text-zinc-50 mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-black dark:text-zinc-50 mb-6">
              {formatPrice(product.price)}
            </p>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">Features:</h3>
              <ul className="space-y-2">
                {(product.features ?? []).map((feature, index) => (
                  <li key={index} className="flex items-center text-zinc-600 dark:text-zinc-400">
                    <span className="w-2 h-2 bg-black dark:bg-zinc-50 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <AddToCartButton productId={id} />
            </div>

            {/* Back to Products */}
            <Link
              href="/products"
              className="inline-block mt-6 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition"
            >
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}